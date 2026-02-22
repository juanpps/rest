import * as React from 'react';
import { ArrowLeft, User, Lock, Download, Info, Check, BookOpen } from 'lucide-react';
import { db } from '../lib/db';
import { exportMonthlyNewspaper } from '../lib/exportNewspaper';

interface ProfilePageProps {
    onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
    const [authorName, setAuthorName] = React.useState(() =>
        localStorage.getItem('im_author_name') || ''
    );
    const [showPinChange, setShowPinChange] = React.useState(false);
    const [currentPin, setCurrentPin] = React.useState('');
    const [newPin, setNewPin] = React.useState('');
    const [confirmPin, setConfirmPin] = React.useState('');
    const [pinMessage, setPinMessage] = React.useState('');
    const [exportMessage, setExportMessage] = React.useState('');
    const [newspaperMonth, setNewspaperMonth] = React.useState(new Date().getMonth());
    const [newspaperYear, setNewspaperYear] = React.useState(new Date().getFullYear());
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleSaveAuthor = () => {
        localStorage.setItem('im_author_name', authorName);
    };

    const handleChangePin = () => {
        const storedPin = localStorage.getItem('im_pin') || '1234';
        if (currentPin !== storedPin) {
            setPinMessage('PIN actual incorrecto');
            return;
        }
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            setPinMessage('El PIN debe ser de 4 dígitos');
            return;
        }
        if (newPin !== confirmPin) {
            setPinMessage('Los PIN no coinciden');
            return;
        }
        localStorage.setItem('im_pin', newPin);
        setPinMessage('PIN actualizado ✓');
        setShowPinChange(false);
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
        setTimeout(() => setPinMessage(''), 2000);
    };

    const handleExportData = async () => {
        try {
            const cronicas = await db.cronicas.toArray();
            const exportData = cronicas.map(c => ({
                ...c,
                coverImage: c.coverImage instanceof Blob ? '[imagen]' : c.coverImage,
                audioFile: c.audioFile instanceof Blob ? '[audio]' : c.audioFile,
            }));
            const json = JSON.stringify(exportData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ioannes_magnus_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            setExportMessage('Exportado ✓');
            setTimeout(() => setExportMessage(''), 2000);
        } catch (err) {
            setExportMessage('Error al exportar');
        }
    };

    const handleGenerateNewspaper = async () => {
        setIsGenerating(true);
        try {
            const start = new Date(newspaperYear, newspaperMonth, 1);
            const end = new Date(newspaperYear, newspaperMonth + 1, 0, 23, 59, 59);
            const cronicas = await db.cronicas
                .where('createdAt').between(start, end)
                .toArray();

            if (cronicas.length === 0) {
                setExportMessage('No hay escritos en este mes');
                setTimeout(() => setExportMessage(''), 2000);
                return;
            }

            await exportMonthlyNewspaper(newspaperMonth, newspaperYear, cronicas);
            setExportMessage('Periódico generado ✓');
            setTimeout(() => setExportMessage(''), 2000);
        } catch (err) {
            setExportMessage('Error al generar');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <button onClick={onBack} className="btn-ghost" style={{ padding: 10 }}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="title-hero" style={{ marginBottom: 0 }}>Perfil</h1>
            </div>

            {/* Author */}
            <div style={{ marginBottom: 32 }}>
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <User size={18} color="var(--accent-gold)" /> Autor
                </h3>
                <div className="card">
                    <label className="caption" style={{ display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                        Nombre del autor
                    </label>
                    <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        onBlur={handleSaveAuthor}
                        placeholder="Ioannes Magnus"
                        className="search"
                        style={{ marginBottom: 0 }}
                    />
                </div>
            </div>

            {/* PIN */}
            <div style={{ marginBottom: 32 }}>
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Lock size={18} color="var(--accent-gold)" /> Seguridad
                </h3>
                <div className="card">
                    {!showPinChange ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 500 }}>Cambiar PIN</div>
                                <div className="caption">PIN de 4 dígitos para acceso</div>
                            </div>
                            <button onClick={() => setShowPinChange(true)} className="btn-ghost" style={{ fontSize: 13 }}>
                                Cambiar
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <input
                                type="password"
                                maxLength={4}
                                value={currentPin}
                                onChange={(e) => setCurrentPin(e.target.value)}
                                placeholder="PIN actual"
                                className="search"
                                style={{ marginBottom: 0, textAlign: 'center', letterSpacing: '0.3em' }}
                            />
                            <input
                                type="password"
                                maxLength={4}
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value)}
                                placeholder="Nuevo PIN"
                                className="search"
                                style={{ marginBottom: 0, textAlign: 'center', letterSpacing: '0.3em' }}
                            />
                            <input
                                type="password"
                                maxLength={4}
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value)}
                                placeholder="Confirmar PIN"
                                className="search"
                                style={{ marginBottom: 0, textAlign: 'center', letterSpacing: '0.3em' }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => { setShowPinChange(false); setCurrentPin(''); setNewPin(''); setConfirmPin(''); }} className="btn-ghost" style={{ flex: 1 }}>
                                    Cancelar
                                </button>
                                <button onClick={handleChangePin} className="btn-primary" style={{ flex: 1 }}>
                                    <Check size={16} /> Guardar
                                </button>
                            </div>
                        </div>
                    )}
                    {pinMessage && (
                        <div style={{ marginTop: 8, fontSize: 13, color: pinMessage.includes('✓') ? 'var(--accent-gold)' : '#dc2626', fontWeight: 500 }}>
                            {pinMessage}
                        </div>
                    )}
                </div>
            </div>

            {/* Export & Newspaper */}
            <div style={{ marginBottom: 32 }}>
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Download size={18} color="var(--accent-gold)" /> Datos & Archivo
                </h3>
                <div className="card" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 500 }}>Exportar todo</div>
                            <div className="caption">Descargar respaldo en JSON</div>
                        </div>
                        <button onClick={handleExportData} className="btn-ghost" style={{ fontSize: 13 }}>
                            <Download size={14} /> Exportar
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>Edición Mensual</div>
                        <div className="caption">"Leer como periódico" (PDF Compendio)</div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <select
                            value={newspaperMonth}
                            onChange={(e) => setNewspaperMonth(Number(e.target.value))}
                            className="select"
                            style={{ flex: 2, height: 44 }}
                        >
                            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={newspaperYear}
                            onChange={(e) => setNewspaperYear(Number(e.target.value))}
                            className="search"
                            style={{ flex: 1, marginBottom: 0, height: 44, textAlign: 'center' }}
                        />
                    </div>

                    <button
                        onClick={handleGenerateNewspaper}
                        className="btn-primary"
                        disabled={isGenerating}
                        style={{ width: '100%', gap: 10, height: 48 }}
                    >
                        {isGenerating ? (
                            <div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        ) : (
                            <BookOpen size={18} />
                        )}
                        {isGenerating ? 'Generando...' : 'Generar Periódico'}
                    </button>

                    {exportMessage && (
                        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--accent-gold)', fontWeight: 600, textAlign: 'center' }}>
                            {exportMessage}
                        </div>
                    )}
                </div>
            </div>

            {/* Version */}
            <div style={{ marginBottom: 32 }}>
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Info size={18} color="var(--accent-gold)" /> Acerca de
                </h3>
                <div className="card">
                    <div className="settings-item" style={{ borderBottom: 'none', padding: 0 }}>
                        <span className="settings-label">Versión</span>
                        <span className="settings-value" style={{ fontFamily: "'Cinzel', serif" }}>1.0.0</span>
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
