import { lucideIcon } from '../components/icon.js';

const userSearchDiv = document.createElement('div')
userSearchDiv.className = 'user-search'

const userSearchBarDiv = document.createElement('div')
userSearchBarDiv.className = 'user-search-bar'

const backBtn = lucideIcon('arrow-left', 'back-btn')
const searchInput = document.createElement('input')
searchInput.placeholder = 'Who are you looking for'
const searchBtn = lucideIcon('search', 'search-btn')
userSearchBarDiv.append(backBtn, searchInput, searchBtn)

userSearchDiv.appendChild(userSearchBarDiv)

const searchResultsDiv = document.createElement('div')
searchResultsDiv.className = 'search-results'
userSearchDiv.appendChild(searchResultsDiv)


export default function userSearchPage() {
	return userSearchPage
}