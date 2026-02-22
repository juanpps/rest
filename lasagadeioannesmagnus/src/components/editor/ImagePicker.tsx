import * as React from 'react';
import { ImagePlus, X } from 'lucide-react';

interface ImagePickerProps {
    label?: string;
    value?: Blob | string | null;
    onChange: (value: Blob | null) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ value, onChange }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const imageUrl = React.useMemo(() => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return URL.createObjectURL(value);
    }, [value]);

    React.useEffect(() => {
        return () => {
            if (imageUrl && typeof value !== 'string') URL.revokeObjectURL(imageUrl);
        };
    }, [imageUrl, value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onChange(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div>
            <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                    width: '100%',
                    borderRadius: 'var(--radius-md)',
                    border: imageUrl ? 'none' : '2px dashed var(--border-subtle)',
                    background: imageUrl ? 'var(--bg-card)' : 'rgba(212, 163, 115, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: imageUrl ? 'auto' : 160,
                    transition: 'all 0.3s ease',
                    boxShadow: imageUrl ? 'var(--shadow-md)' : 'none',
                }}
                onMouseEnter={(e) => { if (!imageUrl) e.currentTarget.style.borderColor = 'var(--accent-gold)'; }}
                onMouseLeave={(e) => { if (!imageUrl) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Preview"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 400,
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.5s ease',
                        }}
                    />
                ) : (
                    <>
                        <div style={{
                            padding: 20,
                            borderRadius: '50%',
                            background: 'rgba(212, 163, 115, 0.1)',
                            marginBottom: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ImagePlus size={28} color="var(--accent-gold)" />
                        </div>
                        <span className="caption" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Cargar imagen de portada</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.05em' }}>FORMATO RECOMENDADO: 16:9</span>
                    </>
                )}

                {imageUrl && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '12px',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        opacity: 1,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onChange(null); }}
                            className="btn-ghost"
                            style={{
                                background: 'rgba(220, 38, 38, 0.8)',
                                color: 'white',
                                padding: '6px 12px',
                                fontSize: 12,
                                height: 'auto',
                                borderRadius: 4,
                                border: 'none'
                            }}
                        >
                            <X size={14} /> Eliminar
                        </button>
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
};
