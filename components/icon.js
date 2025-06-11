const iconDiv = function(iconName, className){
	const div = document.createElement('div')
	div.className = className
	const icon = document.createElement('i')
	icon.dataset.lucide = iconName
	div.appendChild(icon)
	return div
}

export default iconDiv