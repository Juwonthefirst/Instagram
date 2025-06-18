import iconDiv from '../components/icon.js';
import { inputField, passwordField } from '../components/Inputs.js';
import { googleButton } from '../components/buttons.js';
import { router } from '../router.js';
import server from '../fetch.js';
import { google_client_id, FormValidator } from '../helper.js';


let googleClient

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
				onError: (data) => onLoginError(data),
				onSuccess: () => onLoginSuccess( router, server )
			})
		}
	})
})();

const signupDiv = document.createElement('div')
signupDiv.className = 'signup'

const header = document.createElement('div')
header.className = 'header'

const icon = iconDiv("chevron-left", 'back-btn')
icon.addEventListener('click', () => { router.navigateTo('/#/login') })
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

const formValidator = new FormValidator( [ emailField, passField, confirmPassField ], signupBtn )
formValidator.addCustomErrorHandler(confirmPassInput, () => {
	const isValid = confirmPassInput.value.trim() === passInput.value.trim()
	const errorMessage = 'This fiel'
	return { isValid, errorMessage }
})


form.addEventListener('submit', async (event) => {
	event.preventDefault()
	const email = emailInput.value.trim()
	const password = passInput.value.trim()
	const confirmPass = confirmPassInput.value.trim()
	if(formValidator.validate()){
	    await server.signup({ email, password })
	}
	
})
const socialLoginDiv = document.createElement('div')
socialLoginDiv.className = 'social-login-box'

const socialLoginBtn = googleButton(googleClient)
socialLoginDiv.appendChild(socialLoginBtn)
signupDiv.appendChild(socialLoginDiv)
export default function signupPage() {
	const main = document.querySelector('.root')
	main.innerHTML = ''
	main.appendChild(signupDiv)
}