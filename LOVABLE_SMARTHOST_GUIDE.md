# 🚀 Podręcznik Wdrożeniowy: Lovable ⟷ GitHub ⟷ Antigravity ⟷ Smarthost (FTP)

> **Cel dokumentu**: Kompletny, powtarzalny proces (Runbook) pozwalający spiąć dowolny projekt z Lovable z lokalnym edytorem Antigravity oraz automatyczną publikacją na tradycyjny hosting WWW (cPanel / Apache / LiteSpeed przez FTP/FTPS).

---

## 🏗️ Architektura i Przepływ Pracy

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌────────────────────────┐
│   LOVABLE   │ ◄───► │  GITHUB (REPO)  │ ◄───► │   ANTIGRAVITY   │ ───►  │ SMARTHOST (PUBLIC_HTML) │
│ (Prompt UI) │       │  (Single Truth) │       │  (Lokalny Kod)  │       │ (Wizytówka / Produkcja)│
└─────────────┘       └─────────────────┘       └─────────────────┘       └────────────────────────┘
```

1. **Lovable**: Narzędzie do szybkiego prototypowania i edycji UI za pomocą promptów AI.
2. **GitHub**: Centralne repozytorium kodu łączące wszystkie narzędzia.
3. **Antigravity (Google AGY)**: Zaawansowany lokalny asystent AI i środowisko programistyczne pracujące na pełnym kodzie źródłowym.
4. **GitHub Actions + FTP**: Automatyczny proces (CI/CD), który po każdym commicie buduje stronę i wgrywa gotowe pliki na serwer Smarthost.

---

## 🧠 Dlaczego na Smarthost trzeba było robić „fikołki”? (Analiza Techniczna)

| Aspekt | Lovable (Środowisko natywne) | Tradycyjny Hosting (Smarthost / cPanel / Apache) |
| :--- | :--- | :--- |
| **Typ aplikacji** | SSR (Server-Side Rendering) pod chmurę (Nitro / Cloudflare Workers) | Statyczny serwer plików WWW (Apache / LiteSpeed) |
| **Generowanie HTML** | Serwer Node.js / Worker w chmurze generuje HTML w locie dla każdego zapytania | Serwer oczekuje fizycznego pliku `index.html` w katalogu `public_html` |
| **Hydracja Reacta** | Serwer backendowy wstrzykuje do HTML obiekt stanu `window.$_TSR` | Brak serwera backendowego – plik `index.html` musi sam zainicjować stan SPA |
| **Routing podstron** | Obsługiwany w locie przez silnik Nitro | Wymaga reguł `mod_rewrite` w pliku `.htaccess`, aby nie było błędu 404 po odświeżeniu |

---

## 🛠️ Rejestr Błędów i Gotowe Rozwiązania

Poniżej lista wszystkich problemów, na które natrafiliśmy, oraz ich bezpośrednie rozwiązania:

### 1. Próba bezpośredniego połączenia przez Lovable MCP (`https://mcp.lovable.dev`)
* **Objaw**: Błąd `401 Unauthorized` / `calling "initialize": sending "initialize": Unauthorized`.
* **Przyczyna**: Lovable MCP wymaga autoryzacji przeglądarkowej OAuth 2.1, której surowy klient SSE MCP w IDE nie obsługuje bez dedykowanej wtyczki.
* **Rozwiązanie**: Zamiast niestabilnego MCP, używamy **oficjalnej dwukierunkowej synchronizacji GitHub Sync** (wbudowanej w Lovable w darmowym planie).

