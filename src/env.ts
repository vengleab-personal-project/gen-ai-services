import 'dotenv/config';

function toNumber(value: string | undefined, fallback: number): number {
  const parsed = Number((value ?? '').trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toString(value: string | undefined, fallback: string = ''): string {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : fallback;
}

export const env = {
  NODE_ENV: toString(process.env.NODE_ENV, 'development'),
  PORT: toNumber(process.env.PORT, 4002),
  GEMINI_API_KEY: toString(process.env.GEMINI_API_KEY),
  USER_SERVICE_URL: toString(process.env.USER_SERVICE_URL, 'http://localhost:4001'),
};


