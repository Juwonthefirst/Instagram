import server from './fetch.js';
import domManager from './dom-manager.js';
import { memory } from './appMemory.js';

class Socket {
	#chatsocket
	#notificationSocket
	
	constructor() {
		this.#chatsocket = null
		this.#notificationSocket = null
		this.MaxRetry = 5
		this.notificationRetryCount = 0
		this.chatRetryCount = 0
	}
	
	get chatsocket() { return this.#chatsocket } 
	get notificationSocket() { return this.#notificationSocket }
	
	connect(baseUrl = 'wss://beep-me-api.onrender.com/ws/') {
		this.#chatsocket = new WebSocket(`${baseUrl}chat/?token=${server.getAccessToken()}`)
		this.#notificationSocket = new WebSocket(`${baseUrl}notification/?token=${server.getAccessToken()}`)
		this.#chatsocket.onclose = (event) => {
			if (!(event.code === 1000 || event.code === 1001) && this.chatRetryCount < this.maxRetry) {
				this.#chatsocket = new WebSocket(`${baseUrl}chat/?token=${server.getAccessToken()}`)
				this.chatRetryCount++
				console.warn('Chat socket closed retrying connection')
			}
			
		}
		this.#chatsocket.onopen = () => {
			this.chatRetryCount = 0
			console.log('Chat socket opened')
		}
		
		this.#notificationSocket.onclose = (event) => {
			if (!(event.code === 1000 || event.code === 1001) && this.notificationRetryCount < this.maxRetry) {
				this.#notificationSocket = new WebSocket(`${baseUrl}notification/?token=${server.getAccessToken()}`)
				this.notificationRetryCount++
				console.warn('Notification socket closed retrying connection')
			}
			
		}
		this.#notificationSocket.onopen = () => {
			this.notificationRetryCount = 0 
			console.log('Notofication socket open')
		}
		
		
	}
	
	disconnect() {
		this.#chatsocket.close(1000)
		this.#notificationSocket.close(1000)
	}
	
}

const socket = new Socket()
socket.connect()

socket.notificationSocket.onmessage = (event) => {
	const data = event.data
	switch (data.type) {
		case 'chat_notification':
			
			break;
			
		case 'online_status_notification':
			
			break;
			
		case 'friend_notification':
			
			break;
		
		case 'group_notification':
			
			break;
			
		case 'call_notification':
			
			break;
		
		
		
	}
}

export { socket }