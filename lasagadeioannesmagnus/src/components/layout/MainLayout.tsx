import * as React from 'react';
import { Dock } from './Dock';

type View = 'archive' | 'editor' | 'profile';

interface MainLayoutProps {
    children: React.ReactNode;
    selectedYear: number | null;
    onYearSelect: (year: number | null) => void;
    onAddCronica: () => void;
    currentView: View;
    onViewChange: (view: View) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    onAddCronica,
    currentView,
    onViewChange
}) => {
    return (
        <>
            <div className="app">
                {children}
            </div>
            <Dock
                onAddCronica={onAddCronica}
                currentView={currentView}
                onViewChange={onViewChange}
            />
        </>
    );
};
