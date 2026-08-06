// script.js
 
// Assigns an element's `data-src` to its real `src` the first time it's
// actually needed (a slide being shown, a modal being opened), instead of
// letting the browser fetch every photo/video on initial page load. Safe to
// call repeatedly — does nothing once the src is already set.
function loadLazySrc(el) {
  if (el && !el.src && el.dataset && el.dataset.src) {
    el.src = el.dataset.src;
  }
}
 
 
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
 
// ---------- Love Letters Timeline ----------
// Newest first. Each entry becomes one tappable node in the timeline nav.
const loveLetters = [
  {
    month: "17th",
    paragraphs: [
      "Mylove love,",
      "Hii lovee loveee koooo, I MISS YOU NAAAA!!! I want to hug you napoooo. Happy 17th Monthsarryyyyy pooo!!!",
      "Thank you po love love palagi sa love, care, and everything. I'm so thankful na naging tayo at ako yung bf mo",
      "Gagawin ko po lahat lahat para sayo at para saatin. Habang buhay tayo magsasama po ahhh magpapakasal tayooooo",
      "Lastly, I want to say sorry kasi walang 16th dito kasi po yung nakalimutan ko nanaman. Pero love love, tandaan mopo na  mahal na mahal kitaaa MWAAAAAAAAAAAAAAAAAAAAAA. ILOVE YOUUU SO MUCHHHH!!!"
    ]
  },
  {
    month: "15th",
    paragraphs: [
      "Mylove love,",
      "Hii lovee, una gusto ko po mag thank you ulit kasi nagkita ulit tayooo. Thank you sainyo nila tito and tita hehe.",
      "Thank you po kasi nakapag pahinga ako sayo. wag na wag kapo aalis ahh, mamahalin kita ng sobraaa, ibibigay ko lahat lahat sayooo",
      "Kaya lahat ng mga binibigay ko sayo maliit na bagay lang mga yun, okay??? you deserve everything mylove.",
      "Ikaw yung dumating na ayaw kong umalis. kaya para sayo love love mahal na mahal kitaaa MWAAAAAAAAAAAAAAAAAAAAAA. ILOVE YOUUU SO MUCHHHH!!!"
    ]
  },
  {
    month: "14th",
    paragraphs: [
      "Mylove love,",
      "Hii lovee, I just want to say thank you po hehe. Palagi me mag tthank you kasi meron akong ikaw. Gumagaan pakiramdam ko kapag nakakausap, tinitignan, or kahit ano basta nandyan presence mo. Love I'm greatful ako na meron akong ikaw.",
      "Wla na akonghihilingin pang iba. bukod sa maging malakas mga mahal ko sa buhay at maabot mga pangarap natin. Love I LOVE YOU SO MUCHHHHH.",
      "Alam mo lagi nasa isip ko. How can I improve myself. ewan ko ba naiisip ko na pano kita bibigyan ng magandang buhay. Alam kong matagal pa tayo magkakasama(kasal) pero gusto ko na maspoil kita like mabigay wants mo or mahelp kita sa mga needs mo.",
      "Kaya gagawin ko po lahat para sayo love love. gaya ng pagmamahal mo na binibigay sakin. love lagi rin po akong nandito para sayo ahh. nandito para makinig kahit minsan hindi ko alam sasabihin ko. basta makinig sayo, sa mga chikas mo hehe. I LOVE YOU SO MUCHHHH MWAAAAAAAAAAAAAAAAAA"
    ]
  },
  {
    month: "13th",
    paragraphs: [
      "Mylove love,",
      "Hii lovee, I just want to say thank you po hehe. Palagi me mag tthank you kasi meron akong ikaw. Gumagaan pakiramdam ko kapag nakakausap, tinitignan, or kahit ano basta nandyan presence mo. Love I'm greatful ako na meron akong ikaw.",
      "Wag kapo sana magsawa sakin hehe. Ipaparamdam ko sayo na mahal na mahal kita palagi love love ko.",
      "Sorry po kasi nakalimutan ko. Dami kopo kasi iniisip lately na parang wala ako sa isip ko.",
      "sorry po pero tandaan mopo na mahal na mahal kita walang iba. Kaya magpapakasal tayo ahhh walang iwanan. I LOVE YOU SO MUCHHHH MWAAAAAAAAAAAAAAAAAA"
    ]
  },
  {
    month: "11th",
    paragraphs: [
      "Mylove love,",
      "Hii lovee, una gusto ko po mag thank you kasi nagkita na tayooo. Thank you sainyo nila tito and tita sa pag welcome sakin hehe.",
      "Pero alam mo ba nung magksama tayo nasa isip ko na sana hindi na matapos yung araw na yun kasi kapag uuwi ako malungkot nanaman kasi namimiss kita. Love, I LOVE YOU SO MUCHH!!!",
      "Next gusto ko mag sorry kasi wala papong one month nawala na yung binigay mo sakin sorry po...",
      "Lastly, Love babawi ako sayo sa kahit anong paaan gusto ko maparamdam sayo na mahal na maha kita . I LOVE YOUU SOO MUCHHHH. MWAAAAAAAAAAAA!"
    ]
  },
  {
    month: "10th",
    paragraphs: [
      "Mylove love,",
      "HIII LOVEE!!! Mag kikita na tayoooooooooo!!! konti nalanggg MISS NA MISS NAPOOO KITA LOVE LOVE KOO",
      "Ano kayang reaction natin that time. Iniisip ko rin kasi mga gagawin natin huhu. Baka indi tayo payagan na tayo lang sm.",
      "MISS NA MISS NA KITA LOVE LOVE KOOO I LOVE YOU SO MUCHHHHHHHHHHH gusto napo kitang yakapin love love ko. Like hindi na 'to miss pangungulila na AAAAAAAAAAAAAAAAA.",
      "Sorry po medyo late ko 'to mauupload hindi ko nabigay kahapon sorry po. Pero tandaan mopo I LOVE YOU SO MUCHH MWAAAAAAAAAAAAAAAAAAAAAAA"
    ]
  },
  {
    month: "9th",
    paragraphs: [
      "Mylove love,",
      "HIII LOVEE!!! 9th Months naa!! This month miss na miss kitaaa like sobrang nangungulila ako sayo😞. Gusto na kita makita para mayakap at mahalikan. Gusto ko ipakita kung gaano kita kamahal love love ko.",
      "Love love habang ginagawa ko 'to gusto ko sabihin na napaka cutee mo like ackkkkk!!! Napaka ganda na cutie pa ng love love ko",
      "Konti nalang rin magkikita na tayooo. excited ako na kinakabahan hanggang ngayon kasi papalapit na nang papalapit. Also, syempre first time natin magkita huhu medyo kinakabayan me pooo hehe.",
      "Lastly, Again Happy Monthsarry myloveeeee! thank youu po sa lahat ng pinapadama mo saakin. napakaswerte ko sayo at mas gagalingan ko pa sa buhay para sa ating dalawa mamahalin at bibigyan kita ng masayang buhay love. I LOVE YOUU SOO MUCHHHH. MWAAAAAAAAAAAA!"
    ]
  },
  {
    month: "8th",
    paragraphs: [
      "Mylove love,",
      "HIIIIIII LOVEEEEE, another month nanamannnnn and more months, years, and decades pa tayong pagsasamahan.  Tapos ngayon MISS NA MISS KITA LOVEEEEEEE.",
      "Love, I LOVE YOU SO MUCHHH, uulit ulitin kong sasabihin na napakaswerte ko sayo kasi meron akong ikaw. Meron akong cute, mapag-alaga, pinaparamdam sakin na mahal ako at napakaganda na love love.",
      "I can't wait to see youuuu loveee. Excited na ako na makita at mayakap kaaa. 8 Months na tayo at sa susunod in person na tayo magcecelebrate ng mga occations like Monthsarry, Anniversarry, Birthdays and Achivements natin together. See you soon MYLOVEEE.",
      "HAPPY 8TH MONTHSARRY LOVEEEEE LOVEEEE KOOO I LOVEEE YOUUUUU SOO MUCHHH magpapakasal tayo ha."
    ]
  },
  {
    month: "7th",
    paragraphs: [
      "Mylove love,",
      "To my dearest love love I want to say thank youuu and I LOVE YOUUU SO MUCH. 7 months na pala tayo parang ang bilis, dami na rin ng nangyari pero we're going strongger and stronger mylove.",
      "You've brought so much joy, laughter, and warmth into my life. Tapos kapag nakasmile ka ackkkkk ANG CUTEEEE MOOOOOO. Gusto kita pasayahin lagi love love kooo.",
      "Today, we celebrate this 7th monthsary, I want you to know that I LOVE YOUU SO MUCH and I want na we're gonna grow together. Also maachieve natin together dreams natin of all our tomorrows together ha. Lahat ng problem na pagdadaanan natin maoovercome natin lahat ng 'yan and soon magpapakasal and bubuo ng happy family",
      "Lastly I wanna say thank you for being you, for loving me, and for choosing me. I'll do everything for you love and papakasal tayo ha I LOVE YOUUUUUUUUUUUUUUU SOOOO MUCCCHHHHHHH."
    ]
  }
];
 
