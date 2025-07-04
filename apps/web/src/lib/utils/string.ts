export function sanitize(string: string, maxLength?: number) {
  if (!string) return ''

  let sanitized = string.replace(/^\s+/, '');
  sanitized = sanitized.replace(/\s{2,}/g, ' ');
  if (maxLength) sanitized = string.slice(0, maxLength);

  return sanitized
}
