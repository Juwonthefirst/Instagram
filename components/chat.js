import { getTimePassed, getReadableTime } from '../helper.js';

const chatPreview = function({ profileImage, username, timestamp, message }) {
	const chatPreviewDiv = document.createElement('div')
	chatPreviewDiv.className = 'chat-preview'
	const profileFieldDiv = document.createElement('div')
	profileFieldDiv.className = 'profile-field'
	const profileImageTag = document.createElement('img')
	profileImageTag.className = 'profile-picture'
	profileImageTag.src = profileImage
	profileImageTag.alt = 'user\'s profile picture'
	profileFieldDiv.append(profileImageTag)
	chatPreviewDiv.appendChild(profileFieldDiv)
	
	const chatPreviewDetailsDiv = document.createElement('div')
	chatPreviewDetailsDiv.className = 'chat-preview-details'
	const usernameTag = document.createElement('p')
	usernameTag.className = 'username'
	usernameTag.textContent = username
	
	const timestampTag = document.createElement('p')
	timestampTag.className = 'timestamp'
	timestampTag.textContent = getTimePassed(timestamp)
	
	const messageTag = document.createElement('p')
	messageTag.className = 'message'
	messageTag.textContent = message
	
	chatPreviewDetailsDiv.append(usernameTag, timestampTag, messageTag)
	chatPreviewDiv.appendChild(chatPreviewDetailsDiv)
	
	return chatPreviewDiv
}

const chatBubble = function (isSender, message, timestamp, temporary_id) {
	const messageDiv = document.createElement('div')
	const chatBubbleClassName = (isSender)? 'sender' : 'receiver'
	messageDiv.classList.add('chat-bubble', chatBubbleClassName)
	messageDiv.dataset.temporary_id = temporary_id
	
	const messageTag = document.createElement('p')
	messageTag.textContent = message 
	messageDiv.appendChild(messageTag)
	
	const timestampTag = document.createElement('p')
	timestampTag.className = 'timestamp'
	timestampTag.textContent = getReadableTime(timestamp)
	messageDiv.appendChild(timestampTag)
	
	return messageDiv
}

export { chatPreview, chatBubble }