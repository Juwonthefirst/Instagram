const routes = {
	'/': () => import('/pages/home-page.js'),
	'/login': () => import('/pages/login-page.js'),
	'/signup': () => import('/pages/signup-page.js'),
	'finish-signup': () => import('/pages/username-page.js'),
	'/verify-email': () => import('/pages/verify-email.js')
}


class PageRouter {
	constructor(routes) {
		this.routes = routes
		this.main = document.querySelector('.root')
	}
	
	async route() {
		const path = location.pathname || '/'
		
		await this.render(path)
	}
	
	async render(pageURL) {
		const pageModule = this.routes[pageURL] || (() => import('./pages/not-found-page.js'))
		const page = await pageModule()
		this.main.children[0].replaceWith(page.default())
		lucide.createIcons()
	}
	
	async navigateTo(url) {
		history.pushState(null, '', url)
		await this.render(url)
	}
}

const router = new PageRouter(routes)
export { router }