// ================= SELECT ELEMENTS =================
const slider = document.querySelector('.slider');
const items = document.querySelectorAll('.slider .list .item');
const thumbnails = document.querySelectorAll('.thumbnail .item');
const next = document.getElementById('next');
const prev = document.getElementById('prev');

// ================= CONFIG =================
let countItem = items.length;
let itemActive = 0;
let autoSlideDelay = 5000;
let autoSlideTimer = null;

// ================= PROGRESS BAR =================
const progressBar = document.createElement('div');
progressBar.style.position = 'absolute';
progressBar.style.bottom = '0';
progressBar.style.left = '0';
progressBar.style.height = '4px';
progressBar.style.background = 'white';
progressBar.style.width = '0%';
slider.appendChild(progressBar);

// ================= FUNCTIONS =================

// Lazy load (improved - no flicker)
function lazyLoad(index){
    const img = items[index].querySelector('img');
    if(img && img.dataset.src){
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    }
}

// Show slider
function showSlider(){
    document.querySelector('.item.active')?.classList.remove('active');
    document.querySelector('.thumbnail .item.active')?.classList.remove('active');

    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    lazyLoad(itemActive);
    setPositionThumbnail();
}

// Next / Prev
function nextSlide(){
    itemActive = (itemActive + 1) % countItem;
    showSlider();
    restartAutoSlide();
}

function prevSlide(){
    itemActive = (itemActive - 1 + countItem) % countItem;
    showSlider();
    restartAutoSlide();
}

// Thumbnail scroll
function setPositionThumbnail(){
    thumbnails[itemActive].scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
    });
}

// ================= AUTO SLIDE =================

function startAutoSlide(){
    progressBar.style.transition = `width ${autoSlideDelay}ms linear`;
    progressBar.style.width = '100%';

    autoSlideTimer = setTimeout(() => {
        nextSlide();
    }, autoSlideDelay);
}

function restartAutoSlide(){
    clearTimeout(autoSlideTimer);

    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    setTimeout(() => {
        startAutoSlide();
    }, 50);
}

// ================= EVENTS =================

// Buttons
next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

// Thumbnail click
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        itemActive = index;
        showSlider();
        restartAutoSlide();
    });
});

// Keyboard
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') nextSlide();
    if(e.key === 'ArrowLeft') prevSlide();
});

// Pause on hover
slider.addEventListener('mouseenter', () => clearTimeout(autoSlideTimer));
slider.addEventListener('mouseleave', restartAutoSlide);

// ================= SWIPE =================
let startX = 0;

slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

slider.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if(diff > 80) nextSlide();      // swipe left
    else if(diff < -80) prevSlide(); // swipe right
});

// ================= INIT =================

// Lazy setup (better)
items.forEach((item, index) => {
    const img = item.querySelector('img');
    if(img){
        img.dataset.src = img.src;
        if(index !== 0){
            img.src = ''; // keep empty but avoids flicker
        }
    }
});

lazyLoad(0);
showSlider();
startAutoSlide();
