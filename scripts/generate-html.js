import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('.output/public');
const assetsDir = path.join(publicDir, 'assets');

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.startsWith('styles') && f.endsWith('.css'));
  const jsFile = files.find((f) => f.startsWith('index') && f.endsWith('.js'));

  const html = `<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kawiarnia Nocna — Palarnia kawy w Warszawie</title>
    <meta name="description" content="Kawiarnia Nocna to mała palarnia specialty w Warszawie. Świeżo palona kawa, sezonowe menu i spokojne miejsce do pracy." />
    <link rel="icon" href="/favicon.ico" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : ''}
    <script>
      window.$_TSR = {
        h: function() {},
        buffer: [],
        initialized: false,
        router: {
          matches: [
            { i: '__root__', s: 'success', ssr: false }
          ],
          lastMatchId: null,
          manifest: {
            routes: {}
          },
          dehydratedData: {}
        }
      };
    </script>
  </head>
  <body>
    ${jsFile ? `<script type="module" src="/assets/${jsFile}"></script>` : ''}
  </body>
</html>`;

  fs.writeFileSync(path.join(publicDir, 'index.html'), html, 'utf-8');
  console.log('✅ Generated .output/public/index.html with CSS:', cssFile, 'and JS:', jsFile);
}
