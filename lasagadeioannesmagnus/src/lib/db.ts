import Dexie, { type Table } from 'dexie';
import type { Cronica, Vocabulario } from '../types';

export class SagaDatabase extends Dexie {
    cronicas!: Table<Cronica>;
    vocabulario!: Table<Vocabulario>;

    constructor() {
        super('SagaDB');

        this.version(1).stores({
            cronicas: '++id, uuid, title, status, createdAt',
            vocabulario: '++id, word, group, *tags'
        });

        this.version(2).stores({
            cronicas: '++id, uuid, title, status, type, createdAt',
            vocabulario: '++id, word, group, *tags'
        }).upgrade(tx => {
            // Set default type for existing entries
            return tx.table('cronicas').toCollection().modify(cronica => {
                if (!cronica.type) {
                    cronica.type = 'cronica';
                }
            });
        });
    }
}

export const db = new SagaDatabase();
