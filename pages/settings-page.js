import { lucideIcon } from '../components/icon.js';
import { memory } from '../appMemory.js';
import { server } from '../server.js';
import { router } from '../router.js';
import { confirmationPopup } from '../components/popup.js';

const logoutConfirmationPopup = confirmationPopup(
   'are you sure you want to log out',
   async () => {
      await server.logout({
         onError: (data) => {
            if (data.status === 400 || data.status === 401) {
               location.pathname = '/login'
            }
         },
         onSuccess: (data) => { location.pathname = '/login' }
      })
   },
   'Log out'
)

const settingsPageDiv = document.createElement('div')
settingsPageDiv.className = 'settings-page'

const settingsPageHeaderDiv = document.createElement('div')
settingsPageHeaderDiv.className = 'header'

const backBtn = lucideIcon('chevron-left')
backBtn.addEventListener('click', () => history.back())

const headerTag = document.createElement('h2')
headerTag.textContent = 'Beep'

//For aligning header contents to their appropriate positions
const emptyTag = document.createElement('p')
settingsPageHeaderDiv.append(backBtn, headerTag, emptyTag)
settingsPageDiv.appendChild(settingsPageHeaderDiv)

const userDetailsDiv = document.createElement('div')
userDetailsDiv.className = 'user-details'

const userProfilePictureDiv = document.createElement('div')
userProfilePictureDiv.className = 'profile-picture'


const userProfilePictureImg = document.createElement('img')
userProfilePictureImg.src = '/img/profile.jpg'

const profilePictureUploadBtn = lucideIcon('camera', 'camera-btn')

userProfilePictureDiv.append(userProfilePictureImg, profilePictureUploadBtn)
userDetailsDiv.appendChild(userProfilePictureDiv)

const usernameTag = document.createElement('p')
usernameTag.className = 'username'

const emailTag = document.createElement('p')
emailTag.className = 'email'

userDetailsDiv.append(usernameTag, emailTag)
settingsPageDiv.appendChild(userDetailsDiv)

const profileSettingGroupDiv = document.createElement('div')
profileSettingGroupDiv.className = 'profile-settings group'

const profileSettingGroupHeaderDiv = document.createElement('div')
profileSettingGroupHeaderDiv.className = 'group-header'

const profileIcon = lucideIcon('user', '', true)

const profileSettingGroupHeaderTag = document.createElement('p')
profileSettingGroupHeaderTag.textContent = 'Profile-settings'

profileSettingGroupHeaderDiv.append(profileIcon, profileSettingGroupHeaderTag)
profileSettingGroupDiv.appendChild(profileSettingGroupHeaderDiv)

const changeEmailSettingsDiv = document.createElement('div')
changeEmailSettingsDiv.className = 'change-email settings-tab'

const changeEmailSettingsTag = document.createElement('p')
changeEmailSettingsTag.textContent = 'Change your email'

const emailNextButton = lucideIcon('chevron-right')
changeEmailSettingsDiv.append(changeEmailSettingsTag, emailNextButton)
profileSettingGroupDiv.appendChild(changeEmailSettingsDiv)

const changePasswordSettingsDiv = document.createElement('div')
changePasswordSettingsDiv.className = 'change-password settings-tab'

const changePasswordSettingsTag = document.createElement('p')
changePasswordSettingsTag.textContent = 'Change your password'

const passwordNextButton = lucideIcon('chevron-right')

changePasswordSettingsDiv.append(changePasswordSettingsTag, passwordNextButton)
profileSettingGroupDiv.appendChild(changePasswordSettingsDiv)

settingsPageDiv.appendChild(profileSettingGroupDiv)

const logoutBtn = document.createElement('button')
logoutBtn.className = 'logout settings-tab'
logoutBtn.addEventListener('click', () => logoutConfirmationPopup.showModal())

const logoutIcon = lucideIcon('log-out', '', true)
const logoutTextTag = document.createElement('p')
logoutTextTag.textContent = 'Log out'

logoutBtn.append(logoutIcon, logoutTextTag)
settingsPageDiv.append(logoutBtn, logoutConfirmationPopup)

export default function settingsPage() {
   const currentUser = memory.getCurrentUser()
   usernameTag.textContent = currentUser.username
   emailTag.textContent = currentUser.email
   return settingsPageDiv
}