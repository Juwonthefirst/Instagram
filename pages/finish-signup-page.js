import { inputField } from '../components/Inputs.js';
import { server } from '../server.js';
import { router } from '../router.js';
import { memory } from '../appMemory.js';
import { iconifyIcon, loadingLoopIcon } from '../components/icon.js';

let usernameTimeout;


const pickUsernameDiv = document.createElement('div')
pickUsernameDiv.className = 'finish-signup-page'
const form = document.createElement('form')
form.noValidate = true
pickUsernameDiv.appendChild(form)
const usernameField = inputField('text', 'username-field', 'Choose a username')
const usernameInput = usernameField.firstElementChild
const usernameErrorTag = document.createElement('p')
usernameErrorTag.className = 'input-error'
const loadingLoopDiv = document.createElement('div')
loadingLoopDiv.innerHTML = loadingLoopIcon


usernameInput.addEventListener('input', () => {
	clearTimeout(usernameTimeout)
	usernameTimeout = setTimeout(async () => {
		const username = usernameInput.value.trim()
		if (username.length < 4) return
		usernameField.appendChild(loadingLoopDiv)
		await server.userExists({
			username,
			onExist: (data) => {
				usernameErrorTag.className = 'input-result error'
				usernameErrorTag.textContent = data.error.error || 'Sorry, someone already picked this'
				signupBtn.disabled = true
			},
			onFree: () => {
				usernameErrorTag.className = 'input-result success'
				usernameErrorTag.textContent = 'Wow, nice name you should take it'
				signupBtn.disabled = false
			}
		})
		usernameField.removeChild(loadingLoopDiv)
	}, 300)
})
const signupBtn = document.createElement('button')
signupBtn.type = 'submit'
signupBtn.className = 'submit-btn'
signupBtn.textContent = 'All set'
signupBtn.disabled = true

form.addEventListener('submit', async (event) => {
	event.preventDefault()
	const username = usernameInput.value.trim()
	if (username) {
		const data = { username }
		await server.updateUserField({
			data,
			onError: (data) => { usernameErrorTag.textContent = data.error.username },
			onSuccess: (data) => {
				memory.setCurrentUser(data.user)
				router.navigateTo('/')
				localStorage.removeItem('new_user')
			}
		})
	}
})
form.append(usernameField, usernameErrorTag, signupBtn)

export default function pickUsername() {
	return pickUsernameDiv
}