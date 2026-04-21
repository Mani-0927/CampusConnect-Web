import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPanel() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('Workshop');
    const [imageUrl, setImageUrl] = useState('');
    const [capacity, setCapacity] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editEventId, setEditEventId] = useState(null);
    const [showReport, setShowReport] = useState(false);

    // User management state
    const [showUserMgmt, setShowUserMgmt] = useState(false);
    const [adminVerified, setAdminVerified] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [adminPassInput, setAdminPassInput] = useState('');
    const [passError, setPassError] = useState('');
    const [passLoading, setPassLoading] = useState(false);

    const toggleUserMgmt = () => {
        setShowUserMgmt(!showUserMgmt);
        if(!showUserMgmt) {
            setShowForm(false);
            setShowReport(false);
        }
    };

    const handleVerifyAdmin = async (e) => {
        e.preventDefault();
        setPassLoading(true);
        setPassError('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/users/admin-fetch', { password: adminPassInput }, config);
            setUsersList(data);
            setAdminVerified(true);
        } catch (error) {
            setPassError(error.response?.data?.message || "Verification failed");
        }
        setPassLoading(false);
    };

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('/api/events');
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const eventData = { title, description, date, location, type, capacity, imageUrl };
            if (editEventId) {
                await axios.put(`/api/events/${editEventId}`, eventData, config);
            } else {
                await axios.post('/api/events', eventData, config);
            }
            setShowForm(false);
            setEditEventId(null);
            setTitle(''); setDescription(''); setDate(''); setLocation(''); setImageUrl(''); setCapacity('');
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert("Error saving event");
        }
        setLoading(false);
    };

    const handleEditClick = (event) => {
        setEditEventId(event._id);
        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date ? new Date(event.date).toISOString().split('T')[0] : '');
        setLocation(event.location);
        setType(event.type);
        setCapacity(event.capacity || '');
        setImageUrl(event.imageUrl || '');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this event?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/events/${id}`, config);
                fetchEvents();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '3rem' }}>
            <style>{`
                @media (max-width: 950px) {
                    .admin-grid { grid-template-columns: 1fr !important; }
                    .admin-header { padding: 3rem 1.5rem 5rem !important; }
                    .admin-header h1 { font-size: 2rem !important; }
                }
                .input-field {
                    width: 100%; padding: 0.8rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; transition: border-color 0.2s; font-size: 0.95rem; box-sizing: border-box;
                }
                .input-field:focus { border-color: #4f46e5; }
                .form-label { display: block; fontSize: 0.85rem; fontWeight: 600; color: #64748b; marginBottom: 0.5rem; }
            `}</style>

            {/* Top Banner Gradient */}
            <div className="admin-header" style={{ background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #ec4899 100%)', color: 'white', padding: '4rem 2rem 6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Admin Dashboard</h1>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>Welcome back, {user?.name}</p>
                        </div>
                        <button onClick={handleLogout} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 1.5rem', maxWidth: '1200px', margin: '-2.5rem auto 0', position: 'relative', zIndex: 10 }}>
                <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2.5fr', gap: '1.5rem' }}>
                    
                    {/* Left Column: Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ color: '#1e293b', marginBottom: '1.25rem', fontSize: '1.15rem', fontWeight: 700 }}>Management</h3>
                            
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                <button onClick={() => {
                                    setShowForm(!showForm);
                                    if(!showForm) {
                                        setShowUserMgmt(false);
                                        setShowReport(false);
                                        setEditEventId(null);
                                        setTitle(''); setDescription(''); setDate(''); setLocation(''); setImageUrl(''); setCapacity('');
                                    }
                                }} style={{ padding: '0.85rem 1rem', background: showForm ? '#f8fafc' : 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)', color: showForm ? '#64748b' : '#4338ca', border: showForm ? '1px solid #cbd5e1' : 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', transition: 'all 0.2s', boxShadow: showForm ? 'none' : '0 4px 6px -1px rgba(79, 70, 229, 0.1)' }}>
                                    <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>{showForm ? '❌' : '✨'}</span>
                                    {showForm ? 'Cancel' : 'Create New Event'}
                                </button>
                                <button style={{ padding: '0.85rem 1rem', background: showUserMgmt ? '#e0e7ff' : '#f8fafc', color: showUserMgmt ? '#4338ca' : '#475569', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center' }} onClick={toggleUserMgmt}>
                                    <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>👥</span> Manage Users
                                </button>
                                <button onClick={() => {
                                    setShowReport(!showReport);
                                    if(!showReport) {
                                        setShowForm(false);
                                        setShowUserMgmt(false);
                                    }
                                }} style={{ padding: '0.85rem 1rem', background: showReport ? '#e0e7ff' : '#f8fafc', color: showReport ? '#4338ca' : '#475569', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>📊</span> Reports
                                </button>
                            </div>
                        </div>

                        {showForm && (
                            <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e0e7ff' }}>
                                <h3 style={{ color: '#1e293b', marginBottom: '1.25rem', fontSize: '1.1rem' }}>{editEventId ? 'Edit Event' : 'Event Details'}</h3>
                                <form onSubmit={handleSubmitEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label className="form-label">Event Title</label>
                                        <input type="text" placeholder="e.g. CodeFest 2026" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="form-label">Description</label>
                                        <textarea placeholder="Describe the event..." className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ minHeight: '80px' }}></textarea>
                                    </div>
                                    <div>
                                        <label className="form-label">Image URL</label>
                                        <input type="text" placeholder="https://unsplash.com/..." className="input-field" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div>
                                            <label className="form-label">Date</label>
                                            <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="form-label">Location</label>
                                            <input type="text" placeholder="Auditorium" className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                                        <div>
                                            <label className="form-label">Type</label>
                                            <select className="input-field" value={type} onChange={(e) => setType(e.target.value)} style={{ backgroundColor: 'white' }}>
                                                <option>Workshop</option>
                                                <option>Hackathon</option>
                                                <option>Seminar</option>
                                                <option>Cultural</option>
                                                <option>Competition</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label">Capacity</label>
                                            <input type="number" placeholder="100" className="input-field" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.85rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s' }}>
                                        {loading ? 'Processing...' : (editEventId ? 'Update Event' : 'Publish Event')}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Data Table */}
                    {showUserMgmt ? (
                        <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            {!adminVerified ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Enter Admin Password</h3>
                                    <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>You must verify your identity to view sensitive user data.</p>
                                    <form onSubmit={handleVerifyAdmin} style={{ maxWidth: '300px', margin: '0 auto' }}>
                                        <input type="password" value={adminPassInput} onChange={(e) => setAdminPassInput(e.target.value)} placeholder="Your Admin Password" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem', outline: 'none' }} required />
                                        {passError && <div style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>{passError}</div>}
                                        <button type="submit" disabled={passLoading} style={{ width: '100%', padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                            {passLoading ? 'Verifying...' : 'Unlock User Data'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <h3 style={{ color: '#1e293b', marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Registered Users
                                        <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 700 }}>{usersList.length}</span>
                                    </h3>
                                    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                                            <thead>
                                                <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Name</th>
                                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Identifier</th>
                                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Role</th>
                                                    <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Joined</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usersList.map((usr, i) => (
                                                    <tr key={usr._id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fcfcfd' }}>
                                                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{usr.name}</td>
                                                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{usr.email || usr.mobile || 'N/A'}</td>
                                                        <td style={{ padding: '0.75rem 1rem' }}>
                                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', background: usr.role === 'admin' ? '#fee2e2' : '#e0f2fe', color: usr.role === 'admin' ? '#ef4444' : '#0284c7' }}>
                                                                {usr.role.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{new Date(usr.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            {!showReport && (
                                <>
                                    <h3 style={{ color: '#1e293b', marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        All Broadcasted Events
                                        <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 700 }}>{events.length}</span>
                                    </h3>
                                    
                                    {events.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                                            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📂</span>
                                            No events found.
                                        </div>
                                    ) : (
                                        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                                                <thead>
                                                    <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Title</th>
                                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Date</th>
                                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Type</th>
                                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {events.map((event, index) => (
                                                        <tr key={event._id} style={{ borderTop: '1px solid #f1f5f9', background: index % 2 === 0 ? 'white' : '#fcfcfd', transition: 'background 0.2s', fontSize: '0.9rem' }}>
                                                            <td style={{ padding: '0.75rem 1rem', color: '#0f172a', fontWeight: 600 }}>
                                                                {event.title}
                                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>{event.location}</div>
                                                            </td>
                                                            <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</td>
                                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, 
                                                                    background: event.type === 'Hackathon' ? '#e0f2fe' : event.type === 'Workshop' ? '#dcfce7' : '#f3e8ff',
                                                                    color: event.type === 'Hackathon' ? '#0284c7' : event.type === 'Workshop' ? '#16a34a' : '#9333ea',
                                                                    textTransform: 'uppercase'
                                                                }}>
                                                                    {event.type}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                                                <button onClick={() => handleEditClick(event)} style={{ background: 'transparent', color: '#4f46e5', border: '1px solid transparent', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', marginRight: '0.5rem' }} onMouseEnter={(e)=>e.target.style.background='#e0e7ff'} onMouseLeave={(e)=>e.target.style.background='transparent'}>
                                                                    Edit
                                                                </button>
                                                                <button onClick={() => handleDelete(event._id)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid transparent', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.target.style.background='#fee2e2'} onMouseLeave={(e)=>e.target.style.background='transparent'}>
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {/* Reports Section */}
                            {showReport && (
                                <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
                                    <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '16px', border: '1px solid #cbd5e1', marginBottom: '1.5rem' }}>
                                        <h3 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}><span style={{marginRight: '0.5rem'}}>📈</span> Quick Overview</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div style={{ background: 'white', padding: '1rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4f46e5' }}>{events.length}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Events</div>
                                            </div>
                                            <div style={{ background: 'white', padding: '1rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                                                    {events.reduce((acc, ev) => acc + (ev.registeredStudents?.length || 0), 0)}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Registrations</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Breakdown */}
                                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                        <h3 style={{ color: '#1e293b', marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 700 }}>Individual Event Participation</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {events.map(event => {
                                                const regCount = event.registeredStudents?.length || 0;
                                                const cap = event.capacity || 100;
                                                const percent = Math.min(Math.round((regCount / cap) * 100), 100);
                                                const isFull = regCount >= cap;

                                                return (
                                                    <div key={event._id} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                            <div>
                                                                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{event.title}</div>
                                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{event.type} • {new Date(event.date).toLocaleDateString()}</div>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isFull ? '#ef4444' : '#4f46e5' }}>
                                                                    {regCount} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>/ {cap}</span>
                                                                </div>
                                                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isFull ? '#ef4444' : '#10b981' }}>
                                                                    {isFull ? '🔥 FULL' : `${percent}% FILLED`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Progress Bar */}
                                                        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                            <div style={{ 
                                                                width: `${percent}%`, 
                                                                height: '100%', 
                                                                background: isFull ? '#ef4444' : 'linear-gradient(90deg, #4f46e5, #10b981)',
                                                                borderRadius: '10px',
                                                                transition: 'width 1s ease-in-out'
                                                            }}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
