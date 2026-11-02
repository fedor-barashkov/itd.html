// ==================== УТИЛИТЫ ====================

export const esc = (s: string | undefined | null): string => {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const num = (s: string | number | undefined | null): number => {
  if (typeof s === 'number') return isNaN(s) ? 0 : s;
  if (!s) return 0;
  const n = parseFloat(String(s).replace(/\s/g, '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
};

export const rub = (n: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
};

export const pct = (a: number, b: number): string => {
  if (!b) return '0%';
  return Math.round((a / b) * 100) + '%';
};

export const isoOf = (d: Date): string => {
  return d.toISOString().slice(0, 10);
};

export const TODAY = isoOf(new Date());

export const ru = (iso: string): string => {
  if (!iso) return '';
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [y, m, d] = iso.split('-');
  return `${+d} ${months[+m - 1]} ${y} г.`;
};

export const ruShort = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};

export const addDays = (iso: string, days: number): string => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return isoOf(d);
};

export const newId = (type: string): string => {
  return `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

export const nextNumber = (items: any[], type: string): string => {
  const nums = items
    .filter(i => i.type === type && i.n)
    .map(i => parseInt(i.n))
    .filter(n => !isNaN(n));
  return String((nums.length ? Math.max(...nums) : 0) + 1);
};

export const formatDate = (iso: string): string => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('ru-RU');
  } catch {
    return iso;
  }
};

export const relativeTime = (iso: string): string => {
  const now = new Date();
  const d = new Date(iso);
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'сегодня';
  if (diff === 1) return 'вчера';
  if (diff < 7) return `${diff} дн. назад`;
  if (diff < 30) return `${Math.floor(diff / 7)} нед. назад`;
  if (diff < 365) return `${Math.floor(diff / 30)} мес. назад`;
  return `${Math.floor(diff / 365)} г. назад`;
};

export const sumWords = (n: number): string => {
  n = Math.round(n);
  const o = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const of_ = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const t = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const d = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const h = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

  const tri = (x: number, f: boolean): string => {
    const a = [h[Math.floor(x / 100)]];
    let r = x % 100;
    if (r >= 10 && r < 20) {
      a.push(t[r - 10]);
    } else {
      a.push(d[Math.floor(r / 10)]);
      a.push((f ? of_ : o)[r % 10]);
    }
    return a.filter(Boolean).join(' ');
  };

  const form = (x: number, w: string[]): string => {
    const r = x % 100, u = x % 10;
    return w[r > 10 && r < 20 ? 2 : u === 1 ? 0 : u >= 2 && u <= 4 ? 1 : 2];
  };

  if (!n) return 'ноль рублей';
  const parts: string[] = [];
  const mlr = Math.floor(n / 1e9) % 1000;
  const ml = Math.floor(n / 1e6) % 1000;
  const th = Math.floor(n / 1e3) % 1000;
  const u = n % 1000;

  if (mlr) parts.push(tri(mlr, false) + ' ' + form(mlr, ['миллиард', 'миллиарда', 'миллиардов']));
  if (ml) parts.push(tri(ml, false) + ' ' + form(ml, ['миллион', 'миллиона', 'миллионов']));
  if (th) parts.push(tri(th, true) + ' ' + form(th, ['тысяча', 'тысячи', 'тысяч']));
  if (u) parts.push(tri(u, false));

  const s = parts.join(' ') + ' ' + form(n, ['рубль', 'рубля', 'рублей']);
  return s[0].toUpperCase() + s.slice(1);
};
