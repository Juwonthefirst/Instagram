import { router } from './router.js'
import server from './fetch.js'

server.autoRefreshAccessToken()
//window.addEventListener('popstate', router.route)
window.addEventListener('hashchange', router.route)
window.addEventListener('load', router.route)
//history.pushState(null, '', '/#/login')