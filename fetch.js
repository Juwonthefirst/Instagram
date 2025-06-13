const getCookie = (name) => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';')[0] || ''
const access_token_lifetime = 60 * 30 * 1000
const backendUrl = 'https://beep-me-api.onrender.com/api'


class Server {
    
    constructor() {
        this.access_token = null
    }
    
    autoRefreshAccessToken() {
        this.tokenRefresh()
        setInterval(() => this.tokenRefresh(), access_token_lifetime)
    }
    
    getHeader({ auth = false, cred = false } = {}) {
        const header = new Headers({ 'Content-Type': 'application/json' })
        if (auth) header.append('Authorization', `Bearer ${this.access_token}`)
        if (cred) header.append('X-CSRFToken', getCookie('csrftoken'))
        return header
    }
    
    async login({ username = '', email = '', password = '' }) {
        try {
            const response = await fetch(`${backendUrl}/auth/login/`, {
                method: 'POST',
                headers: this.getHeader(),
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
            return { error: e.message }
        }
        
    }
    
    async signup({ username, email, password }) {
        const response = await fetch(`${backendUrl}/auth/registration/`, {
            method: 'POST',
            headers: this.getHeader(),
            body: JSON.stringify({
                username,
                email,
                password1: password,
                password2: password
            })
        })
        
        return await response.json()
    }
    
    async resendVerificationLink(email) {
        const response = await fetch(`${backendUrl}/auth/registration/resend-email/`, {
            method: 'POST',
            headers: this.getHeader(),
            body: JSON.stringify({
                email
            })
        })
        const data = response.json()
        if (data.response == 'ok') {
            
        }
    }
    
    async changePassword(password) {
        const response = await fetch(`${backendUrl}/auth/password/change/`, {
            method: 'POST',
            header: this.getHeader({ auth: true }),
            body: JSON.stringify({
                password1: password,
                password2: password
            })
        })
    }
    
    async tokenRefresh() {
        const response = await fetch(`${backendUrl}/auth/token/refresh/`, {
            method: 'POST',
            headers: this.getHeader({ cred: true }),
            credentials: 'include'
        })
        
        const data = await response.json()
        this.access_token = data.access
        console.log(data)
    }
    
    async googleLoginByID(googleTokenObject) {
        const response = await fetch(`${backendUrl}/auth/social/google/ID/`, {
            method: 'POST',
            headers: this.getHeader(),
            body: JSON.stringify({
                token: googleTokenObject.credential
            })
        })
        const json = await response.json()
        this.access_token = json.access
        return response
    }
    
    async googleLoginByCode(googleTokenObject) {
        const response = await fetch(`${backendUrl}/auth/social/google/code/`, {
            method: 'POST',
            headers: this.getHeader(),
            body: JSON.stringify({
                code: googleTokenObject.code
            })
        })
        const json = await response.json()
        this.access_token = json.access
        return response
    }
}

export default new Server()