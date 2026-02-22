import * as React from 'react';
import { useCronicas } from '../hooks/useCronicas';
import { searchCronicas, indexCronica } from '../lib/search';
import type { Cronica, EntryType } from '../types';
import { ENTRY_TYPE_LABELS } from '../types';
import { Search, Filter, X, PenLine } from 'lucide-react';

interface ArchivePageProps {
    selectedYear: number | null;
    onSelectCronica: (cronica: Cronica) => void;
    onNewCronica: () => void;
}

const TABS: { key: EntryType | null; label: string }[] = [
    { key: null, label: 'Todas' },
    { key: 'cronica', label: 'Crónicas' },
    { key: 'articulo', label: 'Artículos' },
    { key: 'idea', label: 'Ideas' },
    { key: 'pensamiento', label: 'Pensamientos' },
];

const toRoman = (num: number): string => {
    const map: [number, string][] = [
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    let n = num;
    for (const [val, char] of map) {
        while (n >= val) {
            result += char;
            n -= val;
        }
    }
    return result || '0';
};

export const ArchivePage: React.FC<ArchivePageProps> = ({ selectedYear: initialYear, onSelectCronica, onNewCronica }) => {
    const [activeType, setActiveType] = React.useState<EntryType | null>(null);
    const [query, setQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<number[] | null>(null);
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const [filterYear, setFilterYear] = React.useState<number | null>(initialYear);

    const { data: allCronicas, isLoading } = useCronicas(null, activeType);

    // Index all cronicas for search
    React.useEffect(() => {
        if (allCronicas) {
            allCronicas.forEach(c => indexCronica(c));
        }
    }, [allCronicas]);

    // Debounced search
    React.useEffect(() => {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }
        const timer = setTimeout(() => {
            const ids = searchCronicas(query.trim());
            setSearchResults(ids);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const filteredCronicas = React.useMemo(() => {
        if (!allCronicas) return [];
        let results = allCronicas;

        // Apply type filter
        if (activeType) {
            results = results.filter(c => c.type === activeType);
        }

        // Apply search results
        if (searchResults) {
            results = results.filter(c => c.id && searchResults.includes(c.id));
        }

        // Apply year filter
        if (filterYear) {
            const start = new Date(filterYear, 0, 1);
            const end = new Date(filterYear, 11, 31, 23, 59, 59);
            results = results.filter(c => c.createdAt >= start && c.createdAt <= end);
        }

        return results;
    }, [allCronicas, activeType, searchResults, filterYear]);

    // Grouping by year
    const groupedCronicas = React.useMemo(() => {
        const groups: Record<number, Cronica[]> = {};
        filteredCronicas.forEach(c => {
            const y = c.createdAt.getFullYear();
            if (!groups[y]) groups[y] = [];
            groups[y].push(c);
        });

        // Sort years descending
        return Object.entries(groups)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([year, entries]) => ({
                year: Number(year),
                // Entries are already sorted reverse chronological from hook
                entries
            }));
    }, [filteredCronicas]);

    const availableYears = React.useMemo(() => {
        if (!allCronicas) return [];
        const years = new Set<number>();
        allCronicas.forEach(c => years.add(c.createdAt.getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [allCronicas]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <div style={{ width: 32, height: 32, border: '2px solid var(--accent-gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Branding Header */}
            <h1 className="title-hero" style={{ fontSize: 24, textAlign: 'center', marginBottom: 4 }}>
                La Saga de Ioannes Magnus
            </h1>
            <p className="subtitle" style={{ textAlign: 'center', marginBottom: 32 }}>Explorar los Archivos</p>

            {/* Search & Toggle Filters */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: 14,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)',
                            pointerEvents: 'none'
                        }}
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar palabras clave..."
                        className="search"
                        style={{ paddingLeft: 40, paddingRight: query ? 40 : 16 }}
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            style={{
                                position: 'absolute',
                                right: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: 4,
                            }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="btn-ghost"
                    style={{ padding: '0 14px', borderColor: showAdvanced ? 'var(--accent-gold)' : 'var(--border-subtle)' }}
                >
                    <Filter size={18} color={showAdvanced ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                </button>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="card" style={{ marginBottom: 16, padding: '16px' }}>
                    <div style={{ marginBottom: 12 }}>
                        <label className="caption" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Filtrar por Año</label>
                        <select
                            value={filterYear || ''}
                            onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : null)}
                            className="select"
                            style={{ height: 38 }}
                        >
                            <option value="">Todos los años</option>
                            {availableYears.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Type Tabs */}
            <div className="tab-bar">
                {TABS.map(tab => (
                    <button
                        key={tab.key ?? 'all'}
                        className={`tab-item ${activeType === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveType(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Result count if searching */}
            {searchResults !== null && (
                <div className="caption" style={{ marginBottom: 16, textAlign: 'center' }}>
                    {filteredCronicas.length} resultado{filteredCronicas.length !== 1 ? 's' : ''} encontrado{filteredCronicas.length !== 1 ? 's' : ''}
                </div>
            )}

            {/* Historical Index Content */}
            {groupedCronicas.length > 0 ? (
                <div>
                    {groupedCronicas.map(({ year, entries }) => (
                        <div key={year} style={{ marginBottom: 40 }}>
                            <div className="year-header">
                                {year}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {entries.map((cronica, idx) => {
                                    // Calculate roman numeral based on reverse chronological order index
                                    const roman = toRoman(entries.length - idx);
                                    const label = ENTRY_TYPE_LABELS[cronica.type] || 'Crónica';

                                    return (
                                        <div key={cronica.id} onClick={() => onSelectCronica(cronica)} style={{ cursor: 'pointer' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                                <div style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontSize: 14,
                                                    color: 'var(--accent-gold)',
                                                    width: 32,
                                                    paddingTop: 4
                                                }}>
                                                    {roman}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="caption" style={{ textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                                                    <h3 style={{
                                                        fontFamily: "'Cinzel', serif",
                                                        fontSize: 18,
                                                        lineHeight: 1.3,
                                                        color: 'var(--text-primary)'
                                                    }}>
                                                        {cronica.title}
                                                    </h3>
                                                    {cronica.subtitle && (
                                                        <p style={{
                                                            fontFamily: "'Playfair Display', serif",
                                                            fontSize: 14,
                                                            fontStyle: 'italic',
                                                            color: 'var(--text-secondary)',
                                                            marginTop: 2
                                                        }}>
                                                            {cronica.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {idx < entries.length - 1 && (
                                                <div style={{ borderBottom: '1px solid var(--border-subtle)', marginTop: 16, width: 'calc(100% - 44px)', marginLeft: '44px' }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="ornament">✦</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">
                        <PenLine size={24} color="var(--accent-gold)" />
                    </div>
                    <div className="empty-title">Silencio Espacial</div>
                    <p className="empty-text">
                        {query ? 'No se encontraron registros en el archivo.' : 'Todavía no hay escritos en esta sección de la saga.'}
                    </p>
                    {!query && (
                        <button onClick={onNewCronica} className="btn-primary" style={{ width: '100%' }}>
                            Escribir el Primero
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
