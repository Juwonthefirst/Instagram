import { lucideIcon } from '../components/icon.js';
import {server} from '../server.js';
import { memory } from '../appMemory.js';
import { chatBubble } from '../components/chat.js';
import domManager from '../dom-manager.js';

const currentUser = memory.getCurrentUser()

const messagesDiv = document.createElement('div')
messagesDiv.className = 'chat-message'

const messageHeader = document.createElement('div')
messageHeader.className = 'message-header'

const icon = lucideIcon('arrow-left')
messageHeader.appendChild(icon)

const chatDetailsDiv = document.createElement('div')
chatDetailsDiv.className = 'chat-details'

const chatPictureTag = document.createElement('img')
chatPictureTag.src = '/img/profile.jpg'
chatPictureTag.className = 'chat-picture'
chatPictureTag.alt = `${username} profile`
chatDetailsDiv.appendChild(chatPictureTag)

const nameAndStatusDiv = document.createElement('div')
nameAndStatusDiv.className = 'name-and-status'

const usernameTag = document.createElement('p')
usernameTag.className = 'username'
usernameTag.textContent = 'Juwon33'

const statusTag = document.createElement('p')
statusTag.className = 'status'
statusTag.textContent = 'online'

nameAndStatusDiv.append(usernameTag, statusTag)
chatDetailsDiv.appendChild(nameAndStatusDiv)


const iconDiv = document.createElement('div')
iconDiv.className = 'icons'

const videoCallBtn = lucideIcon('video', 'video-icon')
const voiceCallBtn = lucideIcon('phone', 'phone-icon')
const menuBtn = lucideIcon('ellipsis-vertical')

iconDiv.append(videoCallBtn, voiceCallBtn, menuBtn)
messageHeader.appendChild(iconDiv)
messagesDiv.appendChild(messageHeader)

const messageMainDiv = document.createElement('div')
messageMainDiv.className = 'message-main'

const messageInputDiv = document.createElement('div')
messageInputDiv.className = 'input-area'

const messageBoxDiv = document.createElement('div')
messageBoxDiv.className = 'input-box'

const cameraIcon = lucideIcon('camera', 'camera')
const messageInput = document.createElement('input')
messageInput.placeholder = 'Send them that text'
messageBoxDiv.append(cameraIcon, messageInput)
messageInputDiv.appendChild(messageBoxDiv)
const sendBtn = lucideIcon('send', 'send-btn')
messageInputDiv.appendChild(sendBtn)
messageMainDiv.appendChild(messageInputDiv)
messagesDiv.appendChild(messageMainDiv)

export default function chatPage() {
	return messagesDiv
}

window.addEventListener('load', async () => {
	const room = await server.getRoomAndMessage({
		friend_username,
		onSuccess: (data) => {
			usernameTag.textContent = (data.is_group)? data.parent.name : data.parent.username
			const messages = data.messages
			for (const message of messages) {
				const isSender = message.sender_id === currentUser.id
				const chatBubbleDiv = chatBubble(isSender, message.body, message.timestamp)
				messageMainDiv.appendChild(chatBubbleDiv)
				domManager.createChatDom(message.id, chatBubbleDiv)
			}
		}
		
	})
})

