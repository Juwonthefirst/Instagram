import { lucideIcon, iconifyIcon } from '../components/icon.js';
import { chatPreview } from '../components/chat.js';
const chatDiv = document.createElement('div')
chatDiv.className = 'chat'

const chatHeaderDiv = document.createElement('div')
chatHeaderDiv.className = 'chat-header'

const searchIcon = lucideIcon('search', 'left-icons')
const logoHeader = document.createElement('h2')
logoHeader.textContent = 'Beep'
const settingsIcon = lucideIcon('settings', '')
chatHeaderDiv.append(searchIcon, logoHeader, settingsIcon)

chatDiv.appendChild(chatHeaderDiv)

const mainChatDiv = document.createElement('div')
mainChatDiv.className = 'chats-main'

const chat1 = chatPreview({profileImage: '/img/profile.jpg', username: 'Juwon33', timestamp: '12:30', message: 'James is here'})
const chat2 = chatPreview({profileImage: '/img/profile.jpg', username: 'Juwon33', timestamp: '12:30', message: 'Juwon is here'})
const chat3 = chatPreview({profileImage: '/img/profile.jpg', username: 'Juwon33', timestamp: '12:30', message: 'John is here'})

mainChatDiv.append(chat1, chat2, chat3)
chatDiv.appendChild(mainChatDiv)

const bottomNavBar = document.createElement('div')
bottomNavBar.className = 'bottom-navbar'

const friendIcon = lucideIcon('user-plus', '')
const messageIcon = lucideIcon('message-circle', '')
const thoughtIcon = iconifyIcon('mingcute:thought-line')

bottomNavBar.append(friendIcon, messageIcon, thoughtIcon)
chatDiv.appendChild(bottomNavBar)

export default function chatPage() {
	return chatDiv
}