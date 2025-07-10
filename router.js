import { memory} from './appMemory.js';
const routes = {
	'/': () => import('/pages/home-page.js'),
	'login': () => import('/pages/login-page.js'),
	'signup': () => import('/pages/signup-page.js'),
	'finish-signup': () => import('/pages/username-page.js'),
	'verify-email': () => import('/pages/verify-email.js'),
	'chat': () => import('/pages/chat-page.js'),
	'search': () => import('/pages/search-page.js'),
}



class PageRouter {
	constructor(routes) {
		this.routes = routes
		this.blockedRoutes = ['login', 'signup', 'finish-signup']
		this.protectedRoutes = ['/', 'chat', 'search']
		this.main = document.querySelector('.root')
	}
	
	async route() {
		let path = location.pathname.split('/')[1] || '/'
		
		/*if (this.protectedRoutes.includes(path) && !memory.getCurrentUser()) {
			path = 'login'
			history.pushState(null, 'Login nigga', '/login')
		}
		
		else if (this.blockedRoutes.includes(path)) {
			path = '/'
			history.pushState(null, 'Beep', '/')
			
		}*/
		
		await this.render(path)
	}
	
	async render(pageURL) {
		const pageModule = this.routes[pageURL] || (() => import('./pages/not-found-page.js'))
		const page = await pageModule()
		this.main.children[0].replaceWith(page.default())
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