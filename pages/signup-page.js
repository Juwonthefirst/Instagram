import iconDiv from '../components/icon.js';
import { inputField, passwordField } from '../components/Inputs.js';
import { googleButton } from '../components/buttons.js';


const signupDiv = document.createElement('div')
signupDiv.classList.add('login', 'new-user')

const header = document.createElement('div')
header.className = 'header'

const icon = iconDiv("chevron-left", 'back-btn')
header.appendChild(icon)

const headerText = document.createElement('h2')
headerText.textContent = 'Register'
headerText.className = 'header-text'
header.appendChild(headerText)
signupDiv.appendChild(header)
const form = document.createElement('form')
form.noValidate = true

const emailField = inputField('text', 'email-field', 'Enter your email address')
const passField = passwordField('pass-field', 'Enter a password')
const confirmPassField = passwordField('confirm-pass-field', 'Confirm the password')

const loginBtn = document.createElement('button')
loginBtn.type = 'submit'
loginBtn.className = 'submit-btn'
loginBtn.textContent = 'Next'
loginBtn.disabled = true

form.append(emailField, passField, confirmPassField, loginBtn)
signupDiv.appendChild(form)

const socialLoginDiv = document.createElement('div')
socialLoginDiv.className = 'social-login-box'

const socialLoginBtn = googleButton()
socialLoginDiv.appendChild(socialLoginBtn)
signupDiv.appendChild(socialLoginDiv)
export default function signupPage() {
	const main = document.querySelector('.main')
	main.innerHTML = ''
	main.appendChild(signupDiv)
}