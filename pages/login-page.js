import inputField from '../components/Input.js'

const loginDiv = document.createElement('div')
loginDiv.className = 'login'
loginDiv.innerHTML = `  <p class="language">English</p>
    					<h1 class="logo">Instagram</h1>
    `
const googleLoginBtn = document.createElement('button')
googleLoginBtn.className = 'social-login'
googleLoginBtn.innerHTML = '<iconify-icon icon="flat-color-icons:google"></iconify-icon>Continue with Google'
googleLoginBtn.addEventListener('click', () => {
    
})

loginDiv.appendChild(googleLoginBtn)
loginDiv.innerHTML += '<p class="or">OR</p>'
loginDiv.append(
    inputField('text', 'credentials', 'Phone number, username, or email'),
    inputField('password', 'password', 'Password')
)
loginDiv.innerHTML +='<a class="reset-link" href="#">Forgot password?</a>'
const loginBtn = document.createElement('button')
loginBtn.type = 'submit'
loginBtn.className = 'submit-btn'
loginBtn.textContent = 'Log in'
loginBtn.addEventListener('click', (event) => {
    event.preventDefault()
})

loginDiv.appendChild(loginBtn)


export default function login() {
    const body = document.body
	body.innerHTML = ''
	body.appendChild(loginDiv)
}