import { useState } from 'react';

export default function Alerts() {
    const [alerts] = useState([
        { id: 1, title: 'Tuition Payment Due', date: '2026-05-15', severity: 'medium', message: 'Your next credit builder tuition payment is coming up.' },
        { id: 2, title: 'Score Update Available', date: '2026-05-10', severity: 'low', message: 'Your monthly snapshot is ready for review.' },
        { id: 3, title: 'Orientation Complete', date: '2026-05-01', severity: 'low', message: 'Welcome to Credit U! You have unlocked your student ID.' }
    ]);

    return (
        <div id="view-alerts" style={{ maxWidth: '800px' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Campus Alerts</h3>

            <div className="alerts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {alerts.map(alert => (
                    <div key={alert.id} className="alert-card"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start'
                        }}>
                        <div className="alert-icon" style={{
                            fontSize: '1.5rem',
                            color: alert.severity === 'high' ? '#f44336' : (alert.severity === 'medium' ? '#ff9800' : '#4caf50')
                        }}>
                            {alert.severity === 'high' ? '⚠️' : (alert.severity === 'medium' ? '📅' : 'ℹ️')}
                        </div>
                        <div className="alert-content">
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{alert.title}</h4>
                            <p style={{ margin: '0 0 0.5rem 0', color: '#aaa', fontSize: '0.95rem' }}>{alert.message}</p>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>{alert.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
