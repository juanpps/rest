import * as React from 'react';
import { X, FileText, Lightbulb, MessageSquare, Camera, Mic, ScrollText } from 'lucide-react';
import type { EntryType } from '../../types';

interface AddActionOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectType: (type: EntryType, extra?: 'image' | 'audio') => void;
}

export const AddActionOverlay: React.FC<AddActionOverlayProps> = ({ isOpen, onClose, onSelectType }) => {
    if (!isOpen) return null;

    const items: { type: EntryType; label: string; icon: React.ReactNode; desc: string }[] = [
        { type: 'cronica', label: 'Crónica', icon: <ScrollText size={24} />, desc: 'Relato detallado de los hechos' },
        { type: 'articulo', label: 'Artículo', icon: <FileText size={24} />, desc: 'Análisis y exposición profunda' },
        { type: 'idea', label: 'Idea', icon: <Lightbulb size={24} />, desc: 'Destello de inspiración fugaz' },
        { type: 'pensamiento', label: 'Pensamiento', icon: <MessageSquare size={24} />, desc: 'Reflexión o sentencia breve' },
    ];

    return (
        <div
            className="fade-in"
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(10, 9, 8, 0.95)',
                backdropFilter: 'blur(10px)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                paddingTop: '80px',
            }}
        >
            <button
                onClick={onClose}
                className="btn-ghost"
                style={{ position: 'absolute', top: 20, right: 20, padding: 12 }}
            >
                <X size={28} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h2 className="title-hero" style={{ fontSize: 24, marginBottom: 8 }}>¿Qué deseas legar?</h2>
                <p className="caption">Elige el formato de tu entrada en los anales</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
                {items.map((item) => (
                    <button
                        key={item.type}
                        onClick={() => onSelectType(item.type)}
                        className="card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '24px 16px',
                            gap: 12,
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ color: 'var(--accent-gold)' }}>{item.icon}</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Cinzel', serif" }}>{item.label}</div>
                            <div className="caption" style={{ fontSize: 11 }}>{item.desc}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 24 }}>
                <p className="caption" style={{ textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Atajos Rápidos</p>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        onClick={() => onSelectType('cronica', 'image')}
                        className="btn-ghost"
                        style={{ flex: 1, flexDirection: 'column', gap: 8, height: 'auto', padding: '16px 0', background: 'var(--bg-elevated)' }}
                    >
                        <Camera size={20} color="var(--accent-gold)" />
                        <span style={{ fontSize: 12 }}>Captura Foto</span>
                    </button>
                    <button
                        onClick={() => onSelectType('cronica', 'audio')}
                        className="btn-ghost"
                        style={{ flex: 1, flexDirection: 'column', gap: 8, height: 'auto', padding: '16px 0', background: 'var(--bg-elevated)' }}
                    >
                        <Mic size={20} color="var(--accent-gold)" />
                        <span style={{ fontSize: 12 }}>Grabar Voz</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
