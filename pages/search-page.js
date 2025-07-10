import { lucideIcon } from '../components/icon.js';
import { router } from '../router.js';
import { server } from '../server.js';
let searchTimeout


const userSearchDiv = document.createElement('div')
userSearchDiv.className = 'user-search'

const userSearchBarDiv = document.createElement('div')
userSearchBarDiv.className = 'user-search-bar'

const backBtn = lucideIcon('arrow-left', 'back-btn')
backBtn.addEventListener('click', () => {
	const previousRoute = localStorage.getItem('previousRoute') || '/'
	router.navigateTo(previousRoute)
})
const searchInput = document.createElement('input')
searchInput.placeholder = 'Who are you looking for'
searchInput.addEventListener('input', () => {
	clearTimeout(searchTimeout)
	const searchKeyWord = searchInput.value.trim()
	searchTimeout = setTimeout( async () => {
		await server
	}, 1000)
})
const searchBtn = lucideIcon('search', 'search-btn')
userSearchBarDiv.append(backBtn, searchInput, searchBtn)

userSearchDiv.appendChild(userSearchBarDiv)

const searchResultsDiv = document.createElement('div')
searchResultsDiv.className = 'search-results'
userSearchDiv.appendChild(searchResultsDiv)


export default function userSearchPage() {
	return userSearchDiv
}