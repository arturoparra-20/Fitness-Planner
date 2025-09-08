type OTPEntry = { code: string; expiresAt: number };

const otpStore = new Map<string, OTPEntry>();

export function setOtp(email: string, code: string) {
  otpStore.set(email, { code, expiresAt: Date.now() + 60 * 60 * 1000 }); // 1h
}

export function verifyOtp(email: string, code: string): boolean {
  const entry = otpStore.get(email);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  const isValid = entry.code === code;
  if (isValid) otpStore.delete(email);
  return isValid;
}
