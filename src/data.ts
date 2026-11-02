import type { Zone, Settings } from './types';

// ==================== ЗОНЫ ====================
export const ZONES: Record<Zone, { t: string; i: string; tabs: string[] }> = {
  est: { t: 'Сметы', i: 'calculator', tabs: ['summary', 'estimate', 'pd', 'project', 'purchases', 'money', 'files'] },
  itd: { t: 'ИТД', i: 'clipboard-check', tabs: ['summary', 'id', 'journals', 'certs', 'estimate', 'project', 'purchases', 'money', 'files'] },
  biz: { t: 'Бизнес', i: 'briefcase', tabs: ['summary', 'contracts', 'invoices', 'acts', 'bank', 'purchases', 'clients', 'contractors', 'integrations'] },
};

export const ZONE_ORDER_DEFAULT: Zone[] = ['est', 'itd', 'biz'];

// ==================== НАВИГАЦИЯ ====================
export const NAV_ITEMS: { id: string; label: string; icon: string; zone?: Zone }[] = [
  { id: 'dashboard', label: 'Главная', icon: 'layout-dashboard' },
  { id: 'objects', label: 'Объекты', icon: 'building-2' },
  { id: 'tasks', label: 'Задачи', icon: 'check-square' },
  { id: 'estimates', label: 'Сметы', icon: 'calculator', zone: 'est' },
  { id: 'pd', label: 'Разделы ПД', icon: 'drafting-compass', zone: 'est' },
  { id: 'id', label: 'ИТД', icon: 'clipboard-check', zone: 'itd' },
  { id: 'journals', label: 'Журналы', icon: 'notebook-pen', zone: 'itd' },
  { id: 'certs', label: 'Сертификаты', icon: 'badge-check', zone: 'itd' },
  { id: 'contracts', label: 'Договоры', icon: 'file-text', zone: 'biz' },
  { id: 'invoices', label: 'Счета', icon: 'receipt', zone: 'biz' },
  { id: 'acts', label: 'Акты', icon: 'file-check', zone: 'biz' },
  { id: 'bank', label: 'Банк', icon: 'landmark', zone: 'biz' },
  { id: 'purchases', label: 'Закупки', icon: 'shopping-cart' },
  { id: 'clients', label: 'Заказчики', icon: 'users', zone: 'biz' },
  { id: 'contractors', label: 'Исполнители', icon: 'hard-hat', zone: 'biz' },
  { id: 'settings', label: 'Настройки', icon: 'settings' },
];

// ==================== БИБЛИОТЕКА ЖУРНАЛОВ ====================
export const JLIB: Record<string, { t: string; i: string }> = {
  'КС-1': { t: 'Общий журнал работ', i: 'book-open' },
  'КС-1а': { t: 'Журнал подготовительных работ', i: 'book' },
  'КС-2': { t: 'Индивидуальный спецжурнал', i: 'book-marked' },
  'КС-3': { t: 'Журнал бетонных работ', i: 'book' },
  'КС-4': { t: 'Журнал сварочных работ', i: 'book' },
  'КС-5': { t: 'Журнал антикоррозийной защиты', i: 'book' },
  'КС-6': { t: 'Журнал изоляционных работ', i: 'book' },
  'ОС': { t: 'Журнал авторского надзора', i: 'book' },
};

