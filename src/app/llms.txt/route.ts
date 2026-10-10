import { llmsTxt } from '@/lib/agents';
import { docsLlms } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  return new Response(llmsTxt(await docsLlms.index()), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
