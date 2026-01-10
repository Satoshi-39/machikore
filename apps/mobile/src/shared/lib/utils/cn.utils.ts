/**
 * Utility function for merging class names
 * Used with NativeWind and react-native-reusables
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using clsx and tailwind-merge
 * Handles conditional classes and resolves conflicting Tailwind classes
 *
 * @example
 * // Basic usage
 * cn('p-4', 'bg-primary')
 *
 * // Conditional classes
 * cn('p-4', isActive && 'bg-primary', isDisabled && 'opacity-50')
 *
 * // Override conflicting classes (rightmost wins)
 * cn('p-4', 'p-8') // Results in 'p-8'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
