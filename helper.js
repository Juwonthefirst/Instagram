const onRefreshError = (response, router) => {
	if(response === 'no refresh'){
		router.navigateTo('/login')
	}
}

export { onRefreshError }
