// Main JavaScript File for CampusConnect

document.addEventListener('DOMContentLoaded', () => {
    console.log('CampusConnect App Initialized');

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Animate hamburger to X
            menuBtn.classList.toggle('open');
        });
    }

    // Initialize mock data render (if on home page)
    const featuredContainer = document.getElementById('featured-events');
    if (featuredContainer) {
        renderFeaturedEvents(featuredContainer);
    }
});

// Mock Data for Events
const mockEvents = [
    {
        id: 1,
        title: "AI Innovation Hackathon",
        category: "Tech",
        date: "Mar 15, 2026",
        location: "Main Auditorium",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        title: "Digital Art Workshop",
        category: "Art",
        date: "Mar 18, 2026",
        location: "Design Studio B",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        title: "Inter-College Football",
        category: "Sports",
        date: "Mar 20, 2026",
        location: "Campus Ground",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600"
    }
];

function renderFeaturedEvents(container) {
    container.innerHTML = mockEvents.map(event => `
        <article class="event-card">
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <div class="event-details">
                <span class="event-category">${event.category}</span>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <span>📅 ${event.date}</span>
                    <span>📍 ${event.location}</span>
                </div>
                <div class="event-footer">
                    <a href="events.html?id=${event.id}" class="btn btn-primary btn-sm">View Details</a>
                </div>
            </div>
        </article>
    `).join('');
}
