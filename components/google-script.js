export default function loadGoogleScript() {
	return new Promise((resolve, reject) => {
		if (window.google && window.google.accounts) {
			resolve(window.google)
			return 
		}
		
		if (document.querySelector('.google-script')) {
			const isGoogleReady = setInterval(() => {
				if (window.google && window.google.accounts) {
					clearInterval(isGoogleReady)
					resolve(window.google)
					return 
				}
			}, 1000)
			return 
		}
		
		const googleScript = document.createElement('script')
		googleScript.src = "https://accounts.google.com/gsi/client"
		googleScript.async = true
		googleScript.defer = true
		googleScript.className = 'google-script'
		googleScript.onload = () => {
			if (window.google && window.google.accounts) {
				resolve(window.google)
			}
			else{
				reject('error')
			}
		}
		
		document.head.appendChild(googleScript)
	})
}