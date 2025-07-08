class AppMemory{
	#data
	#currentUser
	constructor(){
		this.#currentUser = null
		this.#data = {}
		this.currentRoom = null
	}
	
	save(key, value){
		return this.#data[key] = value
	}
	
	retrieve(key){
		return this.#data[key]
	}
	
	remove(key){
		const value = this.#data[key]
		this.#data[key] = undefined
		return value
	}
	
	clear(){
		this.#data = {}
	}
	
	exists(key){
		return key in this.#data
	}
	
	setCurrentUser(userObject){
		this.#currentUser = userObject
	}
	
	getCurrentUser({field = 'all'} = {}){
		const user = this.#currentUser
		switch (field) {
			case 'id':
				return user.id
				break;
			case 'username':
				return user.username
				break;
			case 'email':
				return user.email
				break;
			case 'firstName':
				return user.first_name
				break;
			case 'lastName':
				return user.last_name
				break;
			case 'all':
				return user
				break;
			
			default:
				throw Error('Invalid User field')
		}
	}
	
	deleteCurrentUser(){
		this.#currentUser = null
	}
	
}

const memory = new AppMemory()
export { memory }