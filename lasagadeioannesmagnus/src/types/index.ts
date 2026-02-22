export type CronicaStatus = 'draft' | 'published' | 'private';
export type EntryType = 'cronica' | 'articulo' | 'idea' | 'pensamiento';

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
    cronica: 'Crónica',
    articulo: 'Artículo',
    idea: 'Idea',
    pensamiento: 'Pensamiento',
};

export interface Cronica {
    id?: number; // Dexie auto-increment ID
    uuid: string; // For syncing/links
    title: string;
    subtitle: string;
    content: string; // HTML
    type: EntryType;
    coverImage?: Blob | string | null;
    audioFile?: Blob | string | null;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    status: CronicaStatus;
}

export interface Vocabulario {
    id?: number;
    word: string;
    group: string;
    tags: string[];
    notes: string;
}
