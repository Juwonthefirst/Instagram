import { inputField, passwordField } from '../components/Inputs.js'
import { googleButton } from '../components/buttons.js';
import server from '../fetch.js'
import { router } from '../router.js';
import { google_client_id, onRefreshError, onLoginError, onLoginSuccess } from '../helper.js';

let googleClient

/*(() => {
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
})();*/

const loginDiv = document.createElement('div')
loginDiv.className = 'login'

const language = document.createElement('p')
language.className = 'language'
language.textContent = 'English'

const logo = document.createElement('h1')
logo.className = 'logo'
logo.textContent = 'Instagram'
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
signupLink.innerHTML = 'Don\'t have an account? <a data-link href="">Sign up</a>'
loginDiv.appendChild(signupLink);

form.addEventListener('submit', async (event) => {
	event.preventDefault()
	const credentials = credentialsField.firstElementChild.value.trim()
	const password = passField.firstElementChild.value.trim()
	if (credentials && password) {
		
		loginBtn.disabled = true
		const data = { password: password };
		data.onSuccess = () => {
			onLoginSuccess( router, server)
			credentialsField.firstElementChild.value = ''
			passField.firstElementChild.value = ''
		};
		data.onError = (data) => onLoginError(errorTag, data);
		
		(credentials.includes('@')) ? data.email = credentials : data.username = credentials;
		loginBtn.innerHTML = '<iconify-icon icon="line-md:loading-loop"></iconify-icon>'
		const response = await server.login(data)
		loginBtn.innerHTML = 'Log in'
		loginBtn.disabled = false
	}
})
form.addEventListener('input', () => loginBtn.disabled = !form.checkValidity());


export default function login() {
	//google.accounts.id.prompt()
	const main = document.querySelector('.main')
	main.innerHTML = ''
	main.appendChild(loginDiv)
}