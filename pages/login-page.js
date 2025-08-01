import { inputField, passwordField } from '../components/Inputs.js'
import { googleButton } from '../components/buttons.js';
import { server, socket } from '../server.js'
import { router } from '../router.js';
import { memory } from '../appMemory.js';
import { google_client_id, onLoginError, onLoginSuccess } from '../helper.js';
import { iconifyIcon, loadingLoopIcon } from '../components/icon.js';

let googleClient;
(() => {
	googleClient = google.accounts.oauth2.initCodeClient({
		client_id: google_client_id,
		scope: 'email profile openid',
		redirect_uri: 'postmessage',
		ux_mode: 'popup',
		code_challenge_method: 'S256',
		callback: async (code) => {
			loginBtn.innerHTML = loadingLoopIcon
			await server.googleLoginByCode({
				googleTokenObject: code,
				onError: (data) => onLoginError(errorTag, data),
				onSuccess: (data) => onLoginSuccess( data, router, server, memory, socket )
			})
			loginBtn.textContent = 'Log in'
		}
	})
})();

const loginDiv = document.createElement('div')
loginDiv.className = 'login'

const language = document.createElement('p')
language.className = 'language'
language.textContent = 'English'

const logo = document.createElement('h1')
logo.className = 'logo'
logo.textContent = 'Beep'
loginDiv.append(language, logo)

const googleLoginBtn = googleButton(googleClient)
loginDiv.appendChild(googleLoginBtn)

const orTag = document.createElement('p')
orTag.className = 'or'
orTag.textContent = 'OR'
loginDiv.appendChild(orTag)

const form = document.createElement('form')
form.noValidate = true
const credentialsField = inputField('text', 'credentials', 'Username or email')
const passField = passwordField('password', 'Password')
form.append(credentialsField, passField)

const forgotPasswordLink = document.createElement('a')
forgotPasswordLink.className = 'reset-link'
forgotPasswordLink.textContent = 'Forgot password?'
form.appendChild(forgotPasswordLink)
loginDiv.appendChild(form)

const loginBtn = document.createElement('button')
loginBtn.type = 'submit'
loginBtn.className = 'submit-btn'
loginBtn.textContent = 'Log in'
loginBtn.disabled = true
const loginBtnIcon = loginBtn.firstElementChild
form.appendChild(loginBtn)

const errorTag = document.createElement('p')
errorTag.className = 'error'
loginDiv.appendChild(errorTag)

const signupLink = document.createElement('p')
signupLink.className = 'signup-link'
signupLink.addEventListener('click', (event) => {
	event.preventDefault()
	router.navigateTo('/signup')
})

signupLink.innerHTML = 'Don\'t have an account? <a data-link>Sign up</a>'
loginDiv.appendChild(signupLink);

form.addEventListener('submit', async (event) => {
	event.preventDefault()
	const credentials = credentialsField.firstElementChild.value.trim()
	const password = passField.firstElementChild.value.trim()
	if (credentials && password) {
		loginBtn.innerHTML = loadingLoopIcon
		loginBtn.disabled = true
		const data = { password: password };
		data.onSuccess = (data) => {
			onLoginSuccess( data, router, server, memory, socket)
			credentialsField.firstElementChild.value = ''
			passField.firstElementChild.value = ''
		};
		data.onError = (data) => onLoginError(errorTag, data, server, router);
		
		(credentials.includes('@')) ? data.email = credentials : data.username = credentials;
		
		await server.login(data)
		loginBtn.textContent = 'Log in'
		loginBtn.disabled = false
	}
})
form.addEventListener('input', () => loginBtn.disabled = !form.checkValidity());



export default function login() {
	return loginDiv
}