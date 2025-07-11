import { lucideIcon } from '../components/icon.js';
import { server, socket } from '../server.js';
import { memory } from '../appMemory.js';
import { chatBubble } from '../components/chat.js';
import domManager from '../dom-manager.js';
import { showNotification } from '../components/notification.js';


const currentUser = memory.getCurrentUser()
const urlPath = location.pathname.split('/')
const friend_username = urlPath.at(-1) || urlPath.at(-2);

(async () => {
	if (Object.keys(domManager.chatDom).length) {
		const chatDomElements = domManager.getChatDom(friend_username)
		return messageMainDiv.append(...chatDomElements)
	}
	const room = await server.getRoomAndMessage({
		friend_username,
		onSuccess: (data) => {
			const chatBubbleElements = []
			memory.currentRoom = data.name
			usernameTag.textContent = (data.is_group) ? data.parent.name : data.parent.username
			const messages = data.messages
			for (const message of messages) {
				const isSender = message.sender_id === currentUser.id
				const chatBubbleDiv = chatBubble(isSender, message.body, message.timestamp)
				chatBubbleElements.push(chatBubbleDiv)
				messageMainDiv.appendChild(chatBubbleDiv)
			}
			
			domManager.createChatDom(friend_username, chatBubbleElements)
		}
		
	})
})()

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
chatPictureTag.alt = `${friend_username} profile`
chatDetailsDiv.appendChild(chatPictureTag)

const nameAndStatusDiv = document.createElement('div')
nameAndStatusDiv.className = 'name-and-status'

const usernameTag = document.createElement('p')
usernameTag.className = 'username'
usernameTag.textContent = friend_username

const statusTag = document.createElement('p')
statusTag.className = 'status'
statusTag.textContent = ''

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
	if (!message) { return }
	const temporary_id = crypto.randomUUID()
	
	socket.send({
		sender_id: currentUser.id,
		sender_username: currentUser.username,
		message,
		action: 'chat',
		room: memory.currentRoom,
		temporary_id
	})
	
	const newMessageBubbleDiv = chatBubble(true, message, 'pending', temporary_id)
	domManager.getChatDom(friend_username).push(newMessageBubbleDiv)
	messageMainDiv.appendChild(newMessageBubbleDiv)
	messageInput.value = ''
})

messageInputDiv.appendChild(sendBtn)
messageMainDiv.appendChild(messageInputDiv)
messagesDiv.appendChild(messageMainDiv)
messageInput.addEventListener('input', () => {
	if (messageInput.value.trim()) {
		sendBtn.children[0].dataset.lucide = 'send'
		lucide.createIcons()
	}
})

export default function chatPage() {
	return messagesDiv
}

socket.onRoomMessage = (data) => {
	if (data.sender_username !== currentUser.username) {
		const chatBubbleDiv = chatBubble(false, data.message, data.timestamp)
		messageMainDiv.appendChild(chatBubbleDiv)
	}
	else {
		messageMainDiv.querySelector(`div[data-temporary_id = ${data.temporary_id}] > .timestamp`).textContent = data.timestamp
	}
}

socket.onTyping = () => {
	statusTag.textContent = 'typing...'
}