import { iconifyIcon } from './icon.js';

const googleButton = function(client) {
	const googleLoginBtn = document.createElement('button')
	googleLoginBtn.className = 'social-login'
	const googleIcon = iconifyIcon('flat-color-icons:google')
	googleLoginBtn.append(googleIcon, 'Continue with google')
	googleLoginBtn.addEventListener('click', () => { client.requestCode() })
	return googleLoginBtn
}

export { googleButton }