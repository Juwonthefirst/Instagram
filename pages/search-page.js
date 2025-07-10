import { lucideIcon, loadingLoopIcon } from '../components/icon.js';
import { router } from '../router.js';
import { server } from '../server.js';
import { userPreview } from '../components/userComponents.js';

let searchTimeout

const userSearchDiv = document.createElement('div')
userSearchDiv.className = 'user-search'

const userSearchBarDiv = document.createElement('div')
userSearchBarDiv.className = 'user-search-bar'

const backBtn = lucideIcon('arrow-left', 'back-btn')
backBtn.addEventListener('click', () => {
	const previousRoute = localStorage.getItem('previousRoute') || '/'
	localStorage.removeItem('previousRoute')
	router.navigateTo(previousRoute)
})
const searchInput = document.createElement('input')
searchInput.placeholder = 'Who are you looking for'
const searchBtn = lucideIcon('search', 'search-btn', true)
const searchIcon = searchBtn.innerHTML
userSearchBarDiv.append(backBtn, searchInput, searchBtn)

userSearchDiv.appendChild(userSearchBarDiv)

const searchResultsDiv = document.createElement('div')
searchResultsDiv.className = 'search-results'
userSearchDiv.appendChild(searchResultsDiv)


export default function userSearchPage() {
	return userSearchDiv
}

//Page actions
searchInput.addEventListener('input', () => {
	clearTimeout(searchTimeout)
	const searchKeyWord = searchInput.value.trim()
	searchTimeout = setTimeout( async () => {
		searchBtn.innerHTML = loadingLoopIcon
		await server.searchUsers({
			searchKeyWord,
			onSuccess: (data) => {
				searchResultsDiv.innerHTML = ''
				for (const user of data.results) {
					const userPreviewDiv = userPreview(user)
					searchResultsDiv.appendChild(userPreviewDiv)
				}
				lucide.createIcons()
			}
		})
		searchBtn.innerHTML = searchIcon
		lucideIcon.createIcons()
	}, 300)
})