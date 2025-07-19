import { lucideIcon } from '../components/icon.js';
import { CallRoom } from '../callRoom.js';

const callPageDiv = document.createElement('div')
callPageDiv.className = 'call-page'

const userOutputVideoTag = document.createElement('video')
userOutputVideoTag.className = 'user-output'
userOutputVideoTag.playsinline = true
userOutputVideoTag.muted = true
userOutputVideoTag.autoplay = true
callPageDiv.appendChild(userOutputVideoTag)

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
const cameraSwitchBtn = lucideIcon('switch-camera')

navigationBtnsDiv.append(screenShareBtn, voiceMicBtn, hangUpBtn, videoSwitchBtn, cameraSwitchBtn)
callPageDiv.appendChild(navigationBtnsDiv)

const handleTrackSubsribed = function(track, publication, participant) {
	track.attach(outputVideoTag)
}

export default async function callPage({ room_name, type }) {
    console.log(type)
	const callRoom = new CallRoom(type)
	callRoom.onTrackSubsribed = handleTrackSubsribed
	callRoom.onReconnecting = () => callStatusTag.textContent = 'Reconnecting'
	callRoom.onReconnected = () => callStatusTag.textContent = 'Connected'
	callRoom.onDisconnected = () => callStatusTag.textContent = 'Disconnected'
	callRoom.onAnswered = () => {
		if (type === 'video')callPageDiv.classList.add('video')
	}
	
	await callRoom.startCall(room_name)
	if (type === 'video') userOutputVideoTag.srcObject = callRoom.localVideoTrack
	
	screenShareBtn.addEventListener('click', async () => {
		if (callRoom.localScreenTrack) {
			await callRoom.closeScreenSharing()
			screenShareBtn.classList.remove('active')
			return
		}
		await callRoom.openScreenSharing()
		screenShareBtn.classList.add('active')
	})
	
	voiceMicBtn.addEventListener('click', async () => {
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
		if (type === 'audio') {
			if (callRoom.videoActive) await callRoom.closeCamera()
			else await callRoom.openCamera()
		}
		else {
			if (callRoom.videoActive) await callRoom.muteVideo()
			else await callRoom.unMuteVideo()
		}
		videoSwitchBtn.classList.toggle('active')
	})
	
	cameraSwitchBtn.addEventListener('click', () => {callRoom.swapCamera()})
	
	
	return callPageDiv
}