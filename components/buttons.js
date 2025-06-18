const googleButton = function(client) {
	const googleLoginBtn = document.createElement('button')
	googleLoginBtn.className = 'social-login'
	googleLoginBtn.innerHTML = '<iconify-icon icon="flat-color-icons:google"></iconify-icon>Continue with Google'
	googleLoginBtn.addEventListener('click', () => { client.requestCode() })
	return googleLoginBtn
}

export { googleButton }