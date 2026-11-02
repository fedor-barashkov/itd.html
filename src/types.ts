// ==================== ТИПЫ ДАННЫХ ====================

export type Zone = 'est' | 'itd' | 'biz';

export interface Settings {
  company: string;
  inn: string;
  kpp: string;
  address: string;
  phone: string;
  director: string;
  bank: string;
  rs: string;
  ks: string;
  bik: string;
  nds: string;
  zone: Zone;
  theme: 'light' | 'dark' | 'system';
  order: Zone[];
}

export interface Obj {
  id: string;
  type: 'obj';
  name: string;
  city?: string;
  client?: string;
  inn?: string;
  zastr?: string;
  builder?: string;
  designer?: string;
  rep1?: string;
  rep2?: string;
  rep3?: string;
  rep4?: string;
  rep5?: string;
  work?: string[];
  sum?: number;
  status?: string;
  folder?: string;
  notes?: string;
  created: string;
}

export interface Task {
  id: string;
  type: 'task';
  title: string;
  obj?: string;
  due?: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  created: string;
}

export interface Estimate {
  id: string;
  type: 'est';
  obj: string;
  n: string;
  date: string;
  section: string;
  sum: number;
  status: string;
  remark?: number;
  notes?: string;
}

export interface PDSection {
  id: string;
  type: 'pd';
  obj: string;
  code: string;
  title: string;
  stage: string;
  status: string;
}

export interface ITDSet {
  id: string;
  type: 'itd';
  obj: string;
  code: string;
  title: string;
  need: number;
  done: number;
}

export interface IDAct {
  id: string;
  type: 'idact';
  obj: string;
  kind: string;
  n: string;
  d1: string;
  d2: string;
  works: string;
  proj?: string;
  mats?: string;
  docs?: string;
  norms?: string;
  next?: string;
  extra?: string;
  copies?: number;
  appx?: string;
  status: string;
}

export interface Journal {
  id: string;
  type: 'journal';
  obj: string;
  code: string;
  resp: string;
  status: string;
}

export interface JournalEntry {
  id: string;
  type: 'jentry';
  obj: string;
  code: string;
  date: string;
  text: string;
  who: string;
}

export interface Certificate {
  id: string;
  type: 'cert';
  obj: string;
  material: string;
  doc?: string;
  supplier?: string;
  status: string;
}

export interface Contract {
  id: string;
  type: 'contract';
  obj?: string;
  n: string;
  date: string;
  client: string;
  subject: string;
  sum: number;
  status: string;
}

export interface Invoice {
  id: string;
  type: 'inv';
  obj?: string;
  n: string;
  date: string;
  client?: string;
  what: string;
  sum: number;
  due: string;
  paid: boolean;
}

export interface Act {
  id: string;
  type: 'act';
  obj?: string;
  n: string;
  date: string;
  upd?: string;
  client?: string;
  kind: string;
  stage: string;
  sum: number;
  status: string;
}

export interface BankAccount {
  id: string;
  type: 'bank';
  name: string;
  bank: string;
  rs: string;
  ks: string;
  bik: string;
  balance: number;
}

export interface BankOp {
  id: string;
  type: 'bankop';
  account: string;
  date: string;
  contragent: string;
  purpose: string;
  income: number;
  expense: number;
}

export interface Purchase {
  id: string;
  type: 'pur';
  obj?: string;
  what: string;
  qty: number;
  unit: string;
  price: number;
  supplier?: string;
  status: string;
  due?: string;
}

export interface Client {
  id: string;
  type: 'client';
  name: string;
  inn?: string;
  contact?: string;
  phone?: string;
  email?: string;
}

export interface Contractor {
  id: string;
  type: 'contractor';
  name: string;
  inn?: string;
  speciality?: string;
  phone?: string;
  rate?: number;
}

export type AnyItem =
  | Obj | Task | Estimate | PDSection | ITDSet | IDAct
  | Journal | JournalEntry | Certificate | Contract
  | Invoice | Act | BankAccount | BankOp | Purchase
  | Client | Contractor;

export type ItemType = AnyItem['type'];

export interface AppState {
  items: Record<string, AnyItem>;
  settings: Settings;
}
