/**
 * Debug Logger untuk troubleshooting di Production
 * Simpan logs ke localStorage dan console untuk analisis
 */

export interface DebugLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  module: string;
  message: string;
  data?: any;
}

const MAX_LOGS = 100;
const LOGS_KEY = 'debug_logs';

export const useDebugLogger = (module: string) => {
  const log = (level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry: DebugLog = {
      timestamp,
      level,
      module,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined // Deep copy to avoid circular refs
    };

    // Log to console
    const consoleMethod = level === 'debug' ? 'log' : level;
    (console[consoleMethod as keyof typeof console] as any)(`[${timestamp}] [${module}] ${message}`, data || '');

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const existingLogs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]') as DebugLog[];
        const newLogs = [logEntry, ...existingLogs].slice(0, MAX_LOGS);
        localStorage.setItem(LOGS_KEY, JSON.stringify(newLogs));
      } catch (e) {
        console.error('Failed to save debug log to localStorage:', e);
      }
    }
  };

  return {
    info: (msg: string, data?: any) => log('info', msg, data),
    warn: (msg: string, data?: any) => log('warn', msg, data),
    error: (msg: string, data?: any) => log('error', msg, data),
    debug: (msg: string, data?: any) => log('debug', msg, data),
  };
};

/**
 * Export debug logs untuk download/share
 */
export const exportDebugLogs = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const logs = localStorage.getItem(LOGS_KEY) || '[]';
    const logsArray = JSON.parse(logs) as DebugLog[];
    
    const content = logsArray
      .map(log => 
        `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.module}] ${log.message}\n${
          log.data ? JSON.stringify(log.data, null, 2) : ''
        }`
      )
      .join('\n\n---\n\n');
    
    return content;
  } catch (e) {
    console.error('Failed to export debug logs:', e);
    return null;
  }
};

/**
 * Clear debug logs
 */
export const clearDebugLogs = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOGS_KEY);
  }
};

/**
 * Get all debug logs
 */
export const getDebugLogs = (): DebugLog[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]') as DebugLog[];
  } catch {
    return [];
  }
};
