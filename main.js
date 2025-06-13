import { router } from './router.js'



console.log(document.cookie)

window.addEventListener('popstate', router.route)
//window.addEventListener('hashchange', router.route)
window.addEventListener('load', router.route)
//history.pushState(null, '', '/#/login')