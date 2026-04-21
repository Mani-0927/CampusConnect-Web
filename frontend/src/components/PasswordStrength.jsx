import React from 'react';

const PasswordStrength = ({ password }) => {
    const checks = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains a number', met: /\d/.test(password) },
        { label: 'Contains a special character', met: /[^A-Za-z0-9]/.test(password) },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    ];

    const strength = checks.filter(c => c.met).length;
    
    const getBarColor = () => {
        if (strength === 0) return '#475569';
        if (strength <= 1) return '#ef4444'; // Red
        if (strength <= 3) return '#f59e0b'; // Orange
        return '#10b981'; // Green
    };

    return (
        <div style={{ marginTop: '1rem', animation: 'fadeIn 0.3s' }}>
            {/* Progress Bar Container */}
            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ 
                    height: '100%', 
                    width: `${(strength / checks.length) * 100}%`, 
                    background: getBarColor(),
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: strength > 0 ? `0 0 10px ${getBarColor()}66` : 'none'
                }}></div>
            </div>

            {/* Criteria List */}
            <div style={{ display: 'grid', gap: '0.5rem' }}>
                {checks.map((check, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', transition: 'all 0.3s' }}>
                        <span style={{ 
                            width: '14px', 
                            height: '14px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginRight: '0.75rem',
                            fontSize: '10px',
                            background: check.met ? '#10b981' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: check.met ? 'none' : '1px solid rgba(255,255,255,0.2)'
                        }}>
                            {check.met ? '✓' : ''}
                        </span>
                        <span style={{ 
                            fontSize: '0.85rem', 
                            color: check.met ? '#f8fafc' : '#94a3b8',
                            fontWeight: check.met ? '600' : '400'
                        }}>
                            {check.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrength;
