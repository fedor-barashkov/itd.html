import { useState, useEffect, useMemo, useCallback } from 'react';
import type { AppState, AnyItem, Zone, Obj, Task } from './types';
import { ZONES, NAV_ITEMS, JLIB, ITD_LIB, FORM_SPECS, DEFAULT_SETTINGS } from './data';
import { loadState, saveState, addItem, updateItem, deleteItem, getAll, getByObj, exportData, importData, getStats } from './store';
import { esc, rub, num, pct, TODAY, ru, ruShort, newId, nextNumber, formatDate, relativeTime, sumWords } from './utils';

// ==================== ИКОНКИ (SVG) ====================
const Icons: Record<string, React.FC<{ className?: string }>> = {
  'layout-dashboard': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  'building-2': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  'check-square': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  'calculator': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
  'drafting-compass': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 2v4"/><path d="m6.34 6.34 2.83 2.83"/><path d="M2 12h4"/><path d="m6.34 17.66 2.83-2.83"/><path d="M12 18v4"/><path d="m17.66 17.66-2.83-2.83"/><path d="M18 12h4"/><path d="m17.66 6.34-2.83 2.83"/></svg>,
  'clipboard-check': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>,
  'notebook-pen': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M14 15H9v-5"/><path d="M18.37 3.63 8 14v3h3l10.37-10.37a2 2 0 0 0-2.83-2.83Z"/></svg>,
  'badge-check': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>,
  'file-text': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
  'receipt': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>,
  'file-check': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>,
  'landmark': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  'shopping-cart': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>,
  'users': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  'hard-hat': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 15V6.5a3.5 3.5 0 0 1 7 0V15"/><path d="M4 15v-4a8 8 0 0 1 16 0v4"/></svg>,
  'settings': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  'search': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  'plus': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  'pencil': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  'trash': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  'x': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  'sun': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  'moon': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  'bell': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  'chevron-right': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>,
  'download': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  'upload': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  'arrow-left': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  'folder': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>,
  'briefcase': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  'alert-triangle': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  'check': ({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
};

const Ic = ({ name, className = 'w-5 h-5' }: { name: string; className?: string }) => {
  const Icon = Icons[name];
  return Icon ? <Icon className={className} /> : null;
};

// ==================== ОСНОВНОЙ КОМПОНЕНТ ====================
export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [page, setPage] = useState('dashboard');
  const [modal, setModal] = useState<{ type: string; id?: string; pre?: Record<string, any> } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Сохранение при изменении
  useEffect(() => { saveState(state); }, [state]);

  // Тема
  useEffect(() => {
    const theme = state.settings.theme;
    const root = document.documentElement;
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
  }, [state.settings.theme]);

  // Горячие клавиши
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setModal(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Тост
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // CRUD
  const handleSave = useCallback((type: string, values: Record<string, any>, id?: string) => {
    if (id) {
      setState(s => updateItem(s, id, values));
      showToast('Изменения сохранены');
    } else {
      const item: any = { type, ...values, created: TODAY };
      if (!item.n && ['est', 'idact', 'inv', 'act', 'contract'].includes(type)) {
        item.n = nextNumber(getAll(state, type), type);
      }
      setState(s => addItem(s, item));
      showToast(`${FORM_SPECS[type]?.n || type}: добавлено`);
    }
    setModal(null);
  }, [state, showToast]);

  const handleDelete = useCallback((id: string) => {
    if (!confirm('Удалить запись? Это действие нельзя отменить.')) return;
    setState(s => deleteItem(s, id));
    setModal(null);
    showToast('Удалено');
  }, [showToast]);

  // Поиск
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return getAll(state).filter(item => {
      const str = JSON.stringify(item).toLowerCase();
      return str.includes(q);
    }).slice(0, 20);
  }, [state, searchQuery]);

  const stats = useMemo(() => getStats(state), [state]);
  const objs = useMemo(() => getAll(state, 'obj') as Obj[], [state]);
  const tasks = useMemo(() => getAll(state, 'task') as Task[], [state]);

  // Рендер страницы
  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard state={state} stats={stats} objs={objs} tasks={tasks} onNavigate={setPage} onNew={(t) => setModal({ type: t })} />;
      case 'objects': return <ObjectsPage state={state} onEdit={(id) => setModal({ type: 'obj', id })} onNew={() => setModal({ type: 'obj' })} onDelete={handleDelete} onOpen={(id) => setPage('obj_' + id)} />;
      case 'tasks': return <TasksPage state={state} onEdit={(id) => setModal({ type: 'task', id })} onNew={() => setModal({ type: 'task' })} onToggle={(id) => { const t = state.items[id] as Task; setState(s => updateItem(s, id, { done: !t.done })); }} onDelete={handleDelete} />;
      case 'estimates': return <SimpleList state={state} type="est" title="Сметы" onEdit={(id) => setModal({ type: 'est', id })} onNew={() => setModal({ type: 'est' })} onDelete={handleDelete} />;
      case 'pd': return <SimpleList state={state} type="pd" title="Разделы ПД" onEdit={(id) => setModal({ type: 'pd', id })} onNew={() => setModal({ type: 'pd' })} onDelete={handleDelete} />;
      case 'id': return <SimpleList state={state} type="itd" title="ИТД" onEdit={(id) => setModal({ type: 'itd', id })} onNew={() => setModal({ type: 'itd' })} onDelete={handleDelete} />;
      case 'journals': return <SimpleList state={state} type="journal" title="Журналы работ" onEdit={(id) => setModal({ type: 'journal', id })} onNew={() => setModal({ type: 'journal' })} onDelete={handleDelete} />;
      case 'certs': return <SimpleList state={state} type="cert" title="Сертификаты и паспорта" onEdit={(id) => setModal({ type: 'cert', id })} onNew={() => setModal({ type: 'cert' })} onDelete={handleDelete} />;
      case 'contracts': return <SimpleList state={state} type="contract" title="Договоры" onEdit={(id) => setModal({ type: 'contract', id })} onNew={() => setModal({ type: 'contract' })} onDelete={handleDelete} />;
      case 'invoices': return <SimpleList state={state} type="inv" title="Счета" onEdit={(id) => setModal({ type: 'inv', id })} onNew={() => setModal({ type: 'inv' })} onDelete={handleDelete} onTogglePaid={(id) => { const inv = state.items[id] as any; setState(s => updateItem(s, id, { paid: !inv.paid })); }} />;
      case 'acts': return <SimpleList state={state} type="act" title="Акты" onEdit={(id) => setModal({ type: 'act', id })} onNew={() => setModal({ type: 'act' })} onDelete={handleDelete} />;
      case 'bank': return <BankPage state={state} onEdit={(id) => setModal({ type: id.startsWith('bank_') ? 'bank' : 'bankop', id })} onNew={(t) => setModal({ type: t || 'bank' })} onDelete={handleDelete} />;
      case 'purchases': return <SimpleList state={state} type="pur" title="Закупки" onEdit={(id) => setModal({ type: 'pur', id })} onNew={() => setModal({ type: 'pur' })} onDelete={handleDelete} />;
      case 'clients': return <SimpleList state={state} type="client" title="Заказчики" onEdit={(id) => setModal({ type: 'client', id })} onNew={() => setModal({ type: 'client' })} onDelete={handleDelete} />;
      case 'contractors': return <SimpleList state={state} type="contractor" title="Исполнители" onEdit={(id) => setModal({ type: 'contractor', id })} onNew={() => setModal({ type: 'contractor' })} onDelete={handleDelete} />;
      case 'settings': return <SettingsPage state={state} onUpdate={(s) => setState(prev => ({ ...prev, settings: { ...prev.settings, ...s } }))} onExport={() => exportData(state)} onImport={async (f) => { const s = await importData(f); setState(s); showToast('Данные загружены'); }} onClear={() => { if (confirm('Удалить ВСЕ данные?')) { setState({ items: {}, settings: DEFAULT_SETTINGS }); showToast('Все данные удалены'); } }} showToast={showToast} />;
      default:
        if (page.startsWith('obj_')) {
          const objId = page.slice(4);
          return <ObjectCard state={state} objId={objId} onBack={() => setPage('objects')} onEdit={(t, id) => setModal({ type: t, id })} onNew={(t, pre) => setModal({ type: t, pre })} onDelete={handleDelete} />;
        }
        return <Dashboard state={state} stats={stats} objs={objs} tasks={tasks} onNavigate={setPage} onNew={(t) => setModal({ type: t })} />;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="titlebar">
        <div className="brand">
          <div className="brand-mark">ПСД</div>
          <span className="hidden sm:inline">Бизнес-панель</span>
        </div>

        <button onClick={() => setSearchOpen(true)} className="search">
          <Ic name="search" className="w-4 h-4" />
          <span className="flex-1 text-left text-sm">Глобальный поиск...</span>
          <kbd className="text-xs opacity-60">Ctrl+K</kbd>
        </button>

        <div className="tools">
          {/* Переключатель зон */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--surface-2)] rounded-lg p-1">
            {state.settings.order.map(z => (
              <button key={z} onClick={() => setState(s => ({ ...s, settings: { ...s.settings, zone: z } }))}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${state.settings.zone === z ? 'bg-[var(--surface)] text-[var(--fg)] shadow-sm' : 'text-[var(--fg-2)] hover:text-[var(--fg)]'}`}>
                {ZONES[z].t}
              </button>
            ))}
          </div>

          <button onClick={() => setState(s => ({ ...s, settings: { ...s.settings, theme: s.settings.theme === 'dark' ? 'light' : s.settings.theme === 'light' ? 'system' : 'dark' } }))} className="icon-btn" title="Тема">
            <Ic name={state.settings.theme === 'dark' ? 'moon' : state.settings.theme === 'light' ? 'sun' : 'sun'} className="w-4 h-4" />
          </button>
          <button className="icon-btn relative" title="Уведомления">
            <Ic name="bell" className="w-4 h-4" />
            {stats.overdueTasks > 0 && <span className="dot" />}
          </button>
          <div className="avatar">{(state.settings.company || 'П')[0]}</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="shell">
        {/* Sidebar */}
        <aside className="side">
          <nav className="nav-group">
            {NAV_ITEMS.filter(n => !n.zone || n.zone === state.settings.zone || ['dashboard', 'objects', 'tasks', 'settings'].includes(n.id)).map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                aria-current={page === item.id ? 'page' : undefined}
                className="nav-item">
                <span className="nav-ico"><Ic name={item.icon} className="w-4 h-4" /></span>
                <span className="text-sm">{item.label}</span>
                {item.id === 'tasks' && stats.openTasks > 0 && <span className="count">{stats.openTasks}</span>}
              </button>
            ))}
          </nav>

          <div className="side-foot">
            <Ic name="alert-triangle" className="w-4 h-4 text-[var(--warn)] flex-shrink-0 mt-0.5" />
            <div>
              <b className="text-xs">Модульная версия</b>
              <p className="text-xs mt-0.5 opacity-70">React + TypeScript + Tailwind</p>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="main">
          <div className="page">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Modal */}
      {modal && <Modal state={state} modal={modal} onClose={() => setModal(null)} onSave={handleSave} onDelete={handleDelete} />}

      {/* Search */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-lg bg-[var(--surface)] rounded-xl border border-[var(--line)] shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--line)]">
              <Ic name="search" className="w-5 h-5 text-[var(--fg-3)]" />
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по объектам, актам, счетам..."
                className="flex-1 bg-transparent outline-none text-sm" />
              <button onClick={() => setSearchOpen(false)} className="text-[var(--fg-3)] hover:text-[var(--fg)]">
                <Ic name="x" className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-auto">
              {searchResults.length === 0 && searchQuery && (
                <p className="text-center py-8 text-sm text-[var(--fg-3)]">Ничего не найдено</p>
              )}
              {searchResults.map(item => (
                <button key={item.id} onClick={() => { setSearchOpen(false); setSearchQuery(''); if (item.type === 'obj') setPage('obj_' + item.id); }}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--surface-2)] border-b border-[var(--line)] last:border-0 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-2)]">{(item as any).type}</span>
                    <span className="text-sm font-medium">{esc((item as any).name || (item as any).title || (item as any).what || (item as any).n || item.id)}</span>
                  </div>
                  {(item as any).client && <p className="text-xs text-[var(--fg-3)] mt-1">{esc((item as any).client)}</p>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[var(--surface)] border border-[var(--line)] rounded-lg shadow-lg text-sm animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ state, stats, objs, tasks, onNavigate, onNew }: { state: AppState; stats: ReturnType<typeof getStats>; objs: Obj[]; tasks: Task[]; onNavigate: (p: string) => void; onNew: (t: string) => void }) {
  const openTasks = tasks.filter(t => !t.done);
  const overdue = openTasks.filter(t => t.due && t.due < TODAY);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">{ZONES[state.settings.zone].t} • {ru(TODAY)}</div>
          <h1>Главная</h1>
        </div>
        <div className="actions">
          <button onClick={() => onNew('obj')} className="btn primary"><Ic name="plus" className="w-4 h-4" />Объект</button>
          <button onClick={() => onNew('task')} className="btn"><Ic name="plus" className="w-4 h-4" />Задачу</button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid g4">
        <div className="card">
          <div className="kpi">
            <div className="label"><Ic name="building-2" className="w-4 h-4" />Объекты</div>
            <div className="value">{stats.objects}</div>
            <div className="delta">{rub(stats.totalEstimateSum)} сметы</div>
          </div>
        </div>
        <div className="card">
          <div className="kpi">
            <div className="label"><Ic name="check-square" className="w-4 h-4" />Задачи</div>
            <div className="value">{stats.openTasks}</div>
            <div className={`delta ${stats.overdueTasks ? 'down' : ''}`}>{stats.overdueTasks ? `${stats.overdueTasks} просрочено` : 'все в срок'}</div>
          </div>
        </div>
        <div className="card">
          <div className="kpi">
            <div className="label"><Ic name="file-text" className="w-4 h-4" />Договоры</div>
            <div className="value">{stats.contracts}</div>
            <div className="delta">{rub(stats.totalContractSum)}</div>
          </div>
        </div>
        <div className="card">
          <div className="kpi">
            <div className="label"><Ic name="receipt" className="w-4 h-4" />Счета</div>
            <div className="value">{rub(stats.paidInvoiceSum)}</div>
            <div className="delta">из {rub(stats.totalInvoiceSum)}</div>
          </div>
        </div>
      </div>

      {/* Recent Objects */}
      <div className="grid g2">
        <div className="card">
          <div className="card-head">
            <h2>Последние объекты</h2>
            <button onClick={() => onNavigate('objects')} className="btn ghost text-sm">Все <Ic name="chevron-right" className="w-4 h-4" /></button>
          </div>
          {objs.length === 0 ? (
            <p className="text-sm text-[var(--fg-3)]">Нет объектов. Создайте первый!</p>
          ) : (
            <div className="list">
              {objs.slice(-5).reverse().map(o => (
                <div key={o.id} className="li cursor-pointer" onClick={() => onNavigate('obj_' + o.id)}>
                  <div className="ico"><Ic name="building-2" className="w-4 h-4" /></div>
                  <div className="body">
                    <div className="t">{esc(o.name)}</div>
                    <div className="m">{esc(o.client || 'Без заказчика')}</div>
                  </div>
                  <div className="r">
                    <span className={`pill ${(o as Obj).status === 'Завершён' ? 'ok' : (o as Obj).status === 'Приостановлен' ? 'warn' : 'info'}`}>{esc((o as Obj).status || 'В работе')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Задачи</h2>
            <button onClick={() => onNavigate('tasks')} className="btn ghost text-sm">Все <Ic name="chevron-right" className="w-4 h-4" /></button>
          </div>
          {overdue.length > 0 && (
            <div className="mb-3 p-3 bg-[var(--bad-soft)] rounded-lg text-sm text-[var(--bad)]">
              <b>{overdue.length}</b> просроченных задач!
            </div>
          )}
          {openTasks.length === 0 ? (
            <p className="text-sm text-[var(--fg-3)]">Нет открытых задач</p>
          ) : (
            <div className="list">
              {openTasks.slice(0, 6).map(t => (
                <div key={t.id} className="li">
                  <div className="ico"><Ic name="check-square" className="w-4 h-4" /></div>
                  <div className="body">
                    <div className="t">{esc(t.title)}</div>
                    <div className="m">{t.due ? ru(t.due) : 'Без срока'}</div>
                  </div>
                  <div className="r">
                    <span className={`pill ${t.priority === 'high' ? 'bad' : t.priority === 'medium' ? 'warn' : 'neutral'}`}>
                      {t.priority === 'high' ? 'Высокий' : t.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ==================== OBJECTS PAGE ====================
function ObjectsPage({ state, onEdit, onNew, onDelete, onOpen }: { state: AppState; onEdit: (id: string) => void; onNew: () => void; onDelete: (id: string) => void; onOpen: (id: string) => void }) {
  const objs = getAll(state, 'obj') as Obj[];
  return (
    <>
      <div className="page-head">
        <div><h1>Объекты</h1><div className="eyebrow">{objs.length} объектов</div></div>
        <button onClick={onNew} className="btn primary"><Ic name="plus" className="w-4 h-4" />Новый объект</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Наименование</th><th>Заказчик</th><th>Статус</th><th>Сумма</th><th></th></tr></thead>
            <tbody>
              {objs.map(o => (
                <tr key={o.id} className="click" onClick={() => onOpen(o.id)}>
                  <td><b>{esc(o.name)}</b>{o.city && <span className="text-[var(--fg-3)]"> • {esc(o.city)}</span>}</td>
                  <td>{esc(o.client || '—')}</td>
                  <td><span className={`pill ${o.status === 'Завершён' ? 'ok' : o.status === 'Приостановлен' ? 'warn' : 'info'}`}>{esc(o.status || 'В работе')}</span></td>
                  <td className="num">{o.sum ? rub(o.sum) : '—'}</td>
                  <td>
                    <button onClick={e => { e.stopPropagation(); onEdit(o.id); }} className="icon-btn"><Ic name="pencil" className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {objs.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[var(--fg-3)]">Нет объектов. Создайте первый!</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ==================== OBJECT CARD ====================
function ObjectCard({ state, objId, onBack, onEdit, onNew, onDelete }: { state: AppState; objId: string; onBack: () => void; onEdit: (type: string, id: string) => void; onNew: (type: string, pre?: Record<string, any>) => void; onDelete: (id: string) => void }) {
  const obj = state.items[objId] as Obj | undefined;
  if (!obj) return <div className="text-center py-12 text-[var(--fg-3)]">Объект не найден</div>;

  const ests = getByObj(state, 'est', objId);
  const acts = getByObj(state, 'idact', objId);
  const journals = getByObj(state, 'journal', objId);
  const certs = getByObj(state, 'cert', objId) as any[];
  const itds = getByObj(state, 'itd', objId);

  return (
    <>
      <button onClick={onBack} className="btn ghost" style={{ paddingLeft: 0 }}><Ic name="arrow-left" className="w-4 h-4" />К списку</button>
      <div className="page-head">
        <div>
          <h1>{esc(obj.name)}</h1>
          <div className="eyebrow">{esc(obj.client || 'Без заказчика')} {obj.city && `• ${esc(obj.city)}`}</div>
        </div>
        <div className="actions">
          <button onClick={() => onEdit('obj', objId)} className="btn"><Ic name="pencil" className="w-4 h-4" />Изменить</button>
          <button onClick={() => onNew('task', { obj: objId })} className="btn primary"><Ic name="plus" className="w-4 h-4" />Добавить</button>
        </div>
      </div>

      <div className="grid g4">
        <div className="card"><div className="kpi"><div className="label">Сметы</div><div className="value">{ests.length}</div><div className="delta">{rub(ests.reduce((s, e) => s + num((e as any).sum), 0))}</div></div></div>
        <div className="card"><div className="kpi"><div className="label">Акты ИД</div><div className="value">{acts.length}</div></div></div>
        <div className="card"><div className="kpi"><div className="label">Журналы</div><div className="value">{journals.length}</div></div></div>
        <div className="card"><div className="kpi"><div className="label">Сертификаты</div><div className="value">{certs.length}</div><div className="delta">{certs.filter(c => c.status === 'Получен').length} получено</div></div></div>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="card-head"><h2>Сметы</h2><button onClick={() => onNew('est', { obj: objId })} className="btn sm"><Ic name="plus" className="w-3 h-3" /></button></div>
          {ests.length === 0 ? <p className="text-sm text-[var(--fg-3)]">Нет смет</p> : (
            <div className="list">{ests.map(e => <div key={e.id} className="li cursor-pointer" onClick={() => onEdit('est', e.id)}><div className="body"><div className="t">{esc((e as any).section)}</div><div className="m">{ruShort((e as any).date)}</div></div><div className="r text-sm font-semibold">{rub(num((e as any).sum))}</div></div>)}</div>
          )}
        </div>
        <div className="card">
          <div className="card-head"><h2>Акты ИД</h2><button onClick={() => onNew('idact', { obj: objId })} className="btn sm"><Ic name="plus" className="w-3 h-3" /></button></div>
          {acts.length === 0 ? <p className="text-sm text-[var(--fg-3)]">Нет актов</p> : (
            <div className="list">{acts.slice(0, 5).map(a => <div key={a.id} className="li cursor-pointer" onClick={() => onEdit('idact', a.id)}><div className="body"><div className="t">{esc((a as any).kind)} №{esc((a as any).n)}</div><div className="m">{esc((a as any).works?.slice(0, 50))}</div></div><div className="r"><span className={`pill ${(a as any).status === 'Подписан' ? 'ok' : 'warn'}`}>{esc((a as any).status)}</span></div></div>)}</div>
          )}
        </div>
      </div>
    </>
  );
}

// ==================== TASKS PAGE ====================
function TasksPage({ state, onEdit, onNew, onToggle, onDelete }: { state: AppState; onEdit: (id: string) => void; onNew: () => void; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const tasks = getAll(state, 'task') as Task[];
  const open = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);
  const overdue = open.filter(t => t.due && t.due < TODAY);

  return (
    <>
      <div className="page-head">
        <div><h1>Задачи</h1><div className="eyebrow">{open.length} открытых {overdue.length > 0 && `• ${overdue.length} просрочено`}</div></div>
        <button onClick={onNew} className="btn primary"><Ic name="plus" className="w-4 h-4" />Новая задача</button>
      </div>
      {overdue.length > 0 && (
        <div className="p-3 bg-[var(--bad-soft)] border border-[var(--bad)] rounded-lg text-sm text-[var(--bad)] flex items-center gap-2">
          <Ic name="alert-triangle" className="w-4 h-4" />
          <b>{overdue.length}</b> просроченных задач
        </div>
      )}
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th></th><th>Задача</th><th>Объект</th><th>Срок</th><th>Приоритет</th><th></th></tr></thead>
            <tbody>
              {open.map(t => (
                <tr key={t.id} className="click">
                  <td><button onClick={() => onToggle(t.id)} className="w-5 h-5 rounded border-2 border-[var(--fg-3)] hover:border-[var(--accent)]" /></td>
                  <td onClick={() => onEdit(t.id)} className="cursor-pointer"><b>{esc(t.title)}</b></td>
                  <td>{t.obj ? esc((state.items[t.obj] as Obj)?.name || '—') : '—'}</td>
                  <td className={t.due && t.due < TODAY ? 'text-[var(--bad)] font-medium' : ''}>{t.due ? ruShort(t.due) : '—'}</td>
                  <td><span className={`pill ${t.priority === 'high' ? 'bad' : t.priority === 'medium' ? 'warn' : 'neutral'}`}>{t.priority === 'high' ? 'Высокий' : t.priority === 'medium' ? 'Средний' : 'Низкий'}</span></td>
                  <td><button onClick={() => onDelete(t.id)} className="icon-btn"><Ic name="trash" className="w-4 h-4" /></button></td>
                </tr>
              ))}
              {open.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--fg-3)]">Нет открытых задач 🎉</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {done.length > 0 && (
        <div className="card">
          <div className="card-head"><h2>Выполненные</h2><span className="text-sm text-[var(--fg-3)]">{done.length}</span></div>
          <div className="list">{done.slice(-10).reverse().map(t => (
            <div key={t.id} className="li opacity-60">
              <button onClick={() => onToggle(t.id)} className="w-5 h-5 rounded border-2 border-[var(--ok)] bg-[var(--ok)] text-white flex items-center justify-center"><Ic name="check" className="w-3 h-3" /></button>
              <div className="body"><div className="t line-through">{esc(t.title)}</div></div>
            </div>
          ))}</div>
        </div>
      )}
    </>
  );
}

// ==================== SIMPLE LIST ====================
function SimpleList({ state, type, title, onEdit, onNew, onDelete, onTogglePaid }: { state: AppState; type: string; title: string; onEdit: (id: string) => void; onNew: () => void; onDelete: (id: string) => void; onTogglePaid?: (id: string) => void }) {
  const items = getAll(state, type);
  const spec = FORM_SPECS[type];

  const renderRow = (item: any) => {
    switch (type) {
      case 'est': return <><td><b>{esc(item.section)}</b></td><td>{esc((state.items[item.obj] as Obj)?.name || '—')}</td><td>{ruShort(item.date)}</td><td className="num">{rub(num(item.sum))}</td><td><span className={`pill ${item.status === 'Согласована' ? 'ok' : item.status === 'Замечания' ? 'warn' : 'info'}`}>{esc(item.status)}</span></td></>;
      case 'inv': return <><td><b>№{esc(item.n)}</b></td><td>{esc(item.client || (state.items[item.obj] as Obj)?.client || '—')}</td><td className="num">{rub(num(item.sum))}</td><td>{ruShort(item.due)}</td><td>{item.paid ? <span className="pill ok">Оплачен</span> : <button onClick={() => onTogglePaid?.(item.id)} className="pill warn cursor-pointer hover:opacity-80">Оплатить</button>}</td></>;
      case 'contract': return <><td><b>№{esc(item.n)}</b></td><td>{esc(item.client)}</td><td className="num">{item.sum ? rub(num(item.sum)) : '—'}</td><td>{ruShort(item.date)}</td><td><span className={`pill ${item.status === 'Действует' ? 'ok' : item.status === 'Исполнен' ? 'info' : 'neutral'}`}>{esc(item.status)}</span></td></>;
      case 'act': return <><td><b>{esc(item.kind)} №{esc(item.n)}</b></td><td>{esc(item.client || '—')}</td><td className="num">{rub(num(item.sum))}</td><td><span className={`pill ${item.status === 'Подписан' ? 'ok' : item.status === 'Оплачен' ? 'info' : 'neutral'}`}>{esc(item.status)}</span></td></>;
      case 'pur': return <><td><b>{esc(item.what)}</b></td><td>{item.qty} {item.unit}</td><td className="num">{item.price ? rub(num(item.price)) : '—'}</td><td>{esc(item.supplier || '—')}</td><td><span className={`pill ${item.status === 'Исполнена' ? 'ok' : item.status === 'Отменена' ? 'bad' : 'info'}`}>{esc(item.status)}</span></td></>;
      case 'client': return <><td><b>{esc(item.name)}</b></td><td className="code">{esc(item.inn || '—')}</td><td>{esc(item.contact || '—')}</td><td>{esc(item.phone || '—')}</td></>;
      case 'contractor': return <><td><b>{esc(item.name)}</b></td><td>{esc(item.speciality || '—')}</td><td>{esc(item.phone || '—')}</td><td className="num">{item.rate ? rub(num(item.rate)) + '/ч' : '—'}</td></>;
      case 'journal': return <><td><b>{esc(JLIB[item.code]?.t || item.code)}</b></td><td>{esc((state.items[item.obj] as Obj)?.name || '—')}</td><td>{esc(item.resp)}</td><td><span className={`pill ${item.status === 'Открыт' ? 'info' : 'ok'}`}>{esc(item.status)}</span></td></>;
      case 'cert': return <><td><b>{esc(item.material)}</b></td><td>{esc(item.doc || '—')}</td><td>{esc(item.supplier || '—')}</td><td><span className={`pill ${item.status === 'Получен' ? 'ok' : item.status === 'Просрочен' ? 'bad' : 'warn'}`}>{esc(item.status)}</span></td></>;
      case 'itd': return <><td><b>{esc(ITD_LIB[item.code]?.t || item.code)}</b></td><td>{esc((state.items[item.obj] as Obj)?.name || '—')}</td><td>{item.done}/{item.need || '—'}</td><td><div className="bar"><i style={{ width: pct(item.done, item.need || 1) }} /></div></td></>;
      case 'pd': return <><td><b>{esc(item.code)}</b></td><td>{esc(item.title)}</td><td>{esc((state.items[item.obj] as Obj)?.name || '—')}</td><td><span className={`pill ${item.status === 'Согласован' ? 'ok' : item.status === 'Замечания' ? 'warn' : 'info'}`}>{esc(item.status)}</span></td></>;
      default: return <td colSpan={5}>{esc(JSON.stringify(item).slice(0, 100))}</td>;
    }
  };

  return (
    <>
      <div className="page-head">
        <div><h1>{title}</h1><div className="eyebrow">{items.length} записей</div></div>
        <button onClick={onNew} className="btn primary"><Ic name="plus" className="w-4 h-4" />Добавить</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr>{getHeaders(type).map(h => <th key={h}>{h}</th>)}<th></th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="click" onClick={() => onEdit(item.id)}>
                  {renderRow(item)}
                  <td><button onClick={e => { e.stopPropagation(); onDelete(item.id); }} className="icon-btn"><Ic name="trash" className="w-4 h-4" /></button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--fg-3)]">Нет записей. Добавьте первую!</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function getHeaders(type: string): string[] {
  switch (type) {
    case 'est': return ['Раздел', 'Объект', 'Дата', 'Сумма', 'Статус'];
    case 'inv': return ['Номер', 'Покупатель', 'Сумма', 'Срок', 'Оплата'];
    case 'contract': return ['Номер', 'Контрагент', 'Сумма', 'Дата', 'Статус'];
    case 'act': return ['Вид', 'Заказчик', 'Сумма', 'Статус'];
    case 'pur': return ['Наименование', 'Кол-во', 'Цена', 'Поставщик', 'Статус'];
    case 'client': return ['Наименование', 'ИНН', 'Контакт', 'Телефон'];
    case 'contractor': return ['Имя', 'Специализация', 'Телефон', 'Ставка'];
    case 'journal': return ['Тип', 'Объект', 'Ответственный', 'Статус'];
    case 'cert': return ['Материал', 'Документ', 'Поставщик', 'Статус'];
    case 'itd': return ['Вид работ', 'Объект', 'Готово', 'Прогресс'];
    case 'pd': return ['Шифр', 'Наименование', 'Объект', 'Статус'];
    default: return ['Данные'];
  }
}

// ==================== BANK PAGE ====================
function BankPage({ state, onEdit, onNew, onDelete }: { state: AppState; onEdit: (id: string) => void; onNew: (t?: string) => void; onDelete: (id: string) => void }) {
  const accounts = getAll(state, 'bank');
  const ops = getAll(state, 'bankop');

  return (
    <>
      <div className="page-head">
        <div><h1>Банк</h1></div>
        <div className="actions">
          <button onClick={() => onNew('bankop')} className="btn"><Ic name="plus" className="w-4 h-4" />Операцию</button>
          <button onClick={() => onNew('bank')} className="btn primary"><Ic name="plus" className="w-4 h-4" />Счёт</button>
        </div>
      </div>
      <div className="grid g2">
        {accounts.map(a => {
          const aOps = ops.filter(o => (o as any).account === a.id);
          const balance = num((a as any).balance) + aOps.reduce((s, o) => s + num((o as any).income) - num((o as any).expense), 0);
          return (
            <div key={a.id} className="card">
              <div className="card-head"><h2>{esc((a as any).name)}</h2><button onClick={() => onEdit(a.id)} className="icon-btn"><Ic name="pencil" className="w-4 h-4" /></button></div>
              <div className="kpi"><div className="label">Остаток</div><div className="value">{rub(balance)}</div><div className="delta">{esc((a as any).bank)} • {esc((a as any).rs)}</div></div>
            </div>
          );
        })}
        {accounts.length === 0 && <div className="card col-span-2"><p className="text-[var(--fg-3)]">Добавьте расчётный счёт</p></div>}
      </div>
      {ops.length > 0 && (
        <div className="card">
          <div className="card-head"><h2>Последние операции</h2></div>
          <div className="tbl-wrap"><table><thead><tr><th>Дата</th><th>Контрагент</th><th>Назначение</th><th>Приход</th><th>Расход</th><th></th></tr></thead>
            <tbody>{ops.sort((a, b) => String((b as any).date).localeCompare(String((a as any).date))).slice(0, 20).map(o => (
              <tr key={o.id} className="click" onClick={() => onEdit(o.id)}>
                <td>{ruShort((o as any).date)}</td><td>{esc((o as any).contragent)}</td><td className="text-sm">{esc((o as any).purpose)}</td>
                <td className="num text-[var(--ok)]">{num((o as any).income) ? rub(num((o as any).income)) : ''}</td>
                <td className="num text-[var(--bad)]">{num((o as any).expense) ? rub(num((o as any).expense)) : ''}</td>
                <td><button onClick={e => { e.stopPropagation(); onDelete(o.id); }} className="icon-btn"><Ic name="trash" className="w-4 h-4" /></button></td>
              </tr>
            ))}</tbody></table></div>
        </div>
      )}
    </>
  );
}

// ==================== SETTINGS PAGE ====================
function SettingsPage({ state, onUpdate, onExport, onImport, onClear, showToast }: { state: AppState; onUpdate: (s: Partial<any>) => void; onExport: () => void; onImport: (f: File) => Promise<void>; onClear: () => void; showToast: (m: string) => void }) {
  const s = state.settings;
  return (
    <>
      <div className="page-head"><div><h1>Настройки</h1></div></div>
      <div className="grid g2">
        <div className="card">
          <div className="card-head"><h2>Реквизиты</h2></div>
          <div className="space-y-3">
            {[['company', 'Организация'], ['inn', 'ИНН'], ['kpp', 'КПП'], ['address', 'Адрес'], ['phone', 'Телефон'], ['director', 'Руководитель']].map(([k, l]) => (
              <div key={k}><label className="text-xs text-[var(--fg-2)] block mb-1">{l}</label><input value={(s as any)[k] || ''} onChange={e => onUpdate({ [k]: e.target.value })} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm" /></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h2>Банковские реквизиты</h2></div>
          <div className="space-y-3">
            {[['bank', 'Банк'], ['rs', 'Расчётный счёт'], ['ks', 'Корр. счёт'], ['bik', 'БИК'], ['nds', 'НДС']].map(([k, l]) => (
              <div key={k}><label className="text-xs text-[var(--fg-2)] block mb-1">{l}</label><input value={(s as any)[k] || ''} onChange={e => onUpdate({ [k]: e.target.value })} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm" /></div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h2>Данные</h2></div>
        <div className="flex flex-wrap gap-3">
          <button onClick={onExport} className="btn"><Ic name="download" className="w-4 h-4" />Скачать копию</button>
          <label className="btn cursor-pointer"><Ic name="upload" className="w-4 h-4" />Загрузить<input type="file" accept=".json" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { await onImport(f); showToast('Данные загружены'); } }} /></label>
          <button onClick={onClear} className="btn text-[var(--bad)]"><Ic name="trash" className="w-4 h-4" />Удалить все данные</button>
        </div>
      </div>
    </>
  );
}

// ==================== MODAL ====================
function Modal({ state, modal, onClose, onSave, onDelete }: { state: AppState; modal: { type: string; id?: string; pre?: Record<string, any> }; onClose: () => void; onSave: (type: string, values: Record<string, any>, id?: string) => void; onDelete: (id: string) => void }) {
  const spec = FORM_SPECS[modal.type];
  if (!spec) return null;
  const existing = modal.id ? state.items[modal.id] : null;
  const [values, setValues] = useState<Record<string, any>>(() => {
    if (existing) return { ...existing };
    if (modal.pre) return { ...modal.pre };
    return {};
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const miss = spec.fields.filter(f => f.req && (!values[f.k] || (Array.isArray(values[f.k]) && values[f.k].length === 0)));
    if (miss.length) { setError('Заполните: ' + miss.map(f => f.l).join(', ')); return; }
    onSave(modal.type, values, modal.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-[var(--surface)] rounded-xl border border-[var(--line)] shadow-xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
          <h2 className="font-semibold">{modal.id ? 'Изменить' : 'Новый'} {spec.n}</h2>
          <button onClick={onClose} className="icon-btn"><Ic name="x" className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-[var(--bad-soft)] text-[var(--bad)] text-sm rounded-lg">{error}</div>}
          {spec.fields.map(f => {
            if (f.t === 'h') return null;
            const val = values[f.k] ?? '';
            return (
              <div key={f.k}>
                <label className="text-xs text-[var(--fg-2)] block mb-1">{f.l}{f.req && ' *'}</label>
                {f.t === 'text' && <input value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm" />}
                {f.t === 'number' && <input type="number" value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm" />}
                {f.t === 'date' && <input type="date" value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm" />}
                {f.t === 'url' && <input type="url" value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm" />}
                {f.t === 'textarea' && <textarea value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} rows={3} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm" />}
                {f.t === 'select' && <select value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm">{f.opts.map((o: string) => <option key={o} value={o}>{o}</option>)}</select>}
                {f.t === 'checks' && <div className="flex flex-wrap gap-2">{f.opts.map((o: string) => <label key={o} className="flex items-center gap-1.5 text-sm"><input type="checkbox" value={o} checked={(val || []).includes(o)} onChange={e => { const arr = val || []; setValues(v => ({ ...v, [f.k]: e.target.checked ? [...arr, o] : arr.filter((x: string) => x !== o) })); }} />{o}</label>)}</div>}
                {f.t === 'obj' && <select value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm"><option value="">—</option>{(getAll(state, 'obj') as Obj[]).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>}
                {f.t === 'bank' && <select value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm"><option value="">—</option>{getAll(state, 'bank').map(b => <option key={b.id} value={b.id}>{(b as any).name}</option>)}</select>}
                {f.t === 'journal' && <select value={val} onChange={e => setValues(v => ({ ...v, [f.k]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-md text-sm"><option value="">—</option>{getAll(state, 'journal').filter(j => (j as any).obj === values.obj).map(j => <option key={j.id} value={(j as any).code}>{JLIB[(j as any).code]?.t || (j as any).code}</option>)}</select>}
              </div>
            );
          })}
          <div className="flex justify-between pt-2">
            {modal.id ? <button type="button" onClick={() => onDelete(modal.id!)} className="btn text-[var(--bad)]"><Ic name="trash" className="w-4 h-4" />Удалить</button> : <div />}
            <button type="submit" className="btn primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
}
