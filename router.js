import loginPage from './pages/login-page.js';
//import signupPage from './pages/signupPage.js';
import home from './pages/home-page.js'
import notFound from './pages/not-found-page.js'

const routes = {
	'/': home,
	'/login': loginPage
}

const router = function(){
	//const route = location.hash.slice(1) || '/'
	const route = location.pathname || '/'
	const page = routes[route] || notFound
	page()
	lucide.createIcons()
}

function navigateTo(url) {
	history.pushState(null, '', url)
	router()
}

document.addEventListener('click', (event) => {
	if (event.target.closest('[data-link]')) {
		event.preventDefault()
		console.log('link clicked')
		navigateTo(event.target.href)
	}
})

window.addEventListener('popstate', router)
//window.addEventListener('hashchange', router)
window.addEventListener('load', router)
//history.pushState(null, '', '/#/login')