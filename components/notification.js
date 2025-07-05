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

export { callNotification }