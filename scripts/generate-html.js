import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

async function generatePrerenderedHTML() {
  const publicDir = path.resolve('.output/public');
  const serverPath = path.resolve('.output/server/index.mjs');

  if (!fs.existsSync(serverPath)) {
    console.warn('⚠️ Server entry not found at .output/server/index.mjs');
    return;
  }

  const serverUrl = pathToFileURL(serverPath).href;
  const server = await import(serverUrl);
  const handler = server.default;
  const env = { ASSETS: { fetch: () => new Response(null, { status: 404 }) } };
  const context = { waitUntil: () => {} };

  const routes = ['/', '/menu', '/o-nas', '/kontakt'];

  for (const route of routes) {
    try {
      const res = await handler.fetch(new Request(`http://localhost${route}`), env, context);
      if (res.status === 200) {
        const html = await res.text();

        if (route === '/') {
          fs.writeFileSync(path.join(publicDir, 'index.html'), html, 'utf-8');
          console.log('✅ Generated prerendered .output/public/index.html');
        } else {
          const cleanRoute = route.replace(/^\//, '');
          const routeDir = path.join(publicDir, cleanRoute);
          if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
          }
          fs.writeFileSync(path.join(publicDir, `${cleanRoute}.html`), html, 'utf-8');
          fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');
          console.log(`✅ Generated prerendered ${route} -> ${cleanRoute}.html & ${cleanRoute}/index.html`);
        }
      } else {
        console.warn(`⚠️ Failed to render ${route}, status: ${res.status}`);
      }
    } catch (err) {
      console.error(`❌ Error prerendering route ${route}:`, err);
    }
  }
}

generatePrerenderedHTML().catch(console.error);
