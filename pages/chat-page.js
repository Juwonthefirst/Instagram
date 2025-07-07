import { lucideIcon } from '../components/icon.js';
import { server, socket } from '../server.js';
import { memory } from '../appMemory.js';
import { chatBubble } from '../components/chat.js';
import domManager from '../dom-manager.js';
import { showNotification } from '../components/notification.js';


const currentUser = memory.getCurrentUser()
const urlPath = location.pathname.split('/')
const friend_username = urlPath.at(-1) || urlPath.at(-2)

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
const sendBtn = lucideIcon('mic', 'send-btn')
sendBtn.addEventListener('click', () => {
	const message = messageInput.value.trim()
	if (message) {
		
		socket.send({
			sender_id: currentUser.id,
			sender_username: currentUser.username,
			message,
			action: 'chat',
			room: ''
		})
		
	}
})
messageInputDiv.appendChild(sendBtn)
messageMainDiv.appendChild(messageInputDiv)
messagesDiv.appendChild(messageMainDiv)
messageInput.addEventListener('input', () => {
	if (messageInput.value.trim()) {
		sendBtn.children[0].dataset.lucide = 'send'
	}
})

export default function chatPage() {
	return messagesDiv
}

(async () => {
	const room = await server.getRoomAndMessage({
		friend_username,
		onSuccess: (data) => {
			memory.currentRoom = data.name
			usernameTag.textContent = (data.is_group) ? data.parent.name : data.parent.username
			const messages = data.messages
			for (const message of messages) {
				const isSender = message.sender_id === currentUser.id
				const chatBubbleDiv = chatBubble(isSender, message.body, message.timestamp)
				messageMainDiv.appendChild(chatBubbleDiv)
				domManager.createChatDom(message.id, chatBubbleDiv)
			}
		}
		
	})
})()

socket.onRoomMessage = (data) => {
	if (data.sender_username !== currentUser.username) {
		const chatBubbleDiv = chatBubble(false, data.message, data.timestamp)
		messageMainDiv.appendChild(chatBubbleDiv)
	}
	else {
		
	}
}

socket.onTyping = () => {
	statusTag.textContent = 'typing...'
}