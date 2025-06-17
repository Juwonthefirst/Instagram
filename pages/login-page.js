import { inputField, passwordField } from '../components/Input.js'
import server from '../fetch.js'
import { router } from '../router.js';
import { onRefreshError } from '../helper.js';


const google_client_id = '333616956580-ehlrhiisjvgupkm594kettrev856vdtu.apps.googleusercontent.com'
let client


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
googleLoginBtn.addEventListener('click', () => { client.requestCode() })
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

const onLoginError = (data) => {
	errorTag.style.display = 'flex'
	errorTag.textContent = data.error
}

const onLoginSuccess = () => {
	router.navigateTo('/')
	server.get_csrf()
	server.startAutoRefreshAccessToken((response) => onRefreshError(response, router))
}

form.addEventListener('submit', async (event) => {
	event.preventDefault()
	const credentials = credentialsField.firstElementChild.value.trim()
	const password = passField.firstElementChild.value.trim()
	if (credentials && password) {
		
		loginBtn.disabled = true
		const data = { password: password };
		data.onSuccess = () => {
			onLoginSuccess()
			credentialsField.firstElementChild.value = ''
			passField.firstElementChild.value = ''
		};
		data.onError = onLoginError;
		(credentials.includes('@')) ? data.email = credentials : data.username = credentials;
		loginBtn.innerHTML = '<iconify-icon icon="line-md:loading-loop"></iconify-icon>'
		const response = await server.login(data)
		loginBtn.innerHTML = 'Log in'
		loginBtn.disabled = false
	}
})
form.addEventListener('input', () => loginBtn.disabled = !form.checkValidity());

(() => {
	client = google.accounts.oauth2.initCodeClient({
		client_id: google_client_id,
		scope: 'email profile openid',
		redirect_uri: 'postmessage',
		ux_mode: 'popup',
		code_challenge_method: 'S256',
		callback: async (code) => {
			await server.googleLoginByCode({
				googleTokenObject: code,
				onError: onLoginError,
				onSuccess: onLoginSuccess
			})
		}
	})
})();

(() => {
	google.accounts.id.initialize({
		client_id: google_client_id,
		callback: async (id_token) => {
			await server.googleLoginByID({
				googleTokenObject: id_token,
				onError: onLoginError,
				onSuccess: onLoginSuccess
			})
		},
		auto_select: true,
		cancel_on_tap_outside: false,
	});
})();

export default function login() {
	google.accounts.id.prompt()
	const body = document.body
	body.innerHTML = ''
	body.appendChild(loginDiv)
}