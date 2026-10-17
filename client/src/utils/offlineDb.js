import { openDB } from 'idb';

const DB_NAME = 'RuralCareOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'savedArticles';

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: '_id' });
        store.createIndex('savedAt', 'savedAt');
        store.createIndex('category', 'category');
      }
    },
  });
};

export const saveArticleOffline = async (article) => {
  const db = await initDB();
  const id = article._id || article.id;
  const item = {
    ...article,
    _id: id,
    savedAt: new Date().toISOString(),
  };
  await db.put(STORE_NAME, item);
  return item;
};

export const removeArticleOffline = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const getSavedArticles = async () => {
  const db = await initDB();
  const articles = await db.getAll(STORE_NAME);
  return articles.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
};

export const isArticleSaved = async (id) => {
  if (!id) return false;
  const db = await initDB();
  const item = await db.get(STORE_NAME, id);
  return Boolean(item);
};
