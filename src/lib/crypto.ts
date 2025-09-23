/**
 * Simple password hashing utility using Web Crypto API
 * Note: This is a basic implementation for demo purposes.
 * In production, consider using bcrypt or similar libraries.
 */

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

// Migration helper to check if password is already hashed
export function isPasswordHashed(password: string): boolean {
  // SHA-256 hash is always 64 characters long and contains only hex characters
  return /^[a-f0-9]{64}$/i.test(password);
}