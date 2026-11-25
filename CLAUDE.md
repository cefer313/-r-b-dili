# Ərəb dili — Claude üçün təlimat

Bu repozitoriya ərəb dili üzrə dərs materialları üçündür: dərsliklər, lüğətlər, çalışmalar.
Tələbələr hərfləri bilir, oxuyub yaza bilir; dərslər qrammatika, danışıq, oxuyub anlamaq və yazı üçündür.
Bu fayldakı qaydalara hər söhbətdə əməl et.

## Ünsiyyət

- Həmişə **Azərbaycan dilində** cavab ver. Ərəbcə yalnız öyrədilən söz və cümlələrdə işlənir.
- Sadə, aydın izah et. Texniki terminləri lazım olmadıqca işlətmə, işlədəndə izah et.
- Bilmədiyin və ya yoxlaya bilmədiyin şeyi açıq de. Uydurma.

## Git qaydaları

- Bu repozitoriyada dəyişiklikləri **birbaşa `main` budağına** yaz və göndər.
- Hər yeni material əlavə olunanda kök `README.md`-dəki mündəricat cədvəlini yenilə.

## Qovluq quruluşu

- Dərsliklər: `dersler/<nömrə>-<mövzu>/` — içində:
  - hazır PDF,
  - `menbe/` — PDF-i yaradan HTML (`ders.html`), `render.js`, `package.json`,
  - (lazım olsa) interaktiv veb variant,
  - qısa `README.md`.
- Növbəti dərs: `dersler/02-...`, `dersler/03-...` və s.

## Dərslik qaydaları

- Format: rəngli, öz dizaynında **A4 PDF**. Quruluş: üz qabığı → **lüğət (~20 söz)** → qaydalar → **çalışmalar** → **cavablar** (müəllim üçün, sonuncu səhifə).
- Yeni dərslər 1-ci dərsin dizaynında olur (`dersler/01-cins-ve-hallar/menbe/ders.html` nümunədir).
- **Yalnız istifadəçinin verdiyi qaydaları** yaz; öz tərəfindən yeni qayda əlavə etmə. Misalları istifadəçinin verdiyi kimi saxla.
- **Oxunuşları istifadəçinin yazdığı kimi** yaz: kitabun, kitabin, kitabən, mədrasətun, mədrasətən, Zeynəbu; hal adları — Raf'un, Cərrun, Nasbun; tə mərbutə, tənvin-i zəmmə / kəsrə / fəthə; yiyəlik hal (istifadəçi "yəli hal" deyə bilər).
- Ərəb mətnləri **tam hərəkəli** yazılır.
- Lüğətdə hər söz üçün: ərəbcə (hərəkəli), oxunuşu, mənası, cinsi.
- Rəng məntiqi (bütün dərslərdə eyni):
  - müzəkkər — mavi, müənnəs — çəhrayı;
  - raf' — yaşıl, cərr — bənövşəyi, nasb — narıncı.
- Çalışmalar yalnız keçilmiş qaydalara əsaslanır; hər çalışmanın cavabı cavablar səhifəsində olur.

## Keçilmiş qaydalar (dərslər üzrə)

- **1-ci dərs — Cins:** 2 cins: müzəkkər (kişi, xüsusi şəkilçisi yoxdur — cinsi sözlə birlikdə əzbərlənir) və müənnəs (qadın, şəkilçisi tə mərbutə ة). Misal: مَدْرَسَةٌ (müənnəs), كِتَابٌ (müzəkkər). Mənaca müənnəs: زَيْنَبُ. İstisnaları müəllim söz əzbərlənərkən deyir.
- **1-ci dərs — İsmin halı:** 3 hal: Raf'un (adlıq, tənvin-i zəmmə: كِتَابٌ), Cərrun (yiyəlik, tənvin-i kəsrə: كِتَابٍ), Nasbun (təsirli, tənvin-i fəthə: كِتَابًا). Tənvin-i fəthədən sonra əlif yazılır; istisna — tə mərbutə üzərində əlif yazılmır (مَدْرَسَةً).

Yeni dərs hazırlananda bu siyahıya onun qaydalarını da əlavə et ki, növbəti dərslər onlara əsaslana bilsin.

## Texniki

- PDF-i HTML-dən brauzer (Playwright/Chromium) ilə yarat ki, ərəb hərfləri düzgün birləşsin (`menbe/render.js`).
- Şriftlər `@fontsource` paketlərindən: ərəbcə **Amiri**, latın **Inter** və **Montserrat** (Azərbaycan hərflərini, böyük Ə daxil, dəstəkləyir).
- Hər səhifənin sığdığını yoxla (`render.js` daşan səhifələri göstərir); səhifə şəkillərinə baxıb düzəlt.

## Yeni qaydalar

İstifadəçi yeni qayda və ya üstünlük deyəndə (məs. "bundan sonra belə et"):
1. Onu bu fayla, uyğun bölməyə əlavə et (uyğun bölmə yoxdursa, aşağıdakı siyahıya).
2. Dəyişikliyi dərhal `main`-ə göndər.
3. İstifadəçiyə qısaca hansı qaydanı yadda saxladığını de.

### Əlavə olunmuş qaydalar (tarixlə)

- 2026-11-25 — Bu fayl yaradıldı; 1-ci dərs `iphone` repozitoriyasından köçürüldü.
