import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(identifier, password);
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
                    <h2>Welcome Back</h2>
                    <p>Login to access your dashboard</p>
                </div>
                {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email or Mobile Number</label>
                        <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="form-control" placeholder="student@gla.ac.in or 9876543210" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="form-control" 
                                placeholder="••••••••" 
                                required 
                            />
                            <button 
                                type="button" 
                                className="eye-icon-btn" 
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? '👁️' : '🔒'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn-block">Sign In</button>
                </form>
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                    <p style={{marginTop: '1rem'}}><Link to="/">← Back to Home</Link></p>
                </div>
            </div>
        </div>
    );
}
