import inputField from '../components/Input.js'
import Server from '../fetch.js'
import { router } from '../router.js';

const server = Server()
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
loginDiv.appendChild(googleLoginBtn)

const orTag = document.createElement('p')
orTag.className = 'or'
orTag.textContent = 'OR'
loginDiv.appendChild(orTag)

const form = document.createElement('form')
form.noValidate = true
const credentialsField = inputField('text', 'credentials', 'Username, or email')
const passwordField = inputField('password', 'password', 'Password')
form.append(credentialsField, passwordField)
form.addEventListener('submit', async (event) => {
	event.preventDefault()
	const credentials = credentialsField.firstElementChild.value.trim()
	const password = passwordField.firstElementChild.value.trim()
	if (credentials && password) {
		const data = { password: password };
		(credentials.includes('@')) ? data.email = credentials: data.username = credentials;
		const response = await server.login(data)
		if (response.ok) {
		    router.navigateTo('/')
		}
		
	}
})

const forgotPasswordLink = document.createElement('a')
forgotPasswordLink.className = 'reset-link'
forgotPasswordLink.href = '/'
forgotPasswordLink.dataset.link = true
forgotPasswordLink.textContent = 'Forgot password?'
form.appendChild(forgotPasswordLink)
loginDiv.appendChild(form)

const loginBtn = document.createElement('button')
loginBtn.type = 'submit'
loginBtn.className = 'submit-btn'
loginBtn.textContent = 'Log in'
form.appendChild(loginBtn)

const signupLink = document.createElement('p')
signupLink.className = 'signup-link'
signupLink.innerHTML = 'Don\'t have an account? <a data-link href="">Sign up</a>'
loginDiv.appendChild(signupLink);

(() => {
	google.accounts.id.initialize({
		client_id: '333616956580-ehlrhiisjvgupkm594kettrev856vdtu.apps.googleusercontent.com',
		callback: async (token) => {
			const response = await server.googleLogin(token)
			if (response.ok) { router.navigateTo('/')}
		},
		ux_mode: 'popup',
		auto_select: true,
		cancel_on_tap_outside: false,
	});
	google.accounts.id.renderButton(googleLoginBtn, { size: 'large', theme: 'outline' })
})()

export default function login() {
	google.accounts.id.prompt()
	const body = document.body
	body.innerHTML = ''
	body.appendChild(loginDiv)
}