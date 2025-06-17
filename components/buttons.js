const googleButton = function() {
	const googleLoginBtn = document.createElement('button')
	googleLoginBtn.className = 'social-login'
	googleLoginBtn.innerHTML = '<iconify-icon icon="flat-color-icons:google"></iconify-icon>Continue with Google'
	googleLoginBtn.addEventListener('click', () => { window.beepMe.googleClient.requestCode() })
	return googleLoginBtn
}

export { googleButton }