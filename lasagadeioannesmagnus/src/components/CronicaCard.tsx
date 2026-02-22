import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronRight, Calendar, BookOpen } from 'lucide-react';
import type { Cronica } from '../types';
import { ENTRY_TYPE_LABELS } from '../types';

interface CronicaCardProps {
    cronica: Cronica;
    onClick: (cronica: Cronica) => void;
}

export const CronicaCard: React.FC<CronicaCardProps> = ({ cronica, onClick }) => {
    const preview = cronica.content.replace(/<[^>]*>?/gm, '').substring(0, 120);

    const imageUrl = React.useMemo(() => {
        if (!cronica.coverImage) return null;
        if (typeof cronica.coverImage === 'string') return cronica.coverImage;
        return URL.createObjectURL(cronica.coverImage);
    }, [cronica.coverImage]);

    React.useEffect(() => {
        return () => {
            if (imageUrl && typeof cronica.coverImage !== 'string') URL.revokeObjectURL(imageUrl);
        };
    }, [imageUrl, cronica.coverImage]);

    const typeLabel = ENTRY_TYPE_LABELS[cronica.type] || 'Crónica';

    return (
        <div className="card" onClick={() => onClick(cronica)} style={{ cursor: 'pointer', padding: 0, display: 'flex', gap: 16, alignItems: 'center', position: 'relative' }}>
            {/* Cover Image (adaptive) */}
            {imageUrl ? (
                <div style={{
                    flexShrink: 0,
                    width: 90,
                    height: 90,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-elevated)',
                    position: 'relative'
                }}>
                    <img
                        src={imageUrl}
                        alt=""
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)'
                    }} />
                </div>
            ) : (
                <div style={{
                    flexShrink: 0,
                    width: 90,
                    height: 90,
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                }}>
                    <BookOpen size={28} color="var(--text-muted)" style={{ opacity: 0.25 }} />
                </div>
            )}

            {/* Content */}
            <div style={{ padding: '16px 20px 16px 0', flex: 1 }}>
                {/* Type badge + date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="type-badge" style={{ fontSize: 10 }}>{typeLabel}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={10} color="var(--text-muted)" />
                        <span className="caption" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            {format(cronica.createdAt, "d MMM yyyy", { locale: es })}
                        </span>
                    </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Cinzel', serif", marginBottom: 4, lineHeight: 1.2, color: 'var(--text-main)' }}>
                    {cronica.title}
                </h3>

                {cronica.subtitle && (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', marginBottom: 4, lineHeight: 1.2 }}>
                        {cronica.subtitle}
                    </p>
                )}

                {preview && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                        {preview}...
                    </p>
                )}
            </div>

            {/* Chevron */}
            <div style={{ position: 'absolute', bottom: 12, right: 12, opacity: 0.3 }}>
                <ChevronRight size={14} />
            </div>
        </div>
    );
};
