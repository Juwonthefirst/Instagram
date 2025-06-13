const getCookie = (name) => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';')[0] || ''


export default function Server(backendUrl = 'https://beep-me-api.onrender.com/api') {
    
    const header = new Headers({ 'Content-Type': 'application/json' })
    const headerWithAuthorization = new Headers({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`
    })
    const headerWithCredentials = new Headers({
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    })
    console.log(getCookie('csrftoken'))
    return {
        async login({ username = '', email = '', password = '' }) {
            try {
                const response = await fetch(`${backendUrl}/auth/login/`, {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                })
                const data = await response.json()
                if (!response.ok) {
                    throw Error(data.non_field_errors[0])
                }
                return data
            }
            catch (e) {
                return{error: e.message}
            }
            
        },
        
        async signup({ username, email, password }) {
            const response = await fetch(`${backendUrl}/auth/registration/`, {
                method: 'POST',
                headers: header,
                body: JSON.stringify({
                    username,
                    email,
                    password1: password,
                    password2: password
                })
            })
            
            return await response.json()
        },
        
        async resendVerificationLink(email) {
            const response = await fetch(`${backendUrl}/auth/registration/resend-email/`, {
                method: 'POST',
                headers: header,
                body: JSON.stringify({
                    email
                })
            })
            const data = response.json()
            if (data.response == 'ok') {
                
            }
        },
        
        async changePassword(password) {
            const response = await fetch(`${backendUrl}/auth/password/change/`, {
                method: 'POST',
                header: headerWithAuthorization,
                body: JSON.stringify({
                    password1: password,
                    password2: password
                })
            })
        },
        
        async tokenRefresh() {
            const response = await fetch(`${backendUrl}/auth/token/refresh/`, {
                method: 'GET',
                headers: headerWithCredentials,
                credentials: 'include'
            })
            
            const data = await response.json()
            localStorage.setItem("access_token", data.access)
            localStorage.setItem("refresh_token", data.refresh)
        },
        
        async googleLoginByID(googleTokenObject) {
            const response = await fetch('https://beep-me-api.onrender.com/api/auth/social/google/ID/', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    token: googleTokenObject.credential
                })
            })
            const json = await response.json()
            localStorage.setItem("access_token", json.access)
            localStorage.setItem("refresh_token", json.refresh)
            return response
        },
        async googleLoginByCode(googleTokenObject) {
            const response = await fetch(`${backendUrl}/auth/social/google/code/`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    code: googleTokenObject.code
                })
            })
            const json = await response.json()
            localStorage.setItem("access_token", json.access)
            return response
        }
    }
}