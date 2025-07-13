import { router } from './router.js'
import { server, socket } from './server.js';
import { memory } from './appMemory.js';


window.addEventListener('popstate', router.route)

window.addEventListener('load', async () => {
	const response = await server.get_csrf()
	if (response.error) { return await router.navigateTo('/login') }
	await server.startAutoRefreshAccessToken()
	alert('it continues')
	if (server.getAccessToken()) {
		await server.getUser({
			onSuccess: (data) => memory.setCurrentUser(data)
		})
		
		socket.connect()
		socket.listenForNotifications()
	}
	
	await router.route()
})