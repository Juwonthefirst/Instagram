import { memory } from './appMemory.js';
import { showNotification } from './components/notification.js';

const access_token_lifetime = 60 * 30 * 1000
const backendUrl = 'https://beep-me-api.onrender.com/api/'

class Server {
    
    constructor() {
        this.access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxOTg4NTMyLCJpYXQiOjE3NTE5ODQ5MzIsImp0aSI6ImQxMTI4MjYzYTdhYzQxNGM5YTBhYTExYmI0OWJmMzE0IiwidXNlcl9pZCI6NX0.bR9Lf5Hy5FHPePp161P0jtC7JP8N-e5AqbaSx87RAmw'
        this.csrf_token = null
    }
    
    async #baseFetch({ path, method = 'GET', auth = false, cred = false, body = null, onError = null, onSuccess = null }) {
        const fetchData = {
            method,
            credentials: (cred) ? 'include' : 'omit',
            headers: this.getHeader({ auth, cred }),
        }
        if (method !== 'GET' && body) { fetchData.body = JSON.stringify(body) }
        
        try {
            const response = await fetch(backendUrl + path, fetchData)
            const data = await response.json()
            if (!response.ok) {
                if (onError) onError({ error: data })
                return { error: data }
            }
            if (onSuccess) onSuccess(data)
            return data
            
        } catch (e) {
            if (onError) onError({ error: e.message })
        }
    }
    
    startAutoRefreshAccessToken(onError) {
        const response = this.tokenRefresh()
        onError(response)
        
        setInterval(() => {
            const response = this.tokenRefresh()
            onError(response)
        }, access_token_lifetime)
        
    }
    
    getHeader({ auth = false, cred = false } = {}) {
        const header = new Headers({ 'Content-Type': 'application/json' })
        if (auth) header.append('Authorization', `Bearer ${this.access_token}`)
        if (cred) header.append('X-CSRFToken', this.csrf_token)
        return header
    }
    
    getAccessToken() {
        return this.access_token
    }
    
    async login({ username = '', email = '', password = '', onSuccess = null, onError = null }) {
        return await this.#baseFetch({
            path: 'auth/login/',
            method: 'POST',
            body: { username, email, password },
            onError,
            onSuccess
        })
    }
    
    async signup({ username, email, password, onError = null, onSuccess = null }) {
        return await this.#baseFetch({
            path: 'auth/registration/',
            method: 'POST',
            body: {
                username,
                email,
                password1: password,
                password2: password
            },
            onError,
            onSuccess
        })
    }
    
    async resendVerificationLink({ email, onError = null, onSuccess = null }) {
        return await this.#baseFetch({
            path: 'auth/registration/resend-email/',
            method: 'POST',
            body: { email },
            onError,
            onSuccess
        })
    }
    
    async changePassword({ password, onError = null, onSuccess = null }) {
        return await this.#baseFetch({
            path: 'auth/password/change/',
            method: 'POST',
            auth: true,
            body: {
                password1: password,
                password2: password
            },
            onError,
            onSuccess
        })
    }
    
    async tokenRefresh({ onError = null, onSuccess = null } = {}) {
        
        const data = await this.#baseFetch({
            path: 'auth/token/refresh/',
            method: 'POST',
            cred: true,
            onError,
            onSuccess
        })
        this.access_token = data.access
    }
    
    async googleLoginByID({ googleTokenObject, onError = null, onSuccess = null }) {
        const data = await this.#baseFetch({
            path: 'auth/social/google/ID/',
            method: 'POST',
            body: { token: googleTokenObject.credential },
            onError,
            onSuccess
        })
        this.access_token = data.access
    }
    
    async googleLoginByCode({ googleTokenObject, onError = null, onSuccess = null }) {
        const data = await this.#baseFetch({
            path: 'auth/social/google/code/',
            method: 'POST',
            body: { code: googleTokenObject.code },
            onError,
            onSuccess
        })
        this.access_token = data.access
    }
    
    async verifyEmail({ key, onSuccess = null, onError = null }) {
        return await this.#baseFetch({
            path: 'auth/registration/verify-email/',
            method: 'POST',
            body: { key },
            onError,
            onSuccess
        })
    }
    
    async get_csrf({ onError = null, onSuccess = null } = {}) {
        const data = await this.#baseFetch({
            path: 'auth/user/csrf/',
            cred: true,
            onError,
            onSuccess
        })
        this.csrf_token = data.csrf_token
        return data
    }
    
    async updateUserField({ fields, onError, onSuccess }) {
        const data = await this.#baseFetch({
            path: 'auth/user/',
            method: 'PATCH',
            auth: true,
            body: fields,
            onError,
            onSuccess
        })
    }
    
    async userExists({ username, onExist, onFree }) {
        const data = await this.#baseFetch({
            path: 'users/exists/',
            method: 'POST',
            auth: true,
            body: { username },
            onError: onExist,
            onSuccess: onFree
        })
    }
    
    async getUserChat({ onSuccess, onError, pageNumber = 1, searchKeyWord = '' }) {
        const data = await this.#baseFetch({
            path: `auth/user/rooms/?page=${pageNumber}&search=${searchKeyWord}`,
            auth: true,
            onSuccess,
            onError
        })
        
    }
    
    async getLiveKitJWT(room_id) {
        const data = await this.#baseFetch({
            path: `chats/${room_id}/video/auth/`,
            auth: true
        })
        return data
    }
    
    async getRoomAndMessage({ friend_username, onSuccess, onError }) {
        const data = await this.#baseFetch({
            path: `chats/${friend_username}/`,
            auth: true,
            onSuccess,
            onError
        })
        
    }
    
    async getUserFriends({onSuccess, onError, pageNumber = 1, searchKeyWord = ''}){
        const data = await this.#baseFetch({
            path: `auth/user/friends/?page=${pageNumber}&search=${searchKeyWord}`,
            auth: true,
            onSuccess,
            onError
        })
    }
}



