import { lucideIcon, loadingLoopIcon } from './icon.js';
import { router } from '../router.js';
import { server } from '../server.js';

const friendPreview = (friendObject) => {
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
	messageIcon.addEventListener('click', () => { router.navigateTo(`/chat/${friendObject.username}/`) })
	const videoIcon = lucideIcon('video')
	const callIcon = lucideIcon('phone')
	friendIconDiv.append(messageIcon, videoIcon, callIcon)
	friendPreviewDiv.appendChild(friendIconDiv)
	
	return friendPreviewDiv
}

const userPreview = function(userObject) {
	const userPreviewDiv = document.createElement('div')
	userPreviewDiv.className = 'result'
	
	const profilePictureTag = document.createElement('img')
	profilePictureTag.src = '/img/profile.jpg'
	profilePictureTag.className = 'profile-picture'
	userPreviewDiv.appendChild(profilePictureTag)
	
	const userDetailsDiv = document.createElement('div')
	userDetailsDiv.className = 'details'
	
	const usernameTag = document.createElement('p')
	usernameTag.className = 'username'
	usernameTag.textContent = userObject.username
	
	const emailTag = document.createElement('p')
	emailTag.className = 'email'
	emailTag.textContent = userObject.email
	userDetailsDiv.append(usernameTag, emailTag)
	
	userPreviewDiv.appendChild(userDetailsDiv)
	
	if (userObject.is_followed_by_me) {
		const friendIcon = (userObject.is_following_me)? lucideIcon('users', 'add-friend', true) : lucideIcon('user-check', 'add-friend sent', true)
		userPreviewDiv.appendChild(friendIcon)
		return userPreviewDiv
	}
	
	const iconName = (userObject.is_following_me)? 'mail' : 'user-plus'
	const addFriendBtn = lucideIcon(iconName, 'add-friend')
	const addFriendIcon = addFriendBtn.innerHTML
	
	addFriendBtn.addEventListener('click', async (event) => {
		addFriendBtn.disabled = true
		addFriendBtn.innerHTML = loadingLoopIcon
		
		await server.sendFriendRequest({
			friendId: userObject.id,
			onSuccess: (data) => {
				alert(data.status)
				if (data.status === 'ok') {
					const friendIcon = (userObject.is_following_me)? lucideIcon( 'users', 'add-friend', true) : lucideIcon( 'user-check', 'add-friend sent', true)
					addFriendBtn.replaceWith(friendIcon)
				}
				
			},
			onError: () => {
				addFriendBtn.disabled = false
				addFriendBtn.innerHTML = addFriendIcon
			}
		})
		lucide.createIcons()
	})
	
	userPreviewDiv.appendChild(addFriendBtn)
	
	return userPreviewDiv
}

export { friendPreview, userPreview }