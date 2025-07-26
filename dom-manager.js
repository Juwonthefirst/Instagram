import { socket } from './server.js';
import { chatBubble, chatPreview } from './components/chat.js';
import { friendPreview } from './components/userComponents.js';

class DomManager{
	constructor(){
		this.chatPreviewDom = {}
		this.chatDom = {}
		this.friendListDom = null
	}
	
	addToFriendListDom(friendObject){
		const friendPreviewDiv = friendPreview(friendObject)
		this.friendListDom.insertBefore(friendPreviewDiv, friendListDom.children[0])
	}
	
	createChatPreviewDom(key, domElement){
		this.chatPreviewDom[key] = domElement
	}
	
	createChatDom(key, domElementList){
		this.chatDom[key] = domElementList
	}
	
	getChatPreviewDom(key){
		return this.chatPreviewDom[key]
	}
	
	getChatDom(key){
		return this.chatDom[key]
	}
	
	updateChatPreviewDom(domKey, callback){
		const domElement = this.chatPreviewDom[domKey]
		callback(domElement)
	}
	
	updateChatDom(domKey, callback){
		const domElement = this.chatDom[domKey]
		callback(domElement)
	}
	
	deleteChatPreviewDomElement(key){
		this.chatPreviewDom[key] = undefined
	}

	deleteChatDomElement(key){
		this.chatPreviewDom[key] = undefined
	}

	clearChatPreviewDomElement(){
		this.chatPreviewDom.clear()
	}
	
	clearChatDomElement(){
		this.chatDom.clear()
	}
	
}

export default new DomManager()