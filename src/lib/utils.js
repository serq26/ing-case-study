export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').substring(0, 10);

  let formatted = '';
  if (digits.length > 0) {
    formatted += '(' + digits.substring(0, 3);
  }
  if (digits.length >= 4) {
    formatted += ') ' + digits.substring(3, 6);
  }
  if (digits.length >= 7) {
    formatted += ' ' + digits.substring(6, 8);
  }
  if (digits.length >= 9) {
    formatted += ' ' + digits.substring(8, 10);
  }

  return formatted;
}
