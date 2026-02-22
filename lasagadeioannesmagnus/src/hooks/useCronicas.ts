import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../lib/db';
import { indexCronica, removeFromIndex } from '../lib/search';
import type { Cronica, EntryType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useCronicas = (year?: number | null, type?: EntryType | null) => {
    return useQuery({
        queryKey: ['cronicas', year, type],
        queryFn: async () => {
            let results = await db.cronicas.orderBy('createdAt').reverse().toArray();

            if (year) {
                const start = new Date(year, 0, 1);
                const end = new Date(year, 11, 31, 23, 59, 59);
                results = results.filter(c => c.createdAt >= start && c.createdAt <= end);
            }

            if (type) {
                results = results.filter(c => c.type === type);
            }

            return results;
        },
    });
};

export const useCreateCronica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cronica: Partial<Cronica>) => {
            const newCronica: Cronica = {
                uuid: uuidv4(),
                title: cronica.title || 'Sin Título',
                subtitle: cronica.subtitle || '',
                content: cronica.content || '',
                type: cronica.type || 'cronica',
                tags: cronica.tags || [],
                createdAt: new Date(),
                updatedAt: new Date(),
                status: cronica.status || 'draft',
                ...cronica
            };

            const id = await db.cronicas.add(newCronica);
            const saved = { ...newCronica, id };
            indexCronica(saved);
            return saved;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cronicas'] });
        },
    });
};

export const useUpdateCronica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cronica: Cronica) => {
            if (!cronica.id) throw new Error('No ID provided for update');

            const updated = {
                ...cronica,
                updatedAt: new Date()
            };

            await db.cronicas.update(cronica.id, updated);
            indexCronica(updated);
            return updated;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['cronicas'] });
            queryClient.invalidateQueries({ queryKey: ['cronica', data.id] });
        },
    });
};

export const useDeleteCronica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await db.cronicas.delete(id);
            removeFromIndex(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cronicas'] });
        },
    });
};
