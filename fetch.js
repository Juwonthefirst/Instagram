export default function Server(backendUrl = 'https://beep-me-api.onrender.com/api') {
    
    const header = new Headers({ 'Content-Type': 'application/json' })
    const headerWithAuthorization = new Headers({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`
    })
    
    return {
        async login({username = '', email = '', password = ''}) {
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
            localStorage.setItem("access_token", data.access)
            localStorage.setItem("refresh_token", data.refresh)
            localStorage.setItem("user", data.user)
            return response
        },
        
        async signup({username, email, password}){
            const response = await fetch(`${backendUrl}/auth/registration/`,{
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
        
        async resendVerificationLink(email){
            const response = await fetch(`${backendUrl}/auth/registration/resend-email/`, {
                method: 'POST',
                headers: header,
                body: JSON.stringify({
                    email
                })
            })
            const data = response.json()
            if (data.response == 'ok'){
                
            }
        },
        
        async changePassword(password){
            const response = await fetch(`${backendUrl}/auth/password/change/`, {
                method: 'POST',
                header: headerWithAuthorization,
                body: JSON.stringify({
                    password1: password,
                    password2: password
                })
            })
        },
        
        async tokenRefresh(){
            const response = await fetch(`${backendUrl}/auth/token/refresh/`,{
                method: 'POST',
                headers: header,
                body: JSON.stringify({
                    refresh: localStorage.getItem('refresh_token')
                })
            })
         
            const data = await response.json()
            localStorage.setItem("access_token", data.access)
            localStorage.setItem("refresh_token", data.refresh)
        },
        
    }
}