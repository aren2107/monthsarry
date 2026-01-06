// script.js


  // Hide loader with delay + fade
  window.addEventListener("load", () => {
    setTimeout(() => {
      const loader = document.getElementById("loader");
      loader.classList.add("hidden");
      setTimeout(() => {
        loader.style.display = "none";
      }, 1000); // matches the fade duration
    }, 1000); // delay before fading out (1s)
  });


    // Random Quotes
const quotes = [
  "You're my today and all of my tomorrows 💕",
  "Every love story is beautiful, but ours is my favorite ✨",
  "You make my heart smile 💖",
  "Forever isn’t long enough with you 💞",
  "Ikaw ang tahanan ko 🏡❤️",
  "I LOVEE YOUU SO MUCHHHHH"
];

function showRandomQuote() {
  const box = document.getElementById("quoteBox");
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  box.innerHTML = random;
}
setInterval(showRandomQuote, 4000); // changes every 4s
showRandomQuote();

function showEnvelopePopup() {
  document.getElementById("envelopePopup").classList.remove("hidden");
}

function closeEnvelopePopup() {
  document.getElementById("envelopePopup").classList.add("hidden");
}

function openEnvelope() {
  document.getElementById("videoModal").classList.remove("hidden");
}

function closeVideo() {
  const v = document.getElementById("annivVideo");
  document.getElementById("videoModal").classList.add("hidden");
  v.pause();
  v.currentTime = 0;
}




    // Slideshow Logic
let slideIndex = 0;
const slides = document.querySelectorAll(".slides img");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.add("hidden");
    if (i === index) slide.classList.remove("hidden");
  });
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}




// Auto play every 4s
setInterval(nextSlide, 4000);
showSlide(slideIndex);

    const messages = [
    "I love you so much 💖",
    "Happy monthsary, mahal ko 🥰",
    "Every moment with you is precious ✨",
    "You're my favorite notification 💌",
];
let currentMessage = 0;
let charIndex = 0;

function typeWriter() {
    const typewriter = document.getElementById("typewriter");
    if (!typewriter) return;

    if (charIndex < messages[currentMessage].length) {
        typewriter.innerHTML += messages[currentMessage].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100); // typing speed
    } else {
        setTimeout(() => {
            typewriter.innerHTML = '';
            charIndex = 0;
            currentMessage = (currentMessage + 1) % messages.length;
            setTimeout(typeWriter, 300); // small delay before next message
        }, 2000); // wait 2s before deleting
    }
}

// Start after load
window.addEventListener("DOMContentLoaded", typeWriter);

// Background music control
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let isMusicPlaying = false;

// Try to autoplay with unmuting after short delay
setTimeout(() => {
    bgMusic.muted = false;
    bgMusic.play().then(() => {
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-volume-up');
        isMusicPlaying = true;
    }).catch(e => {
        console.warn("Autoplay failed:", e);
    });

    // Start timers
    updateLoveTimer();
    updateNextCountdown();
    setInterval(updateLoveTimer, 1000);
    setInterval(updateNextCountdown, 1000);
}, 1000);

// Try to play on first user interaction
function enableAudioOnInteraction() {
    bgMusic.muted = false;
    bgMusic.play().then(() => {
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-volume-up');
        isMusicPlaying = true;
    }).catch(err => {
        console.warn("Autoplay failed after interaction:", err);
    });

    document.removeEventListener('click', enableAudioOnInteraction);
}
document.addEventListener('click', enableAudioOnInteraction);

// Toggle music
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('fa-volume-up');
        musicIcon.classList.add('fa-music');
    } else {
        bgMusic.play();
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-volume-up');
    }
    isMusicPlaying = !isMusicPlaying;
}

function updateLoveTimer() {
    const startDate = new Date('January 7, 2025 00:00:00');
    const now = new Date();

    // Compute year and month difference using calendar logic
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        // Fix for negative days by borrowing days from previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // Calculate hours, minutes, seconds
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msSinceMidnight = now - midnight;

    const hours = Math.floor(msSinceMidnight / (1000 * 60 * 60));
    const minutes = Math.floor((msSinceMidnight % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((msSinceMidnight % (1000 * 60)) / 1000);

    document.getElementById('years').innerHTML = years;
    document.getElementById('months').innerHTML = months;
    document.getElementById('days').innerHTML = days;
    document.getElementById('hours').innerHTML = hours;
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;
}



// Countdown to next monthsary
function updateNextCountdown() {
    const startDate = new Date('January 7, 2025 00:00:00');
    const now = new Date();

    let nextMonthsary = new Date(startDate);
    while (nextMonthsary <= now) {
        nextMonthsary.setMonth(nextMonthsary.getMonth() + 1);
    }

    const distance = nextMonthsary - now;

    if (distance < 0) {
        document.getElementById('next-days').innerHTML = '🎉';
        document.getElementById('next-hours').innerHTML = '🎉';
        document.getElementById('next-minutes').innerHTML = '🎉';
        document.getElementById('next-seconds').innerHTML = '🎉';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('next-days').innerHTML = days;
    document.getElementById('next-hours').innerHTML = hours;
    document.getElementById('next-minutes').innerHTML = minutes;
    document.getElementById('next-seconds').innerHTML = seconds;
}

// Floating heart effect
document.addEventListener('click', function(e) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.position = 'fixed';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.color = ['#ff9a9e', '#fad0c4', '#a18cd1', '#fbc2eb'][Math.floor(Math.random() * 4)];
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 60 - 30}deg)`;
    document.body.appendChild(heart);

    let posY = e.clientY;
    const floatUp = setInterval(() => {
        posY -= 2;
        heart.style.top = posY + 'px';
        heart.style.opacity = (parseFloat(heart.style.opacity) || 1) - 0.01;

        if (parseFloat(heart.style.opacity) <= 0) {
            clearInterval(floatUp);
            heart.remove();
        }
    }, 20);
});
