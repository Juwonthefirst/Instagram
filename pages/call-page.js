import { lucideIcon } from '../components/icon.js';
import { CallRoom } from '../callRoom.js';
import { socket } from '../server.js';
import { formatSeconds } from '../helper.js';
import { router } from '../router.js';


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

const usernameBoxDiv = document.createElement('div')
usernameBoxDiv.className = 'username-box'

const usernameTag = document.createElement('p')
usernameTag.className = 'username'
usernameTag.textContent = 'Juwon33'
usernameBoxDiv.appendChild(usernameTag)

const mutedAudioIcon = lucideIcon('mic-off', '', true)
const mutedVideoIcon = lucideIcon('video-off', '', true)
usernameBoxDiv.append(mutedAudioIcon, mutedVideoIcon)
callDetailsDiv.appendChild(usernameBoxDiv)

const callStatusTag = document.createElement('p')
callStatusTag.className = 'status'
callStatusTag.textContent = 'Beeping'
callDetailsDiv.appendChild(callStatusTag)
callPageDiv.appendChild(callDetailsDiv)


const navigationBtnsDiv = document.createElement('div')
navigationBtnsDiv.className = 'buttons'

const screenShareBtn = lucideIcon('screen-share')
const voiceMicBtn = lucideIcon('mic-off')
const hangUpBtn = lucideIcon('phone', 'cancel-call')
const videoSwitchBtn = lucideIcon('video')
const cameraSwitchBtn = lucideIcon('switch-camera')

navigationBtnsDiv.append(voiceMicBtn, hangUpBtn, videoSwitchBtn)
callPageDiv.appendChild(navigationBtnsDiv)

const handleTrackSubsribed = (track, publication, participant) => {
	track.attach(outputVideoTag)
}

export default async function callPage({ room_name, type }) {
	if (type === 'video') {
		const stream  = await navigator.mediaDevices.getUserMedia({ video: true })
		userOutputVideoTag.srcObject = stream
		userOutputVideoTag.play()
	}
	(async () => {
		const callRoom = new CallRoom(type)
		callRoom.onTrackSubsribed = handleTrackSubsribed
		callRoom.onConnected = () => {
			callStatusTag.textContent = 'Calling...'
			
		}
		callRoom.onReconnecting = () => callStatusTag.textContent = 'Reconnecting'
		callRoom.onReconnected = () => callStatusTag.textContent = 'Connected'
		callRoom.onDisconnected = () => router.route()
		callRoom.onAnswered = () => {
			if (type === 'video') callPageDiv.classList.add('video')
			setInterval(() => {
				const currentTime = new Date.now()
				const callDuration = currentTime - callRoom.callStartedAt
				callStatusTag.textContent = formatSeconds(callDuration)
			}, 1000)
		}
		callRoom.onAudioMuted = () => mutedAudioIcon.classList.add('muted')
		callRoom.onAudioUnMuted = () => mutedAudioIcon.classList.remove('muted')
		callRoom.onVideoMuted = () => mutedVideoIcon.classList.add('muted')
		callRoom.onVideoUnMuted = () => mutedVideoIcon.classList.remove('muted')
		
		await callRoom.startCall(room_name)
		if (type === 'video') callRoom.localVideoTrack.attach(userOutputVideoTag)
		
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
				console.log(callRoom.videoActive)
				if (callRoom.videoActive) await callRoom.closeCamera()
				else await callRoom.openCamera()
			}
			else {
				if (callRoom.videoActive) await callRoom.muteVideo()
				else await callRoom.unMuteVideo()
			}
			videoSwitchBtn.classList.toggle('active')
		})
		
		//cameraSwitchBtn.addEventListener('click', () => { callRoom.swapCamera() })
		
	})()
	return callPageDiv
}