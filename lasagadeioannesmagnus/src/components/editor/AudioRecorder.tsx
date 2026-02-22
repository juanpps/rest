import * as React from 'react';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';

interface AudioRecorderProps {
    onRecorded: (blob: Blob) => void;
    onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecorded, onCancel }) => {
    const [state, setState] = React.useState<'idle' | 'recording' | 'recorded'>('idle');
    const [duration, setDuration] = React.useState(0);
    const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);

    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const chunksRef = React.useRef<Blob[]>([]);
    const timerRef = React.useRef<number | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const blobRef = React.useRef<Blob | null>(null);

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                blobRef.current = blob;
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setState('recorded');
                stream.getTracks().forEach(t => t.stop());
            };

            mediaRecorder.start(1000); // 1s timeslice to ensure data chunks are emitted regularly
            setState('recording');
            setDuration(0);
            timerRef.current = window.setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);
        } catch (err) {
            console.error('Microphone access denied', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && state === 'recording') {
            mediaRecorderRef.current.stop();
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const togglePlayback = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const reRecord = () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        blobRef.current = null;
        setDuration(0);
        setState('idle');
    };

    const confirmRecording = () => {
        if (blobRef.current) {
            onRecorded(blobRef.current);
        }
    };

    return (
        <div style={{ padding: '16px 0' }}>
            {state === 'idle' && (
                <button
                    onClick={startRecording}
                    style={{
                        width: '100%',
                        padding: '20px 0',
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
                    <Mic size={24} color="var(--accent-red)" />
                    <span className="caption" style={{ fontWeight: 600 }}>Tocar para grabar</span>
                </button>
            )}

            {state === 'recording' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                }}>
                    <div className="recording-dot" />
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, fontFamily: "'Cinzel', serif" }}>
                        {formatTime(duration)}
                    </span>
                    <button
                        onClick={stopRecording}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#dc2626',
                            border: 'none',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <Square size={16} fill="white" />
                    </button>
                </div>
            )}

            {state === 'recorded' && (
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: 12,
                    }}>
                        <button
                            onClick={togglePlayback}
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
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>Grabación</div>
                            <div className="caption">{formatTime(duration)}</div>
                        </div>
                        <button onClick={reRecord} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <RotateCcw size={18} />
                        </button>
                        {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} />}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={onCancel} className="btn-ghost" style={{ flex: 1 }}>Cancelar</button>
                        <button onClick={confirmRecording} className="btn-primary" style={{ flex: 1 }}>Usar grabación</button>
                    </div>
                </div>
            )}
        </div>
    );
};
