import { Debtor, Transaction, WorkflowEntry } from '../types';

const WEB_APP_URL = import.meta.env.VITE_SHEETS_WEB_APP_URL || '';
const API_TOKEN = import.meta.env.VITE_SHEETS_API_TOKEN || '';

export interface SheetData {
  debtors: Debtor[];
  transactions: Transaction[];
  workflowEntries: WorkflowEntry[];
}

export interface SheetAction {
  type: 'replaceAll' | 'upsertDebtor' | 'upsertTransaction' | 'upsertWorkflowEntry' | 'deleteDebtor' | 'reset';
  debtor?: Debtor;
  transaction?: Transaction;
  workflowEntry?: WorkflowEntry;
  debtors?: Debtor[];
  transactions?: Transaction[];
  workflowEntries?: WorkflowEntry[];
  debtorId?: string;
}

export function isSheetsSyncConfigured() {
  return Boolean(WEB_APP_URL);
}

export function readSheetData(): Promise<SheetData> {
  if (!WEB_APP_URL) {
    return Promise.reject(new Error('Google Sheets sync is not configured.'));
  }

  return new Promise((resolve, reject) => {
    const callbackName = `debtflowSheetsCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const url = new URL(WEB_APP_URL);

    url.searchParams.set('action', 'read');
    url.searchParams.set('callback', callbackName);
    if (API_TOKEN) url.searchParams.set('token', API_TOKEN);

    const script = document.createElement('script');
    const cleanup = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      script.remove();
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Google Sheets read timed out.'));
    }, 15000);

    (window as unknown as Record<string, unknown>)[callbackName] = (response: { ok: boolean; data?: SheetData; error?: string }) => {
      window.clearTimeout(timeout);
      cleanup();

      if (!response.ok || !response.data) {
        reject(new Error(response.error || 'Google Sheets read failed.'));
        return;
      }

      resolve(response.data);
    };

    script.onerror = () => {
      window.clearTimeout(timeout);
      cleanup();
      reject(new Error('Google Sheets read failed. The Apps Script URL is probably not deployed with access set to Anyone.'));
    };

    script.src = url.toString();
    document.body.appendChild(script);
  });
}

export function postSheetAction(action: SheetAction): Promise<void> {
  if (!WEB_APP_URL) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const iframeName = `debtflowSheetsPost_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const iframe = document.createElement('iframe');
    const form = document.createElement('form');
    const payload = document.createElement('input');
    const token = document.createElement('input');

    iframe.name = iframeName;
    iframe.style.display = 'none';

    form.method = 'POST';
    form.action = WEB_APP_URL;
    form.target = iframeName;
    form.style.display = 'none';

    payload.name = 'payload';
    payload.value = JSON.stringify(action);

    token.name = 'token';
    token.value = API_TOKEN;

    form.append(payload, token);
    document.body.append(iframe, form);

    let submitted = false;
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Google Sheets write timed out.'));
    }, 15000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      form.remove();
      iframe.remove();
    };

    iframe.onload = () => {
      if (!submitted) return;
      cleanup();
      resolve();
    };

    submitted = true;
    form.submit();
  });
}
