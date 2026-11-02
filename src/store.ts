import type { AppState, AnyItem, Settings } from './types';
import { DEFAULT_SETTINGS } from './data';
import { newId } from './utils';

const STORAGE_KEY = 'biznes-panel-psd';

// ==================== ЗАГРУЗКА / СОХРАНЕНИЕ ====================
export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: {}, settings: DEFAULT_SETTINGS };
    const data = JSON.parse(raw);
    return {
      items: data.items || {},
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
    };
  } catch {
    return { items: {}, settings: DEFAULT_SETTINGS };
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Ошибка сохранения:', e);
  }
};

// ==================== ЭКСПОРТ / ИМПОРТ ====================
export const exportData = (state: AppState): void => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `biznes-panel-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<AppState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve({
          items: data.items || {},
          settings: { ...DEFAULT_SETTINGS, ...data.settings },
        });
      } catch {
        reject(new Error('Неверный формат файла'));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
};

// ==================== CRUD ОПЕРАЦИИ ====================
export const addItem = (state: AppState, item: Omit<AnyItem, 'id'> & { id?: string }): AppState => {
  const id = item.id || newId(item.type);
  const newItem = { ...item, id } as AnyItem;
  const items: Record<string, AnyItem> = { ...state.items, [id]: newItem };
  return { ...state, items };
};

export const updateItem = (state: AppState, id: string, updates: Partial<AnyItem>): AppState => {
  const existing = state.items[id];
  if (!existing) return state;
  const items: Record<string, AnyItem> = { ...state.items, [id]: { ...existing, ...updates } as AnyItem };
  return { ...state, items };
};

export const deleteItem = (state: AppState, id: string): AppState => {
  const items = { ...state.items };
  delete items[id];
  return { ...state, items };
};

// ==================== ПОЛУЧЕНИЕ ДАННЫХ ====================
export const getAll = (state: AppState, type?: string): AnyItem[] => {
  const items = Object.values(state.items);
  return type ? items.filter(i => i.type === type) : items;
};

export const getById = (state: AppState, id: string): AnyItem | undefined => {
  return state.items[id];
};

export const getByObj = (state: AppState, type: string, objId: string): AnyItem[] => {
  return Object.values(state.items).filter(i => i.type === type && (i as any).obj === objId);
};

export const getSettings = (state: AppState): Settings => {
  return state.settings;
};

export const updateSettings = (state: AppState, updates: Partial<Settings>): AppState => {
  return {
    ...state,
    settings: { ...state.settings, ...updates },
  };
};

// ==================== СТАТИСТИКА ====================
export const getStats = (state: AppState) => {
  const items = Object.values(state.items);
  const objs = items.filter(i => i.type === 'obj');
  const tasks = items.filter(i => i.type === 'task');
  const estimates = items.filter(i => i.type === 'est');
  const contracts = items.filter(i => i.type === 'contract');
  const invoices = items.filter(i => i.type === 'inv');
  const acts = items.filter(i => i.type === 'act');

  const openTasks = tasks.filter(t => !(t as any).done).length;
  const overdueTasks = tasks.filter(t => {
    const task = t as any;
    return !task.done && task.due && task.due < new Date().toISOString().slice(0, 10);
  }).length;

  const totalEstimateSum = estimates.reduce((sum, e) => sum + ((e as any).sum || 0), 0);
  const totalContractSum = contracts.reduce((sum, c) => sum + ((c as any).sum || 0), 0);
  const totalInvoiceSum = invoices.reduce((sum, i) => sum + ((i as any).sum || 0), 0);
  const paidInvoiceSum = invoices.filter(i => (i as any).paid).reduce((sum, i) => sum + ((i as any).sum || 0), 0);

  return {
    objects: objs.length,
    tasks: tasks.length,
    openTasks,
    overdueTasks,
    estimates: estimates.length,
    totalEstimateSum,
    contracts: contracts.length,
    totalContractSum,
    invoices: invoices.length,
    totalInvoiceSum,
    paidInvoiceSum,
    acts: acts.length,
  };
};
