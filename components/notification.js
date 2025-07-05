import { lucideIcon } from './icon.js';
import { Room } from '../modules/livekit-client.esm.js';
import server from '../fetch.js';

let wsurl = ''

const callNotification = (username, room_name, room_id) => {
	const notificationDiv = document.createElement('div')
	notificationDiv.className = 'call-notification'
	
	const profileImgTag = document.querySelector('img')
	profileImgTag.src = '/img/profile.jpg'
	profileImgTag.className = 'caller-profile-pic'
	notificationDiv.appendChild(profileImgTag)
	
	const usernameTag = document.createElement('p')
	usernameTag.textContent = username
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
	notificationDiv.append(answerBtn, denyBtn)
	return notificationDiv
}


const chatNotification = (message, sender, sender_id) => {
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
	
	const closeBtn = document.createElement('button')
	closeBtn.className = 'close-btn'
	closeBtn.textContent = 'X'
	closeBtn.addEventListener('click', () => {
		document.querySelector('.root').removeChild(chatNotificationDiv)
	})
	chatNotificationDiv.appendChild(closeBtn)
	
	return chatNotificationDiv
}

export { callNotification, chatNotification }