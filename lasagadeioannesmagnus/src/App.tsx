import * as React from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ArchivePage } from './pages/ArchivePage';
import { EditorPage } from './pages/EditorPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReadingPage } from './pages/ReadingPage';
import { PINLock } from './components/auth/PINLock';
import { useCreateCronica, useUpdateCronica, useDeleteCronica } from './hooks/useCronicas';
import { exportCronicaToPDF } from './lib/export';
import { QuoteImageGenerator } from './components/export/QuoteImageGenerator';
import { AddActionOverlay } from './components/layout/AddActionOverlay';
import type { Cronica, EntryType } from './types';

type View = 'archive' | 'editor' | 'profile' | 'reading' | 'share';

function App() {
  const [isLocked, setIsLocked] = React.useState(true);
  const [view, setView] = React.useState<View>('archive');
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null);
  const [currentCronica, setCurrentCronica] = React.useState<Partial<Cronica> | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);

  const createMutation = useCreateCronica();
  const updateMutation = useUpdateCronica();
  const deleteMutation = useDeleteCronica();

  const handleNewCronica = (type: EntryType = 'cronica') => {
    setCurrentCronica({
      title: '',
      subtitle: '',
      content: '',
      type: type,
      tags: [],
      status: 'private'
    });
    setIsAdding(false);
    setView('editor');
  };

  const handleOpenReading = (cronica: Cronica) => {
    setCurrentCronica(cronica);
    setView('reading');
  };

  const handleEditCronica = (cronica: Cronica) => {
    setCurrentCronica(cronica);
    setView('editor');
  };

  const handleSave = async (data: Partial<Cronica>) => {
    if (data.id) {
      await updateMutation.mutateAsync(data as Cronica);
    } else {
      await createMutation.mutateAsync(data);
    }
    setView('archive');
    setCurrentCronica(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas borrar esta entrada? Esta acción es irreversible.')) {
      await deleteMutation.mutateAsync(id);
      setView('archive');
      setCurrentCronica(null);
    }
  };

  const handleBack = () => {
    setView('archive');
    setCurrentCronica(null);
  };

  const handleExportPDF = async (cronica: Cronica) => {
    await exportCronicaToPDF(cronica);
  };

  const handleShareQuote = (cronica: Cronica) => {
    setCurrentCronica(cronica);
    setView('share');
  };

  if (isLocked) {
    return <PINLock onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <MainLayout
      selectedYear={selectedYear}
      onYearSelect={setSelectedYear}
      onAddCronica={() => setIsAdding(true)}
      currentView={view === 'reading' || view === 'share' ? 'archive' : view}
      onViewChange={(v) => {
        setView(v as View);
        if (v === 'archive') setCurrentCronica(null);
      }}
    >
      {view === 'archive' && (
        <ArchivePage
          selectedYear={selectedYear}
          onSelectCronica={handleOpenReading}
          onNewCronica={() => setIsAdding(true)}
        />
      )}
      {/* Action Overlay */}
      <AddActionOverlay
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSelectType={(type) => handleNewCronica(type)}
      />
      {view === 'editor' && (
        <EditorPage
          cronica={currentCronica || {}}
          onSave={handleSave}
          onBack={() => setView(currentCronica?.id ? 'reading' : 'archive')}
          onDelete={handleDelete}
        />
      )}
      {view === 'reading' && currentCronica && (
        <ReadingPage
          cronica={currentCronica as Cronica}
          onBack={handleBack}
          onEdit={handleEditCronica}
          onDelete={handleDelete}
          onExportPDF={handleExportPDF}
          onShareQuote={handleShareQuote}
        />
      )}
      {view === 'share' && currentCronica && (
        <QuoteImageGenerator
          cronica={currentCronica as Cronica}
          onClose={() => setView('reading')}
        />
      )}
      {view === 'profile' && (
        <ProfilePage onBack={handleBack} />
      )}
    </MainLayout>
  );
}

export default App;
