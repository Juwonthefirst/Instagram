import { router } from './router.js'
import server from './fetch.js';
import { onRefreshError, onLoginSuccess, onLoginError } from './helper.js';

const google_client_id = '333616956580-ehlrhiisjvgupkm594kettrev856vdtu.apps.googleusercontent.com'

window.beepMe = {};
window.onload = (() => {
	window.beepMe.googleClient = google.accounts.oauth2.initCodeClient({
		client_id: google_client_id,
		scope: 'email profile openid',
		redirect_uri: 'postmessage',
		ux_mode: 'popup',
		code_challenge_method: 'S256',
		callback: async (code) => {
			await server.googleLoginByCode({
				googleTokenObject: code,
				onError: (data) => onLoginError(data),
				onSuccess: () => onLoginSuccess( router, server )
			})
		}
	})
});

(() => {
	google.accounts.id.initialize({
		client_id: google_client_id,
		callback: async (id_token) => {
			await server.googleLoginByID({
				googleTokenObject: id_token,
				onError: (data) => onLoginError(data),
				onSuccess: () => onLoginSuccess( router, server )
			})
		},
		auto_select: true,
		cancel_on_tap_outside: false,
	});
})();

window.addEventListener('popstate', router.route)
//window.addEventListener('hashchange', router.route)
//window.addEventListener('load', router.route)

window.addEventListener('load', async () => {
	const response = await server.get_csrf()
	router.route()
	if(response.error){ return router.navigateTo('/login') }
	else await server.startAutoRefreshAccessToken( (response) => onRefreshError(response, router) )
})
//history.pushState(null, '', '/#/signup')