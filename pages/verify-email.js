import { router } from '../router.js';
import {server} from '../server.js';
import { memory } from '../appMemory.js';
import { basicPopUp } from '../components/popup.js';
import { lucideIcon, iconifyIcon } from '../components/icon.js';

const emailSentPopup = basicPopUp('A new verification email has been sent to you click on it to verify your Email')
const invalidVerificationKeyPopup = basicPopUp('We can\'t verify you with the key you provided, please request for a new link', true)
const errorEmailSentPopup = basicPopUp('it seems like something is wrong and we are unable to send you a new verification email')
const params = new URLSearchParams(location.search)
const uid = params.get('uid')
const token = params.get('token')

if(uid && token){
	server.verifyEmail({ 
		uid, 
		token,
		onSuccess: () => {
			verifyEmailDiv.classList.add('success')
			pendingVerificationIcon.replaceWith(iconifyIcon('carbon:checkmark-outline'))
			status.textContent = 'Email verified'
			verifyEmailText.textContent = 'Congratulations!!, Your email has been verified now you can finally beep your friends'
			resendLink.replacewith(redirectLink)
		}, 
		onError:  () => invalidVerificationKeyPopup.showModal()
	})
}

const verifyEmailDiv = document.createElement('div')
verifyEmailDiv.className = 'verify-email'

const pendingVerificationIcon = iconifyIcon('svg-spinners:clock')
verifyEmailDiv.appendChild(pendingVerificationIcon)

const status = document.createElement('h2')
status.className = 'verification-status'
status.textContent = 'Email verification pending'

const verifyEmailText = document.createElement('p')
verifyEmailText.textContent = 'Congratulations!!, You are almost done just verify your email by clicking the verification link sent to your mail'

const redirectLink = document.createElement('button')
redirectLink.textContent = 'Login to your new account'
redirectLink.className = 'resend-btn'
redirectLink.addEventListener('click', async (event) => { await router.navigateTo('/login')})

const resendLink = document.createElement('button')
const resendLinkText = 'request a new verification link'
resendLink.className = 'resend-btn'
resendLink.textContent = resendLinkText
resendLink.addEventListener('click', async (event) => {
	resendLink.disabled = true
	let timeout = 120
	const getTimeoutText = (timeout) => `Wait ${timeout} seconds before sending another request`
	resendLink.textContent = getTimeoutText(timeout)
	const interval = setInterval(() => {
		if(timeout <= 0){
			resendLink.disabled = false
			resendLink.textContent = resendLinkText
			return clearInterval(interval)
		}
		timeout--
		resendLink.textContent = getTimeoutText(timeout)
	}, 1000)
	await server.resendVerificationLink({
		email: sessionStorage.getItem('pending_verified_mail'),
		onSuccess: () => {emailSentPopup.showModal()},
		onError: () => {errorEmailSentPopup.showModal()}
	})
})

verifyEmailDiv.append(pendingVerificationIcon, status, verifyEmailText, resendLink, emailSentPopup, errorEmailSentPopup)

export default function verifyEmail(){
	return verifyEmailDiv
}