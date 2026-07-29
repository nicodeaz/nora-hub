// Shared connection details for the darelsalto.com PHP backend (mail/) that
// backs both the server-side PIN lockout and the workshop reservations list.
// Fixed endpoints (not user-editable) so there's one less thing to misconfigure;
// only the admin token is a secret Nora pastes in once from mail/.env.

export const BACKEND_BASE_URL = 'https://darelsalto.com/mail';
export const PIN_GUARD_URL = `${BACKEND_BASE_URL}/pin-guard.php`;
export const RESERVATIONS_URL = `${BACKEND_BASE_URL}/reservations.php`;

const DEVICE_ID_KEY = 'nora_hub_device_id';
const ADMIN_TOKEN_KEY = 'nora_hub_admin_token';

/** Stable per-browser id sent with PIN attempts so the server can lock out a
 * specific device, not just its IP (home wifi is often shared). */
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getAdminToken(): string {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}
