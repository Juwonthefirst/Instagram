import { lucideIcon } from './icon.js';
import { Room } from '../modules/livekit-client.esm.js';
import {server} from '../server.js';

let wsurl = ''

const callNotification = ({caller, room_name, room_id}) => {
	const notificationDiv = document.createElement('div')
	notificationDiv.className = 'call-notification'
	
	const profileImgTag = document.createElement('img')
	profileImgTag.src = '/img/profile.jpg'
	profileImgTag.className = 'caller-profile-pic'
	notificationDiv.appendChild(profileImgTag)
	
	const usernameTag = document.createElement('p')
	usernameTag.textContent = caller
	usernameTag.className = 'caller'
	notificationDiv.appendChild(usernameTag)
	
	const answerBtn = lucideIcon('phone', 'call-answer-btn')
	answerBtn.addEventListener('click', async () => {
		const room = new Room()
		const token = await server.getLiveKitJWT(room_id)
		await room.connect(wsurl, token)
		await room.localParticipant.enableCameraAndMicrophone()
		if(!is_video) await room.localParticipant.setCameraEnabled(false)
	})
	const denyBtn = lucideIcon('phone', 'call-deny-btn')
	notificationDiv.append(denyBtn, answerBtn)
	return notificationDiv
}


const chatNotification = ({message, sender, timestamp}) => {
	const chatNotificationDiv = document.createElement('div')
	chatNotificationDiv.className = 'chat-notification'
	
	const profileImg = document.createElement('img')
	profileImg.src = '/img/profile.jpg'
	profileImg.className = 'sender-profile-pic'
	chatNotificationDiv.appendChild(profileImg)
	
	const senderUsername = document.createElement('p')
	senderUsername.textContent = sender
	senderUsername.className = 'message-sender'
	chatNotificationDiv.appendChild(senderUsername)
	
	const messageTag = document.createElement('p')
	messageTag.textContent = message
	messageTag.className = 'message-body'
	chatNotificationDiv.appendChild(messageTag)
	
	const timestampTag = document.createElement('p')
	timestampTag.className = 'timestamp'
	timestampTag.textContent = timestamp
	chatNotificationDiv.appendChild(timestampTag)
	
	return chatNotificationDiv
}

const friendNotification = ({sender, action}) => {
	const friendNotificationDiv = document.createElement('div')
	friendNotificationDiv.className = 'chat-notification'
	
	const profileImg = document.createElement('img')
	profileImg.src = '/img/profile.jpg'
	profileImg.className = 'sender-profile-pic'
	friendNotificationDiv.appendChild(profileImg)
	
	const senderUsername = document.createElement('p')
	senderUsername.textContent = sender
	senderUsername.className = 'message-sender'
	friendNotificationDiv.appendChild(senderUsername)
	
	const messageTag = document.createElement('p')
	messageTag.textContent = message
	messageTag.className = 'message-body'
	friendNotificationDiv.appendChild(messageTag)
	
	const timestampTag = document.createElement('p')
	timestampTag.className = 'timestamp'
	timestampTag.textContent = timestamp
	friendNotificationDiv.appendChild(timestampTag)
	
	return friendNotificationDiv
}

const notificationMap = {
	chat: chatNotification,
	call: callNotification,
	friend: friendNotification,
}

const showNotification = (type, options) => {
	const root = document.querySelector('.root')
	const notificationDiv = notificationMap[type](options)
	root.appendChild(notificationDiv)
}
	
export { showNotification }