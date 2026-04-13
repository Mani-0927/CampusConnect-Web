import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            await axios.post('/api/auth/send-otp', { identifier }, config);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await register(name, identifier, password, otp);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="auth-page" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem'}}>
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join CampusConnect today</p>
                </div>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {step === 1 ? (
                    <form onSubmit={handleSendOTP}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label>Email or Mobile Number</label>
                            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} type="text" className="form-control" placeholder="student@gla.ac.in or 9876543210" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder="••••••••" required />
                        </div>
                        <button type="submit" className="btn-block">Send OTP</button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Enter OTP</label>
                            <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" className="form-control" placeholder="6-digit OTP" required />
                            <small style={{display: 'block', marginTop: '0.5rem', color: '#64748b'}}>We've sent a code to your email or mobile (check console if testing).</small>
                        </div>
                        <button type="submit" className="btn-block">Verify & Register</button>
                        <button type="button" onClick={() => setStep(1)} className="btn-block" style={{marginTop: '1rem', background: '#e2e8f0', color: '#1e293b'}}>Back</button>
                    </form>
                )}
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    <p style={{marginTop: '1rem'}}><Link to="/">← Back to Home</Link></p>
                </div>
            </div>
        </div>
    );
}

