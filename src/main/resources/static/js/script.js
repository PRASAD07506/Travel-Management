// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        this.classList.add('active');

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Interactive 360 Modal Logic
const modal360 = document.getElementById('modal-360');
const panoContainer = document.getElementById('pano-container');
const panoImage = document.getElementById('pano-image');

const rooms = [
    { name: 'Luxury Suite',   price: 350, img: 'images/hotel_room_palace.png' },
    { name: 'Ocean Villa',    price: 550, img: 'images/hotel_room_maldives.png' },
    { name: 'Mountain Chalet',price: 420, img: 'images/hotel_room_leh.png' },
    { name: 'Beach Resort',   price: 300, img: 'images/hotel_room_goa.png' }
];

let currentRoom = 0;
let isDragging = false;
let startX;
let currentTranslate = 0;
let prevTranslate = 0;

function switchRoom(idx) {
    currentRoom = idx;
    const room = rooms[idx];
    panoImage.style.backgroundImage = `url('${room.img}')`;
    document.getElementById('room-name').innerText = room.name;
    document.getElementById('room-price').innerText = `$${room.price}/night`;
    // Update tab active state
    document.querySelectorAll('.room-tab').forEach((t, i) => {
        t.classList.toggle('active', i === idx);
    });
    // Reset pan
    currentTranslate = 0;
    prevTranslate = 0;
    panoImage.style.transform = 'translateX(0)';
}

function open360Modal(roomIndex = 0) {
    currentTranslate = 0;
    prevTranslate = 0;
    switchRoom(roomIndex);
    panoImage.style.transform = 'translateX(0)';
    modal360.classList.add('active');
}

function close360Modal() {
    modal360.classList.remove('active');
}

modal360.addEventListener('click', (e) => {
    if (e.target === modal360) close360Modal();
});

panoContainer.addEventListener('mousedown', dragStart);
panoContainer.addEventListener('mouseup', dragEnd);
panoContainer.addEventListener('mouseleave', dragEnd);
panoContainer.addEventListener('mousemove', drag);
panoContainer.addEventListener('touchstart', dragStart);
panoContainer.addEventListener('touchend', dragEnd);
panoContainer.addEventListener('touchmove', drag);

function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
}

function dragEnd() {
    isDragging = false;
    prevTranslate = currentTranslate;
}

function drag(e) {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    const diff = (currentPosition - startX) * 1.8;
    currentTranslate = prevTranslate + diff;
    const minTranslate = -(panoContainer.offsetWidth * 2);
    if (currentTranslate > 0) currentTranslate = 0;
    if (currentTranslate < minTranslate) currentTranslate = minTranslate;
    panoImage.style.transform = `translateX(${currentTranslate}px)`;
}

function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}


// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add initial styles for animation to cards
document.querySelectorAll('.destination-card, .hotel-card, .transport-card, .guide-card').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==== AUTH LOGIC ====
const API_BASE_URL = 'http://localhost:8081/api/auth';
const authModal = document.getElementById('modal-auth');
const loginView = document.getElementById('auth-login-view');
const registerView = document.getElementById('auth-register-view');

function openAuthModal(view) {
    authModal.classList.add('active');
    switchAuthView(view);
}

function closeAuthModal() {
    authModal.classList.remove('active');
}

function switchAuthView(view) {
    if (view === 'login') {
        loginView.style.display = 'block';
        registerView.style.display = 'none';
    } else {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    }
}

// Close auth modal on outside click
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('username', data.username);
            updateNavForUser(data.username);
            closeAuthModal();
            alert('Login successful!');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Server connection error. Please ensure backend is running.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Registration successful! Please log in.');
            switchAuthView('login');
        } else {
            const text = await response.text();
            alert(text || 'Registration failed.');
        }
    } catch (error) {
        console.error('Error registering:', error);
        alert('Server connection error. Please ensure backend is running.');
    }
}

function updateNavForUser(username) {
    const navActions = document.getElementById('nav-actions-container');
    if (navActions && username) {
        navActions.innerHTML = `
            <div class="user-profile-btn">
                <i class="fa-solid fa-circle-user"></i>
                <span>${username}</span>
            </div>
            <button class="btn btn-outline" style="padding: 0.5rem 1rem;" onclick="handleLogout()">Logout</button>
        `;
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    location.reload(); // Reload to reset UI
}

// Check auth state on load
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (username && token) {
        updateNavForUser(username);
    }

    // Make tourist place photos clickable to open explore modal
    document.querySelectorAll('.destination-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-explore')) {
                openExploreModal(this);
            }
        });
    });
});

// ==== EXPLORE MODAL LOGIC ====
const exploreModal = document.getElementById('modal-explore');
const exploreImg = document.getElementById('explore-img');
const exploreTitle = document.getElementById('explore-title');
const exploreLocation = document.getElementById('explore-location');
const exploreDesc = document.getElementById('explore-desc');

