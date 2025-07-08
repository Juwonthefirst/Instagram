import { lucideIcon } from './icon.js';

const friendPreview = (friendObject, ) => {
	const friendPreviewDiv = document.createElement('div')
	friendPreviewDiv.className = 'friend'
	
	const profilePictureTag = document.createElement('img')
	profilePictureTag.src = '/img/profile.jpg'
	profilePictureTag.className = 'profile-picture'
	profilePictureTag.alt = `${friendObject.username} profile picture`
	friendPreviewDiv.appendChild(profilePictureTag)
	
	const usernameTag = document.createElement('h2')
	usernameTag.textContent = friendObject.username
	usernameTag.className = 'username'
	friendPreviewDiv.appendChild(usernameTag)
	
	const friendIconDiv = document.createElement('div')
	friendIconDiv.className = 'friend-icons'
	const messageIcon = lucideIcon('message-circle')
	const videoIcon = lucideIcon('video')
	const callIcon = lucideIcon('phone')
	friendIconDiv.append(messageIcon, videoIcon, callIcon)
	friendPreviewDiv.appendChild(friendIconDiv)
	
	return friendPreviewDiv
}


export { friendPreview }