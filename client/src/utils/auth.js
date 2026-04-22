export const getToken    = () => localStorage.getItem('mc_token');
export const setToken    = (t) => localStorage.setItem('mc_token', t);
export const removeToken = () => localStorage.removeItem('mc_token');
export const isAuthenticated = () => !!getToken();

export function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

export function getUserRole() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}
