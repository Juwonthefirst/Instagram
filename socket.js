import server from './fetch.js';

class Socket {
	constructor(baseUrl = 'wss://beep-me-api.onrender.com/ws/') {
		this.chatsocket = new WebSocket(`${baseUrl}chat/?token=${server.getAccessToken()}`)
		this.notificationSocket = new WebSocket(`${baseUrl}notification/?token=${server.getAccessToken()}`)
		this.maxRetry = 5
		this.retryCount = 0
	}
	
	connect(){
		this.chatsocket.onclose = (event) => {
			if (!(event.code === 1000 || event.code === 1001) && this.retryCount >= this.maxRetry){
			    this.chatsocket = new WebSocket(`${baseUrl}chat/?token=${server.getAccessToken()}`)
			}
		}
	}
	
}

export { Socket }