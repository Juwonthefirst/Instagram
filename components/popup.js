const basicPopUp = function( title, text ) {
	const popup = document.createElement('dialog')
	popup.className = 'basic-popup'
	const popupHead = document.createElement('p')
	popupHead.textContent = title
	popup.appendChild(popupHead)
	
	const popupText = document.createElement('p')
	popupText.className = 'main-text'
	popupText.textContent = text
	popup.appendChild(popupText)
	
	const closeButton = document.createElement('button')
	closeButton.addEventListener('click', popup.close)
	popup.appendChild(closeButton)
	return popup
}

export { basicPopUp }