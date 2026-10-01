import {randomBytes} from 'node:crypto';
// The school's requested shared code. Account approval remains a separate check.
export const schoolCode='2026';
export const sessionSecret=process.env.APP_SESSION_SECRET||process.env.GROQ_API_KEY||randomBytes(32).toString('hex');
