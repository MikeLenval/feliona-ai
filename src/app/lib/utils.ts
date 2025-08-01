import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Утилита для объединения CSS классов с поддержкой Tailwind CSS
 * Комбинирует clsx для условных классов и tailwind-merge для правильного слияния Tailwind классов
 *
 * @param inputs - массив значений классов (строки, объекты, массивы)
 * @returns объединенная строка классов
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Утилита для создания условных классов
 * Альтернатива для более простых случаев без Tailwind merge
 */
export { clsx };

/**
 * Форматирование чисел с разделителями тысяч
 * @param num - число для форматирования
 * @returns отформатированная строка или исходное число как строка при ошибке
 */
export function formatNumber(num: number): string {
  // ✅ FIX 1: Добавлена валидация для предотвращения ошибок
  if (!Number.isFinite(num)) return String(num);
  return new Intl.NumberFormat('ru-RU').format(num);
}

/**
 * Создание инициалов из имени
 * @param name - полное имя
 * @returns инициалы (максимум 2 символа)
 */
export function getInitials(name: string): string {
  // ✅ FIX 1: Валидация пустой строки
  if (!name || name.trim().length === 0) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Обрезка текста с многоточием
 * @param str - исходная строка
 * @param length - максимальная длина
 * @returns обрезанная строка с многоточием или исходная строка
 */
export function truncate(str: string, length: number): string {
  // ✅ FIX 2: Валидация длины
  if (length < 0) return str;
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Проверка, является ли значение пустым
 * @param value - значение для проверки
 * @returns true если значение пустое
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Дебаунс функции с возможностью отмены
 * @param func - функция для дебаунса
 * @param wait - время задержки в миллисекундах
 * @returns дебаунсированная функция с методом cancel
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  // ✅ FIX 2: Улучшена типизация, убран слишком широкий unknown[]
  let timeout: ReturnType<typeof setTimeout>;
  
  const debouncedFunc = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  // ✅ FIX 3: Добавлен метод cancel для предотвращения memory leaks
  debouncedFunc.cancel = () => {
    clearTimeout(timeout);
  };
  
  return debouncedFunc;
}

/**
 * Задержка выполнения
 * @param ms - время задержки в миллисекундах
 * @returns Promise, который резолвится через указанное время
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}