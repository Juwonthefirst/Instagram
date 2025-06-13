import { inputField, passwordField } from '../components/Input.js'
import server from '../fetch.js'
import { router } from '../router.js';

const google_client_id = '333616956580-ehlrhiisjvgupkm594kettrev856vdtu.apps.googleusercontent.com'
let client

(() => {
	client = google.accounts.oauth2.initCodeClient({
		client_id: google_client_id,
		scope: 'email profile openid',
		redirect_uri: 'postmessage',
		ux_mode: 'popup',
		code_challenge_method: 'S256',
		callback: async (code) => {
			console.log(code)
			const response = await server.googleLoginByCode(code)
			if (response.ok) { router.navigateTo('/') }
		}
	})
})();

(() => {
	google.accounts.id.initialize({
		client_id: google_client_id,
		callback: async (token) => {
			const response = await server.googleLoginByID(token)
			if (response.ok) { router.navigateTo('/')}
		},
		auto_select: true,
		cancel_on_tap_outside: false,
	});
})()


const loginDiv = document.createElement('div')
loginDiv.className = 'login'

const language = document.createElement('p')
language.className = 'language'
language.textContent = 'English'

const logo = document.createElement('h1')
logo.className = 'logo'
logo.textContent = 'Instagram'
loginDiv.append(language, logo)

const googleLoginBtn = document.createElement('button')
googleLoginBtn.className = 'social-login'
googleLoginBtn.innerHTML = '<iconify-icon icon="flat-color-icons:google"></iconify-icon>Continue with Google'
googleLoginBtn.addEventListener('click', () => {client.requestCode()})
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
		(credentials.includes('@')) ? data.email = credentials: data.username = credentials;
		loginBtn.innerHTML = '<iconify-icon icon="line-md:loading-loop"></iconify-icon>'
		const response = await server.login(data)
		if (response.error) {
			errorTag.style.display = 'flex'
			errorTag.textContent = response.error
		}
		else {
			sessionStorage.setItem('access', response.access)
			router.navigateTo('/')
			server.autoRefreshAccessToken()
			credentialsField.firstElementChild.value = ''
			passField.firstElementChild.value = ''
		}
		loginBtn.innerHTML = 'Log in'
		loginBtn.disabled = false
	}
})
form.addEventListener('input', () => loginBtn.disabled = !form.checkValidity())


export default function login() {
	google.accounts.id.prompt()
	const body = document.body
	body.innerHTML = ''
	body.appendChild(loginDiv)
}