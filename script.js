/* ==========================================================================
   INTERACTIVE ENGAGEMENT LOGIC FOR DIGITAL INVITATION (PREMIUM UPGRADE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LOADING SCREEN TIMEOUT
    const loader = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 600);
        }, 800); // Memberikan efek loading elegan sesaat
    });

    // PARSING URL PARAMETER UNTUK NAMA TAMU (e.g. ?to=Bapak+Budi)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        document.getElementById('guest-target').innerText = decodeURIComponent(guestName);
    }

    // 2. MUSIK & EVENT BUKA UNDANGAN
    const btnOpen = document.getElementById('btn-open-invite');
    const cover = document.getElementById('cover-overlay');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const floatMusicBtn = document.getElementById('floating-music-btn');

    btnOpen.addEventListener('click', () => {
        // Efek Confetti Terpicu
        initConfetti();
        
        // Memutar Audio secara terprogram
        bgMusic.play().catch(err => console.log("Autoplay ditolak browser. Menunggu interaksi resmi."));
        floatMusicBtn.classList.remove('hidden');

        // Animasi transisi cover menghilang
        cover.style.transform = 'translateY(-100%)';
        mainContent.classList.remove('hide-content');

        // Memicu inisialisasi scroll reveal setelah dibuka
        setTimeout(handleScrollReveal, 400);
    });

    // 3. KONTROL AUDIO FLOATING BUTTON (Font Awesome Version Upgrade)
    const musicIcon = document.getElementById('music-icon');
    floatMusicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicIcon.innerHTML = '<i class="fa-solid fa-music"></i>';
        } else {
            bgMusic.pause();
            musicIcon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });

    // 4. AUTOMATIC COUNTDOWN TIMER (Target: 07 Juli 2026)
    const targetDate = new Date('July 7, 2026 10:00:00').getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown-wrapper').innerHTML = "<h3 class='font-playfair' style='grid-column: span 4;'>Acara Sedang Berlangsung!</h3>";
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(d).padStart(2, '0');
        document.getElementById('hours').innerText = String(h).padStart(2, '0');
        document.getElementById('minutes').innerText = String(m).padStart(2, '0');
        document.getElementById('seconds').innerText = String(s).padStart(2, '0');
    }, 1000);

    // 5. RESPONSIVE AUTOMATIC GALLERY SLIDER
    const track = document.getElementById('slider-track');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('slide-next');
    const prevBtn = document.getElementById('slide-prev');
    let currentIndex = 0;

    const moveSlide = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
    };

    nextBtn.addEventListener('click', () => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        moveSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        moveSlide(prevIndex);
    });

    // Autoslide setiap 4 detik
    setInterval(() => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        moveSlide(nextIndex);
    }, 4000);

    // 6. SCROLL BAR, REVEAL, & BACK TO TOP MECHANISM
    const btt = document.getElementById('back-to-top');
    const progressBar = document.getElementById('scroll-progress');
    const revealElements = document.querySelectorAll('.scroll-reveal');

    function handleScrollReveal() {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) el.classList.add('active');
        });
    }

    window.addEventListener('scroll', () => {
        // Progress Bar Calculation
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";

        // Back To Top Display
        if (winScroll > 400) btt.classList.add('show');
        else btt.classList.remove('show');

        // Trigger Reveal Animation
        handleScrollReveal();
    });

    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 7. GOOGLE SHEETS GUESTBOOK SYSTEM (RSVP) - LINK TERINTEGRASI
    const rsvpForm = document.getElementById('rsvp-form');
    const wishesDisplay = document.getElementById('wishes-display');
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbz8sOjWvkiFEsSAslqxdSewVZpUbofiSftEuWWfZRWbmgSsEbGZCIk_AY6q0Pvi511b/exec'; 

    // Fungsi mengambil semua doa dari Google Sheets secara publik
    const renderWishes = () => {
        wishesDisplay.innerHTML = '<p class="font-cormorant text-center" style="color:#A67C52; padding: 20px 0;">Memuat ucapan doa...</p>';
        
        fetch(scriptUrl)
            .then(response => response.json())
            .then(storedWishes => {
                if(storedWishes.length === 0) {
                    wishesDisplay.innerHTML = '<p class="font-cormorant text-center" style="color:#5C4033; opacity:0.7; padding: 20px 0;">Belum ada ucapan doa.</p>';
                    return;
                }
                wishesDisplay.innerHTML = storedWishes.map(item => `
                    <div class="wish-item">
                        <div class="wish-header">
                            <span class="font-playfair">${escapeHtml(item.name)}</span>
                            <span class="wish-badge font-cormorant">${item.status}</span>
                        </div>
                        <p style="margin-top:8px; color:#5C4033; font-weight: 300;">${escapeHtml(item.message)}</p>
                    </div>
                `).reverse().join(''); // Urutan dibalik agar ucapan paling baru muncul paling atas
            })
            .catch(err => {
                console.error("Gagal memuat ucapan:", err);
                wishesDisplay.innerHTML = '<p class="font-cormorant text-center" style="color:red; padding: 20px 0;">Gagal memuat ucapan doa.</p>';
            });
    };

    // Fungsi mengirim data ke Google Sheets saat form disubmit
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Animasi loading tombol kirim
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span><i class="fa-solid fa-spinner fa-spin"></i> Mengirim...</span>';

        const name = document.getElementById('rsvp-name').value;
        const status = document.getElementById('rsvp-status').value;
        const message = document.getElementById('rsvp-message').value;

        const dataToSend = { name, status, message };

        fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Mencegah kendala CORS lintas platform mobile browser
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        })
        .then(() => {
            showToast('Ucapan berhasil dikirim!');
            rsvpForm.reset();
            
            // Memberikan sedikit jeda untuk server Google memproses sebelum web memuat ulang datanya
            setTimeout(() => {
                renderWishes();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        })
        .catch(err => {
            console.error('Gagal mengirim:', err);
            showToast('Gagal mengirim ucapan!');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    });

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    renderWishes(); // Memuat daftar ucapan pertama kali saat undangan dibuka
});

// 8. CLIPBOARD SCRIPT WITH TOAST
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Nomor rekening berhasil disalin!');
    }).catch(err => console.error('Gagal menyalin text: ', err));
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 9. PREMIUM VISUAL EFFECTS: VANILLA CONFETTI GENERATOR
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#A67C52', '#C7A27C', '#E8D8C8', '#F2E6D8'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, idx) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle);
            p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
        });

        update();
    }

    function update() {
        let remaining = 0;
        particles.forEach(p => {
            if (p.y < canvas.height) remaining++;
        });
        if (remaining > 0) requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    draw();
}
