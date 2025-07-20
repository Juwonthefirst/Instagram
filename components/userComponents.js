import { lucideIcon, loadingLoopIcon } from './icon.js';
import { router } from '../router.js';
import { server } from '../server.js';
import { memory } from '../appMemory.js';
import domManager from '../dom-manager.js';

const friendPreview = (friendObject) => {
	const room_name = 'chat-' + [friendObject.id, memory.getCurrentUser({field: 'id'})].sort().join('-')
	const friendPreviewDiv = document.createElement('div')
	friendPreviewDiv.className = 'friend'
	
	const profilePictureTag = document.createElement('img')
	profilePictureTag.src = '/img/profile.jpg'
	profilePictureTag.className = 'profile-picture'
	profilePictureTag.alt = `${friendObject.username} profile picture`
	friendPreviewDiv.appendChild(profilePictureTag)
	
	const usernameTag = document.createElement('p')
	usernameTag.textContent = friendObject.username
	usernameTag.className = 'username'
	friendPreviewDiv.appendChild(usernameTag)
	
	const friendIconDiv = document.createElement('div')
	friendIconDiv.className = 'friend-icons'
	const messageIcon = lucideIcon('message-circle', '')
	messageIcon.addEventListener('click', async () => {
		await router.navigateTo(`/chat/${friendObject.username}/`)
	})
	const videoBtn = lucideIcon('video')
	videoBtn.addEventListener('click', () => router.render('call', { room_name, type: 'video'}))
	const callBtn = lucideIcon('phone')
	callBtn.addEventListener('click', () => router.render('call', { room_name, type: 'audio'}))
	
	friendIconDiv.append(messageIcon, videoBtn, callBtn)
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
		const friendIcon = (userObject.is_following_me) ? lucideIcon('users', 'add-friend', true) : lucideIcon('user-check', 'add-friend sent', true)
		userPreviewDiv.appendChild(friendIcon)
		return userPreviewDiv
	}
	
	const iconName = (userObject.is_following_me) ? 'mail' : 'user-plus'
	const addFriendBtn = lucideIcon(iconName, 'add-friend')
	const addFriendIcon = addFriendBtn.innerHTML
	let action = 'send'
	let friendIcon = lucideIcon('user-check', 'add-friend sent', true)
	
	
	addFriendBtn.addEventListener('click', async (event) => {
		addFriendBtn.disabled = true
		addFriendBtn.innerHTML = loadingLoopIcon
		if (userObject.is_following_me) {
			action = 'accept'
			friendIcon = lucideIcon('users', 'add-friend', true)
		}
		await server.sendFriendRequest({
			friendId: userObject.id,
			action,
			onSuccess: (data) => {
				if (data.status === 'ok') {
					addFriendBtn.replaceWith(friendIcon)
					if (userObject.is_following_me) {
						domManager.addToFriendListDom(userObject)
					}
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