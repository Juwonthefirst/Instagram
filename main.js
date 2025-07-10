import { router } from './router.js'
import { server, socket } from './server.js';
import { onRefreshError } from './helper.js';
import { memory } from './appMemory.js';

let loginFailed = false
//window.addEventListener('popstate', router.route)
//window.addEventListener('hashchange', router.route)
//window.addEventListener('load', router.route)

/*window.addEventListener('load', async () => {
	const response = await server.get_csrf()
	if (response.error) { return await router.navigateTo('/login') }
	else {
		await server.startAutoRefreshAccessToken(() => {
			onRefreshError(router)
			loginFailed = true
		})
		
		if (loginFailed) return 

		await server.getUser({
			onSuccess: (data) => memory.setCurrentUser(data)
			
		})
		
		socket.connect()
		socket.listenForNotifications()
		await router.route()
	}
})*/
router.render('/')
