# ☕ Simple Demo Showcase (Kawiarnia Nocna)

Projekt referencyjny i poligon testowy dla pełnej, dwukierunkowej integracji:
**Lovable ⟷ GitHub ⟷ Antigravity (Google AGY) ⟷ Smarthost (FTP via GitHub Actions)**

---

## 🎯 Cel Projektu

Ten projekt powstał jako praktyczny test architektury łączącej tworzenie UI za pomocą promptów AI z zaawansowanym programowaniem lokalnym i automatyczną publikacją na tradycyjny hosting WWW:

1. **Lovable (Web UI)**: Generowanie i edycja komponentów aplikacji przez prompty AI.
2. **GitHub**: Centralny węzeł i repozytorium kodu synchronizujące Lovable z lokalnym edytorem.
3. **Antigravity (Google AGY)**: Lokalny agent programistyczny pracujący bezpośrednio na kodzie źródłowym.
4. **GitHub Actions (CI/CD)**: Automatyczne budowanie statyczne (build-time SSR) i wysyłka na serwer FTP Smarthost po każdym commicie.

---

## 📖 Pełny Przewodnik Wdrożeniowy (Runbook)

Szczegółowy opis całego procesu, analiza techniczna, rejestr rozwiązanych problemów oraz gotowa instrukcja *Copy-Paste* do wdrożenia w innych projektach znajduje się w pliku:

👉 **[LOVABLE_SMARTHOST_GUIDE.md](./LOVABLE_SMARTHOST_GUIDE.md)**

---

## 🌐 Środowiska na żywo

- **Produkcja (Smarthost / Apache)**: [https://adrianlovablehub.smarthost.pl](https://adrianlovablehub.smarthost.pl)
- **Podgląd Lovable**: [https://adrianlovablehub.lovable.app](https://adrianlovablehub.lovable.app)
- **Edytor Lovable**: [https://lovable.dev/projects/ad7d0424-b78f-46a3-98d8-6f977dc5c58b](https://lovable.dev/projects/ad7d0424-b78f-46a3-98d8-6f977dc5c58b)

---

## 💻 Uruchomienie lokalne (Development)

Wymagany Node.js (v20+ lub v22+):

```bash
# 1. Klonowanie repozytorium
git clone https://github.com/A-Wodnicki/simple-demo-showcase.git
cd simple-demo-showcase

# 2. Instalacja zależności
npm install

# 3. Uruchomienie serwera deweloperskiego
npm run dev

# 4. Budowanie i pre-rendering dla hostingu statycznego
npm run build
node scripts/generate-html.js
```
