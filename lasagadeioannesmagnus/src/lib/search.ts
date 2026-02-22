import { Index } from 'flexsearch';
import type { Cronica } from '../types';

export const cronicaIndex = new Index({
    tokenize: 'forward',
    cache: true,
});

export const indexCronica = (cronica: Cronica) => {
    if (!cronica.id) return;

    const plainContent = cronica.content.replace(/<[^>]*>?/gm, '');
    const searchString = `${cronica.title} ${cronica.subtitle} ${plainContent} ${cronica.tags.join(' ')} ${cronica.type || 'cronica'}`;

    cronicaIndex.add(cronica.id, searchString);
};

export const removeFromIndex = (id: number) => {
    cronicaIndex.remove(id);
};

export const searchCronicas = (query: string): number[] => {
    return cronicaIndex.search(query, { limit: 50 }) as number[];
};
