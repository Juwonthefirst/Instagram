const basicPopUp = function( text ) {
	const popup = document.createElement('dialog')
	popup.className = 'basic-popup'

	
	const popupText = document.createElement('p')
	popupText.className = 'main-text'
	popupText.textContent = text
	popup.appendChild(popupText)
	
	const closeButton = document.createElement('button')
	closeButton.textContent = 'Close'
	closeButton.addEventListener('click', () => popup.close())
	popup.appendChild(closeButton)
	return popup
}

export { basicPopUp }