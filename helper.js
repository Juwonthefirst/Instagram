const onRefreshError = (response, router) => {
	if(response === 'no refresh'){
		router.navigateTo('/login')
	}
}
const onLoginError = (data) => {
	errorTag.style.display = 'flex'
	errorTag.textContent = data.error
}

const onLoginSuccess = (router, server ) => {
	router.navigateTo('/')
	server.get_csrf()
	server.startAutoRefreshAccessToken((response) => onRefreshError(response, router))
}

export { onRefreshError, onLoginError, onLoginSuccess }