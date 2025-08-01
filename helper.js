const google_client_id = '333616956580-ehlrhiisjvgupkm594kettrev856vdtu.apps.googleusercontent.com'

const onLoginError = async (errorTag, data, server, router) => {
    if (data.status === 403) {
        await server.resendVerificationLink({
            email: data.error.email,
        })
        return router.navigateTo('/verify-email')
    }
    const error = data.error.error
    errorTag.style.display = 'flex'
    errorTag.textContent = error
}

const onLoginSuccess = async (data, router, server, memory, socket) => {
    await server.get_csrf()
    await server.startAutoRefreshAccessToken()
    memory.setCurrentUser(data.user)
    socket.connect()
	socket.listenForNotifications()
    if (data.new_user) {
        return await router.render('finish-signup')
    }
    await router.navigateTo('/')
}


class FormValidator {
    constructor(inputFields, button) {
        this.inputFields = inputFields
        this.inputs = this.inputFields.map((inputField) => inputField.firstElementChild)
        this.button = button
        this.customErrorHandlers = new Map()
    }
    
    
    getErrorMessage(input) {
        const errors = {
            valueMissing: 'This field can\'t be empty',
            typeMismatch: `Input a valid ${input.type}`,
            patternMismatch: 'This does not match the set format',
            rangeOverflow: `Your input can not be greater than ${input.max}`,
            rangeUnderflow: `Your input can not be less than ${input.min}`,
            stepMismatch: 'invalid number'
        }
        
        
        for (let error in errors) {
            if (input.validity[error]) {
                return errors[error]
            }
        }
        return ''
    }
    
    
    getCustomErrorMessage(input) {
        const callback = this.customErrorHandlers.get(input)
        if (!callback) return;
        const { isValid, errorMessage } = callback()
        return isValid ? null : errorMessage
    }
    
    hasErrors() {
        const hasBasicErrors = Array.from(this.inputs).some(input => !input.validity.valid)
        const hasCustomError = this.customErrorHandlers.values().some(errorHandler => !errorHandler().isValid)
        return hasBasicErrors || hasCustomError
    }
    
    renderErrorMessage(input, customErrorMessage) {
        const inputParent = input.parentElement
        const errorMessage = this.getErrorMessage(input) || this.getCustomErrorMessage(input)
        this.appendErrorMessage(inputParent, errorMessage)
        
    }
    
    appendErrorMessage(inputParent, errorMessage) {
        let errorTag = inputParent.nextElementSibling
        if (!errorMessage) {
            inputParent.style.borderColor = ''
            errorTag.style.display = ''
            return
        }
        
        if ((errorTag === null) || (errorTag.className !== 'input-error' && errorTag.nodeName !== 'P')) {
            errorTag = document.createElement('p')
            errorTag.className = 'input-error'
            inputParent.after(errorTag)
        }
        errorTag.style.display = 'block'
        errorTag.textContent = errorMessage
        inputParent.style.borderColor = 'red'
    }
    
    addCustomErrorHandler(input, callback) {
        if (typeof callback !== 'function') {
            throw Error('Custom errors must contain a callback')
        }
        this.customErrorHandlers.set(input, callback)
    }
    
    validate() {
        if (this.hasErrors()) {
            let inputHasListener;
            this.inputs.forEach((input) => {
                if (!inputHasListener) {
                    input.addEventListener('input', () => { this.renderErrorMessage(input) })
                }
                this.renderErrorMessage(input)
            })
            inputHasListener = true
            return;
        }
        
        return true
    }
}

const getTimePassed = (date) => {
    const parsedDate = new Date(date)
    const now = new Date()
    const secondsPassed = now - parsedDate
    return convertSecondToString(secondsPassed)
}

const convertSecondToString = (seconds) => {
    seconds /= 1000
    if (seconds < 60) {
        return 'less than a minute ago'
    }
    else if (60 <= seconds && seconds < 3600) {
        return `${Math.floor(seconds / 60)} minutes ago`
    }
    else if (3600 <= seconds && seconds < (3600 * 24)) {
        return `${Math.floor(seconds / 3600)} hours ago`
    }
    else if ((3600 * 24) <= seconds /*&& seconds < (3600 * 24 * 7)*/) {
        return `${Math.floor(seconds / (3600 * 24))} days ago`
    }
}

const getReadableTime = (date) => {
    const parsedDate = new Date(date)
    let minutes = parsedDate.getMinutes()
    let hours = parsedDate.getHours()
    if (minutes < 10) minutes = '0' + minutes
    if (hours < 10) hours = '0' + hours
    return hours + ':' + minutes
}

const formatSeconds = (seconds) => {
    seconds /= 1000
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const second = Math.Round(seconds % 60).toString().padStart(2, '0')
    return hours + ' : ' + minutes + ' : ' + second
}

export { google_client_id, onLoginError, onLoginSuccess, FormValidator, getTimePassed, getReadableTime, formatSeconds }