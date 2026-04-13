import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Hackathons() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                // Filter specifically for hackathons
                const onlyHacks = data.filter(e => e.type === 'Hackathon' || e.type === 'Competition');
                setHackathons(onlyHacks);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch hackathons", error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const [registeringId, setRegisteringId] = useState(null);

    const handleRegister = async (eventId) => {
        if (!user) {
            alert('Please login to register for hackathons.');
            return;
        }
        setRegisteringId(eventId);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/events/${eventId}/register`, {}, config);
            alert('Successfully registered for the Hackathon!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to register');
        } finally {
            setRegisteringId(null);
        }
    };

    return (
        <main className="hackathons-page">
            <style>{`
                .hackathons-page {
                    background-color: #020617;
                    color: #e2e8f0;
                    background-image: 
                        radial-gradient(circle at 0% 0%, rgba(30, 58, 138, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, rgba(126, 34, 206, 0.1) 0%, transparent 50%);
                    min-height: 100vh;
                    padding-bottom: 6rem;
                }

                .page-header {
                    text-align: center;
                    padding: 8rem 0 4rem;
                    position: relative;
                }

                .page-header h1 {
                    font-size: 4.5rem;
                    font-weight: 900;
                    color: #ffffff;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.04em;
                }

                .page-header p {
                    font-size: 1.25rem;
                    color: #94a3b8;
                    max-width: 700px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                .hackathon-list {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 3rem;
                    max-width: 1100px;
                    margin: 0 auto;
                }

                .hackathon-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 28px;
                    overflow: hidden;
                    display: flex;
                    min-height: 280px;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .hackathon-card:hover {
                    background: rgba(15, 23, 42, 0.8);
                    border-color: rgba(96, 165, 250, 0.3);
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
                }

                .hackathon-img-container {
                    flex: 0 0 320px;
                    position: relative;
                    overflow: hidden;
                }

                .hackathon-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.8s ease;
                }

                .hackathon-card:hover .hackathon-img {
                    transform: scale(1.1);
                }

                .hackathon-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.7) 40%);
                    pointer-events: none;
                }

                .hackathon-content {
                    flex: 1;
                    padding: 2rem 2.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    z-index: 5;
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(34, 197, 94, 0.1);
                    color: #4ade80;
                    padding: 0.4rem 1rem;
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    width: fit-content;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    background: currentColor;
                    border-radius: 50%;
                    box-shadow: 0 0 10px currentColor;
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .hackathon-title {
                    font-size: 1.8rem;
                    font-weight: 900;
                    margin-top: 1rem;
                    color: #fff;
                    line-height: 1.2;
                    letter-spacing: -0.01em;
                }

                .hackathon-desc {
                    color: #94a3b8;
                    font-size: 1rem;
                    line-height: 1.5;
                    margin-top: 0.75rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .hackathon-meta {
                    display: flex;
                    gap: 1.5rem;
                    margin: 1.5rem 0;
                    color: #cbd5e1;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .meta-icon {
                    color: #60a5fa;
                    font-size: 1rem;
                }

                .reg-btn {
                    width: fit-content;
                    padding: 0.75rem 2rem;
                    border-radius: 12px;
                    font-weight: 800;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .reg-btn-primary {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    color: white;
                    box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
                }

                .reg-btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px -5px rgba(139, 92, 246, 0.5);
                }

                .reg-btn:disabled {
                    background: #334155;
                    color: #64748b;
                    cursor: not-allowed;
                }

                @media (max-width: 1000px) {
                    .hackathon-card { flex-direction: column; min-height: auto; }
                    .hackathon-card::after { background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.9) 100%); }
                    .hackathon-img-container { flex: 0 0 300px; }
                    .hackathon-content { padding: 2.5rem; }
                    .hackathon-title { font-size: 2rem; }
                }

                @media (max-width: 600px) {
                    .page-header h1 { font-size: 3rem; }
                    .hackathon-meta { flex-direction: column; gap: 1rem; }
                }
            `}</style>

            <div className="container">
                <div className="page-header">
                    <h1>Code. Build. Win.</h1>
                    <p>Compete with the brightest minds across the country in high-stakes innovation challenges.</p>
                </div>

                <div className="hackathon-list">
                    {loading ? (
                        <div style={{textAlign: 'center', padding: '6rem'}}>
                            <div className="spinner" style={{width: '60px', height: '60px', border: '5px solid rgba(59, 130, 246, 0.1)', borderTop: '5px solid #3b82f6', borderRadius: '50%', margin: '0 auto 2rem', animation: 'spin 1s linear infinite'}}></div>
                            <h2 style={{color: '#94a3b8'}}>Finding the best challenges...</h2>
                        </div>
                    ) : hackathons.length === 0 ? (
                        <div className="hackathon-card" style={{gridTemplateColumns: '1fr', textAlign: 'center'}}>
                            <div className="hackathon-content" style={{alignItems: 'center'}}>
                                <h2 style={{color: 'white'}}>No Hackathons Found</h2>
                                <p style={{color: '#94a3b8'}}>Our next grand challenge is being curated. Stay sharp!</p>
                            </div>
                        </div>
                    ) : (
                        hackathons.map(hack => (
                            <div key={hack._id} className="hackathon-card">
                                <div className="hackathon-img-container">
                                    <img 
                                        src={hack.imageUrl} 
                                        alt={hack.title} 
                                        className="hackathon-img"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800";
                                            e.target.onerror = null;
                                        }}
                                    />
                                </div>
                                <div className="hackathon-content">
                                    <div className="status-badge">
                                        <div className="status-dot"></div>
                                        Registration Live
                                    </div>
                                    <h2 className="hackathon-title">{hack.title}</h2>
                                    <p className="hackathon-desc">{hack.description}</p>
                                    <div className="hackathon-meta">
                                        <div className="meta-item"><span className="meta-icon">📅</span> {new Date(hack.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                        <div className="meta-item"><span className="meta-icon">📍</span> {hack.location}</div>
                                        <div className="meta-item"><span className="meta-icon">👥</span> {hack.capacity} Slots Left</div>
                                    </div>
                                    <button 
                                        className="reg-btn reg-btn-primary" 
                                        onClick={() => handleRegister(hack._id)} 
                                        disabled={registeringId === hack._id}
                                    >
                                        {registeringId === hack._id ? (
                                            <div className="spinner" style={{width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                                        ) : 'Secure My Spot'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

