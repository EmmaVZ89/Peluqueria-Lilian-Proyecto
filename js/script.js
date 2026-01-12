document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            const expanded = navLinks.classList.contains('active');
            hamburger.setAttribute('aria-expanded', expanded);
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});

// --- Google Maps Logic (Global Function) ---
window.initMap = function() {
    const mapElement = document.getElementById("google-map");
    if (!mapElement) return;

    // Coordenadas de Peluquería Lilian
    const lilianLocation = { lat: -34.6073107, lng: -58.3883938 };

    // Estilo personalizado
    const mapStyles = [
        { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
        { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
        { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
    ];

    // Inicializar Mapa
    const map = new google.maps.Map(mapElement, {
        zoom: 16,
        center: lilianLocation,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true
    });

    new google.maps.Marker({
        position: lilianLocation,
        map: map,
        title: "Peluquería Lilian",
        animation: google.maps.Animation.DROP
    });

    // --- BUSCAR PLACE ID DINÁMICAMENTE ---
    // Usamos esto para evitar IDs vencidos. Buscamos por nombre y dirección.
    const request = {
        query: "Peluqueria Lilian Uruguay 148",
        fields: ['place_id']
    };

    const service = new google.maps.places.PlacesService(map);
    
    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            const correctId = results[0].place_id;
            
            // Ahora pedimos los detalles con el ID encontrado
            const detailsRequest = {
                placeId: correctId,
                fields: ['name', 'rating', 'user_ratings_total', 'opening_hours', 'reviews']
            };
            
            service.getDetails(detailsRequest, (place, status) => {
                 if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                     fillMapCard(place);
                     if (place.reviews && place.reviews.length > 0) {
                         renderReviews(place.reviews);
                     } else {
                         showFallbackReviews();
                     }
                 }
            });

        } else {
            console.log("No se pudo encontrar el lugar automáticamente. Status:", status);
            showFallbackReviews();
        }
    });
};

function fillMapCard(place) {
    const dataContainer = document.getElementById("api-places-data");
    let htmlContent = '';

    // Rating
    if (place.rating) {
        htmlContent += `
            <div style="font-size: 1.2rem; font-weight: bold; color: var(--color-primary); margin-bottom: 5px;">
                ${place.rating} <i class="fas fa-star"></i>
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 5px;">
                Basado en ${place.user_ratings_total} reseñas
            </div>
        `;
    }

    // Estado Abierto/Cerrado
    if (place.opening_hours) {
        console.log(place.opening_hours);
        // isOpen() devuelve true/false según el horario actual
        const isOpen = place.opening_hours.open_now; 
        const statusText = isOpen ? "Abierto ahora" : "Cerrado ahora";
        const color = isOpen ? "green" : "red";
        
        // Debug para ver por qué dice cerrado
        console.log("Google dice que está:", isOpen ? "ABIERTO" : "CERRADO");

        htmlContent += `<div style="color: ${color}; font-weight: 500;">● ${statusText}</div>`;
    }
    
    dataContainer.innerHTML = htmlContent;
}

function renderReviews(reviews) {
    const container = document.getElementById("reviews-container");
    
    // Filtramos solo 5 estrellas
    const topReviews = reviews.filter(r => r.rating === 5).slice(0, 5);

    if (topReviews.length === 0) {
        showFallbackReviews();
        return;
    }

    let html = '';
    topReviews.forEach((review, index) => {
        const activeClass = index === 0 ? 'active' : '';
        // Cortar texto si es muy largo
        const text = review.text.length > 180 ? review.text.substring(0, 180) + "..." : review.text;
        
        html += `
            <div class="testimonial ${activeClass}">
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"${text}"</p>
                <h4 class="client-name">${review.author_name}</h4>
            </div>
        `;
    });

    container.innerHTML = html;
    
    // Reiniciar Slider Logic
    initTestimonialSlider();
}

function showFallbackReviews() {
    const container = document.getElementById("reviews-container");
    container.innerHTML = `
        <div class="testimonial active">
            <div class="stars">★★★★★</div>
            <p class="testimonial-text">"Excelente atención, muy buen servicio y calidez humana. Precio muy accesible, muy recomendable."</p>
            <h4 class="client-name">Karina Torres</h4>
        </div>
        <div class="testimonial">
            <div class="stars">★★★★★</div>
            <p class="testimonial-text">"Lilian siempre con muy buena onda y Ezequiel hace unos alisados impecables!"</p>
            <h4 class="client-name">Jesica Bus</h4>
        </div>
    `;
    initTestimonialSlider();
}

function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;

    // Clonar para limpiar listeners previos
    if(nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.addEventListener('click', () => showSlide(currentSlide + 1));
    }

    if(prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.addEventListener('click', () => showSlide(currentSlide - 1));
    }

    function showSlide(index) {
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');
    }
}
