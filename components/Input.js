import iconTag from './icon.js';

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
	const icon = iconTag('eye-closed', 'password-icon')
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