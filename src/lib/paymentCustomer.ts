/**
 * Centralized customer data sanitization and validation for PIX payments.
 */

export function sanitizeCustomerName(name: string): string {
  return (name || '')
    .trim()
    .replace(/\s*[-–]\s*\d+\s*$/, '') // remove trailing " - 02" style suffixes
    .replace(/\s{2,}/g, ' ')          // collapse multiple spaces
    .trim();
}

export function sanitizeDocument(cpf: string): string {
  return (cpf || '').replace(/\D/g, '');
}

export function sanitizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}

export function isValidCpf(cpfDigits: string): boolean {
  if (cpfDigits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfDigits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpfDigits[i]) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem === 10) rem = 0;
  if (rem !== parseInt(cpfDigits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpfDigits[i]) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem === 10) rem = 0;
  if (rem !== parseInt(cpfDigits[10])) return false;

  return true;
}

export interface CustomerData {
  name: string;
  email: string;
  document: string;
  phone: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  customer: CustomerData;
}

export function validateCustomerForPix(raw: {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
}): ValidationResult {
  const name = sanitizeCustomerName(raw.nome || '');
  const email = (raw.email || '').trim().toLowerCase();
  const document = sanitizeDocument(raw.cpf || '');
  const phone = sanitizePhone(raw.telefone || '');

  const errors: string[] = [];

  if (name.length < 2) errors.push('Nome inválido ou muito curto.');
  if (!email.includes('@') || !email.includes('.')) errors.push('E-mail inválido.');
  if (!isValidCpf(document)) errors.push('CPF inválido.');
  if (phone.length < 10 || phone.length > 11) errors.push('Telefone inválido.');

  return {
    valid: errors.length === 0,
    errors,
    customer: { name, email, document, phone },
  };
}
