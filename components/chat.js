const chatPreview = function({ profileImage, username, timestamp, message }) {
	const chatPreviewDiv = document.createElement('div')
	chatPreviewDiv.className = 'chat-preview'
	const profileFieldDiv = document.createElement('div')
	profileFieldDiv.className = 'profile-field'
	const profileImageTag = document.createElement('img')
	profileImageTag.className = 'profile-picture'
	profileImageTag.src = profileImage
	profileImageTag.alt = 'user\'s profile picture'
	const onlineStatusTag = document.createElement('p')
	onlineStatusTag.classList.add('status', 'online')
	profileFieldDiv.append(profileImageTag, onlineStatusTag)
	chatPreviewDiv.appendChild(profileFieldDiv)
	
	const chatPreviewDetailsDiv = document.createElement('div')
	chatPreviewDetailsDiv.className = 'chat-preview-details'
	const usernameTag = document.createElement('p')
	usernameTag.className = 'username'
	usernameTag.textContent = username
	
	const timestampTag = document.createElement('p')
	timestampTag.className = 'timestamp'
	timestampTag.textContent = timestamp
	
	const messageTag = document.createElement('p')
	messageTag.className = 'message'
	messageTag.textContent = message
	
	chatPreviewDetailsDiv.append(usernameTag, timestampTag, messageTag)
	chatPreviewDiv.appendChild(chatPreviewDetailsDiv)
	
	return chatPreviewDiv
}

export { chatPreview }