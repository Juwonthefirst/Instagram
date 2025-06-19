const basicPopUp = function( title, text, isError ) {
	const popup = document.createElement('dialog')
	popup.className = isError? 'basic-popup error' : 'basic-popup'
	const popupHead = document.createElement('p')
	popupHead.textContent = title
	popup.appendChild(popupHead)
	
	const popupText = document.createElement('p')
	popupText.className = 'main-text'
	popupText.textContent = text
	popup.appendChild(popupText)
	
	const closeButton = document.createElement('button')
	closeButton.addEventListener('click', () => popup.close())
	popup.appendChild(closeButton)
	return popup
}

export { basicPopUp }