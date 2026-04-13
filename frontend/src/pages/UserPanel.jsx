import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserPanel() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]);

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/events/myevents', config);
                setMyEvents(data);
            } catch (error) {
                console.error("Failed to fetch user events", error);
            }
        };
        fetchMyEvents();
    }, [user]);


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '3rem' }}>
            <style>{`
                @media (max-width: 850px) {
                    .dashboard-grid { grid-template-columns: 1fr !important; }
                    .dashboard-header { padding: 3rem 1.5rem 5rem !important; }
                    .dashboard-header h1 { font-size: 2rem !important; }
                }
                .event-reg-card {
                    padding: 0; 
                    border: 1px solid rgba(0, 0, 0, 0.05); 
                    border-radius: 20px; 
                    display: flex; 
                    gap: 0; 
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    background: white;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .event-reg-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    transform: translateY(-5px);
                    border-color: #bae6fd;
                }
                .reg-img-container {
                    width: 140px;
                    height: 110px;
                    overflow: hidden;
                    background: #f1f5f9;
                }
                .reg-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .event-reg-card:hover .reg-img {
                    transform: scale(1.1);
                }
                .reg-content {
                    padding: 1.5rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                @media (max-width: 500px) {
                    .event-reg-card { flex-direction: column; }
                    .reg-img-container { width: 100%; height: 160px; }
                }
            `}</style>

            <div className="dashboard-header" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)', color: 'white', padding: '4rem 2rem 6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Student Dashboard</h1>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>Welcome to your command center, {user?.name}</p>
                        </div>
                        <button onClick={handleLogout} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 1.5rem', maxWidth: '1000px', margin: '-3rem auto 0', position: 'relative', zIndex: 10 }}>
                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>
                    
                    {/* Left Column: Profile */}
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', alignSelf: 'start' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)' }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h3 style={{ color: '#1e293b', margin: 0, fontSize: '1.2rem' }}>{user?.name}</h3>
                            <span style={{ display: 'inline-block', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '50px', marginTop: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>{user?.role}</span>
                        </div>
                        
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Email Address</label>
                                <div style={{ color: '#334155', fontWeight: 500, fontSize: '0.95rem', wordBreak: 'break-all' }}>{user?.email}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>University ID</label>
                                <div style={{ color: '#334155', fontWeight: 500, fontSize: '0.95rem' }}>2115XXXX</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Registered Events */}
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            My Registrations
                            <span style={{ fontSize: '0.8rem', background: '#e0f2fe', color: '#0284c7', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>{myEvents.length} Events</span>
                        </h3>
                        
                        {myEvents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🎯</span>
                                <p style={{ marginBottom: '1.5rem' }}>You haven't registered for any events yet.</p>
                                <button onClick={() => navigate('/events')} style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)', transition: 'transform 0.2s' }}>Explore Opportunities</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {myEvents.map(event => (
                                    <div key={event._id} className="event-reg-card">
                                        <div className="reg-img-container">
                                            <img 
                                                src={event.imageUrl} 
                                                alt={event.title} 
                                                className="reg-img" 
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop";
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <div className="reg-content">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: 700 }}>{event.title}</h4>
                                                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, background: event.type === 'Hackathon' ? '#e0f2fe' : event.type === 'Workshop' ? '#dcfce7' : '#f3e8ff', color: event.type === 'Hackathon' ? '#0284c7' : event.type === 'Workshop' ? '#16a34a' : '#9333ea', textTransform: 'uppercase' }}>{event.type}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.6rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>📅 {new Date(event.date).toLocaleDateString()}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>📍 {event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => navigate('/events')} style={{ marginTop: '1rem', background: '#f8fafc', color: '#0ea5e9', border: '1px dashed #bae6fd', padding: '1rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
                                    + Find More Events
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