let activeLetterIndex = 0;
 
function renderLetterNav() {
  const nav = document.getElementById("timelineNav");
  if (!nav) return;
  nav.innerHTML = "";
  loveLetters.forEach((letter, i) => {
    const btn = document.createElement("button");
    btn.className = "timeline-node" + (i === activeLetterIndex ? " active" : "");
    btn.type = "button";
    btn.textContent = letter.month;
    btn.setAttribute("aria-pressed", i === activeLetterIndex ? "true" : "false");
    btn.addEventListener("click", () => selectLetter(i));
    nav.appendChild(btn);
  });
}
 
function renderLetterContent() {
  const panel = document.getElementById("timelineLetter");
  if (!panel) return;
  const letter = loveLetters[activeLetterIndex];
 
  panel.classList.remove("fade-in");
  panel.innerHTML = `
    <h3 class="dancing-font text-3xl md:text-4xl text-center text-purple-600 mb-6">Happy ${letter.month} Monthsarry</h3>
    <div class="text-lg leading-relaxed">
      ${letter.paragraphs.map(p => `<p class="mb-4">${p}</p>`).join("")}
      <p class="mt-8 dancing-font text-2xl text-pink-500">Forever yours,</p>
      <p class="dancing-font text-2xl text-purple-600">Aren</p>
    </div>
  `;
  // Restart the fade-in animation
  void panel.offsetWidth;
  panel.classList.add("fade-in");
}
 