### 2. Błąd `403 Forbidden` po pierwszym wdrożeniu na Smarthost
* **Objaw**: Strona `https://twojadomena.smarthost.pl` zwraca błąd 403.
* **Przyczyna**: Build z Lovable tworzył tylko pliki JS i CSS w folderze `.output/public/assets/`, ale **nie generował pliku `index.html`**. Apache przy braku `index.html` blokuje wyświetlanie folderu.
* **Rozwiązanie**: Dodaliśmy lekki skrypt pomocniczy [`scripts/generate-html.js`](file:///c:/Users/adria/Documents/antigravity/mysterious-newton/scripts/generate-html.js), który po kompilacji generuje fizyczny `index.html`.

### 3. Błąd `Invariant failed` w konsoli F12
* **Objaw**: Biały ekran, w konsoli `Uncaught Error: Invariant failed at Te`.
* **Przyczyna**: TanStack Router w trybie SSR oczekuje obiektu `window.$_TSR`. Przy wdrożeniu statycznym obiekt nie istniał.
* **Rozwiązanie**: Wstrzyknęliśmy do nagłówka `index.html` startowy obiekt konfiguracji `window.$_TSR` w trybie SPA.

### 4. Błąd `TypeError: window.$_TSR?.h is not a function`
* **Objaw**: Biały ekran, błąd w skrypcie startowym.
* **Przyczyna**: TanStack Router po zamontowaniu drzewa wywołuje funkcję zwrotną `window.$_TSR.h()`.
* **Rozwiązanie**: Dodaliśmy pustą funkcję `h: function() {}` do obiektu `window.$_TSR`.

### 5. Błąd `Cannot read properties of undefined (reading '__root__')`
* **Objaw**: Czerwony pasek błędu Reacta na stronie.
* **Przyczyna**: Komponent `HeadContent` z TanStack Router szukał właściwości `manifest.routes['__root__']`. W pustym obiekcie `manifest: {}` pole `routes` było `undefined`.
* **Rozwiązanie**: Ustawiliśmy w obiekcie `manifest: { routes: {} }`.

### 6. Błąd 404 przy odświeżaniu podstron (np. `/menu`, `/kontakt`)
* **Objaw**: Po wejściu bezpośrednio w link podstrony serwer Apache zwraca 404 Not Found.
* **Przyczyna**: Apache szuka fizycznego katalogu `/menu/index.html`, który nie istnieje w aplikacji SPA.
* **Rozwiązanie**: Dodaliśmy plik [`public/.htaccess`](file:///c:/Users/adria/Documents/antigravity/mysterious-newton/public/.htaccess) przekierowujący wszystkie zapytania do głównego `index.html`.

### 7. Ostrzeżenie w konsoli `React error #418` (Hydration Mismatch)
* **Objaw**: W konsoli deweloperskiej pojawia się `Minified React error #418`.
* **Przyczyna**: Jest to standardowe ostrzeżenie Reacta informujące, że na wejściu plik HTML nie zawierał wstępnie wyrenderowanego drzewa DOM (ponieważ serwujemy plik statycznie).
* **Wpływ na działanie**: **Brak wpływu (całkowicie bezpieczne)** – React natychmiast wykonuje tzw. *Client-Side Fallback* i w ułamku milisekundy samodzielnie buduje cały interfejs, nawigację i komponenty w przeglądarce.

---

## 📋 Instrukcja Krok po Kroku do wdrożenia w NOWYM / ISTNIEJĄCYM projekcie

Gdy chcesz podpiąć ten sam proces pod inny projekt, wykonaj poniższe kroki:

### Krok 1: W Lovable (połączenie z GitHubem)
1. Otwórz projekt w Lovable.
2. Kliknij nazwę projektu w lewym górnym rogu ➔ **GitHub** (lub ikona GitHub).
3. Kliknij **Connect to GitHub** i utwórz repozytorium (np. `https://github.com/TwojUser/nowy-projekt.git`).

### Krok 2: W Smarthost (Konto FTP)
1. Zaloguj się do cPanelu Smarthost.
2. Wejdź w **Pliki ➔ Konta FTP**.
3. Utwórz konto:
   - **Logowanie**: `deploy`
   - **Hasło**: Silne, wygenerowane hasło
   - **Katalog**: Koniecznie zmień na samo `public_html` (lub `public_html/twojadomena.pl`)!

### Krok 3: W GitHubie (Sekrety repozytorium)
1. W repozytorium wejdź w: **Settings ➔ Secrets and variables ➔ Actions**.
2. Dodaj 3 sekrety (**New repository secret**):
   - `FTP_SERVER`: adres serwera (np. `s61.smarthost.pl`)
   - `FTP_USERNAME`: pełny login z małpą (np. `deploy@twojadomena.smarthost.pl`)
   - `FTP_PASSWORD`: hasło do konta FTP

### Krok 4: Skopiuj 3 kluczowe pliki do projektu

#### 📄 1. Plik `scripts/generate-html.js`
Utwórz katalog `scripts/` i plik `generate-html.js`:
```javascript
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
    <title>Aplikacja WWW</title>
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
```

#### 📄 2. Plik `public/.htaccess`
Utwórz plik `.htaccess` w folderze `public/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### 📄 3. Plik `.github/workflows/deploy.yml`
Utwórz plik `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Smarthost via FTP

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  web-deploy:
    name: Build & Deploy to Smarthost
    runs-on: ubuntu-latest
    steps:
      - name: 🚚 Pobieranie kodu z GitHub
        uses: actions/checkout@v4

      - name: ⚙️ Konfiguracja Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 📦 Instalacja zależności
        run: npm install

      - name: 🔨 Budowanie aplikacji
        run: npm run build

      - name: 📄 Generowanie pliku index.html dla hostingu
        run: node scripts/generate-html.js

      - name: 🔍 Sprawdzenie folderu wyjściowego
        run: |
          if [ -d ".output/public" ]; then
            echo "DEPLOY_DIR=.output/public/" >> $GITHUB_ENV
          elif [ -d "dist" ]; then
            echo "DEPLOY_DIR=dist/" >> $GITHUB_ENV
          else
            echo "DEPLOY_DIR=./" >> $GITHUB_ENV
          fi

      - name: 🚀 Wysyłanie plików przez FTP na Smarthost
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ${{ env.DEPLOY_DIR }}
          server-dir: ./
          dangerous-clean-slate: false
```

### Krok 5: Push i gotowe!
Wypchnij te pliki do GitHuba (`git push origin main`). Od tej pory:
- Każda zmiana zrobiona w **Lovable** automatycznie kompiluje się i publikuje na **Smarthost**.
- Każda zmiana zrobiona lokalnie w **Antigravity** natychmiast synchronizuje się z **Lovable** i **Smarthostem**.