// ==================== НОРМАТИВНЫЙ ПЕРЕЧЕНЬ ИТД ====================
export const ITD_LIB: Record<string, { sec: string; t: string; ic: string; need: number }> = {
  'АОСР': { sec: 'Акты освидетельствования', t: 'АОСР (скрытые работы)', ic: 'file-check', need: 0 },
  'АОКР': { sec: 'Акты освидетельствования', t: 'АОКР (конструкции)', ic: 'file-check', need: 0 },
  'АОУР': { sec: 'Акты освидетельствования', t: 'АОУР (устройства)', ic: 'file-check', need: 0 },
  'Исполнительные схемы': { sec: 'Чертежи', t: 'Исполнительные схемы', ic: 'map', need: 0 },
  'Паспорта': { sec: 'Документы о качестве', t: 'Паспорта на материалы', ic: 'badge-check', need: 0 },
  'Сертификаты': { sec: 'Документы о качестве', t: 'Сертификаты соответствия', ic: 'badge-check', need: 0 },
  'Протоколы испытаний': { sec: 'Документы о качестве', t: 'Протоколы лабораторных испытаний', ic: 'flask-conical', need: 0 },
  'Журнал КС-1': { sec: 'Журналы работ', t: 'Общий журнал работ (КС-1)', ic: 'notebook-pen', need: 1 },
  'Журнал КС-6': { sec: 'Журналы работ', t: 'Журнал изоляционных работ', ic: 'notebook-pen', need: 0 },
};

export const ITD_SECTIONS = [
  'Акты освидетельствования',
  'Чертежи',
  'Документы о качестве',
  'Журналы работ',
];

// ==================== СТАТУСЫ ====================
export const STATUS_OBJ = ['В работе', 'Завершён', 'Приостановлен', 'Планируется'];
export const STATUS_EST = ['В работе', 'Согласована', 'Замечания', 'Сдана'];
export const STATUS_PD = ['В работе', 'Согласован', 'Замечания', 'Сдан'];
export const STATUS_IDACT = ['В работе', 'Подписан', 'Замечания'];
export const STATUS_JOURNAL = ['Открыт', 'Закрыт'];
export const STATUS_CERT = ['Ожидается', 'Получен', 'Просрочен'];
export const STATUS_CONTRACT = ['Проект', 'Действует', 'Исполнен', 'Расторгнут'];
export const STATUS_INV = ['Выставлен', 'Оплачен', 'Просрочен'];
export const STATUS_ACT = ['Проект', 'Подписан', 'Оплачен'];
export const STATUS_PUR = ['Черновик', 'Отправлена', 'Подтверждена', 'Исполнена', 'Отменена'];

// ==================== ВИДЫ РАБОТ ====================
export const WORK_TYPES = ['Общестроительные', 'Электрика', 'Сантехника', 'Вентиляция', 'Отделка'];

// ==================== ЕДИНИЦЫ ИЗМЕРЕНИЯ ====================
export const UNITS = ['шт', 'м', 'м²', 'м³', 'кг', 'т', 'л', 'компл', 'усл'];

// ==================== НАЧальные настройки ====================
export const DEFAULT_SETTINGS: Settings = {
  company: '',
  inn: '',
  kpp: '',
  address: '',
  phone: '',
  director: '',
  bank: '',
  rs: '',
  ks: '',
  bik: '',
  nds: 'Без НДС (УСН)',
  zone: 'est',
  theme: 'system',
  order: ZONE_ORDER_DEFAULT,
};

