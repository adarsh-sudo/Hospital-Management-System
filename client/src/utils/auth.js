export const getToken    = () => localStorage.getItem('mc_token');
export const setToken    = (t) => localStorage.setItem('mc_token', t);
export const removeToken = () => localStorage.removeItem('mc_token');
export const isAuthenticated = () => !!getToken();

export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function getUserRole() {
  return getUser()?.role || null;
}

export function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}
