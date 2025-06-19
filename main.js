import { router } from './router.js'
import server from './fetch.js';
import { onRefreshError, onLoginSuccess, onLoginError } from './helper.js';

//window.addEventListener('popstate', router.route)
//window.addEventListener('hashchange', router.route)
//window.addEventListener('load', router.route)

/*window.addEventListener('load', async () => {
	const response = await server.get_csrf()
	router.route()
	if(response.error){ return router.navigateTo('/login') }
	else await server.startAutoRefreshAccessToken( (response) => onRefreshError(response, router) )
})*/
router.render('/verify-email')
//history.pushState(null, '', '/#/signup')