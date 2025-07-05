export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isTokenValid(token) {
  if (!token) return false;
  
  try {
    // Simple check - if token exists and is not empty
    return token.length > 0;
  } catch (error) {
    return false;
  }
} 