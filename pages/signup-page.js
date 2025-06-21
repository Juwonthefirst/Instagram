import { lucideIcon, iconifyIcon } from '../components/icon.js';
import { inputField, passwordField } from '../components/Inputs.js';
import { googleButton } from '../components/buttons.js';
import { basicPopUp } from '../components/popup.js';
import { router } from '../router.js';
import server from '../fetch.js';
import { google_client_id, FormValidator } from '../helper.js';


let googleClient
const signupErrorPopup = basicPopUp('')

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
				onSuccess: () => router.render('finish-signup')
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

const emailField = inputField('email', 'email-field', 'Enter your email address')
const passField = passwordField('pass-field', 'Enter a password')
const confirmPassField = passwordField('confirm-pass-field', 'Confirm the password')

const emailInput = emailField.firstElementChild
const passInput = passField.firstElementChild
const confirmPassInput = confirmPassField.firstElementChild

const signupBtn = document.createElement('button')
signupBtn.type = 'submit'
signupBtn.className = 'submit-btn'
signupBtn.textContent = 'Next'

form.append(emailField, passField, confirmPassField, signupBtn)
signupDiv.appendChild(form)

const formValidator = new FormValidator([emailField, passField, confirmPassField], signupBtn)
formValidator.addCustomErrorHandler(confirmPassInput, () => {
	const isValid = confirmPassInput.value.trim() === passInput.value.trim()
	const errorMessage = 'This field should be the same as your password'
	return { isValid, errorMessage }
})

const onSignupError = (data) => {
	const inputFields = {
		email: emailField,
		password1: passField
	}
	
	const errors = data.error
	
	for (let error in errors) {
		const errorMessage = errors[error][0]
		const inputFieldWithError = inputFields[error] || null
		if(!inputFieldWithError){
			signupErrorPopup.firstElementChild.textContent = errorMessage
			signupErrorPopup.showModal()
			continue
		}
		formValidator.appendErrorMessage( inputFieldWithError, errorMessage )
	}
}

form.addEventListener('submit', async (event) => {
	event.preventDefault()
	if (formValidator.validate()) {
		const email = emailInput.value
		const password = passInput.value
		const defaultUsername = email.replace('@gmail.com', '')
		signupBtn.firstChild.replaceWith(iconifyIcon('line-md:loading-loop'))
		await server.signup({
			username: defaultUsername,
			email,
			password,
			onSuccess: () => {
				router.render('/verify-email');
				sessionStorage.setItem('pending_verified_mail', emailInput.value)
			},
			onError: (data) => onSignupError(data)
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