const API_BASE = "http://localhost:8080";

export async function apiRequest(
  path,
  method = "GET",
  body = null,
  token = null
) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Network error (could be CORS), force logout
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired or network error. Please log in again.');
  }

  if (res.status === 401 || res.status === 403) {
    // Try to parse the error message
    let errorMsg = '';
    try {
      errorMsg = await res.text();
    } catch (e) {}
    // Check for common JWT/token error messages
    if (
      errorMsg.toLowerCase().includes('jwt') ||
      errorMsg.toLowerCase().includes('token') ||
      errorMsg.toLowerCase().includes('expired') ||
      errorMsg.toLowerCase().includes('invalid')
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    } else {
      throw new Error(errorMsg || 'Unauthorized');
    }
  }

  if (!res.ok) throw new Error(await res.text());
  
  // Check if response is JSON or text
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    return res.text();
  }
} 