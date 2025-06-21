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
	
	async render(pageURL) {
		const pageModule = this.routes[pageURL] || (() => import('./pages/not-found-page.js'))
		const page = await pageModule()
		console.log(this.main.children[0])
		this.main.children[0].replaceWith(page.default())
		lucide.createIcons()
	}
	async route() {
		console.log(location.pathname)
		const path = location.pathname || '/'
		//const route = location.hash.slice(1) || '/'
		await this.render( path )
	}
	async navigateTo( url ) {
		history.pushState( null, '', url )
		await this.render( url )
	}
}

const router = new PageRouter( routes )
export { router }