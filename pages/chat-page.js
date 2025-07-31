import { lucideIcon } from '../components/icon.js';
import { server, socket } from '../server.js';
import { memory } from '../appMemory.js';
import { chatBubble } from '../components/chat.js';
import domManager from '../dom-manager.js';
import { showNotification } from '../components/notification.js';
import { router } from '../router.js';
import { getTimePassed, getReadableTime } from '../helper.js';

export default function chatPage() {
    
    const appendMessageBubbles = (messages) => {
        const currentUser = memory.getCurrentUser()
        const chatBubbleElements = []
        for (let message of messages) {
            const isSender = message.sender === currentUser.id
            const chatBubbleDiv = chatBubble(isSender, message.body, message.timestamp)
            chatBubbleElements.push(chatBubbleDiv)
            messageMainDiv.appendChild(chatBubbleDiv)
        }
        return chatBubbleElements
    }
    
    const fetchRoomAndDisplayMessages = async (friend_username) => {
        let friendObject
        /*if (Object.keys(domManager.chatDom).length) {
        	const chatDomElements = domManager.getChatDom(friend_username)
        	return messageMainDiv.append(...chatDomElements)
        }*/
        
        await server.getRoomAndMessage({
            friend_username,
            onSuccess: (data) => {
                memory.currentRoom = data.name
                voiceCallBtn.onclick = () => router.render('call', { room_name: memory.currentRoom, type: 'audio', calleeObject: data.parent })
                videoCallBtn.onclick = () => router.render('call', { room_name: memory.currentRoom, type: 'video', calleeObject: data.parent })
                usernameTag.textContent = data.parent.username
                const messages = data.messages
                const chatBubbleElements = appendMessageBubbles(messages)
                
                domManager.createChatDom(memory.currentRoom, chatBubbleElements)
                socket.groupJoin(data.name)
                
                if (data.parent.is_online) {
                    statusTag.classList.add('online')
                    statusTag.textContent = 'online'
                }
                else {
                    statusTag.classList.remove('online')
                    statusTag.textContent = 'was online ' + getTimePassed(data.parent.last_online)
                }
                
            },
            onError: (data) => console.log(data)
        })
    }
    
    
    const messagesDiv = document.createElement('div')
    messagesDiv.className = 'chat-message'
    
    const messageHeader = document.createElement('div')
    messageHeader.className = 'message-header'
    
    const backBtn = lucideIcon('arrow-left')
    backBtn.addEventListener('click', () => {
        router.navigateTo('/')
        socket.groupLeave()
    })
    messageHeader.appendChild(backBtn)
    
    const chatDetailsDiv = document.createElement('div')
    chatDetailsDiv.className = 'chat-details'
    
    const chatPictureTag = document.createElement('img')
    chatPictureTag.src = '/img/profile.jpg'
    chatPictureTag.className = 'chat-picture'
    chatDetailsDiv.appendChild(chatPictureTag)
    
    const nameAndStatusDiv = document.createElement('div')
    nameAndStatusDiv.className = 'name-and-status'
    
    const usernameTag = document.createElement('p')
    usernameTag.className = 'username'
    
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
    const messageInput = document.createElement('textarea')
    messageInput.name = 'chat-message'
    messageInput.rows = 1
    messageInput.placeholder = 'Beep them'
    messageBoxDiv.append(cameraIcon, messageInput)
    messageInputDiv.appendChild(messageBoxDiv)
    const sendBtn = lucideIcon('mic', 'send-btn')
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim()
        if (!message) return
        
        const temporary_id = socket.sendMessage(message)
        
        const newMessageBubbleDiv = chatBubble(true, message, 'pending', temporary_id)
        domManager.updateChatDom(memory.currentRoom, (domElementsList) => {
            domElementsList?.push(newMessageBubbleDiv)
            console.log(domElementsList)
        })
        messageMainDiv.insertBefore(newMessageBubbleDiv, messageMainDiv.children[0])
        messageInput.value = ''
        messageInput.style.height = 'auto'
        messageInput.focus()
    })
    
    messageInputDiv.appendChild(sendBtn)
    messagesDiv.appendChild(messageMainDiv)
    messagesDiv.appendChild(messageInputDiv)
    
    let typingSignalSent = false
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim()) {
            sendBtn.children[0].dataset.lucide = 'send'
        }
        else {
            sendBtn.children[0].dataset.lucide = 'mic'
        }
        messageInput.style.height = 'auto'
        messageInput.style.height = messageInput.scrollHeight + 'px'
        lucide.createIcons()
        
        if (typingSignalSent) return
        socket.typing()
        typingSignalSent = true
        setTimeout(() => typingSignalSent = false, 3000)
    })
    
    let nextMessagePage
    let pageNumber = 2
    let fetchingMoreMessages = false
    
    const onScrollUp = async (event) => {
        const currentScrollHeight = (-messageMainDiv.scrollTop) + messageMainDiv.clientHeight
        const maxScrollHeight = messageMainDiv.scrollHeight
        const onFetchNewMessagePage = (data) => {
            pageNumber++
            if (data.next) nextMessagePage = data.next
            const chatBubbleElements = appendMessageBubbles(data.results)
            domManager.updateChatDom(memory.currentRoom, (elementList) => {
                elementList.push(...chatBubbleElements)
                console.log(element)
            })
        }
        
        console.log(fetchingMoreMessages)
        if (currentScrollHeight > (maxScrollHeight - 300) && !fetchingMoreMessages) {
            //messageMainDiv.appendChild()
            fetchingMoreMessages = true
            
            if (nextMessagePage) {
                return await server.get({
                    path: nextMessagePage,
                    onSuccess: onFetchNewMessagePage
                })
            }
            
            await server.getRoomMessages({
                room_name: memory.currentRoom,
                pageNumber,
                onSuccess: onFetchNewMessagePage
            })
            
            setTimeout(() => fetchingMoreMessages = false, 3000)
        }
    }
    
    
    let typingTimeout = false
    const currentUser = memory.getCurrentUser()
    const urlPath = location.pathname.split('/')
    const friend_username = urlPath.at(-1) || urlPath.at(-2);
    
    usernameTag.textContent = friend_username
    chatPictureTag.alt = `${friend_username} profile`
    
    fetchRoomAndDisplayMessages(friend_username, currentUser)
    socket.onRoomMessage = (data) => {
        if (data.sender_username !== currentUser.username) {
            const newMessageBubbleDiv = chatBubble(false, data.message, data.timestamp)
            domManager.updateChatDom(memory.currentRoom, (domElementsList) => {
                domElementsList?.push(newMessageBubbleDiv)
            })
            messageMainDiv.insertBefore(newMessageBubbleDiv, messageMainDiv.children[0])
        }
        messageMainDiv.scrollTop = messageMainDiv.scrollHeight
    }
    
    socket.onTyping = () => {
        clearTimeout(typingTimeout)
        const statusTagTextContent = statusTag.textContent
        statusTag.textContent = 'typing...'
        typingTimeout = setTimeout(() => {
            statusTag.textContent = statusTagTextContent
        }, 3000)
        
    }
    messageMainDiv.addEventListener('scroll', () => onScrollUp())
    return messagesDiv
}