import { router } from './router.js'
lucide.createIcons()
//window.addEventListener('popstate', router.route)
window.addEventListener('hashchange', router.route)
window.addEventListener('load', router.route)
history.pushState(null, '', '/#/login')