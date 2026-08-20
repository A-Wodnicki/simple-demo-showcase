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
2. **GitHub**: Centralne repozytorium kodu łączące wszystkie narzędzia (Single Source of Truth).
3. **Antigravity (Google AGY)**: Lokalny agent programistyczny pracujący bezpośrednio na kodzie źródłowym.
4. **GitHub Actions + FTP**: Automatyczny proces (CI/CD), który po każdym commicie buduje stronę z pre-renderingiem SSR i wgrywa gotowe pliki na serwer Smarthost.

---

## 🧠 Dlaczego na Smarthost trzeba było robić „fikołki”? (Analiza Techniczna)

| Aspekt | Lovable (Środowisko natywne) | Tradycyjny Hosting (Smarthost / cPanel / Apache) |
| :--- | :--- | :--- |
| **Typ aplikacji** | SSR (Server-Side Rendering) pod chmurę (Nitro / Cloudflare Workers) | Statyczny serwer plików WWW (Apache / LiteSpeed) |
| **Generowanie HTML** | Serwer Node.js / Worker w chmurze generuje HTML w locie dla każdego zapytania | Serwer oczekuje fizycznego pliku `index.html` w katalogu `public_html` |
| **Hydracja Reacta** | Serwer backendowy wstrzykuje do HTML stan `window.$_TSR` z wyrenderowanym DOM | Wymaga wstępnego pre-renderingu SSR w build-time, aby nie było błędu #418 |
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
* **Rozwiązanie**: Dodaliśmy skrypt pomocniczy [`scripts/generate-html.js`](file:///c:/Users/adria/Documents/antigravity/mysterious-newton/scripts/generate-html.js), który po kompilacji generuje fizyczny `index.html`.

### 3. Błąd `Invariant failed` w konsoli F12
* **Objaw**: Biały ekran, w konsoli `Uncaught Error: Invariant failed at Te`.
* **Przyczyna**: TanStack Router w trybie SSR oczekuje obiektu `window.$_TSR`. Przy wdrożeniu statycznym obiekt nie istniał.
* **Rozwiązanie**: Wstrzyknęliśmy startowy obiekt konfiguracji `window.$_TSR`.

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
* **Przyczyna**: Plik HTML na serwerze był pustą powłoką, a kod Reacta oczekiwał wyrenderowanego drzewa DOM z nagłówkami.
* **Rozwiązanie**: Zastosowaliśmy **prawdziwy pre-rendering SSR w build-time** w pliku `scripts/generate-html.js` – skrypt importuje wygenerowany bundle `.output/server/index.mjs` i renderuje pełny HTML dla wszystkich tras w trakcie budowania na GitHubie. Wynik: **0 błędów w konsoli**.

---

## 📋 Instrukcja Krok po Kroku do wdrożenia w DOWOLNYM projekcie

Oto kompletna procedura wdrożeniowa do powtórzenia w innych projektach:

### KROK 0: Ciche sprawdzenie środowiska Git
* Sprawdź dostępność `git` w systemie (`git --version`).
* Jeśli brak w zmiennej PATH (częste na Windows), wykorzystaj wbudowany Git ze środowiska Visual Studio:
  `C:\Program Files\Microsoft Visual Studio\...\Git\cmd\git.exe` lub zainstaluj przez `winget install --id Git.Git -e --source winget`.

### KROK 1: Podpięcie repozytorium w Lovable
1. Otwórz projekt w [Lovable.dev](https://lovable.dev/).
2. W lewym górnym rogu kliknij nazwę projektu ➔ **GitHub** (lub **Connect to GitHub**).
3. Połącz swoje konto GitHub i utwórz repozytorium (np. `https://github.com/TwojLogin/nazwa-projektu.git`).
4. Lovable automatycznie wyśle pierwszy stan projektu do gałęzi `main`.

### KROK 2: Połączenie repozytorium z lokalnym Antigravity
W terminalu przestrzeni roboczej Antigravity zainicjuj i pobierz repozytorium:
```powershell
git init
git remote add origin https://github.com/TwojLogin/nazwa-projektu.git
git fetch origin
git checkout -B main origin/main
git branch --set-upstream-to=origin/main main
```
Wszystkie pliki projektu (React, TanStack, Tailwind) pojawią się lokalnie w Twoim folderze roboczym.

### KROK 3: Trwałe reguły w przestrzeni roboczej (`GEMINI.md` / `AGENTS.md`)
Zapisz plik konfiguracyjny reguł w katalogu projektu, aby każdy agent AI znał powiązanie:
```markdown
# Lovable Project Integration
- **Project URL**: https://lovable.dev/projects/<ID_PROJEKTU>
- **Repository**: https://github.com/TwojLogin/nazwa-projektu
- **Zasada**: Wszelkie zmiany w kodzie wypychamy do gałęzi `main`.
```

### KROK 4: Weryfikacja dwukierunkowej synchronizacji
1. **Lokalnie ➔ Lovable**: Zmodyfikuj plik (np. dodaj baner w `src/routes/index.tsx`), wykonaj commit i `git push origin main`. W Lovable podgląd natychmiast się zaktualizuje.
2. **Lovable ➔ Lokalnie**: Wpisz prompt w Lovable (np. *"Zmień nagłówek"*). Po wygenerowaniu wykonaj `git pull origin main` w Antigravity – nowy kod pojawi się w edytorze.

### KROK 5: Utworzenie konta FTP na Smarthost
1. Zaloguj się do cPanelu Smarthost.
2. Wejdź w **Pliki ➔ Konta FTP**.
3. Utwórz konto:
   - **Logowanie**: `deploy`
   - **Hasło**: Silne, wygenerowane hasło
   - **Katalog**: Koniecznie zmień na samo `public_html` (lub `public_html/twojadomena.pl`)!

### KROK 6: Konfiguracja GitHub Secrets
1. W repozytorium na GitHubie wejdź w: **Settings ➔ Secrets and variables ➔ Actions**.
2. Dodaj 3 sekrety (**New repository secret**):
   - `FTP_SERVER`: adres serwera (np. `s61.smarthost.pl`)
   - `FTP_USERNAME`: pełny login z małpą (np. `deploy@twojadomena.smarthost.pl`)
   - `FTP_PASSWORD`: hasło do konta FTP

### KROK 7: Skopiuj 3 kluczowe pliki do projektu

#### 📄 1. Plik `scripts/generate-html.js`
Utwórz katalog `scripts/` i plik `generate-html.js`:
```javascript
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

  // Lista podstron do wyrenderowania
  const routes = ['/', '/menu', '/o-nas', '/kontakt'];

  for (const route of routes) {
    try {
      const res = await handler.fetch(new Request(`http://localhost${route}`), env, context);
      if (res.status === 200) {
        const html = await res.text();

        if (route === '/') {
          fs.writeFileSync(path.join(publicDir, 'index.html'), html, 'utf-8');
          console.log('✅ Wygenerowano pre-renderowany .output/public/index.html');
        } else {
          const cleanRoute = route.replace(/^\//, '');
          const routeDir = path.join(publicDir, cleanRoute);
          if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
          }
          fs.writeFileSync(path.join(publicDir, `${cleanRoute}.html`), html, 'utf-8');
          fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');
          console.log(`✅ Wygenerowano pre-renderowany ${route} -> ${cleanRoute}.html & ${cleanRoute}/index.html`);
        }
      }
    } catch (err) {
      console.error(`❌ Błąd przy generowaniu trasy ${route}:`, err);
    }
  }
}

generatePrerenderedHTML().catch(console.error);
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

### KROK 8: Push i pełna automatyzacja!
Wypchnij te pliki do GitHuba (`git add .`, `git commit -m "Setup deployment"`, `git push origin main`). Od tej pory:
- Każda zmiana zrobiona w **Lovable** automatycznie kompiluje się, generuje pre-renderowane pliki HTML (bez błędu hydracji React #418) i publikuje na **Smarthost**.
- Każda zmiana zrobiona lokalnie w **Antigravity** natychmiast synchronizuje się z **Lovable** i **Smarthostem**.
- Strona na hostingu działa w 100% płynnie, szybko i z **0 błędami w konsoli F12**!

