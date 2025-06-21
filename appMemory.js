class AppMemory{
	constructor(){
		this.currentUser = null
		this.data = {}
	}
	
	save(key, value){
		return this.data[key] = value
	}
	
	retrieve(key){
		return this.data[key]
	}
	
	delete(key){
		const value = this.data[key]
		this.data[key] = undefined
		return value
	}
}

const memory = new AppMemory()
export { memory }