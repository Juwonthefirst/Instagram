import { lucideIcon } from '../components/icon.js';
import { CallRoom } from '../callRoom.js';
const callPageDiv = document.createElement('div')
callPageDiv.className = 'call-page'

const outputVideoTag = document.createElement('video')
outputVideoTag.className = 'call-output'
outputVideoTag.playsinline = true
outputVideoTag.muted = true
outputVideoTag.autoplay = true
callPageDiv.appendChild(outputVideoTag)

const callPageHeaderDiv = document.createElement('div')
callPageHeaderDiv.className = 'call-header'

const minimizeBtn = lucideIcon('chevron-down')
const menuBtn = lucideIcon('ellipsis')

callPageHeaderDiv.append(minimizeBtn, menuBtn)
callPageDiv.appendChild(callPageHeaderDiv)

const callDetailsDiv = document.createElement('div')
callDetailsDiv.className = 'caller-details'

const profilePictureImg = document.createElement('img')
profilePictureImg.className = 'profile-picture'
profilePictureImg.src = '/img/profile.jpg'
callDetailsDiv.appendChild(profilePictureImg)

const usernameTag = document.createElement('p')
usernameTag.className = 'username'
usernameTag.textContent = 'Juwon33'
callDetailsDiv.appendChild(usernameTag)

const callStatusTag = document.createElement('p')
callStatusTag.className = 'status'
callStatusTag.textContent = 'Connecting'
callDetailsDiv.appendChild(callStatusTag)
callPageDiv.appendChild(callDetailsDiv)


const navigationBtnsDiv = document.createElement('div')
navigationBtnsDiv.className = 'buttons'

const screenShareBtn = lucideIcon('screen-share')
const voiceMicBtn = lucideIcon('mic')
const hangUpBtn = lucideIcon('phone', 'cancel-call')
const videoSwitchBtn = lucideIcon('video')
const volumeSwitchBtn = lucideIcon('volume-off')

navigationBtnsDiv.append(screenShareBtn, voiceMicBtn, hangUpBtn, videoSwitchBtn, volumeSwitchBtn)
callPageDiv.appendChild(navigationBtnsDiv)

const handleTrackSubsribed = function(track, publication, participant) {
	track.attach(outputVideoTag)
}

export default async function callPage({ room_name, type }) {
	const callRoom = new CallRoom(type)
	callRoom.onTrackSubsribed = handleTrackSubsribed
	await callRoom.startCall(room_name)
	screenShareBtn.addEventListener('click', async () => {
		if (callRoom.localScreenTrack) {
			await callRoom.closeScreenSharing()
			screenShareBtn.classList.remove('active')
			return
		}
		await callRoom.openScreenSharing()
		screenShareBtn.classList.add('active')
	})
	
	voiceMicBtn.addEventListener('click', () => {
		if (callRoom.audioMuted) {
			await callRoom.unMuteAudio()
			voiceMicBtn.classList.remove('active')
			return
		}
		await callRoom.muteAudio()
		voiceMicBtn.classList.add('active')
	})
	
	hangUpBtn.addEventListener('click', () => callRoom.endCall())
	
	videoSwitchBtn.addEventListener('click', async () => {
		if (callRoom.videoActive) {
			if (type === 'audio') await callRoom.openCamera()
			else await callRoom.unMuteVideo()
			
		}
		else {
			if (type === 'audio') await callRoom.closeCamera()
			else await callRoom.muteVideo()
		}
		
	})
	
	return callPageDiv
}