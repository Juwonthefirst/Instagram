const lucideIcon = function(iconName, className){
	const div = document.createElement('div')
	div.className = className
	const icon = document.createElement('i')
	icon.dataset.lucide = iconName
	div.appendChild(icon)
	return div
}

const iconifyIcon = function(iconName){
	const icon = document.createElement('iconify-icon')
	icon.icon = iconName
	return icon
}
export { lucideIcon, iconifyIcon }