import { lucideIcon, iconifyIcon } from '../components/icon.js';
import { chatPreview } from '../components/chat.js';
import { server, socket } from '../server.js';
import domManager from '../dom-manager.js'
import { showNotification } from '../components/notification.js';
import { router } from '../router.js';
import { friendPreview } from '../components/userComponents.js';
import { getTimePassed } from '../helper.js';

// 54px is the chat header size
//70px is the size of each chat preview + gap

let currentChatPage = 1
let currentFriendPage = 1
let currentThoughtPage = 1
let currentSubPage
let searchTimeout
let searching = false
let pageScrollLimit = 54 + (70 * 15)


//Page render
const homeDiv = document.createElement('div')
homeDiv.className = 'home'

const homeHeaderDiv = document.createElement('div')
homeHeaderDiv.className = 'home-header'

const searchBar = document.createElement('div')
searchBar.className = 'search-bar'


const backIcon = lucideIcon('chevron-left', 'back-btn')
searchBar.appendChild(backIcon)
const searchInput = document.createElement('input')
searchInput.className = 'search-input'
searchInput.placeholder = 'What are you looking for'
searchBar.appendChild(searchInput)
const searchIcon = lucideIcon('search', 'search-btn', true)
searchBar.appendChild(searchIcon)
const logoHeader = document.createElement('h2')
logoHeader.textContent = 'Beep'
const settingsBtn = lucideIcon('settings', 'settings')
settingsBtn.addEventListener('click', () => router.navigateTo('/settings'))
homeHeaderDiv.append(searchBar, logoHeader, settingsBtn)

homeDiv.appendChild(homeHeaderDiv)

/**
 * Sub pages
 */

// Chat
const chatDiv = document.createElement('div')
chatDiv.className = 'chats-main'

const onUserChatsFetchSuccess = (data) => {
    for (let room of data.results) {
        const username = (room.is_group) ? room.parent.name : room.parent.username
        const chatPreviewDiv = chatPreview({ profileImage: '/img/profile.jpg', username, timestamp: room.last_message.timestamp, message: room.last_message.body })
        chatPreviewDiv.addEventListener('click', () => router.navigateTo(`/chat/${room.parent.username}/`))
        domManager.createChatPreviewDom(room.name, chatPreviewDiv)
        chatDiv.appendChild(chatPreviewDiv)
    }
}

const onUserFriendsFetchSuccess = (data) => {
    for (const friend of data.results) {
        const friendPreviewDiv = friendPreview(friend)
        friendDiv.appendChild(friendPreviewDiv)
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
        onSuccess: onUserChatsFetchSuccess,
    })
}
showUserChats()
homeDiv.appendChild(chatDiv)

//Friend
const friendDiv = document.createElement('div')
friendDiv.className = 'friends-list'
const addFriendIcon = lucideIcon('user-plus', 'add-friend-btn new-desig')
addFriendIcon.addEventListener('click', () => {
    const previousRoute = router.currentRoute
    localStorage.setItem('previousRoute', previousRoute)
    router.navigateTo('/search')
})
friendDiv.appendChild(addFriendIcon)
domManager.friendListDom = friendDiv



const showUserFriends = async () => {
    await server.getUserFriends({
        onSuccess: onUserFriendsFetchSuccess,
    })
}

showUserFriends()


//Search
const searchResultDiv = document.createElement('div')
searchResultDiv.className = 'search-results'
const resultsDiv = document.createElement('div')
resultsDiv.className = 'results'
searchResultDiv.appendChild(resultsDiv)

const bottomNavBar = document.createElement('div')
bottomNavBar.className = 'bottom-navbar'

const friendIcon = lucideIcon('users', '')
const messageIcon = lucideIcon('message-circle', 'current')
const thoughtIcon = iconifyIcon('mingcute:thought-line');


//Bottom navbar
let currentSectionIcon = messageIcon

const updateCurrentSection = (newCurrentIcon, newSection) => {
    if (searching) { return }
    currentSectionIcon.classList.toggle('current')
    currentSectionIcon = newCurrentIcon
    currentSectionIcon.classList.toggle('current')
    homeDiv.children[1].replaceWith(newSection)
    lucide.createIcons()
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

//Export function
export default function homePage() {
    socket.onPreviewMessage = (data) => {
        if (data.room in domManager.chatPreviewDom) {
            domManager.updateChatPreviewDom(data.room, (element) => {
                element.querySelector('.timestamp').textContent = getTimePassed(data.timestamp)
                element.querySelector('.message').textContent = data.message
                chatDiv.removeChild(element)
                chatDiv.insertBefore(element, chatDiv.children[0])
            })
            
        }
        
        else {
            const chatPreviewDiv = chatPreview({ profileImage: '/img/profile.jpg', username: data.sender_username, timestamp: data.timestamp, message: data.message })
            if (chatDiv.children[0]) chatDiv.insertBefore(chatPreviewDiv, chatDiv.children[0])
            else chatDiv.appendChild(chatPreviewDiv)
            domManager.createChatPreviewDom(data.room, chatPreviewDiv)
        }
    }
    
    socket.onTyping = (data) => {
        if (data.room in domManager.chatPreviewDom) {
            domManager.updateChatPreviewDom(data.room, (element) => {
                const messageTag = element.querySelector('.message')
                const last_message = messageTag.textContent
                messageTag.textContent = 'typing...'
                setTimeout(() => {
                    messageTag.textContent = last_message
                }, 3000)
            })
        }
    }
    
    return homeDiv
}

// Page actions
backIcon.addEventListener('click', (event) => {
    if (!searchBar.classList.contains('opened')) return
    event.stopPropagation()
    searching = false
    searchBar.classList.remove('opened');
    logoHeader.style.display = 'block'
    settingsBtn.style.display = 'block'
    searchResultDiv.replaceWith(currentSubPage)
})

searchBar.addEventListener('click', () => {
    if (searchBar.classList.contains('opened')) return
    searchBar.classList.add('opened');
    logoHeader.style.display = 'none'
    settingsBtn.style.display = 'none'
    currentSubPage = homeDiv.children[1]
    currentSubPage.replaceWith(searchResultDiv)
    searching = true
})

searchInput.addEventListener('input', async () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(async () => {
        const searchKeyWord = searchInput.value.trim()
        if (currentSectionIcon === messageIcon) {
            await server.getUserChat({
                searchKeyWord,
                onSuccess: (data) => {
                    searchResultDiv.innerHTML = ''
                    for (let room of data.results) {
                        const username = (room.is_group) ? room.parent.name : room.parent.username
                        const chatPreviewDiv = chatPreview({ profileImage: '/img/profile.jpg', username, timestamp: room.last_message_time, message: room.last_message.body })
                        chatPreviewDiv.addEventListener('click', () => router.navigateTo(`/chat/${room.parent.name}/`))
                        searchResultDiv.appendChild(chatPreviewDiv)
                    }
                    lucide.createIcons()
                }
            })
        }
        
        else if (currentSectionIcon === friendIcon) {
            await server.getUserFriends({
                searchKeyWord,
                onSuccess: (data) => {
                    searchResultDiv.innerHTML = ''
                    for (const friend of data.results) {
                        const friendPreviewDiv = friendPreview(friend)
                        searchResultDiv.appendChild(friendPreviewDiv)
                    }
                    lucide.createIcons()
                }
            })
        }
        
        else if (currentSectionIcon === thoughtIcon) {
            
        }
    }, 300)
})

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