import { buildLlmsTxt } from '@/lib/llms/build';

export async function GET() {
  return new Response(await buildLlmsTxt(true), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
