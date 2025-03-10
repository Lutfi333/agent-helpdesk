export function Env() {
  return {
    API_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    API_ACCESS_KEY: process.env.NEXT_PUBLIC_ACCESS_KEY,
  };
}
