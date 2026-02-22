import * as React from 'react';
import { Archive, Plus, User } from 'lucide-react';

type View = 'archive' | 'editor' | 'profile';

interface DockProps {
    onAddCronica: () => void;
    currentView: View;
    onViewChange: (view: View) => void;
}

export const Dock: React.FC<DockProps> = ({ onAddCronica, currentView, onViewChange }) => {
    return (
        <nav className="bottom-nav">
            <button
                className={`nav-item ${currentView === 'archive' ? 'active' : ''}`}
                onClick={() => onViewChange('archive')}
            >
                <Archive size={22} />
                <span>Archivo</span>
            </button>

            <button className="nav-add" onClick={onAddCronica} aria-label="Nueva entrada">
                <Plus size={24} strokeWidth={2.5} />
            </button>

            <button
                className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
                onClick={() => onViewChange('profile')}
            >
                <User size={22} />
                <span>Perfil</span>
            </button>
        </nav>
    );
};
