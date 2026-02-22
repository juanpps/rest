import * as React from 'react';
import { CronicaEditor } from '../components/editor/CronicaEditor';
import { ImagePicker } from '../components/editor/ImagePicker';
import { AudioPicker } from '../components/editor/AudioPicker';
import { QuoteGenerator } from '../components/export/QuoteGenerator';
import { exportCronicaToPDF } from '../lib/export';
import type { Cronica, EntryType } from '../types';
import { ENTRY_TYPE_LABELS } from '../types';
import { ArrowLeft, Share2, Tag, Download } from 'lucide-react';

interface EditorPageProps {
    cronica: Partial<Cronica>;
    onSave: (cronica: Partial<Cronica>) => void;
    onBack: () => void;
    onDelete?: (id: number) => void;
}

const TYPE_PLACEHOLDERS: Record<EntryType, { title: string; subtitle: string }> = {
    cronica: { title: 'Título de la Crónica', subtitle: 'El hilo de la historia...' },
    articulo: { title: 'Título del Artículo', subtitle: 'La tesis central...' },
    idea: { title: 'Nombre de la Idea', subtitle: 'En pocas palabras...' },
    pensamiento: { title: 'Pensamiento', subtitle: 'Reflexión breve...' },
};

export const EditorPage: React.FC<EditorPageProps> = ({ cronica, onSave, onBack }) => {
    const [title, setTitle] = React.useState(cronica?.title || '');
    const [subtitle, setSubtitle] = React.useState(cronica?.subtitle || '');
    const [content, setContent] = React.useState(cronica?.content || '');
    const [type, setType] = React.useState<EntryType>(cronica?.type || 'cronica');
    const [tags, setTags] = React.useState<string[]>(cronica?.tags || []);
    const [coverImage, setCoverImage] = React.useState<Blob | string | undefined>(cronica?.coverImage || undefined);
    const [audioFile, setAudioFile] = React.useState<Blob | string | undefined>(cronica?.audioFile || undefined);
    const [tagInput, setTagInput] = React.useState('');
    const [isExporting, setIsExporting] = React.useState(false);
    const [showQuoteGenerator, setShowQuoteGenerator] = React.useState(false);

    const placeholders = TYPE_PLACEHOLDERS[type];

    const handleSave = () => {
        onSave({
            ...cronica,
            title,
            subtitle,
            content,
            type,
            tags,
            coverImage,
            audioFile,
            updatedAt: new Date(),
        });
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            await exportCronicaToPDF({
                ...cronica,
                title,
                subtitle,
                content,
                type,
                tags,
                coverImage,
                audioFile,
            } as Cronica);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fade-in">
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <button onClick={onBack} className="btn-ghost" style={{ padding: 10 }}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setShowQuoteGenerator(!showQuoteGenerator)} className="btn-ghost" style={{ padding: 10 }}>
                        <Share2 size={18} />
                    </button>
                    <button onClick={handleSave} className="btn-primary">
                        Guardar
                    </button>
                </div>
            </div>

            {/* Type Selector */}
            <div style={{ marginBottom: 16 }}>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EntryType)}
                    className="select"
                >
                    {(Object.entries(ENTRY_TYPE_LABELS) as [EntryType, string][]).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Title Fields */}
            <div style={{ marginBottom: 24 }}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={placeholders.title}
                    className="input-clean"
                    style={{ fontSize: 26, fontFamily: "'Cinzel', serif", fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}
                />
                <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder={placeholders.subtitle}
                    className="input-clean"
                    style={{ fontSize: 15, color: 'var(--text-secondary)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                />
            </div>

            {/* Editor */}
            <div className="card" style={{ marginBottom: 24, minHeight: 300 }}>
                <CronicaEditor
                    content={content}
                    onChange={setContent}
                />
            </div>

            {/* Multimedia */}
            <div style={{ marginBottom: 24 }}>
                <h3 className="section-title">Multimedia</h3>
                <div className="card" style={{ marginBottom: 16 }}>
                    <label className="caption" style={{ display: 'block', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Portada</label>
                    <ImagePicker
                        label="Seleccionar imagen"
                        value={coverImage}
                        onChange={(val) => setCoverImage(val || undefined)}
                    />
                </div>
                <div className="card">
                    <label className="caption" style={{ display: 'block', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Audio</label>
                    <AudioPicker
                        value={audioFile}
                        onChange={(val) => setAudioFile(val || undefined)}
                    />
                </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 24 }}>
                <h3 className="section-title">Etiquetas</h3>
                <div style={{ position: 'relative', marginBottom: 12 }}>
                    <Tag size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Agregar etiqueta..."
                        className="search"
                        style={{ paddingLeft: 40 }}
                    />
                </div>
                {tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {tags.map(tag => (
                            <span key={tag} className="tag">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Export */}
            <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}
            >
                <Download size={18} /> {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </button>

            {showQuoteGenerator && (
                <QuoteGenerator
                    quote={content.replace(/<[^>]*>?/gm, '').substring(0, 200) || 'El silencio de la saga...'}
                    author={title || 'Escriba Anónimo'}
                    onClose={() => setShowQuoteGenerator(false)}
                />
            )}
        </div>
    );
};
