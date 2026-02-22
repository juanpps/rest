import * as React from 'react';
import { toPng } from 'html-to-image';
import { Download, X } from 'lucide-react';

interface QuoteGeneratorProps {
    quote: string;
    author: string;
    onClose: () => void;
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ quote, author, onClose }) => {
    const quoteRef = React.useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!quoteRef.current) return;
        try {
            const dataUrl = await toPng(quoteRef.current, { pixelRatio: 3 });
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `ioannes_quote_${Date.now()}.png`;
            a.click();
        } catch (err) {
            console.error('Failed to export quote', err);
        }
    };

    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 className="section-title" style={{ marginBottom: 0 }}>Compartir Cita</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            {/* Quote Card Preview */}
            <div
                ref={quoteRef}
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #151210, #0a0908)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(176, 141, 87, 0.2)',
                    padding: '40px 24px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* Decorative dash */}
                <div style={{ width: 40, height: 2, background: 'var(--accent-gold)', margin: '0 auto 24px', borderRadius: 1 }} />

                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    color: '#e8e6e0',
                    marginBottom: 24,
                }}>
                    "{quote}"
                </p>

                <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#b08d57',
                }}>
                    — {author}
                </div>

                {/* Bottom accent line */}
                <div style={{ width: 40, height: 2, background: 'var(--accent-gold)', margin: '24px auto 0', borderRadius: 1 }} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>
                    Cerrar
                </button>
                <button onClick={handleDownload} className="btn-primary" style={{ flex: 1 }}>
                    <Download size={16} /> Descargar
                </button>
            </div>
        </div>
    );
};