function selectLetter(index) {
  if (index === activeLetterIndex) return;
  activeLetterIndex = index;
  renderLetterNav();
  renderLetterContent();
}
 
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("timelineNav")) {
    renderLetterNav();
    renderLetterContent();
  }
});
 
function showEnvelopePopup() {
  document.getElementById("envelopePopup").classList.remove("hidden");
}
 
function closeEnvelopePopup() {
  document.getElementById("envelopePopup").classList.add("hidden");
}
 
function openEnvelope() {
  const wrapper = document.getElementById("envelopeWrapper");
  const videoModal = document.getElementById("videoModal");
  loadLazySrc(videoModal.querySelector("iframe"));
 
  if (wrapper) {
    // Play the opening animation (normally hover-only, so this covers touch/tap too),
    // then show the video a beat later so the animation is actually visible.
    wrapper.classList.add("opened");
    setTimeout(() => {
      videoModal.classList.remove("hidden");
    }, 550);
  } else {
    videoModal.classList.remove("hidden");
  }
}
 
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("envelopeWrapper");
  if (wrapper) {
    wrapper.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEnvelope();
      }
    });
  }
 
  const revealCard = document.getElementById("revealCard");
  if (revealCard) {
    revealCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleRevealCard();
      }
    });
  }
});
 
function closeVideo() {
  const modal = document.getElementById("videoModal");
  modal.classList.add("hidden");
 
  const wrapper = document.getElementById("envelopeWrapper");
  if (wrapper) wrapper.classList.remove("opened");
 
  // The video is a YouTube iframe, not a <video> tag, so we stop playback
  // by resetting the iframe's src (reload it) rather than calling .pause()
  const iframe = modal.querySelector("iframe");
  if (iframe) {
    const src = iframe.src;
    iframe.src = "";
    iframe.src = src;
  }
}
 
 
document.getElementById("openGiftBtn").addEventListener("click", function() {
    const giftLink = "https://gifft.me/o/b/x7rj78ru6rl6pl32rtrc2ccg";
    const newWindow = window.open(giftLink, "_blank");
    if (!newWindow) {
      // Fallback if popup blocked
      window.location.href = giftLink;
    }
  });
 
    // Slideshow Logic
