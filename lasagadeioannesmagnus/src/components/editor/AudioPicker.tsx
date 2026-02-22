import * as React from 'react';
import { Mic, X, Play, Pause, Upload } from 'lucide-react';
import { AudioRecorder } from './AudioRecorder';

interface AudioPickerProps {
    value?: Blob | string | null;
    onChange: (value: Blob | null) => void;
}

export const AudioPicker: React.FC<AudioPickerProps> = ({ value, onChange }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [mode, setMode] = React.useState<'choose' | 'record' | 'upload' | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const audioUrl = React.useMemo(() => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return URL.createObjectURL(value);
    }, [value]);

    React.useEffect(() => {
        return () => {
            if (audioUrl && typeof value !== 'string') URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl, value]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            setMode(null);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Already has audio
    if (audioUrl) {
        return (
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            onClick={togglePlay}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'var(--accent-red)',
                                border: 'none',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 2 }} />}
                        </button>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Audio adjunto</div>
                            <div className="caption">Toca para reproducir</div>
                        </div>
                        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} />
                    </div>
                    <button
                        onClick={() => onChange(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                    >
                        <X size={18} />
                    </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" style={{ display: 'none' }} />
            </div>
        );
    }

    // Recording mode
    if (mode === 'record') {
        return (
            <AudioRecorder
                onRecorded={(blob) => {
                    onChange(blob);
                    setMode(null);
                }}
                onCancel={() => setMode(null)}
            />
        );
    }

    // Choose mode: two options
    return (
        <div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    onClick={() => setMode('record')}
                    style={{
                        flex: 1,
                        padding: '16px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        border: '1px dashed var(--border-subtle)',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                    }}
                >
                    <Mic size={20} color="var(--accent-red)" />
                    <span className="caption" style={{ fontWeight: 600 }}>Grabar</span>
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        flex: 1,
                        padding: '16px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        border: '1px dashed var(--border-subtle)',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                    }}
                >
                    <Upload size={20} color="var(--accent-gold)" />
                    <span className="caption" style={{ fontWeight: 600 }}>Subir</span>
                </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" style={{ display: 'none' }} />
        </div>
    );
};
