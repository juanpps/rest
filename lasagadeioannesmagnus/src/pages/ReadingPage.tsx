import * as React from 'react';
import { ArrowLeft, MoreVertical, Share2, PenLine, Download, Trash2, Calendar, Music, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Cronica } from '../types';
import { ENTRY_TYPE_LABELS } from '../types';

interface ReadingPageProps {
    cronica: Cronica;
    onBack: () => void;
    onEdit: (cronica: Cronica) => void;
    onDelete: (id: number) => void;
    onExportPDF: (cronica: Cronica) => void;
    onShareQuote: (cronica: Cronica) => void;
}

export const ReadingPage: React.FC<ReadingPageProps> = ({
    cronica,
    onBack,
    onEdit,
    onDelete,
    onExportPDF,
    onShareQuote
}) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const [isImageZoomed, setIsImageZoomed] = React.useState(false);

    const typeLabel = ENTRY_TYPE_LABELS[cronica.type] || 'Crónica';

    const coverUrl = React.useMemo(() => {
        if (!cronica.coverImage) return null;
        if (typeof cronica.coverImage === 'string') return cronica.coverImage;
        return URL.createObjectURL(cronica.coverImage);
    }, [cronica.coverImage]);

    const audioUrl = React.useMemo(() => {
        if (!cronica.audioFile) return null;
        if (typeof cronica.audioFile === 'string') return cronica.audioFile;
        return URL.createObjectURL(cronica.audioFile);
    }, [cronica.audioFile]);

    React.useEffect(() => {
        return () => {
            if (coverUrl && typeof cronica.coverImage !== 'string') URL.revokeObjectURL(coverUrl);
            if (audioUrl && typeof cronica.audioFile !== 'string') URL.revokeObjectURL(audioUrl);
        };
    }, [coverUrl, audioUrl, cronica.coverImage, cronica.audioFile]);

    const menuOptions = [
        { label: 'Editar', icon: <PenLine size={16} />, onClick: () => { onEdit(cronica); setShowMenu(false); } },
        { label: 'Compartir Cita', icon: <Share2 size={16} />, onClick: () => { onShareQuote(cronica); setShowMenu(false); } },
        { label: 'Exportar PDF', icon: <Download size={16} />, onClick: () => { onExportPDF(cronica); setShowMenu(false); } },
        { label: 'Eliminar', icon: <Trash2 size={16} />, onClick: () => { if (cronica.id) onDelete(cronica.id); setShowMenu(false); }, danger: true },
    ];

    return (
        <div className="fade-in">
            {/* Top Navigation */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'var(--bg-primary)',
                padding: '12px 0',
                margin: '-12px 0 12px 0',
            }}>
                <button onClick={onBack} className="btn-ghost" style={{ padding: 10 }}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="btn-ghost"
                        style={{ padding: 10 }}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                onClick={() => setShowMenu(false)}
                                style={{ position: 'fixed', inset: 0, zIndex: 100 }}
                            />
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: 8,
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                width: 200,
                                zIndex: 101,
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                            }}>
                                {menuOptions.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={opt.onClick}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: '12px 16px',
                                            background: 'none',
                                            border: 'none',
                                            color: opt.danger ? '#ef4444' : 'var(--text-primary)',
                                            fontSize: 14,
                                            fontWeight: 500,
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            borderBottom: i < menuOptions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                        }}
                                    >
                                        {opt.icon}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <span className="type-badge">{typeLabel}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} color="var(--text-muted)" />
                        <span className="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            {format(cronica.createdAt, "d 'de' MMMM, yyyy", { locale: es })}
                        </span>
                    </div>
                </div>

                <h1 className="title-hero" style={{ fontSize: 32, marginBottom: 8 }}>{cronica.title}</h1>
                {cronica.subtitle && (
                    <p className="subtitle" style={{ fontSize: 18, marginBottom: 0 }}>{cronica.subtitle}</p>
                )}
            </div>

            {/* Ornamental Separator */}
            <div className="ornament">✦ ✦ ✦</div>

            {/* Cover Image */}
            {coverUrl && (
                <div
                    onClick={() => setIsImageZoomed(true)}
                    style={{
                        width: 'calc(100% + 40px)',
                        margin: '0 -20px 32px',
                        overflow: 'hidden',
                        cursor: 'zoom-in',
                        position: 'relative'
                    }}
                >
                    <img
                        src={coverUrl}
                        alt={cronica.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 70%, var(--bg-main))',
                        pointerEvents: 'none'
                    }} />
                </div>
            )}

            {/* Lightbox Overlay */}
            {isImageZoomed && coverUrl && (
                <div
                    className="fade-in lightbox-overlay"
                    onClick={() => setIsImageZoomed(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 2000,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        cursor: 'zoom-out'
                    }}
                >
                    <img
                        src={coverUrl}
                        alt="Zoomed view"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            borderRadius: 4
                        }}
                    />
                    <button
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>
            )}

            {/* Audio Player if exists */}
            {audioUrl && (
                <div className="card" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'var(--accent-red)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Music size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>Audio de la saga</div>
                        <audio controls src={audioUrl} style={{ width: '100%', height: 32, marginTop: 8 }} />
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: cronica.content }}
                style={{ marginBottom: 48 }}
            />

            {/* Ornamental Separator */}
            <div className="ornament" style={{ marginBottom: 48 }}>✦ ✦ ✦</div>

            {/* Tags */}
            {cronica.tags && cronica.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48 }}>
                    {cronica.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            )}

            {/* Footer Branding */}
            <div style={{
                textAlign: 'center',
                padding: '40px 0',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)'
            }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: '0.1em', marginBottom: 4 }}>
                    — Ioannes Magnus —
                </div>
                <div className="caption">La Saga • Fin del Escrito</div>
            </div>
        </div >
    );
};