class Socket {
    #chatsocket
    #notificationSocket
    
    constructor() {
        this.#chatsocket = null
        this.#notificationSocket = null
        this.currentRoom = null
        this.maxRetry = 5
        this.retryTimeout = 10000
        this.notificationRetryCount = 0
        this.chatRetryCount = 0
        this.onRoomMessage = null
        this.onPreviewMessage = null
        this.onTyping = null
    }
    
    get chatsocket() { return this.#chatsocket }
    get notificationSocket() { return this.#notificationSocket }
    
    connectChatSocket() {
        this.#chatsocket = new WebSocket(`wss://beep-me-api.onrender.com/ws/chat/?token=${server.getAccessToken()}`)
        this.#chatsocket.onclose = (event) => {
            if (!(event.code === 1000 || event.code === 1001) && this.chatRetryCount < this.maxRetry) {
                this.chatRetryCount++
                console.warn('Chat socket closed retrying connection')
                setTimeout(() => this.connectChatSocket(), this.retryTimeout)
            }
            
        }
        this.#chatsocket.onopen = () => {
            this.chatRetryCount = 0
            console.log('Chat socket opened')
        }
        
        this.#chatsocket.onmessage = (event) => {
            data = event.data
            if (data.typing && this.onTyping) {
                this.onTyping()
            }
            else if (memory.currentRoom === data.room && this.onRoomMessage) {
                this.onRoomMessage(data)
            }
            
            else if (memory.currentRoom && memory.currentRoom !== data.room) {
                showNotification('chat', {
                        message: data.message,
                        sender: data.sender_username,
                        timestamp: data.timestamp
                    })
            }
            if (this.onPreviewMessage) this.onPreviewMessage(data)
        }
        
    }
    
    connectNotificationSocket() {
        this.#notificationSocket = new WebSocket(`wss://beep-me-api.onrender.com/ws/notification/?token=${server.getAccessToken()}`)
        this.#notificationSocket.onclose = (event) => {
            console.log('connection')
            if (!(event.code === 1000 || event.code === 1001) && this.notificationRetryCount < this.maxRetry) {
                this.notificationRetryCount++
                console.warn('Notification socket closed retrying connection')
                setTimeout(() => this.connectNotificationSocket(), this.retryTimeout)
            }
            
        }
        
        this.#notificationSocket.onopen = () => {
            this.notificationRetryCount = 0
            console.log('Notofication socket open')
        }
    }
    
    connect() {
        this.connectChatSocket()
        this.connectNotificationSocket()
    }
    
    disconnect() {
        this.#chatsocket.close(1000)
        this.#notificationSocket.close(1000)
    }
    
    listenForNotifications() {
        this.#notificationSocket.onmessage = () => {
            const data = event.data
            switch (data.type) {
                case 'chat_notification':
                    showNotification('chat', {
                        message: data.message,
                        sender: data.sender_username,
                        timestamp: data.timestamp
                    })
                    break;
                case 'call_notification':
                    showNotification('call', {
                        caller: data.caller,
                        room_id: data.room_id,
                        room_name: data.room_name,
                    })
                    break;
                    
                    
                default:
                    
            }
            
        }
    }
    
    
    send(...body){
        this.#chatsocket.send(JSON.stringify(body))
    }
    
}
const server = new Server()
const socket = new Socket()


export { server, socket }