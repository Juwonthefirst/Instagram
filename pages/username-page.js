import { inputField } from '../components/Inputs.js';
import server from '../fetch.js';
import { router } from '../router.js';
import { memory } from '../appMemory.js';
import { iconifyIcon } from '../components/icon.js';

const usernameResponseTag = (isError) => {
	const div = document.createElement('div')
	const iconName = isError? '' : ''
	div.appendChild(iconifyIcon(iconName))
	const textTag = document.createElement('p')
	textTag.textContent = ''
	textTag.className = isError? 'input-error': 'input-success'
	return div
}
const pickUsernameDiv = document.createElement('div')
const form = document.createElement('form')
form.noValidate = true
pickUsernameDiv.appendChild(form)
const usernameField = inputField('text', 'username-field', 'Choose a username')
const usernameInput = usernameField.firstElementChild
const usernameFeedbackTag
usernameErrorTag.className = 'input-error'

usernameInput.addEventListener('input', () => {
	usernameErrorTag.textContent = ''
	await server.userExists({ 
		username: usernameInput.value,
		onExist: () => { usernameErrorTag.textContent = 'Sorry, someone already picked this' },
		onFree: () => {usernameField.textContent = 'Wow, nice name you should take it'}
	})
})
const signupBtn = document.createElement('button')
signupBtn.type = 'submit'
signupBtn.className = 'submit-btn'
signupBtn.textContent = 'All set'
signupBtn.disabled = true
form.addEventListener('submit', (event) => {
	event.preventDefault()
	const username = usernameInput.value
	if (username) {
		data = { username }
		server.updateUserField({
			data,
			onError: (data) => {usernameErrorTag.textContent = data.error.username},
			onSuccess: (data) => {
				memory.setCurrentUser(data.user)
				router.navigateTo('/')
			}
		})
	}
})
form.appendChild(usernameField, usernameErrorTag, signupBtn)

export default function pickUsername() {
	return pickUsernameDiv
}