import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook, PayloadRequest } from 'payload';

/**
 * Invalide le cache des pages publiques après une modification dans l'admin.
 * Tout le site partage le même layout : on purge l'ensemble, c'est simple et suffisant à cette échelle.
 * Ignoré hors runtime Next (script de seed) ou quand le contexte le demande.
 */
async function purge(req: PayloadRequest) {
  if (req.context?.disableRevalidate) return;
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');
  } catch {
    // Hors requête Next (ex. `payload run`) : rien à invalider.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await purge(req);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await purge(req);
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await purge(req);
  return doc;
};

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
};