const destinationDetails = {
    'Goa': 'Famous for its pristine beaches, vibrant nightlife, and Portuguese heritage. Experience the ultimate party destination with thrilling water sports and delicious seafood.',
    'Kashmir': 'Known as Paradise on Earth, Kashmir offers breathtaking snow-capped mountains, serene Dal Lake shikara rides, and lush valleys perfect for a peaceful retreat.',
    'Kerala': 'Gods own country features tranquil backwaters, luxurious houseboats, and rejuvenating Ayurveda spas nestled among lush green landscapes.',
    'Ladakh': 'The land of high passes, a haven for adventure seekers. Known for majestic mountains, thrilling bike trips, and rugged terrains under a clear blue sky.',
    'Jaipur': 'The Pink City boasts royal palaces, majestic forts, and vibrant traditional markets. Dive into rich culture and royal heritage.',
    'Maldives': 'A tropical paradise featuring luxury water villas, crystal clear turquoise waters, and pristine beaches. Perfect for honeymooners and scuba diving enthusiasts.',
    'Paris': 'The City of Lights and Love. Iconic for the Eiffel Tower, world-class fashion, charming cafes, and a deeply romantic atmosphere.',
    'Bali': 'An Island of the Gods with lush tropical resorts, beautiful beaches, and a serene connection to nature mixed with a vibrant nightlife.'
};

const hotelNames = {
    'Goa': 'Taj Exotica Resort', 'Kashmir': 'Lalit Grand Palace', 'Kerala': 'Kumarakom Lake Resort',
    'Ladakh': 'The Grand Dragon', 'Jaipur': 'Rambagh Palace', 'Maldives': 'Soneva Jani',
    'Paris': 'Hôtel de Crillon', 'Bali': 'COMO Uma Ubud'
};

const packagePrices = {
    'Goa': 799, 'Kashmir': 1099, 'Kerala': 949, 'Ladakh': 1199,
    'Jaipur': 849, 'Maldives': 2499, 'Paris': 1999, 'Bali': 1299
};

const nearbyAttractions = {
    'Goa': ['Dudhsagar Waterfalls', 'Aguada Fort', 'Basilica of Bom Jesus', 'Anjuna Flea Market'],
    'Kashmir': ['Gulmarg Gondola', 'Pahalgam Valley', 'Sonamarg', 'Shankaracharya Temple'],
    'Kerala': ['Munnar Tea Gardens', 'Wayanad Wildlife Sanctuary', 'Varkala Beach', 'Athirappilly Waterfalls'],
    'Ladakh': ['Pangong Lake', 'Nubra Valley', 'Magnetic Hill', 'Thiksey Monastery'],
    'Jaipur': ['Amber Fort', 'Hawa Mahal', 'Jantar Mantar', 'Nahargarh Fort'],
    'Maldives': ['Male City', 'Banana Reef', 'Bioluminescent Beach', 'Manta Point'],
    'Paris': ['Louvre Museum', 'Notre-Dame Cathedral', 'Palace of Versailles', 'Montmartre'],
    'Bali': ['Ubud Monkey Forest', 'Tanah Lot Temple', 'Mount Batur', 'Tegallalang Rice Terrace']
};

const hotelImages = {
    'Goa': 'images/hotel_room_goa.png',
    'Jaipur': 'images/hotel_room_palace.png',
    'Maldives': 'images/hotel_room_maldives.png',
    'Ladakh': 'images/hotel_room_leh.png',
    'Kashmir': 'images/hotel_room_mountain.png',
    'Kerala': 'images/hotel_room_ocean.png',
    'Paris': 'images/hotel_room_luxury.png',
    'Bali': 'images/hotel_room_ocean.png'
};

