const normalizeBase = (value) => (value ? value.replace(/\/$/, '') : value);

const envBase = normalizeBase(process.env.NEXT_PUBLIC_SITE_URL);
const localhostFallback = 'http://localhost:3000';

export const serverUrl = `${envBase || localhostFallback}/api`;
