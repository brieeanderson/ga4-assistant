// Utility to format ALL_UPPERCASE_UNDERSCORE_TEXT to Title Case
export function formatLabel(value: string) {
  if (!value) return '';
  return value
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 