function openExploreModal(element) {
    const card = element.closest('.destination-card');
    const cardContent = card.querySelector('.card-content');
    const cardBg = card.querySelector('.card-bg');
    
    const title = cardContent.querySelector('h3').innerText;
    const locationHTML = cardContent.querySelector('.location').innerHTML;
    const bgImage = cardBg.style.backgroundImage;

    // Populate Modal
    exploreTitle.innerText = title;
    exploreLocation.innerHTML = locationHTML;
    exploreImg.style.backgroundImage = bgImage;
    exploreDesc.innerText = destinationDetails[title] || 'Discover the beauty and wonder of ' + title + '.';
    
    // Update dynamic content
    const pkgName = document.getElementById('explore-pkg-name');
    const pkgPrice = document.getElementById('explore-pkg-price');
    const stayName = document.getElementById('explore-stay-name');
    const stayPrice = document.getElementById('explore-stay-price');
    const stayImg = document.getElementById('explore-stay-img');
    const stay360Btn = document.getElementById('explore-stay-360-btn');
    
    if (pkgName) pkgName.innerText = title;
    if (pkgPrice) pkgPrice.innerText = packagePrices[title] || 1200;
    if (stayName) stayName.innerText = hotelNames[title] || 'Luxury Resort';
    if (stayPrice) stayPrice.innerText = Math.round((packagePrices[title] || 1200) * 0.3);
    if (stayImg) stayImg.style.backgroundImage = `url('${hotelImages[title] || 'images/hotel_room_1778876311607.png'}')`;
    if (stay360Btn) {
        let roomIdx = 0;
        if (title === 'Maldives') roomIdx = 1;
        else if (title === 'Ladakh') roomIdx = 2;
        else if (title === 'Goa') roomIdx = 3;
        stay360Btn.setAttribute('onclick', `open360Modal(${roomIdx})`);
    }

    const nearbyGrid = document.getElementById('explore-nearby-grid');
    if (nearbyGrid) {
        const attractions = nearbyAttractions[title] || ['Local Market', 'City Center', 'Historic Monument', 'Nature Park'];
        nearbyGrid.innerHTML = attractions.map(attr => `
            <div style="background: #F8F9FA; border-radius: 12px; padding: 1rem; border: 1px solid #EEE; display: flex; align-items: center; gap: 0.8rem;">
                <div style="background: rgba(255,56,92,0.1); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 1.2rem;">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <div>
                    <h5 style="margin-bottom: 0.2rem; font-size: 0.95rem;">${attr}</h5>
                    <p style="font-size: 0.75rem; color: var(--dark-muted);">Must Visit</p>
                </div>
            </div>
        `).join('');
    }

    const exploreMap = document.getElementById('explore-map-iframe');
    if (exploreMap) {
        exploreMap.src = `https://maps.google.com/maps?q=${encodeURIComponent(title)}&t=&z=11&ie=UTF8&iwloc=&output=embed`;
    }

    exploreModal.classList.add('active');
}

function closeExploreModal() {
    exploreModal.classList.remove('active');
}

// Close explore modal on outside click
exploreModal.addEventListener('click', (e) => {
    if (e.target === exploreModal) {
        closeExploreModal();
    }
});

// ==== BOOKING MODAL LOGIC ====
const bookingModal = document.getElementById('modal-booking');
const successModal = document.getElementById('modal-success');

const bookingConfig = {
    hotel:   { icon: '🏨', title: 'Book Hotel Room',     basePrice: 350, unit: 'night',  subtitle: 'Luxury resort — Breakfast & WiFi included.' },
    package: { icon: '✈️', title: 'Book Travel Package', basePrice: 1200, unit: 'person', subtitle: 'Flights, 5-star stay, guided tours & meals.' },
    car:     { icon: '🚗', title: 'Book Vehicle',         basePrice: 45,  unit: 'day',    subtitle: '' },
    guide:   { icon: '🧑‍✈️', title: 'Hire Local Guide', basePrice: 50,  unit: 'day',    subtitle: '' }
};

let currentBookingPrice = 0;
let currentBookingUnit = 'night';

function openBookingModal(type, label, priceStr) {
    const cfg = bookingConfig[type] || bookingConfig['hotel'];
    const price = priceStr ? parseInt(priceStr.replace(/\D/g, '')) : cfg.basePrice;
    currentBookingPrice = price;
    currentBookingUnit = cfg.unit;

    const subtitle = label ? `${label} — ${priceStr || '$' + price + '/' + cfg.unit}` : cfg.subtitle;

    document.getElementById('booking-icon').innerText = cfg.icon;
    document.getElementById('booking-title').innerText = cfg.title;
    document.getElementById('booking-subtitle').innerText = subtitle;

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    document.getElementById('booking-checkin').value = today;
    document.getElementById('booking-checkout').value = tomorrow;
    document.getElementById('booking-guests').value = 1;

    // Pre-fill if user is logged in
    const username = localStorage.getItem('username');
    if (username) document.getElementById('booking-name').value = username;
    else document.getElementById('booking-name').value = '';
    document.getElementById('booking-email').value = '';

    recalculateTotal();
    bookingModal.classList.add('active');
}

function recalculateTotal() {
    const checkin  = document.getElementById('booking-checkin').value;
    const checkout = document.getElementById('booking-checkout').value;
    const guests   = parseInt(document.getElementById('booking-guests').value) || 1;

    let units = 1;
    if (checkin && checkout) {
        const d1 = new Date(checkin);
        const d2 = new Date(checkout);
        const diff = Math.round((d2 - d1) / 86400000);
        if (diff > 0) units = diff;
    }

    const total = currentBookingPrice * units * guests;
    document.getElementById('booking-total').innerText = `$${total.toLocaleString()}`;
}

