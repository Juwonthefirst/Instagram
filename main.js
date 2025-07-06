import { router } from './router.js'
import server from './server.js';
import { onRefreshError } from './helper.js';

/*window.addEventListener('popstate', router.route)
//window.addEventListener('hashchange', router.route)
//window.addEventListener('load', router.route)

window.addEventListener('load', async () => {
	/*const response = await server.get_csrf()
	await router.route()
	if(response.error){ return await router.navigateTo('/login') }
	else await server.startAutoRefreshAccessToken( (response) => onRefreshError(response, router) )
	await router.route()
})*/
//history.pushState(null, '', '/#/signup')
router.render('/')