import { lucideIcon, iconifyIcon } from '../components/icon.js';
import { chatPreview } from '../components/chat.js';
import { server, socket } from '../server.js';
import domManager from '../dom-manager.js'
import { showNotification } from '../components/notification.js';
// 54px is the chat header size
//70px is the size of each chat preview + gap
let currentPage = 1
const currentScrollLimit = () => (54 + (70 * 15)) * currentPage

//Page render

const homeDiv = document.createElement('div')
homeDiv.className = 'home'

const homeHeaderDiv = document.createElement('div')
homeHeaderDiv.className = 'home-header'

const searchIcon = lucideIcon('search', 'left-icons')
const logoHeader = document.createElement('h2')
logoHeader.textContent = 'Beep'
const settingsIcon = lucideIcon('settings', '')
homeHeaderDiv.append(searchIcon, logoHeader, settingsIcon)

homeDiv.appendChild(homeHeaderDiv)

const chatDiv = document.createElement('div')
chatDiv.className = 'chats-main'

const onFetchSuccess = (data) => {
	for (let room of data.results) {
		const username = (room.is_group) ? room.parent.name : room.parent.username
		const chatPreviewDiv = chatPreview({ profileImage: '/img/profile.jpg', username, timestamp: room.last_message_time, message: room.last_message.body })
		domManager.createChatPreviewDom(room.name, chatPreviewDiv)
		chatDiv.appendChild(chatPreviewDiv)
	}
}

const showUserChats = async function() {
	await server.getUsersChat({
		onSuccess: onFetchSuccess
	})
}
showUserChats()
homeDiv.appendChild(chatDiv)

const bottomNavBar = document.createElement('div')
bottomNavBar.className = 'bottom-navbar'

const friendIcon = lucideIcon('user-plus', '')
const messageIcon = lucideIcon('message-circle', 'current')
const thoughtIcon = iconifyIcon('mingcute:thought-line');

/*const currentSectionIconMap = {
	chat: messageIcon,
	friend: friendIcon,
	memory: thoughtIcon,
}*/

let currentSectionIcon = messageIcon

const updateCurrentSection = (newCurrentIcon, newSection) => {
	currentSectionIcon.classList.toggle('current')
	currentSectionIcon = newCurrentIcon
	currentSectionIcon.classList.toggle('current')
	homeDiv.children[1].replaceWith(newSection)
}

friendIcon.addEventListener('click', () => {
	if (currentSectionIcon === friendIcon) { return }
	updateCurrentSection(friendIcon, chatDiv)
	console.log('friend')
})

messageIcon.addEventListener('click', () => {
	if (currentSectionIcon === messageIcon) { return }
	updateCurrentSection(messageIcon, chatDiv)
	console.log('chat')
})

thoughtIcon.addEventListener('click', () => {
	if (currentSectionIcon === thoughtIcon) { return }
	updateCurrentSection(thoughtIcon, chatDiv)
	console.log('memory')
})

bottomNavBar.append(friendIcon, messageIcon, thoughtIcon)
homeDiv.appendChild(bottomNavBar)

export default function homePage() {
	return homeDiv
}

// Page actions
chatDiv.addEventListener('scroll', async (event) => {
	console.log(scrollY)
	if (scrollY < currentScrollLimit) { return }
	
	currentPage++
	await server.getUsersChat({
		onSuccess: onFetchSuccess,
		pageNumber: currentPage
	})
})

socket.chatsocket.addEventListener('message', (event) => {
	data = event.data
	
	
	if (data.typing && data.room in domManager.chatPreviewDom) {
		domManager.updateChatPreview(data.room, (element) => {
			const messageTag = element.querySelector('.message')
			const last_message = messageTag.textContent
			
			setTimeout(() => {
				messageTag.textContent = last_message
			}, 3000)
		})
		
	}
	
	else if (data.room in domManager.chatPreviewDom) {
		domManager.updateChatPreview(data.room, (element) => {
			element.querySelector('.timestamp').textContent = data.timestamp
			element.querySelector('.message').textContent = data.message
		})
		chatDiv.removeChild(element)
		chatDiv.children[0].insertBefore(element)
		
	}
	
	else {
		const chatPreviewDiv = chatPreview({ profileImage: '/img/profile.jpg', username: data.sender_username, timestamp: data.timestamp, message: data.message })
		chatDiv.children[0].insertBefore(chatPreviewDiv)
		domManager.createChatPreviewDom(data.room, chatPreviewDiv)
	}
	
})

socket.notificationSocket.onmessage = (event) => {
	const data = event.data
	switch (data.type) {
		case 'chat_notification':
			showNotification('chat',{
				message: data.message,
				sender: data.sender_username,
				timestamp: data.timestamp
			})
			break;
		case 'call_notification':
			showNotification('call', {
				caller: data.caller,
				room_id: data.room_id,
				room_name: data.room_name,
			})
			break;
			
		
		default:
			// Tab to edit
	}
	
}


//showNotification('chat',{message: 'heeey Nigga my name is jayfKsgxhdhxglxkfzkgdlyxkfzkfzkfzktdltxfkxglxktdlydxggkxgkxtkxgkxg,gxl', sender: 'Juwon33', timestamp: '13:60'})
showNotification('call', {caller:'Juwon33', room_name: 'chat_1_2', room_id: 3})
