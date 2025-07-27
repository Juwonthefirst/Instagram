import { lucideIcon } from '../components/icon.js';
import { CallRoom } from '../callRoom.js';
import { socket } from '../server.js';
import { formatSeconds } from '../helper.js';
import { router } from '../router.js';

export default async function callPage({ calleeObject, room_name, type }) {
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
	
	const videoCallDetailsDiv = document.createElement('div')
	videoCallDetailsDiv.className = 'video-call-details'
	
	const calleeUsernameTag = document.createElement('p')
	calleeUsernameTag.className = 'callee-username'
	calleeUsernameTag.textContent = calleeObject.username
	
	const videoCallStatusTag = document.createElement('p')
	videoCallStatusTag.className = 'video-call-status'
	videoCallStatusTag.textContent = ''
	videoCallDetailsDiv.append(calleeUsernameTag, videoCallStatusTag)
	
	callPageHeaderDiv.append(minimizeBtn, videoCallDetailsDiv, menuBtn)
	callPageDiv.appendChild(callPageHeaderDiv)
	
	const callerDetailsDiv = document.createElement('div')
	callerDetailsDiv.className = 'caller-details'
	
	const profilePictureImg = document.createElement('img')
	profilePictureImg.className = 'profile-picture'
	profilePictureImg.src = '/img/profile.jpg'
	callerDetailsDiv.appendChild(profilePictureImg)
	
	const usernameBoxDiv = document.createElement('div')
	usernameBoxDiv.className = 'username-box'
	
	const usernameTag = document.createElement('p')
	usernameTag.className = 'username'
	usernameTag.textContent = calleeObject.username
	usernameBoxDiv.appendChild(usernameTag)
	
	const mutedAudioIcon = lucideIcon('mic-off', '', true)
	const mutedVideoIcon = lucideIcon('video-off', '', true)
	usernameBoxDiv.append(mutedAudioIcon, mutedVideoIcon)
	callerDetailsDiv.appendChild(usernameBoxDiv)
	
	const callStatusTag = document.createElement('p')
	callStatusTag.className = 'status'
	callStatusTag.textContent = 'Beeping...'
	callerDetailsDiv.appendChild(callStatusTag)
	callPageDiv.appendChild(callerDetailsDiv)
	
	
	const navigationBtnsDiv = document.createElement('div')
	navigationBtnsDiv.className = 'buttons'
	
	//const screenShareBtn = lucideIcon('screen-share')
	const voiceMicBtn = lucideIcon('mic-off')
	const hangUpBtn = lucideIcon('phone', 'cancel-call')
	const videoSwitchBtn = (type === 'video') ? lucideIcon('video-off') : lucideIcon('video')
	//const cameraSwitchBtn = lucideIcon('switch-camera')
	
	navigationBtnsDiv.append(voiceMicBtn, hangUpBtn, videoSwitchBtn)
	callPageDiv.appendChild(navigationBtnsDiv)
	
	const handleTrackSubsribed = (track, publication, participant) => {
		track.attach(outputVideoTag)
	}
	
	//Call room backend
	(async () => {
		const callRoom = new CallRoom(type)
		callRoom.onTrackSubsribed = handleTrackSubsribed
		callRoom.onConnected = () => {
			callStatusTag.textContent = 'Beeping...'
		}
		callRoom.onReconnecting = () => callStatusTag.textContent = 'Reconnecting'
		callRoom.onReconnected = () => callStatusTag.textContent = 'Connected'
		callRoom.onDisconnected = () => router.route()
		callRoom.onAnswered = () => {
			if (type === 'video') callPageDiv.classList.add('video')
			setInterval(() => {
				const currentTime = Date.now()
				const callDuration = currentTime - callRoom.callStartedAt
				callStatusTag.textContent = formatSeconds(callDuration)
				videoCallStatusTag.textContent = formatSeconds(callDuration)
			}, 1000)
		}
		callRoom.onAudioMuted = () => mutedAudioIcon.classList.add('muted')
		callRoom.onAudioUnMuted = () => mutedAudioIcon.classList.remove('muted')
		callRoom.onVideoMuted = () => mutedVideoIcon.classList.add('muted')
		callRoom.onVideoUnMuted = () => mutedVideoIcon.classList.remove('muted')
		
		await callRoom.startCall(room_name)
		if (type === 'video') callRoom.localVideoTrack.attach(userOutputVideoTag)
		
		/*screenShareBtn.addEventListener('click', async () => {
			if (callRoom.localScreenTrack) {
				await callRoom.closeScreenSharing()
				screenShareBtn.classList.remove('active')
				return
			}
			await callRoom.openScreenSharing()
			screenShareBtn.classList.add('active')
		})*/
		
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
			videoSwitchBtn.classList.toggle('active')
			if (callRoom.videoActive) await callRoom.muteVideo()
			else await callRoom.unMuteVideo()
		})
		
		//cameraSwitchBtn.addEventListener('click', () => { callRoom.swapCamera() })
		
	})()
	return callPageDiv
}