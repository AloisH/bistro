import { auth } from '../../features/auth/auth-config';

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event));
});
