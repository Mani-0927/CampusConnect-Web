// Full Event Data (Extended Mock)
const allEvents = [
    {
        id: 103,
        title: "Water Contamination Detection (Biozenesys)",
        category: "Tech",
        date: "Feb 04, 2026",
        location: "GLA University Campus",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 101,
        title: "Payload Party (Cyberonites)",
        category: "Tech",
        date: "Feb 07, 2026",
        location: "Academic Block 1",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 102,
        title: "Kavya Sangam 2026",
        category: "Art",
        date: "Feb 11, 2026",
        location: "EC Conference Hall, AB-2",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600"
    },
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
    },
    {
        id: 4,
        title: "Web Dev Bootcamp",
        category: "Tech",
        date: "Mar 22, 2026",
        location: "Lab 3",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 5,
        title: "Music Fest 2026",
        category: "Art",
        date: "Apr 05, 2026",
        location: "Open Air Theatre",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 6,
        title: "Career Fair",
        category: "Workshop",
        date: "Apr 10, 2026",
        location: "Convention Hall",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-container');
    const searchInput = document.getElementById('event-search');
    const checkboxes = document.querySelectorAll('.filter-option input');

    if (eventsContainer) {
        // Initial Render
        renderEvents(allEvents);

        // Event Listeners
        searchInput.addEventListener('input', filterEvents);
        checkboxes.forEach(cb => cb.addEventListener('change', filterEvents));
    }

    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase();

        // Get checked categories
        const checkedCategories = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Filter Logic
        const filtered = allEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                event.location.toLowerCase().includes(searchTerm);
            const matchesCategory = checkedCategories.includes(event.category) ||
                (event.category === "Workshop" && checkedCategories.includes("Workshop"));
            // Simple logic, can be expanded
            return matchesSearch && matchesCategory;
        });

        renderEvents(filtered);
    }

    function renderEvents(events) {
        if (events.length === 0) {
            eventsContainer.innerHTML = '<div class="no-results">No events found matching your criteria.</div>';
            return;
        }

        eventsContainer.innerHTML = events.map(event => `
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
                        <button class="btn btn-outline btn-sm" onclick="alert('Registration Logic Placeholder')">Register</button>
                    </div>
                </div>
            </article>
        `).join('');
    }
});
