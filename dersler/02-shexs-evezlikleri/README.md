# 2-ci dərs: Şəxs əvəzlikləri

- **`erebce-ders-2-shexs-evezlikleri.pdf`** — 8 səhifəlik A4 dərslik:
  üz qabığı → lüğət (10 yeni söz) → Qayda: şəxs və say (tək / ikilik / cəm) → Qayda: 14 şəxs əvəzliyi (cədvəl və siyahı) → sual əvəzliyi مَنْ (kim?) → 2 çalışma → cavablar.
- **`erebce-ders-2-video.mp4`** — dərsin animasiya videosu (4 dəqiqə, 1920×1080, səssiz — izahlar ekranda yazılıb). Uşaq üçün sadə dildə: cins, say, 14 əvəzlik, مَنْ «kim?», 4 sualdan ibarət sınaq, yeni sözlər.
- **`video/`** — videonun mənbəyi (Remotion). Dəyişiklik etmək üçün `video/src/` fayllarını redaktə edin və yenidən yaradın:

```bash
cd video
npm install
npm run render
```

  **Səsləndirmə:** mətn — `video/seslendirme.md`. Səs yazısını `video/ses-xam/` qovluğuna qoyun (ya `01.m4a` … `21.m4a`, ya da hissələr arasında ~2 saniyə pauza olan tək fayl), sonra `node ses-hazirla.mjs` (səsin tembri dəyişdirilir; `derin` və ya `ince`) və `npm run render`. Xam yazı gitə düşmür.

- **`menbe/`** — PDF-in mənbəyi. Dəyişiklik etmək üçün `ders.html`-i redaktə edin və yenidən yaradın:

```bash
cd menbe
npm install
npm run pdf
```

Lazımdır: Node.js və Playwright (Chromium).
