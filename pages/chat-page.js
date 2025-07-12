import { lucideIcon } from '../components/icon.js';
import { server, socket } from '../server.js';
import { memory } from '../appMemory.js';
import { chatBubble } from '../components/chat.js';
import domManager from '../dom-manager.js';
import { showNotification } from '../components/notification.js';
import { router } from '../router.js';
import { getTimePassed } from '../helper.js';

const currentUser = memory.getCurrentUser()
const urlPath = location.pathname.split('/')
const friend_username = urlPath.at(-1) || urlPath.at(-2);

memory.currentRoom = 'chat_4_5';
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
			socket.send({
				action: 'group_join',
				room_name: data.name
			})
			
			if (data.parent.is_online) {
				statusTag.textContent = 'online' 
			}
			else {
				const last_online_date = new Date(data.parent.last_online)
				statusTag.textContent = getTimePassed(data.parent.last_online)
			}
			
		}
		
	})
})();

const messagesDiv = document.createElement('div')
messagesDiv.className = 'chat-message'

const messageHeader = document.createElement('div')
messageHeader.className = 'message-header'

const backBtn = lucideIcon('arrow-left')
backBtn.addEventListener('click', () => {router.navigateTo('/')})
messageHeader.appendChild(backBtn)

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
messageHeader.appendChild(chatDetailsDiv)

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
messageInput.type = 'text'
messageInput.name = 'chat-message'
messageInput.placeholder = 'Beep them'
messageBoxDiv.append(cameraIcon, messageInput)
messageInputDiv.appendChild(messageBoxDiv)
const sendBtn = lucideIcon('mic', 'send-btn')
sendBtn.addEventListener('click', () => {
	const message = messageInput.value.trim()
	if (!message) { return }
	const temporary_id = crypto.randomUUID()
	
	socket.send({
		message,
		action: 'chat',
		room: memory.currentRoom,
		temporary_id
	})
	
	const newMessageBubbleDiv = chatBubble(true, message, 'pending', temporary_id)
	domManager.updateChatDom(memory.currentRoom, (domElementsList) => {
		domElementsList?.push(newMessageBubbleDiv)
	})
	messageMainDiv.appendChild(newMessageBubbleDiv)
	messageInput.value = ''
})

messageInputDiv.appendChild(sendBtn)
messageMainDiv.appendChild(messageInputDiv)
messagesDiv.appendChild(messageMainDiv)
messageInput.addEventListener('input', () => {
	if (messageInput.value.trim()) {
		sendBtn.children[0].dataset.lucide = 'send'
	}
	else {
		sendBtn.children[0].dataset.lucide = 'mic'
	}
	lucide.createIcons()
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
	const statusTagTextContent = statusTag.textContent
	statusTag.textContent = 'typing...'
	setTimeout(() => {
		statusTag.textContent = statusTagTextContent
	}, 3000)
	
}