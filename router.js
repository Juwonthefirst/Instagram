import { memory} from './appMemory.js';
const routes = {
	'/': () => import('/pages/home-page.js'),
	'login': () => import('/pages/login-page.js'),
	'signup': () => import('/pages/signup-page.js'),
	'finish-signup': () => import('/pages/finish-signup-page.js'),
	'verify-email': () => import('/pages/verify-email.js'),
	'chat': () => import('/pages/chat-page.js'),
	'search': () => import('/pages/search-page.js'),
	'call': () => import('/pages/call-page.js'),
	'settings': () => import('/pages/settings-page.js'),
	
}



class PageRouter {
	constructor(routes) {
		this.routes = routes
		this.invalidRoutes = ['finish-signup']
		this.blockedRoutes = ['login', 'signup']
		//this.protectedRoutes = ['/', 'chat', 'search', 'settings', ]
		this.main = document.querySelector('.root')
	}
	
	async route() {
		let path = location.pathname.split('/')[1] || '/'
		
		if (this.invalidRoutes.includes(path)) {
			path = ''
		}
		
		else if (!this.blockedRoutes.includes(path) && !memory.getCurrentUser()) {
			path = 'login'
			history.pushState(null, '', '/login')
		}
		
		else if (this.blockedRoutes.includes(path) && memory.getCurrentUser()) {
			path = '/'
			history.pushState(null, '', '/')
			
		}
		
		await this.render(path)
	}
	
	async render(pageURL, options) {
		const pageModule = this.routes[pageURL] || (() => import('./pages/not-found-page.js'))
		const page = await pageModule()
		this.main.children[0].replaceWith(await page.default(options))
		lucide.createIcons()
	}
	
	async navigateTo(url) {
		const path = url.split('/')[1] || '/'
		history.pushState(null, '', url)
		await this.render(path)
		
	}
	
	get currentRoute(){
		return location.pathname
	}
}

const router = new PageRouter(routes)
export { router }