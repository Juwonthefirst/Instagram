import server from '../fetch.js';
import { basicPopUp } from '../components/popup.js';

const key = new URLSearchParams(location.search).get('key')
if(key){
	await server.verifyEmail({ 
		key, 
		onSuccess: () => {
			sessionStorage.removeItem('pending_verified_mail')
			router.render('finish-signup')
		}, 
		onError:  ''})
}

const emailSentPopup = basicPopUp('Verification mail sent', 'A new verification email has been sent to you click on it to verify your Email')
//const errorEmailSentPopup = 
const verifyEmailDiv = document.createElement('.div')
verifyEmailDiv.className = 'verify-email'

const emailSentVideo = document.createElement('video')
emailSentVideo.src = '/img/Email_Sent.webm'
emailSentVideo.autoplay = true
emailSentVideo.loop = true
emailSentVideo.playsInline = true
emailSentVideo.muted = true
verifyEmailDiv.appendChild(emailSentVideo)

const verifyEmailText = document.createElement('p')
verifyEmailText.textContent = 'Congratulations!!, You are almost done just verify your email by clicking the verification link sent to your mail'

const resendVerificationEmail = document.createElement('p')
const resendLink = document.createElement('button')
resendLink.addEventListener('click', (event) => {
	resendLink.disabled = true
	setTimeout(() => {resendLink.disabled = false}, 1000 * 60 * 2)
	await server.resendVerificationLink({
		email: sessionStorage.getItem('pending_verified_mail'),
		onSuccess: emailSentPopup.showModal,
	})
})
verifyEmailDiv.appendChild(verifyEmailText)

export default function verifyEmail(){
	return verifyEmailDiv
}