// Live recalculate on input change
document.getElementById('booking-checkin').addEventListener('change', recalculateTotal);
document.getElementById('booking-checkout').addEventListener('change', recalculateTotal);
document.getElementById('booking-guests').addEventListener('input', recalculateTotal);

function closeBookingModal() {
    bookingModal.classList.remove('active');
}

function closeSuccessModal() {
    successModal.classList.remove('active');
}

bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal();
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) closeSuccessModal();
});

function handleBookingSubmit(e) {
    e.preventDefault();
    const name    = document.getElementById('booking-name').value;
    const email   = document.getElementById('booking-email').value;
    const checkin = document.getElementById('booking-checkin').value;
    const total   = document.getElementById('booking-total').innerText;
    closeBookingModal();
    document.getElementById('success-msg').innerText =
        `Hi ${name}! ✅ Your booking from ${checkin} (${total}) is confirmed. A receipt has been sent to ${email}.`;
    successModal.classList.add('active');
}

// ==== SEARCH LOGIC ====
const availableLocations = ['Goa', 'Kashmir', 'Kerala', 'Ladakh', 'Jaipur', 'Maldives', 'Paris', 'Bali'];

function handleLocationSearch(query) {
    const suggestionsBox = document.getElementById('location-suggestions');
    if (!query || query.trim() === '') {
        suggestionsBox.classList.remove('active');
        return;
    }
    const filtered = availableLocations.filter(loc => loc.toLowerCase().includes(query.toLowerCase()));
    
    if (filtered.length > 0) {
        suggestionsBox.innerHTML = filtered.map(loc => `<div class="suggestion-item" onclick="selectLocation('${loc}')"><i class="fa-solid fa-map-pin" style="margin-right: 8px; color: var(--primary);"></i>${loc}</div>`).join('');
        suggestionsBox.classList.add('active');
    } else {
        suggestionsBox.innerHTML = '<div class="suggestion-item" style="color: var(--dark-muted);">No locations found</div>';
        suggestionsBox.classList.add('active');
    }
}

function selectLocation(loc) {
    document.getElementById('search-location').value = loc;
    document.getElementById('location-suggestions').classList.remove('active');
    
    // Auto-open explore modal for the selected location if it exists
    const cards = document.querySelectorAll('.destination-card');
    let foundCard = null;
    cards.forEach(card => {
        const title = card.querySelector('h3');
        if (title && title.innerText === loc) {
            foundCard = card;
        }
    });
    
    if (foundCard) {
        openExploreModal(foundCard);
    }
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    const suggestionsBox = document.getElementById('location-suggestions');
    if (suggestionsBox && e.target.id !== 'search-location' && !e.target.closest('.suggestions-box')) {
        suggestionsBox.classList.remove('active');
    }
});

// Interactive Hero Parallax Effect
document.addEventListener('mousemove', (e) => {
    const heroBg = document.getElementById('hero-bg-interactive');
    if (heroBg) {
        // Smooth hardware-accelerated parallax based on mouse position
        const x = (e.clientX / window.innerWidth - 0.5) * 40; // 40px intensity
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        heroBg.style.transform = `scale(1.25) translate(${x}px, ${y}px)`;
    }
});


// AI Smart Trip Planner Logic
function generateAITrip() {
    const promptInput = document.getElementById('ai-prompt');
    const resultBox = document.getElementById('ai-result');
    const loader = document.getElementById('ai-loader');
    const content = document.getElementById('ai-content');
    
    if (!promptInput.value.trim()) {
        alert("Please enter a destination or trip idea first!");
        return;
    }

    resultBox.style.display = 'block';
    loader.style.display = 'flex';
    content.style.display = 'none';

    // Simulate AI Generation Delay
    setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = `
            <h4 style="color: var(--primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-plane-departure"></i> Your Personalized Itinerary</h4>
            <p style="font-size: 0.95rem; color: var(--dark-muted); margin-bottom: 1rem;">Based on your prompt: <em>"${promptInput.value}"</em></p>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.8rem;">
                <li style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="background: var(--primary); color: #fff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</div>
                    <div><strong>Arrival & Check-in:</strong> Settle into your luxury suite and enjoy a welcome dinner with panoramic views.</div>
                </li>
                <li style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="background: var(--primary); color: #fff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
                    <div><strong>Guided Exploration:</strong> Private tour of top local attractions with an expert local guide.</div>
                </li>
                <li style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div style="background: var(--primary); color: #fff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
                    <div><strong>Leisure & Departure:</strong> Relax by the pool, souvenir shopping, and luxury transfer to the airport.</div>
                </li>
            </ul>
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="openBookingModal('package')">Book This AI Trip ($1,450)</button>
                <button class="btn btn-outline" style="border-color: var(--dark-muted); color: var(--dark-muted);" onclick="document.getElementById('ai-result').style.display='none'">Discard</button>
            </div>
        `;
    }, 2500);
}
