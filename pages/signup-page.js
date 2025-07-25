import { lucideIcon, iconifyIcon, loadingLoopIcon } from '../components/icon.js';
import { inputField, passwordField } from '../components/Inputs.js';
import { googleButton } from '../components/buttons.js';
import { basicPopUp } from '../components/popup.js';
import { router } from '../router.js';
import {server} from '../server.js';
import { memory } from '../appMemory.js';
import { google_client_id, FormValidator } from '../helper.js';

let usernameTimeout
let googleClient
const signupErrorPopup = basicPopUp('');

(() => {
	googleClient = google.accounts.oauth2.initCodeClient({
		client_id: google_client_id,
		scope: 'email profile openid',
		redirect_uri: 'postmessage',
		ux_mode: 'popup',
		code_challenge_method: 'S256',
		callback: async (code) => {
			await server.googleLoginByCode({
				googleTokenObject: code,
				onError: (data) => {
					signupErrorPopup.firstElementChild.textContent = data.error
					signupErrorPopup.showModal()
				},
				onSuccess: (data) => {
					if (data.new_user) {
						return router.render('finish-signup')
					}
					router.navigateTo('/')
				}
			})
		}
	})
})();

const signupDiv = document.createElement('div')
signupDiv.className = 'signup'

signupDiv.appendChild(signupErrorPopup)

const header = document.createElement('div')
header.className = 'header'

const icon = lucideIcon("chevron-left", 'back-btn')
icon.addEventListener('click', () => { router.navigateTo('/login') })
header.appendChild(icon)

const headerText = document.createElement('p')
headerText.textContent = 'Register'
headerText.className = 'header-text'
header.appendChild(headerText)
signupDiv.appendChild(header)

const form = document.createElement('form')
form.noValidate = true
const usernameField = inputField('text', 'username-field', 'Enter your preferred username')
const loadingLoopDiv = document.createElement('div')
loadingLoopDiv.innerHTML = loadingLoopIcon
const emailField = inputField('email', 'email-field', 'Enter your email address')
const passField = passwordField('pass-field', 'Enter a password')
const confirmPassField = passwordField('confirm-pass-field', 'Confirm the password')

const usernameInput = usernameField.firstElementChild
const emailInput = emailField.firstElementChild
const passInput = passField.firstElementChild
const confirmPassInput = confirmPassField.firstElementChild

const signupBtn = document.createElement('button')
signupBtn.type = 'submit'
signupBtn.className = 'submit-btn'
signupBtn.textContent = 'Next'
signupBtn.disabled = true

form.append(usernameField, emailField, passField, confirmPassField, signupBtn)
signupDiv.appendChild(form)


const formValidator = new FormValidator([emailField, passField, confirmPassField], signupBtn)
formValidator.addCustomErrorHandler(confirmPassInput, () => {
	const isValid = confirmPassInput.value.trim() === passInput.value.trim()
	const errorMessage = 'This field should be the same as your password'
	return { isValid, errorMessage }
})

const onSignupSuccess = () => {
	router.navigateTo('/verify-email');
	localStorage.setItem('pending_verified_mail', emailInput.value)
}

const onSignupError = (data) => {
	const inputFields = {
		email: emailField,
		password1: passField
	}
	
	const errors = data.error
	
	for (let error in errors) {
		const errorMessage = errors[error][0]
		const inputFieldWithError = inputFields[error]
		if (!inputFieldWithError) {
			signupErrorPopup.firstElementChild.textContent = errorMessage
			signupErrorPopup.showModal()
			continue
		}
		formValidator.appendErrorMessage(inputFieldWithError, errorMessage)
	}
}

usernameInput.addEventListener('input', async () => {
	clearTimeout(usernameTimeout)
	usernameTimeout = setTimeout(async () => {
		const username = usernameInput.value.trim().toLowerCase()
		if (username.length < 4) return 
		usernameField.appendChild(loadingLoopDiv)
		await server.userExists({
			username,
			onExist: (data) => {
				const errorText = data.error.error || 'Sorry, someone already picked this'
				formValidator.appendErrorMessage(usernameField, errorText)
				usernameField.nextElementSibling.style.color = 'red'
				usernameField.style.borderColor = 'red'
				signupBtn.disabled = true
			},
			onFree: () => {
				formValidator.appendErrorMessage(usernameField, 'Wow, nice name you should take it')
				usernameField.nextElementSibling.style.color = 'green'
				usernameField.style.borderColor = 'green'
				signupBtn.disabled = false
			}
		})
		usernameField.removeChild(loadingLoopDiv)
	}, 300)
})

form.addEventListener('submit', async (event) => {
	event.preventDefault()
	if (formValidator.validate()) {
		const email = emailInput.value.trim()
		const password = passInput.value.trim()
		const username = usernameInput.value.trim()
		
		signupBtn.innerHTML = loadingLoopIcon
		await server.signup({
			username,
			email,
			password,
			onSuccess: onSignupSuccess,
			onError: onSignupError
		})
		signupBtn.textContent = 'Next'
	}
	
})
const socialLoginDiv = document.createElement('div')
socialLoginDiv.className = 'social-login-box'

const socialLoginBtn = googleButton(googleClient)
socialLoginDiv.appendChild(socialLoginBtn)
signupDiv.appendChild(socialLoginDiv)

export default function signupPage() {
	return signupDiv
}