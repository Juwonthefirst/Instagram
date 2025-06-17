import { router } from './router.js'
import server from './fetch.js';
import { onRefreshError } from './helper.js';

window.addEventListener('popstate', router.route)
//window.addEventListener('hashchange', router.route)
window.addEventListener('load', async () => {
	const response = await server.get_csrf()
	if(response === 'no csrf'){ return router.navigateTo('/login') }
	router.route()
	await server.startAutoRefreshAccessToken( (response) => onRefreshError(response, router) )
})
//history.pushState(null, '', '/#/login')