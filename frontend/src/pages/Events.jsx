import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState(['Tech', 'Art', 'Sports', 'Workshop', 'Cultural', 'Hackathon', 'Seminar', 'Other']);
    const { user } = useContext(AuthContext);


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch generic events", error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [registeringId, setRegisteringId] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch generic events", error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleRegister = async (eventId) => {
        if (!user) {
            alert('Please login to register for events.');
            return;
        }
        
        setRegisteringId(eventId);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/events/${eventId}/register`, {}, config);
            alert('Congratulations! You have successfully registered.');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to register');
        } finally {
            setRegisteringId(null);
        }
    };

    // Combined filtering logic
    const filteredEvents = events.filter(event => {
        const matchesCategory = selectedCategories.includes(event.type);
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             event.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main>
            <style>{`
                .events-page {
                    background-color: #f8fafc;
                    min-height: 100vh;
                    padding-bottom: 5rem;
                }
                .page-header {
                    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
                    color: white;
                    padding: 3.5rem 0;
                    text-align: center;
                    border-radius: 0 0 40px 40px;
                    margin-bottom: 3rem;
                    box-shadow: 0 20px 40px -15px rgba(30, 27, 75, 0.3);
                    position: relative;
                    overflow: hidden;
                }
                .page-header h1 { font-size: 2.8rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.75rem; color: #ffffff; }
                .page-header p { font-size: 1.1rem; opacity: 0.8; max-width: 500px; margin: 0 auto; }
                
                .events-layout { display: grid; grid-template-columns: 280px 1fr; gap: 2.5rem; }
                
                @media (max-width: 1000px) {
                    .events-layout { grid-template-columns: 1fr; }
                    .filters-sidebar { position: static !important; width: 100% !important; }
                }

                .filters-sidebar {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 24px;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    height: fit-content;
                    position: sticky;
                    top: 100px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                }

                .search-container { position: relative; margin-bottom: 2rem; }
                .search-input {
                    width: 100%;
                    padding: 0.85rem 1rem 0.85rem 2.75rem;
                    border-radius: 12px;
                    border: 2px solid #f1f5f9;
                    background: #f8fafc;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    outline: none;
                    box-sizing: border-box;
                }
                .search-input:focus {
                    border-color: #4f46e5;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
                }
                .search-icon {
                    position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
                    font-size: 1rem; color: #94a3b8;
                }

                .filter-group h3 {
                    font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem;
                    display: flex; align-items: center; gap: 0.5rem;
                }
                
                .category-list { display: flex; flex-direction: column; gap: 0.5rem; }
                
                .category-item {
                    display: flex; align-items: center; gap: 0.75rem; cursor: pointer;
                    padding: 0.6rem 0.75rem; border-radius: 10px; transition: all 0.2s ease;
                }
                .category-item:hover { background: #f1f5f9; }
                
                .custom-checkbox {
                    width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 5px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s ease; background: white;
                }
                .category-item.active .custom-checkbox {
                    background: #4f46e5; border-color: #4f46e5;
                }
                .category-item.active .custom-checkbox::after {
                    content: '✓'; color: white; font-size: 10px; font-weight: 900;
                }
                .category-label { font-weight: 600; color: #475569; font-size: 0.85rem; }
                .category-item.active .category-label { color: #1e293b; }

                .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

                .event-card {
                    background: white; border-radius: 24px; overflow: hidden;
                    border: 1px solid rgba(0, 0, 0, 0.05); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex; flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .event-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1); }

                .event-img-container { height: 180px; background: #f1f5f9; position: relative; overflow: hidden; }
                .event-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
                .event-card:hover .event-img { transform: scale(1.08); }
                
                .type-badge {
                    position: absolute; top: 1rem; left: 1rem;
                    padding: 0.4rem 0.75rem; border-radius: 50px; background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(4px); font-size: 0.65rem; font-weight: 800; color: #1e293b;
                    text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .event-info { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
                .event-date { color: #4f46e5; font-weight: 800; font-size: 0.75rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
                .event-title { font-size: 1.3rem; font-weight: 900; color: #0f172a; margin-bottom: 0.75rem; line-height: 1.2; letter-spacing: -0.01em; }
                .event-desc { 
                    color: #64748b; line-height: 1.5; margin-bottom: 1.5rem; font-size: 0.95rem; 
                    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
                }
                .page-header h1 { color: #ffffff; }
                
                .event-meta { border-top: 1px solid #f1f5f9; padding-top: 1rem; margin-top: auto; display: flex; flex-direction: column; gap: 0.5rem; }
                .meta-item { display: flex; align-items: center; gap: 0.5rem; color: #475569; font-size: 0.85rem; font-weight: 500; }
                .meta-icon { font-size: 1rem; }

                .reg-btn {
                    margin-top: 1.5rem; width: 100%; padding: 0.85rem; border: none; border-radius: 12px;
                    font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                }
                .reg-btn-primary { background: #4f46e5; color: white; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }
                .reg-btn-primary:hover:not(:disabled) { background: #4338ca; transform: translateY(-2px); }
                .reg-btn:disabled { background: #94a3b8; cursor: not-allowed; opacity: 0.7; }

                .no-results {
                    grid-column: 1 / -1; text-align: center; padding: 6rem 2rem;
                    background: white; border-radius: 32px; border: 2px dashed #e2e8f0;
                }
                .no-results i { font-size: 4rem; color: #cbd5e1; margin-bottom: 1.5rem; display: block; }
                
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            <div className="events-page">
                <div className="page-header">
                    <div className="container">
                        <h1>Discover Events</h1>
                        <p>Explore specialized workshops, intense hackathons, and vibrant cultural meetups.</p>
                    </div>
                </div>

                <div className="container events-layout">
                    {/* Sidebar Filters */}
                    <aside className="filters-sidebar">
                        <div className="search-container">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search by name..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <h3><span>🎯</span> Categories</h3>
                            <div className="category-list">
                                {['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Other'].map(category => (
                                    <div 
                                        key={category} 
                                        className={`category-item ${selectedCategories.includes(category) ? 'active' : ''}`}
                                        onClick={() => {
                                            if (selectedCategories.includes(category)) {
                                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                                            } else {
                                                setSelectedCategories([...selectedCategories, category]);
                                            }
                                        }}
                                    >
                                        <div className="custom-checkbox"></div>
                                        <span className="category-label">{category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Events Grid */}
                    <div className="events-grid">
                        {loading ? (
                            <div className="no-results" style={{borderStyle: 'solid'}}>
                                <div className="spinner" style={{width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #4f46e5', borderRadius: '50%', margin: '0 auto 2rem', animation: 'spin 1s linear infinite'}}></div>
                                <h2>Curating your experience...</h2>
                            </div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="no-results">
                                <span style={{fontSize: '4rem', display: 'block', marginBottom: '1rem'}}>🔍</span>
                                <h2>No matches found</h2>
                                <p>Try adjusting your filters or search terms.</p>
                                <button 
                                    onClick={() => {setSearchQuery(''); setSelectedCategories(['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Other']);}}
                                    style={{marginTop: '1.5rem', background: '#f1f5f9', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer'}}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            filteredEvents.map(event => (
                                <div key={event._id} className="event-card">
                                    <div className="event-img-container">
                                        <div className="type-badge">{event.type}</div>
                                        <img 
                                            src={event.imageUrl} 
                                            alt={event.title} 
                                            className="event-img"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';
                                                e.target.onerror = null;
                                            }}
                                        />
                                    </div>
                                    <div className="event-info">
                                        <div className="event-date">📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                        <h3 className="event-title">{event.title}</h3>
                                        <p className="event-desc">{event.description}</p>
                                        <div className="event-meta">
                                            <div className="meta-item"><span className="meta-icon">📍</span> {event.location}</div>
                                            <div className="meta-item"><span className="meta-icon">👥</span> {event.capacity} Slots Available</div>
                                        </div>
                                        <button 
                                            className="reg-btn reg-btn-primary" 
                                            onClick={() => handleRegister(event._id)} 
                                            disabled={registeringId === event._id}
                                        >
                                            {registeringId === event._id ? (
                                                <div className="spinner" style={{width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                                            ) : 'Register for Free'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
