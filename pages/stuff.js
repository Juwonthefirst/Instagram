export default function home() {
  const main = document.querySelector('.root')
	main.innerHTML = `<header class="head">
    <h2>Instagram</h2>
    <div class="head-icon">
      <i class="plus" data-lucide="plus">icon1</i>
      <i data-lucide="heart">icon2</i>
    </div>
  </header>
  <div class="main">
    <div class="story-bar">
      <div class="personal story">
        <div class="story-pic">
          <img src="./img/profile.jpg" alt="" />
          <i data-lucide="plus"></i>
        </div>
        <p>Your story</p>
      </div>
       <!--<div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>
    <div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>
    <div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>
    <div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>
    <div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>
    <div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>
    <div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>
    <div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>
    <div class="story">
      <div class="story-pic">
        <img src="./img/profile.jpg" alt="" />
        <i data-lucide="plus"></i>
      </div>
      <p>Your story</p>
    </div>-->
    </div>
    <div class="posts">
      <div class="post">
        <div class="post-head">
          <div class="post-owner-pic">
            <img class="post-owner-pic" src="./img/profile.jpg" alt="" />
          </div>
          <div class="post-owner-details">
            <p class="post-owner"><span class="username">Juwonthefirst</span></p>
            <p class="extra">Original audio</p>
          </div>
          <i data-lucide="ellipsis"></i>
        </div>
        <img src="./img/1.jpg" alt="post" />
        <div class="icons">
          <i data-lucide="heart"></i>
          <i data-lucide="message-circle"></i>
          <i data-lucide="send"></i>
          <i data-lucide="bookmark"></i>
        </div>
        <p class="likes"> 26 likes</p>
        <p class="post-details"><span class="username">Juwonthefirst</span> This is a post about how much life sucks</p>
      </div>
    </div>
  </div>
  <div class="footer">
    <i data-lucide="house"></i>
    <i data-lucide="search"></i>
    <svg class="reels" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
      <path d="M3 7h18" />
      <path d="M7 3l4 4" />
      <path d="M13 3l4 4" />
      <polygon points="10 10 16 13 10 16 10 10" />
    </svg>
    <iconify-icon icon="ri:messenger-line"></iconify-icon>
    <img src="./img/profile.jpg" alt="" />
  </div>`
}