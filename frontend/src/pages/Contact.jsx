import { Link } from 'react-router-dom';

export default function Contact() {
    return (
        <main>
            <div className="contact-hero mesh-gradient-3"
                style={{padding: '6rem 0 8rem', textAlign: 'center', marginBottom: '-4rem', position: 'relative'}}>
                <div className="container" style={{position: 'relative', zIndex: 2}}>
                    <h1 style={{fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-main)'}}>Get in Touch</h1>
                    <p style={{fontSize: '1.2rem', color: 'var(--text-muted)'}}>Have questions? We'd love to hear from you.</p>
                </div>
            </div>

            <div className="container" style={{paddingBottom: '4rem'}}>
                <div className="auth-container"
                    style={{maxWidth: '900px', margin: '0 auto', background: 'white', color: 'var(--text-dark)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '3rem'}}>

                    {/* Form Side */}
                    <div>
                        <h3 style={{marginBottom: '1.5rem', fontSize: '1.5rem', color: '#1e293b'}}>Send a Message</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label style={{color: '#64748b'}}>Name</label>
                                <input type="text" className="form-control"
                                    style={{background: '#f8fafc', border: '1px solid #e2e8f0', color: '#333'}}
                                    placeholder="Your Name" />
                            </div>
                            <div className="form-group">
                                <label style={{color: '#64748b'}}>Email</label>
                                <input type="email" className="form-control"
                                    style={{background: '#f8fafc', border: '1px solid #e2e8f0', color: '#333'}}
                                    placeholder="your@email.com" />
                            </div>
                            <div className="form-group">
                                <label style={{color: '#64748b'}}>Message</label>
                                <textarea className="form-control" rows="4"
                                    style={{background: '#f8fafc', border: '1px solid #e2e8f0', color: '#333'}}
                                    placeholder="How can we help?"></textarea>
                            </div>
                            <button type="submit" className="btn-block">Send Message</button>
                        </form>
                    </div>

                    {/* Info Side */}
                    <div style={{background: '#f1f5f9', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <div>
                            <h3 style={{marginBottom: '1.5rem', fontSize: '1.5rem', color: '#1e293b'}}>Contact Info</h3>
                            <div style={{marginBottom: '1.5rem'}}>
                                <strong style={{display: 'block', color: '#1e293b', marginBottom: '0.25rem'}}>📍 Address</strong>
                                <p className="text-muted">GLA University, Mathura<br/>Chaumuhan, Uttar Pradesh 281406</p>
                            </div>
                            <div style={{marginBottom: '1.5rem'}}>
                                <strong style={{display: 'block', color: '#1e293b', marginBottom: '0.25rem'}}>📧 Email</strong>
                                <p className="text-muted">campusconnect@gla.ac.in</p>
                            </div>
                            <div>
                                <strong style={{display: 'block', color: '#1e293b', marginBottom: '0.25rem'}}>📞 Phone</strong>
                                <p className="text-muted">+91 123 456 7890</p>
                            </div>
                        </div>

                        <div style={{marginTop: '2rem', height: '200px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'}}>
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
                                style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4}} alt="Map" />
                            <span style={{position: 'absolute', background: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                                View on Google Maps
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

