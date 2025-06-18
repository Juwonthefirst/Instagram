
const routes = {
	'/': () => import( './pages/home-page.js'),
	'/login': () => import( './pages/login-page.js'),
	'/signup': () => import('./pages/signup-page.js'),
	'finish-signup': () => import('./pages/username-page.js')
}


class PageRouter {
	constructor(routes) {
		this.routes = routes
	}
	
	async render(pageURL){
		const pageModule = this.routes[pageURL] || (() => import('./pages/not-found-page.js'))
		const page = await pageModule()
		page.default()
		lucide.createIcons()
	}
	async route() {
		const route = location.pathname || '/'
		//const route = location.hash.slice(1) || '/'
		await this.render(route)
	}
	async navigateTo(url) {
		history.pushState(null, '', url)
		await this.route()
	}
}

const router = new PageRouter(routes)
export { router }