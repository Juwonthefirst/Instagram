//import signupPage from './pages/signupPage.js';

const routes = {
	'/': () => import( './pages/home-page.js'),
	'/login': () => import( './pages/login-page.js'),
	
}


class PageRouter {
	constructor(routes) {
		this.routes = routes
	}
	async route() {
		//const route = location.pathname || '/'
		const route = location.hash.slice(1) || '/'
		const pageModule = routes[route] || (() => import('./pages/not-found-page.js'))
		const page = await pageModule()
		page.default()
		lucide.createIcons()
	}
	async navigateTo(url) {
		history.pushState(null, '', url)
		await this.route()
	}
}

const router = new PageRouter(routes)
export { router }