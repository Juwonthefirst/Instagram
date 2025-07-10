import { socket } from './server.js';
import { chatBubble, chatPreview } from './components/chat.js';

class DomManager{
	constructor(){
		this.chatPreviewDom = {}
		this.chatDom = {}
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
	
	updateChatPreview(domKey, callback){
		const domElement = this.chatPreviewDom[domKey]
		callback(domElement)
	}
	
	updateChat(domKey, callback){
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