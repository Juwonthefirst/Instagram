const access_token_lifetime = 60 * 30 * 1000
const backendUrl = 'https://beep-me-api.onrender.com/api/'
/*{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxNzA2ODY0LCJpYXQiOjE3NTE3MDMyNjQsImp0aSI6IjA0ZDdlNmIwMWJiZTQwMmJhMTFiMzIxY2EyZDA4NzczIiwidXNlcl9pZCI6NX0.k_w0yFxUfn1BipKWdY_zX9oj7t5DuttjR34vfMJiNys",
  "user": {
    "pk": 5,
    "username": "juwon30",
    "email": "ajibolajuwon57@gmail.com",
    "first_name": "",
    "last_name": ""
  }
}*/
class Server {
    
    constructor() {
        this.access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxNzE1MTAxLCJpYXQiOjE3NTE3MTE1MDEsImp0aSI6IjcwYjVmZWRmOTFlZTRmODA5YTRkOGE2NzU3MWNkYzBmIiwidXNlcl9pZCI6NX0.JH6ipVgW-DTa1SmyQW9mYDLDmp0BylSIuWH6zXoJAQg'
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
    
    getAccessToken(){
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
    
    async verifyEmail({key, onSuccess = null, onError = null}){
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
    
    async updateUserField({fields, onError, onSuccess}){
        const data = await this.#baseFetch({
            path: 'auth/user/',
            method: 'PATCH',
            auth: true,
            body: fields,
            onError,
            onSuccess
        })
    }
    
    async userExists({username, onExist, onFree}){
        const data = await this.#baseFetch({
            path: 'users/exists/',
            method: 'POST',
            auth: true,
            body: {username},
            onError: onExist,
            onSuccess: onFree
        })
    }
    
    async getUsersChat({onSuccess, onError, pageNumber = 1, searchKeyWord = ''}){
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
    
    async getRoomAndMessage({room_name, onSuccess, onError}) {
        const data = await this.#baseFetch({
            path: `chats/${room_name}/`,
            auth: true,
            onSuccess,
            onError
        })
    }
}

export default new Server()