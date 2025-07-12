import { lucideIcon } from './icon.js';

const inputField = function (type, id, title){
	const fieldDiv = document.createElement('div')
	fieldDiv.className = 'input-field'
	const input = document.createElement('input')
	input.type = type
	input.id = id
	input.required = true
	input.placeholder = ' '
	const label = document.createElement('label')
	label.for = id
	label.textContent = title
	const errorTag = document.createElement('p')
	errorTag.className = 'error'
	
	fieldDiv.append(input, label)
	return fieldDiv
}

const passwordField = function (id, title){
	const fieldDiv = document.createElement('div')
	fieldDiv.className = 'input-field'
	const input = document.createElement('input')
	input.type = 'password'
	input.id = id
	input.required = true
	input.placeholder = ' '
	const label = document.createElement('label')
	label.for = id
	label.textContent = title
	let icon = lucideIcon('eye-closed', 'password-icon')
	icon.type = 'button'
	icon.style.visibility = 'hidden'
	icon.addEventListener('click', () => {
		if(icon.firstElementChild.dataset.lucide === 'eye'){
			icon.firstElementChild.dataset.lucide = 'eye-closed'
			input.type = 'password'
		}
		else{
			icon.firstElementChild.dataset.lucide = 'eye'
			input.type = 'text'
		}
		lucide.createIcons()
	})
	fieldDiv.append( input, label, icon )
	return fieldDiv
}

export { inputField, passwordField }