let slideIndex = 0;
const slides = document.querySelectorAll(".slides img");
 
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.add("hidden");
    if (i === index) slide.classList.remove("hidden");
  });
 
  // Lazy-load the current photo plus its immediate neighbors so swiping
  // forward/back still feels instant, without downloading all 40+ photos
  // the moment the page opens.
  if (slides.length) {
    [index - 1, index, index + 1].forEach((i) => {
      const wrapped = (i + slides.length) % slides.length;
      loadLazySrc(slides[wrapped]);
    });
  }
 
  const counter = document.getElementById("slideCounter");
  if (counter && slides.length) {
    counter.textContent = `${index + 1} / ${slides.length}`;
  }
}
 
function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}
 
function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}
 
 
document.addEventListener("DOMContentLoaded", () => {
 
  let vidIndex = 0;
  const slides = document.querySelectorAll(".yt-slide");
 
  function showVid(n) {
    slides.forEach(s => s.classList.remove("show"));
    slides[n].classList.add("show");
    loadLazySrc(slides[n].querySelector("iframe"));
  }
 
  function nextVid() {
    vidIndex = (vidIndex + 1) % slides.length;
    showVid(vidIndex);
  }
 
  function prevVid() {
    vidIndex = (vidIndex - 1 + slides.length) % slides.length;
    showVid(vidIndex);
  }
 
  document.getElementById("nextBtn").addEventListener("click", nextVid);
  document.getElementById("prevBtn").addEventListener("click", prevVid);
 
  // START
  showVid(vidIndex);
 
});
 
// Auto play every 4s
let slideAutoplay = setInterval(nextSlide, 4000);
showSlide(slideIndex);
 
// Swipe support for mobile (photo slideshow)
(function() {
  const slidesContainer = document.getElementById("slidesContainer");
  if (!slidesContainer) return;
 
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 40; // minimum px distance to count as a swipe
 
  function restartAutoplay() {
    clearInterval(slideAutoplay);
    slideAutoplay = setInterval(nextSlide, 4000);
  }
 
  slidesContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
 
  slidesContainer.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;
 
    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      if (distance < 0) {
        nextSlide(); // swiped left -> next
      } else {
        prevSlide(); // swiped right -> previous
      }
      restartAutoplay();
    }
  }, { passive: true });
})();
 
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
 
// Surprise reveal card (tap to flip)
function toggleRevealCard() {
    const card = document.getElementById('revealCard');
    if (card) card.classList.toggle('flipped');
}
 
// Dark mode toggle (remembers preference across visits)
function applyDarkMode(isDark) {
    const icon = document.getElementById('darkModeIcon');
    document.body.classList.toggle('dark-mode', isDark);
    if (icon) {
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
    }
}
 
function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    applyDarkMode(isDark);
    try {
        localStorage.setItem('darkMode', isDark ? '1' : '0');
    } catch (e) {
        console.warn('Could not save dark mode preference:', e);
    }
}
 
// Restore saved preference on load
(function() {
    try {
        const saved = localStorage.getItem('darkMode');
        if (saved === '1') applyDarkMode(true);
    } catch (e) {
        console.warn('Could not read dark mode preference:', e);
    }
})();
 
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
