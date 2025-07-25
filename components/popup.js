const basicPopUp = function(text) {
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

const confirmationPopup = (text, onConfirm, confirmText) => {
	const popup = document.createElement('dialog')
	popup.className = 'basic-popup'
	
	const popupText = document.createElement('p')
	popupText.className = 'main-text'
	popupText.textContent = text
	popup.appendChild(popupText)
	
	const buttonsDiv = document.createElement('div')
	buttonsDiv.className = 'choice-btns'
	
	const cancelBtn = document.createElement('button')
	cancelBtn.textContent = 'Cancel'
	cancelBtn.addEventListener('click',() =>  popup.close())
	
	const confirmBtn = document.createElement('button')
	confirmBtn.textContent = confirmText || 'Confirm'
	confirmBtn.addEventListener('click', onConfirm)
	
	buttonsDiv.append(cancelBtn, confirmBtn)
	
	popup.appendChild(buttonsDiv)
	return popup
}

export { basicPopUp, confirmationPopup }