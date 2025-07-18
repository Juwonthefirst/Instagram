import { Room, RoomEvent } from '../modules/livekit-client.esm.js';
import { server } from '../server.js';
import { lucideIcon } from '../components/icon.js';
const callPageDiv = document.createElement('div')
callPageDiv.className = 'call-page'

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

export default function callPage(/*{receiverUsername, type}*/){
	return callPageDiv
}