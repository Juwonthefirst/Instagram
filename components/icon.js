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

const loadingLoopIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9">
		<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0" />
		<animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
	</path>
</svg>`
export { lucideIcon, iconifyIcon, loadingLoopIcon }