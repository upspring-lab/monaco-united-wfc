import type { SyncProvider } from './types';

/**
 * Connecteur actif, choisi par SYNC_PROVIDER. Aucun par défaut : sans source configurée,
 * la tâche planifiée ne fait rien et l'admin reste la seule source (saisie manuelle).
 *
 * Pour brancher une source : implémenter SyncProvider (voir types.ts) dans ce dossier
 * et l'ajouter ci-dessous. Connecteur prévu : Score'n'co (API de l'offre Premium).
 */
export function getProvider(): SyncProvider | null {
  switch (process.env.SYNC_PROVIDER) {
    case undefined:
    case '':
    case 'none':
      return null;
    default:
      throw new Error(`SYNC_PROVIDER inconnu : ${process.env.SYNC_PROVIDER}`);
  }
}
