import server from './fetch.js';

class Socket {
	constructor(baseUrl = 'wss://beep-me-api.onrender.com/ws/') {
		this.chatsocket = null
		this.notificationSocket = null
		this.MaxRetry = 5
		this.notificationRetryCount = 0
		this.chatRetryCount = 0
	}
	
	connect(){
		this.chatsocket = new WebSocket(`${baseUrl}chat/?token=${server.getAccessToken()}`)
		this.notificationSocket = new WebSocket(`${baseUrl}notification/?token=${server.getAccessToken()}`)
		this.chatsocket.onclose = (event) => {
			if (!(event.code === 1000 || event.code === 1001) && this.chatRetryCount >= this.maxRetry){
			    this.chatsocket = new WebSocket(`${baseUrl}chat/?token=${server.getAccessToken()}`)
			    this.chatRetryCount ++
			    console.warn('Chat socket closed retrying connection')
			}
		}
		this.chatsocket.onopen = () => {
			this.chatRetryCount = 0
		}
		
		this.notificationSocket.onclose = (event) => {
			if (!(event.code === 1000 || event.code === 1001) && this.notificationRetryCount >= this.maxRetry){
			    this.notificationSocket = new WebSocket(`${baseUrl}notification/?token=${server.getAccessToken()}`)
			    this.notificationRetryCount ++
			    console.warn('Notification socket closed retrying connection')
			}
		}
		this.notificationSocket.onopen = () => {
			this.notificationRetryCount = 0
		}
		
	}
	
}

export { Socket }