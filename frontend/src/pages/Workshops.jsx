import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Workshops() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const { data } = await axios.get('/api/events');
                const onlyWorkshops = data.filter(e => e.type === 'Workshop');
                setWorkshops(onlyWorkshops);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch workshops", error);
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    const handleRegister = async (eventId) => {
        if (!user) {
            alert('Please login to register for workshops.');
            return;
        }
        setRegisteringId(eventId);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/events/${eventId}/register`, {}, config);
            alert('Successfully registered for the workshop!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to register');
        } finally {
            setRegisteringId(null);
        }
    };

    const filteredWorkshops = workshops.filter(w =>
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="workshops-page">
            <style>{`
                .workshops-page {
                    background-color: #f8fafc;
                    min-height: 100vh;
                    padding-bottom: 5rem;
                }
                .page-header {
                    background: linear-gradient(135deg, #065f46 0%, #059669 100%);
                    color: white;
                    padding: 4rem 0;
                    text-align: center;
                    border-radius: 0 0 40px 40px;
                    margin-bottom: 3rem;
                    box-shadow: 0 20px 40px -15px rgba(6, 95, 70, 0.3);
                }
                .page-header h1 { font-size: 2.8rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.75rem; color: #ffffff; }
                .page-header p { font-size: 1.1rem; opacity: 0.9; max-width: 500px; margin: 0 auto; }
                
                .workshop-container { display: flex; flex-direction: column; gap: 2rem; }
                
                .search-bar-container {
                    max-width: 500px; margin: 0 auto; width: 100%; position: relative;
                }
                .search-input {
                    width: 100%; padding: 1rem 1.25rem 1rem 3rem; border-radius: 16px;
                    border: 2px solid #e2e8f0; background: white; font-size: 1rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); transition: all 0.3s ease;
                    outline: none; box-sizing: border-box;
                }
                .search-input:focus { border-color: #10b881; box-shadow: 0 15px 30px -10px rgba(16, 185, 129, 0.2); }
                .search-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); font-size: 1.1rem; color: #94a3b8; }

                .workshop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
                
                .workshop-card {
                    background: white; border-radius: 24px; overflow: hidden;
                    border: 1px solid rgba(0, 0, 0, 0.05); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex; flex-direction: column;
                }
                .workshop-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(6, 95, 70, 0.15); }
                
                .workshop-img-container { height: 200px; background: #f1f5f9; position: relative; overflow: hidden; }
                .workshop-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
                .workshop-card:hover .workshop-image { transform: scale(1.1); }
                
                .workshop-content { padding: 1.75rem; flex: 1; display: flex; flex-direction: column; }
                .workshop-tag {
                    background: rgba(16, 185, 129, 0.1); color: #059669; padding: 0.4rem 0.75rem;
                    border-radius: 50px; font-size: 0.65rem; font-weight: 800; width: fit-content; margin-bottom: 1rem;
                    text-transform: uppercase; letter-spacing: 0.1em;
                }
                .workshop-title { font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; line-height: 1.2; }
                .workshop-desc { 
                    color: #64748b; line-height: 1.5; margin-bottom: 1.5rem; font-size: 0.95rem; 
                    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
                }
                
                .workshop-meta {
                    margin-top: auto; padding-top: 1.25rem; border-top: 1px solid #f1f5f9;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .meta-date { color: #059669; font-weight: 700; font-size: 0.85rem; }
                
                .btn-workshop {
                    background: #10b881; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px;
                    font-weight: 800; cursor: pointer; transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); font-size: 0.9rem;
                }
                .btn-workshop:hover:not(:disabled) { background: #059669; transform: scale(1.05); }
                .btn-workshop:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }

                .no-results { grid-column: 1 / -1; text-align: center; padding: 6rem 2rem; }

                @media (max-width: 600px) {
                    .page-header h1 { font-size: 2.5rem; }
                    .workshop-grid { grid-template-columns: 1fr; }
                }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            <div className="workshops-page">
                <div className="page-header">
                    <div className="container">
                        <h1>Expert Workshops</h1>
                        <p>Join immersive, hands-on sessions led by industry leaders to master new skills.</p>
                    </div>
                </div>

                <div className="container workshop-container">
                    <div className="search-bar-container">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Find a workshop (e.g. AI, React, UI)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="workshop-grid">
                        {loading ? (
                            <div className="no-results">
                                <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #10b881', borderRadius: '50%', margin: '0 auto 2rem', animation: 'spin 1s linear infinite' }}></div>
                                <h2>Brewing some knowledge...</h2>
                            </div>
                        ) : filteredWorkshops.length === 0 ? (
                            <div className="no-results">
                                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem' }}>💡</span>
                                <h2>No workshops found</h2>
                                <p>Try a different keyword or check back later!</p>
                            </div>
                        ) : (
                            filteredWorkshops.map(workshop => (
                                <div key={workshop._id} className="workshop-card">
                                    <div className="workshop-img-container">
                                        <img
                                            src={workshop.imageUrl}
                                            alt={workshop.title}
                                            className="workshop-image"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800";
                                                e.target.onerror = null;
                                            }}
                                        />
                                    </div>
                                    <div className="workshop-content">
                                        <span className="workshop-tag">Skill Workshop</span>
                                        <h3 className="workshop-title">{workshop.title}</h3>
                                        <p className="workshop-desc">{workshop.description}</p>
                                        <div className="workshop-meta">
                                            <span className="meta-date">📅 {new Date(workshop.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                                            <button
                                                className="btn-workshop"
                                                onClick={() => handleRegister(workshop._id)}
                                                disabled={registeringId === workshop._id}
                                            >
                                                {registeringId === workshop._id ? (
                                                    <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                ) : 'Register'}
                                            </button>
                                        </div>
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
