import * as React from 'react';

interface PINLockProps {
    onUnlock: () => void;
}

export const PINLock: React.FC<PINLockProps> = ({ onUnlock }) => {
    const [pin, setPin] = React.useState('');
    const [error, setError] = React.useState(false);

    const storedPin = localStorage.getItem('im_pin') || '1234';
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

    const handleKey = (key: string) => {
        if (key === '⌫') {
            setPin(p => p.slice(0, -1));
            setError(false);
        } else if (key && pin.length < 4) {
            const newPin = pin + key;
            setPin(newPin);

            if (newPin.length === 4) {
                if (newPin === storedPin) {
                    setTimeout(onUnlock, 200);
                } else {
                    setError(true);
                    setTimeout(() => { setPin(''); setError(false); }, 600);
                }
            }
        }
    };

    return (
        <div className="app" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '0 20px',
        }}>
            {/* Logo / title */}
            <h1 className="title-hero" style={{ fontSize: 28, marginBottom: 4, textAlign: 'center', lineHeight: 1.2 }}>
                La Saga de Ioannes Magnus
            </h1>
            <p className="subtitle" style={{ marginBottom: 48, textAlign: 'center' }}>
                Imperio Interior
            </p>

            {/* PIN dots */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: pin.length > i
                            ? (error ? '#dc2626' : 'var(--accent-gold)')
                            : 'var(--bg-elevated)',
                        border: `2px solid ${error ? '#dc2626' : pin.length > i ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                        transition: 'all 0.2s ease',
                        transform: error ? 'translateX(2px)' : 'none',
                    }} />
                ))}
            </div>

            {/* Keypad */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 72px)',
                gap: 12,
                justifyContent: 'center',
            }}>
                {keys.map((key, index) => (
                    <button
                        key={index}
                        onClick={() => handleKey(key)}
                        disabled={!key}
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: key ? 'var(--bg-elevated)' : 'transparent',
                            border: key ? '1px solid var(--border-subtle)' : 'none',
                            color: 'var(--text-primary)',
                            fontSize: key === '⌫' ? 20 : 24,
                            fontFamily: "'Cinzel', serif",
                            fontWeight: 600,
                            cursor: key ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.1s ease',
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>
        </div>
    );
};
