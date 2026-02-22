import * as React from 'react';
import { toPng } from 'html-to-image';
import { Download, X } from 'lucide-react';
import type { Cronica } from '../../types';

interface QuoteImageGeneratorProps {
    cronica: Cronica;
    onClose: () => void;
}

type StyleID = 'pergamino' | 'dark' | 'paper' | 'minimal';

export const QuoteImageGenerator: React.FC<QuoteImageGeneratorProps> = ({ cronica, onClose }) => {
    const [selectedText, setSelectedText] = React.useState(cronica.subtitle || '');
    const [style, setStyle] = React.useState<StyleID>('pergamino');
    const [isExporting, setIsExporting] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    // Initial setup: use selection if user selected something in reading view, 
    // but for now we'll just allow them to edit the text area.
    React.useEffect(() => {
        const selection = window.getSelection()?.toString();
        if (selection && selection.length > 5) {
            setSelectedText(selection);
        }
    }, []);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);
        try {
            // High quality export
            const dataUrl = await toPng(cardRef.current, {
                pixelRatio: 3,
                style: { transform: 'scale(1)', transformOrigin: 'top left' }
            });
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `SagaQuote_${Date.now()}.png`;
            a.click();
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setIsExporting(false);
        }
    };

    const styles: Record<StyleID, { name: string, card: React.CSSProperties, text: React.CSSProperties, accent: string, label: string }> = {
        pergamino: {
            name: 'Pergamino',
            card: { background: '#f1e8d8', border: '1px solid #d4c5a9', color: '#1c1c1c' },
            text: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic' },
            accent: '#7a1c1c',
            label: '#b08d57'
        },
        dark: {
            name: 'Oscuro Elegante',
            card: { background: 'linear-gradient(135deg, #151210, #0a0908)', border: '1px solid rgba(176, 141, 87, 0.3)', color: '#e8e6e0' },
            text: { fontFamily: "'Playfair Display', serif" },
            accent: '#b08d57',
            label: '#b08d57'
        },
        paper: {
            name: 'Textura Papel',
            card: { background: '#ebe4d3', border: '1px solid #c9bda3', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)', color: '#2d2d2d' },
            text: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic' },
            accent: '#5a4632',
            label: '#8d7b68'
        },
        minimal: {
            name: 'Minimalista',
            card: { background: '#000000', border: '1px solid #333', color: '#ffffff' },
            text: { fontFamily: "'Playfair Display', serif" },
            accent: '#ffffff',
            label: '#666'
        }
    };

    const currentStyle = styles[style];

    return (
        <div className="fade-in" style={{ paddingBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 className="section-title" style={{ marginBottom: 0 }}>Convertir en Cita</h3>
                <button onClick={onClose} className="btn-ghost" style={{ padding: 8 }}><X size={20} /></button>
            </div>

            {/* Text Input Area */}
            <div className="card" style={{ marginBottom: 24, padding: 12 }}>
                <label className="caption" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Texto de la Cita</label>
                <textarea
                    value={selectedText}
                    onChange={(e) => setSelectedText(e.target.value)}
                    placeholder="Escribe el párrafo que deseas convertir..."
                    style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 16,
                        minHeight: 100,
                        outline: 'none',
                        resize: 'none'
                    }}
                />
            </div>

            {/* Style Selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
                {(Object.keys(styles) as StyleID[]).map(s => (
                    <button
                        key={s}
                        onClick={() => setStyle(s)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: 'var(--radius-md)',
                            background: style === s ? 'var(--bg-elevated)' : 'transparent',
                            border: `1px solid ${style === s ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                            color: style === s ? 'var(--accent-gold)' : 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: "'Cinzel', serif"
                        }}
                    >
                        {styles[s].name}
                    </button>
                ))}
            </div>

            {/* Preview Card */}
            <div style={{ marginBottom: 32, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                <div
                    ref={cardRef}
                    style={{
                        width: 400, // Fixed width for consistent export aspect ratio
                        padding: '60px 48px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        boxSizing: 'border-box',
                        ...currentStyle.card
                    }}
                >
                    {/* Top Decorative Line */}
                    <div style={{ width: 60, height: 1, background: currentStyle.accent, marginBottom: 40, opacity: 0.8 }} />

                    {/* Quote Text */}
                    <p style={{
                        fontSize: 22,
                        lineHeight: 1.6,
                        margin: 0,
                        padding: 0,
                        ...currentStyle.text
                    }}>
                        "{selectedText}"
                    </p>

                    {/* Signature */}
                    <div style={{
                        marginTop: 40,
                        fontFamily: "'Cinzel', serif",
                        fontSize: 12,
                        letterSpacing: '0.12em',
                        fontWeight: 600,
                        color: currentStyle.label,
                        textTransform: 'uppercase'
                    }}>
                        — Ioannes Magnus
                    </div>

                    {/* Bottom Decorative Line */}
                    <div style={{ width: 60, height: 1, background: currentStyle.accent, marginTop: 40, opacity: 0.8 }} />

                    {/* Small ID tag in corner */}
                    <div style={{ position: 'absolute', bottom: 12, right: 12, fontSize: 8, opacity: 0.3, letterSpacing: '0.2em' }}>
                        LA SAGA ARCHIVES
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
                <button
                    onClick={onClose}
                    className="btn-ghost"
                    style={{ flex: 1, height: 48 }}
                >
                    Cancelar
                </button>
                <button
                    onClick={handleDownload}
                    className="btn-primary"
                    disabled={isExporting}
                    style={{ flex: 2, height: 48, gap: 10 }}
                >
                    {isExporting ? (
                        <div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : (
                        <Download size={18} />
                    )}
                    {isExporting ? 'Exportando...' : 'Descargar Imagen'}
                </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
