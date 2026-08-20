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

## 🔄 Test Obejścia Rotacji Workspace'ów (Multi-Workspace Bypass)

W ramach tego projektu przetestowaliśmy i wdrożyliśmy rozwiązanie na znane ograniczenie Lovable (brak możliwości przepięcia pod istniejące repo przy zmianie workspace/konta):

* **Repozytorium Główne (Produkcja)**: `A-Wodnicki/simple-demo-showcase` – posiada skonfigurowane sekrety FTP i automatyczny deploy na Smarthost.
* **Repozytorium Tymczasowe (Piaskownica Lovable)**: `A-Wodnicki/tiny-showcase` – podpięte pod nowy projekt w Lovable ze świeżą pulą darmowych kredytów AI.
* **Zasada działania**: Kod synchronizujemy lokalnie w Antigravity za pomocą dodatkowego remote (`temp-lovable`). Dzięki temu **nie trzeba dodawać sekretów ani konfigurować hostingu od nowa** w żadnym nowo tworzonym projekcie Lovable!

---

## 📖 Pełny Przewodnik Wdrożeniowy (Runbook)

Szczegółowy opis całego procesu, analiza techniczna, rejestr rozwiązanych problemów oraz gotowa instrukcja *Copy-Paste* do wdrożenia w innych projektach znajduje się w pliku:

👉 **[LOVABLE_SMARTHOST_GUIDE.md](./LOVABLE_SMARTHOST_GUIDE.md)**

---

## 🌐 Środowiska na żywo

- **Produkcja (Smarthost / Apache)**: [https://adrianlovablehub.smarthost.pl](https://adrianlovablehub.smarthost.pl)
- **Podgląd Lovable**: [https://adrianlovablehub.lovable.app](https://adrianlovablehub.lovable.app)
- **Główne Repozytorium GitHub**: [https://github.com/A-Wodnicki/simple-demo-showcase](https://github.com/A-Wodnicki/simple-demo-showcase)
- **Tymczasowe Repozytorium Lovable**: [https://github.com/A-Wodnicki/tiny-showcase](https://github.com/A-Wodnicki/tiny-showcase)

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
