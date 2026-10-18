import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { generatePolicyImpactSummary, lookupHarmonizedCode } from './src/server/aiHandler.ts';

function taxApiPlugin(): Plugin {
  return {
    name: 'tax-ai-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const isImpactSummary = req.url?.startsWith('/api/tax-ai/impact-summary');
        const isHsLookup = req.url?.startsWith('/api/tax-ai/hs-lookup');

        if (!isImpactSummary && !isHsLookup) {
          return next();
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const payload = body ? JSON.parse(body) : {};
            let result: any = null;

            if (isImpactSummary) {
              result = await generatePolicyImpactSummary(payload);
            } else if (isHsLookup) {
              result = await lookupHarmonizedCode(payload.query, payload.language);
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err) {
            console.error('API Error in tax middleware:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), taxApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

