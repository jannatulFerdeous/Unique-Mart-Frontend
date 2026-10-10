// Reads a JWT's payload without verifying it. Only for display/routing on the
// client (e.g. which user just signed in); the server is what trusts tokens.
export const readJwtPayload = <T>(token: string): T | null => {
  const part = token.split(".")[1];
  if (!part) return null;

  try {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
};
