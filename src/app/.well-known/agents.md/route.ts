import { AGENTS_MD } from '@/lib/agents';

export const revalidate = false;

export function GET() {
  return new Response(AGENTS_MD, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
