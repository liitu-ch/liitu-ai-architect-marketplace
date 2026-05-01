# Testingkonzept

> Testartefakte werden mit dem Plugin `ai-architect-testing` erstellt.
> Skills: `/manual-test` · `/playwright-test` · `/vitest`

Dieses Dokument beschreibt die drei Teststufen, die in diesem Projekt eingesetzt werden: manuelle Benutzertests, automatisierte Unit-Tests und End-to-End-Tests.

---

## 1. Manuelle Benutzertests (User Tests)

### Was

{was-manual}

### Warum

{warum-manual}

### Wie

- Tests werden auf echten Geräten ({geraete}) sowie im Browser durchgeführt.
- Vor jedem Release werden kritische User Journeys manuell durchgespielt ({user-journeys}).
- Gefundene Fehler werden als Issues erfasst.
- Testpläne werden mit `/manual-test` erstellt.

---

## 2. End-to-End-Tests (Playwright)

### Was

{was-e2e}

### Warum

{warum-e2e}

### Wie

- Framework: [Playwright](https://playwright.dev/), Konfiguration in `playwright.config.ts`.
- Tests befinden sich im Verzeichnis `{e2e-verzeichnis}`.
- Die App wird gegen {testserver-beschreibung} gestartet (`{testserver-befehl}`, Port {testserver-port}).
- Getestete Browser und Geräte:
  - Desktop: {desktop-browser}
  - Mobil: {mobile-geraete}
- Schwerpunkte:
  - {e2e-schwerpunkte}
- Ausführung: `{e2e-befehl}`
- Tests werden mit `/playwright-test` erstellt.

---

## 3. Unit-Tests (Vitest)

### Was

{was-unit}

### Warum

{warum-unit}

### Wie

- Framework: [Vitest](https://vitest.dev/) mit `@testing-library/react` für Komponenten.
- Tests befinden sich neben dem zu testenden Code in `*.test.ts(x)`-Dateien.
- Schwerpunkte:
  - {unit-schwerpunkte}
- Ausführung: `{unit-befehl}`
- Tests werden mit `/vitest` erstellt.

---

## Zusammenfassung

| Teststufe  | Tool       | Geschwindigkeit | Abdeckung                           |
| ---------- | ---------- | --------------- | ----------------------------------- |
| Manuell    | –          | Langsam         | UX, natives Verhalten, Geräte       |
| E2E-Tests  | Playwright | Mittel          | Vollständige User Journeys, Browser |
| Unit-Tests | Vitest     | Schnell         | Logik, Mapper, Komponenten          |
