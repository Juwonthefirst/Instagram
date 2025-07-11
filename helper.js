const google_client_id = '333616956580-ehlrhiisjvgupkm594kettrev856vdtu.apps.googleusercontent.com'

const onRefreshError = (router) => {
    router.navigateTo('/login')
}
const onLoginError = (errorTag, data) => {
    const error = data.error
    errorTag.style.display = 'flex'
    errorTag.textContent = error.error || error.non_field_errors[0]
}

const onLoginSuccess = (data, router, server, memory) => {
    server.get_csrf()
    server.startAutoRefreshAccessToken((response) => onRefreshError(response, router))
    memory.setCurrentUser(data.user)
    if (data.new_user) {
        return router.render('finish-signup')
    }
    router.navigateTo('/')
}



const onFree = (inputField) => {
    inputField.style.borderColor = 'green'
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


export { google_client_id, onRefreshError, onLoginError, onLoginSuccess, FormValidator }