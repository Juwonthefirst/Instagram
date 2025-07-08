import { lucideIcon, iconifyIcon } from '../components/icon.js';
import { chatPreview } from '../components/chat.js';
import { server, socket } from '../server.js';
import domManager from '../dom-manager.js'
import { showNotification } from '../components/notification.js';
import { router } from '../router.js';
import { friendPreview } from '../components/userComponents.js';

// 54px is the chat header size
//70px is the size of each chat preview + gap
let currentChatPage = 1
let currentFriendPage = 1
let currentThoughtPage = 1

let pageScrollLimit = 54 + (70 * 15)


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

const onUserChatsFetchSuccess = (data) => {
	for (let room of data.results) {
		const username = (room.is_group) ? room.parent.name : room.parent.username
		const chatPreviewDiv = chatPreview({ profileImage: '/img/profile.jpg', username, timestamp: room.last_message_time, message: room.last_message.body })
		chatPreviewDiv.addEventListener('click', () => router.navigateTo(`/chat/${room.parent.name}/`))
		domManager.createChatPreviewDom(room.name, chatPreviewDiv)
		chatDiv.appendChild(chatPreviewDiv)
	}
}

const onUserFriendsFetchSuccess = (data) => {
	for (const friend of data.results) {
		const friendDiv = friendPreview(friend)
		friendDiv.appendChild(friendDiv)
	}
}

const showUserChats = async function() {
	if (Object.keys(domManager.chatPreviewDom).length) {
		for (const domElement in domManager.chatPreviewDom) {
			chatDiv.appendChild(domElement)
		}
		return 
	}
	
	await server.getUserChat({
		onSuccess: onUserChatsFetchSuccess
	})
}
showUserChats()
homeDiv.appendChild(chatDiv)

const friendDiv = document.createElement('div')
friendDiv.className = 'friends-list'
friendDiv.textContent = 'heeelo friends'

const getUserFriends = async () => {
	await server.getUserFriends({
		onSuccess: onUserFriendsFetchSuccess
	})
}

getUserFriends()

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
	updateCurrentSection(friendIcon, friendDiv)
	
})

messageIcon.addEventListener('click', () => {
	if (currentSectionIcon === messageIcon) { return }
	updateCurrentSection(messageIcon, chatDiv)
})

thoughtIcon.addEventListener('click', () => {
	if (currentSectionIcon === thoughtIcon) { return }
	updateCurrentSection(thoughtIcon, chatDiv)
})

bottomNavBar.append(friendIcon, messageIcon, thoughtIcon)
homeDiv.appendChild(bottomNavBar)

export default function homePage() {
	return homeDiv
}

// Page actions
chatDiv.addEventListener('scroll', async (event) => {
	console.log(scrollY)
	if (scrollY < currentScrollLimit * currentChatPage) { return }
	
	currentChatPage++
	await server.getUserChat({
		onSuccess: onUserChatsFetchSuccess,
		pageNumber: currentChatPage
	})
})

friendDiv.addEventListener('scroll', async (event) => {
	console.log(scrollY)
	if (scrollY < currentScrollLimit * currentFriendPage) { return }
	
	currentFriendPage++
	await server.getUserFriends({
		onSuccess: onUserFriendsFetchSuccess,
		pageNumber: currentFriendPage
	})
})

socket.onPreviewMessage = (data) => {
	if (data.room in domManager.chatPreviewDom) {
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
}

socket.onTyping = () => {
	if (data.room in domManager.chatPreviewDom) {
		domManager.updateChatPreview(data.room, (element) => {
			const messageTag = element.querySelector('.message')
			const last_message = messageTag.textContent
			
			setTimeout(() => {
				messageTag.textContent = last_message
			}, 3000)
		})
		
	}
}




//showNotification('chat', { message: 'heeey Nigga my name is jayfKsgxhdhxglxkfzkgdlyxkfzkfzkfzktdltxfkxglxktdlydxggkxgkxtkxgkxg,gxl', sender: 'Juwon33', timestamp: '13:60' })
//showNotification('call', {caller:'Juwon33', room_name: 'chat_1_2', room_id: 3})