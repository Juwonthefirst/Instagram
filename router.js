import loginPage from './pages/login-page.js';
//import signupPage from './pages/signupPage.js';
console.log('error')
import home from './pages/home-page.js'
import notFound from './pages/not-found-page.js'

const routes = {
	'/': home,
	'/login': loginPage
}

const router = function(){
	const route = location.hash.slice(1) || '/'
	const page = routes[route] || notFound
	page()
	lucide.createIcons()
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)