// ==================== ФОРМЫ СОЗДАНИЯ ====================
export const FORM_SPECS: Record<string, { n: string; i: string; fields: any[] }> = {
  obj: {
    n: 'Объект', i: 'building-2',
    fields: [
      { k: 'name', l: 'Наименование объекта', t: 'text', req: true },
      { k: 'city', l: 'Город', t: 'text' },
      { k: 'client', l: 'Заказчик', t: 'text' },
      { k: 'inn', l: 'ИНН заказчика', t: 'text' },
      { k: 'zastr', l: 'Застройщик', t: 'text' },
      { k: 'builder', l: 'Лицо, осуществляющее строительство', t: 'text' },
      { k: 'designer', l: 'Проектировщик', t: 'text' },
      { k: 'work', l: 'Виды работ', t: 'checks', opts: WORK_TYPES },
      { k: 'sum', l: 'Сумма договора, ₽', t: 'number' },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_OBJ },
      { k: 'folder', l: 'Ссылка на папку', t: 'url' },
      { k: 'notes', l: 'Примечания', t: 'textarea' },
    ],
  },
  task: {
    n: 'Задача', i: 'check-square',
    fields: [
      { k: 'title', l: 'Название', t: 'text', req: true },
      { k: 'obj', l: 'Объект', t: 'obj' },
      { k: 'due', l: 'Срок', t: 'date' },
      { k: 'priority', l: 'Приоритет', t: 'select', opts: ['low', 'medium', 'high'] },
    ],
  },
  est: {
    n: 'Смета', i: 'calculator',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj', req: true },
      { k: 'section', l: 'Раздел', t: 'text', req: true },
      { k: 'date', l: 'Дата', t: 'date' },
      { k: 'sum', l: 'Сумма, ₽', t: 'number', req: true },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_EST },
      { k: 'remark', l: 'Замечаний экспертизы', t: 'number' },
      { k: 'notes', l: 'Примечания', t: 'textarea' },
    ],
  },
  pd: {
    n: 'Раздел ПД', i: 'drafting-compass',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj', req: true },
      { k: 'code', l: 'Шифр раздела', t: 'text', req: true },
      { k: 'title', l: 'Наименование', t: 'text', req: true },
      { k: 'stage', l: 'Стадия (П/Р)', t: 'select', opts: ['П', 'Р'] },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_PD },
    ],
  },
  itd: {
    n: 'Комплект ИТД', i: 'clipboard-check',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj', req: true },
      { k: 'code', l: 'Вид работ', t: 'select', opts: Object.keys(ITD_LIB), req: true },
      { k: 'need', l: 'Нужно документов', t: 'number' },
      { k: 'done', l: 'Готово', t: 'number' },
    ],
  },
  idact: {
    n: 'Акт ИД', i: 'file-check',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj', req: true },
      { k: 'kind', l: 'Вид акта', t: 'select', opts: ['АОСР', 'АОКР', 'АОУР'], req: true },
      { k: 'd1', l: 'Дата начала работ', t: 'date', req: true },
      { k: 'd2', l: 'Дата окончания', t: 'date', req: true },
      { k: 'works', l: 'Наименование скрытых работ', t: 'textarea', req: true },
      { k: 'proj', l: 'Проектная документация', t: 'textarea' },
      { k: 'mats', l: 'Применённые материалы', t: 'textarea' },
      { k: 'docs', l: 'Предъявленные документы', t: 'textarea' },
      { k: 'norms', l: 'Соответствует требованиям', t: 'textarea' },
      { k: 'next', l: 'Последующие работы', t: 'textarea' },
      { k: 'extra', l: 'Дополнительные сведения', t: 'textarea' },
      { k: 'copies', l: 'Кол-во экземпляров', t: 'number' },
      { k: 'appx', l: 'Приложения', t: 'textarea' },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_IDACT },
    ],
  },
  journal: {
    n: 'Журнал работ', i: 'notebook-pen',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj', req: true },
      { k: 'code', l: 'Тип журнала', t: 'select', opts: Object.keys(JLIB), req: true },
      { k: 'resp', l: 'Ответственный за ведение', t: 'text', req: true },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_JOURNAL },
    ],
  },
  jentry: {
    n: 'Запись в журнал', i: 'pen-line',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj', req: true },
      { k: 'code', l: 'Журнал', t: 'journal', req: true },
      { k: 'date', l: 'Дата', t: 'date', req: true },
      { k: 'text', l: 'Наименование работ', t: 'textarea', req: true },
      { k: 'who', l: 'Кто внёс', t: 'text', req: true },
    ],
  },
  cert: {
    n: 'Сертификат / паспорт', i: 'badge-check',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj', req: true },
      { k: 'material', l: 'Материал / изделие', t: 'text', req: true },
      { k: 'doc', l: 'Номер документа', t: 'text' },
      { k: 'supplier', l: 'Поставщик', t: 'text' },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_CERT },
    ],
  },
  contract: {
    n: 'Договор', i: 'file-text',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj' },
      { k: 'n', l: 'Номер', t: 'text', req: true },
      { k: 'date', l: 'Дата', t: 'date', req: true },
      { k: 'client', l: 'Контрагент', t: 'text', req: true },
      { k: 'subject', l: 'Предмет договора', t: 'textarea' },
      { k: 'sum', l: 'Сумма, ₽', t: 'number' },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_CONTRACT },
    ],
  },
  inv: {
    n: 'Счёт', i: 'receipt',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj' },
      { k: 'client', l: 'Покупатель', t: 'text' },
      { k: 'what', l: 'Наименование услуг', t: 'text', req: true },
      { k: 'sum', l: 'Сумма, ₽', t: 'number', req: true },
      { k: 'date', l: 'Дата', t: 'date' },
      { k: 'due', l: 'Оплатить до', t: 'date', req: true },
    ],
  },
  act: {
    n: 'Акт / КС-2 / КС-3', i: 'file-check',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj' },
      { k: 'client', l: 'Заказчик', t: 'text' },
      { k: 'kind', l: 'Вид', t: 'select', opts: ['Акт сдачи-приёмки', 'КС-2 / КС-3'], req: true },
      { k: 'stage', l: 'Этап / работы', t: 'textarea', req: true },
      { k: 'sum', l: 'Сумма, ₽', t: 'number', req: true },
      { k: 'date', l: 'Дата акта', t: 'date' },
      { k: 'upd', l: 'Дата УПД', t: 'date' },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_ACT },
    ],
  },
  bank: {
    n: 'Расчётный счёт', i: 'landmark',
    fields: [
      { k: 'name', l: 'Название счёта', t: 'text', req: true },
      { k: 'bank', l: 'Банк', t: 'text', req: true },
      { k: 'rs', l: 'Расчётный счёт', t: 'text', req: true },
      { k: 'ks', l: 'Корр. счёт', t: 'text', req: true },
      { k: 'bik', l: 'БИК', t: 'text', req: true },
      { k: 'balance', l: 'Остаток, ₽', t: 'number' },
    ],
  },
  bankop: {
    n: 'Операция по счёту', i: 'arrow-right-left',
    fields: [
      { k: 'account', l: 'Счёт', t: 'bank', req: true },
      { k: 'date', l: 'Дата', t: 'date', req: true },
      { k: 'contragent', l: 'Контрагент', t: 'text', req: true },
      { k: 'purpose', l: 'Назначение платежа', t: 'text' },
      { k: 'income', l: 'Приход, ₽', t: 'number' },
      { k: 'expense', l: 'Расход, ₽', t: 'number' },
    ],
  },
  pur: {
    n: 'Заявка на закупку', i: 'shopping-cart',
    fields: [
      { k: 'obj', l: 'Объект', t: 'obj' },
      { k: 'what', l: 'Что закупаем', t: 'text', req: true },
      { k: 'qty', l: 'Количество', t: 'number', req: true },
      { k: 'unit', l: 'Ед. изм.', t: 'select', opts: UNITS },
      { k: 'price', l: 'Цена, ₽', t: 'number' },
      { k: 'supplier', l: 'Поставщик', t: 'text' },
      { k: 'due', l: 'Срок', t: 'date' },
      { k: 'status', l: 'Статус', t: 'select', opts: STATUS_PUR },
    ],
  },
  client: {
    n: 'Заказчик', i: 'users',
    fields: [
      { k: 'name', l: 'Наименование', t: 'text', req: true },
      { k: 'inn', l: 'ИНН', t: 'text' },
      { k: 'contact', l: 'Контактное лицо', t: 'text' },
      { k: 'phone', l: 'Телефон', t: 'text' },
      { k: 'email', l: 'Email', t: 'text' },
    ],
  },
  contractor: {
    n: 'Исполнитель', i: 'hard-hat',
    fields: [
      { k: 'name', l: 'Наименование / ФИО', t: 'text', req: true },
      { k: 'inn', l: 'ИНН', t: 'text' },
      { k: 'speciality', l: 'Специализация', t: 'text' },
      { k: 'phone', l: 'Телефон', t: 'text' },
      { k: 'rate', l: 'Ставка, ₽/час', t: 'number' },
    ],
  },
};
