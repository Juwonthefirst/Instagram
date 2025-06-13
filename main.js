import { router } from './router.js'
import server from './fetch.js'

server.autoRefreshAccessToken()
console.log(document.cookie)
console.log(getCookie('csrftoken'))
window.addEventListener('popstate', router.route)
//window.addEventListener('hashchange', router.route)
window.addEventListener('load', router.route)
//history.pushState(null, '', '/#/login')