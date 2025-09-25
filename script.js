// Lisää tämä script.js:n alkuun, ennen muita funktioita
(function() {
    // Varmista että EmailJS latautuu oikein
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS ei ole latautunut');
        return;
    }
    
    // Alusta EmailJS
    emailjs.init({
        publicKey: 'EV6UX6GIPG231yXUd', // Tarkista että tämä on oikea
        blockHeadless: true,
        limitRate: {
            id: 'app',
            throttle: 10000,
        },
    });
})();


// Set minimum dates for form inputs
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.min = today;
    });

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize
    checkCookieConsent();
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

function closeMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');
}

// Carousel scroll
function scrollCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const scrollAmount = 350;
    track.scrollBy({
        left: scrollAmount * direction,
        behavior: 'smooth'
    });
}

// Contact Modal
function showContactModal() {
    document.getElementById('contactModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('show');
    document.body.style.overflow = '';
}

// Terms Modal
function showTerms() {
    document.getElementById('termsModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeTermsModal() {
    document.getElementById('termsModal').classList.remove('show');
    document.body.style.overflow = '';
}

// Lightbox
const galleryImages = [
    'images/c55i.webp',
    'images/c55i-5.webp',
    'images/camping-car.webp',
    'images/c55i-nuit.webp',
    'images/ceefe67e.webp'
];

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    img.src = galleryImages[index];
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('show');
    document.body.style.overflow = '';
}


// Form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Näytä loading-tila
        const submitBtn = event.target.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Lähetetään...';
        submitBtn.disabled = true;
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // EmailJS parametrit
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            start_date: data.startDate,
            end_date: data.endDate,
            message: data.message,
            to_email: 'janne.jokela@live.fi'
        };
        
        try {
            // Lähetä sähköposti EmailJS:n kautta
            await emailjs.send(
                'service_nnxux1e',  // service ID
                'template_rnwavtk', // template ID
                templateParams
            );
            
            // Onnistui
            alert('Kiitos yhteydenotostasi! Viesti on lähetetty onnistuneesti. Palaamme asiaan mahdollisimman pian.');
            closeContactModal();
            event.target.reset();
            
        } catch (error) {
            console.error('Virhe sähköpostin lähetyksessä:', error);
            alert('Viestin lähetyksessä tapahtui virhe. Yritä uudelleen tai ota yhteyttä suoraan puhelimitse.');
        } finally {
            // Palauta nappi
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

// Cookie Banner
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        setTimeout(() => {
            document.getElementById('cookieBanner').classList.add('show');
        }, 2000);
    } else if (consent === 'accepted') {
        // Initialize GA4
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID');
        }
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieBanner').classList.remove('show');
    // Initialize GA4
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID');
    }
}

function showCookieSettings() {
    alert('Evästeasetukset: Käytämme vain välttämättömiä evästeitä ja Google Analytics -analytiikkaa. Voit estää analytiikan selaimesi asetuksista.');
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#contact') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});