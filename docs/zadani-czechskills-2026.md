# Zadání soutěžního projektu: Architektura CMS budoucnosti (SEO/GEO 2026)

Vážené vývojářky, vážení vývojáři,

vítejte na startu letošního ročníku soutěže. Jako jednatel webové agentury vás chci vyzvat k řešení jednoho z problémů současného digitálního trhu. Píše se rok 2026 a pravidla organické návštěvnosti se dramaticky mění. Tradiční vyhledávače ustupují konverzační umělé inteligenci a klasické SEO již nestačí – nastoupila éra Generative Engine Optimization (GEO).

Vaším úkolem je navrhnout a naprogramovat vlastní CMS (Content Management System) s integrovaným frontendem, který tyto nové výzvy beze zbytku reflektuje. Hledáme inovativní řešení, bezchybnou architekturu a hluboké porozumění modernímu webu.

Zde je vaše oficiální zadání:

## Hlavní cíl projektu

Cílem je vytvořit vlastní CMS pro správu blogu a FAQ + výkonný frontend web. Systém nesmí být vázaný na jedinou doménu, ale musí fungovat jako multi-tenant řešení (Headless CMS) schopné obsluhovat více nezávislých klientských projektů současně. Byznysovou prioritou výsledného řešení je maximalizace organické návštěvnosti. Web musí být od prvního řádku kódu navržen tak, aby exceloval v tradičních vyhledávačích (SEO) i v AI poháněných generativních enginech (GEO).

## Detailní specifikace

### 1. Požadavky na Frontend

Frontend musí být bleskově rychlý, přístupný a plně připravený na indexaci.

- **Jelikož CMS bude multi-tenant**, vaším úkolem pro klientskou část je naprogramovat jeden ukázkový web (demo klienta). Tento frontend bude přes API konzumovat data z jednoho konkrétního ukázkového projektu, který vytvoříte ve vašem CMS.
- **Striktní URL struktura a routování:** Vyžadujeme implementaci přesně definované hierarchie stránek:
  - `/blog`: Hlavní obsahový rozcestník (hub). Zde musí být přehledný výpis (listing) všech publikovaných článků, funkční stránkování (pagination) a možnost filtrování obsahu podle kategorií nebo štítků. Vždy vlastní url a meta data pro všechno.
  - `/faq`: Samostatná dedikovaná stránka pro nejčastější dotazy. Všechny dotazy zde musí být logicky kategorizované a opatřené validními strukturovanými daty pro maximální pokrytí v AI vyhledávačích. Vždy vlastní url a meta data. (příklad: https://www.malby-lehnert.cz/faq/)
- **Architektura detailů a kategorií (Blog i FAQ):** Přesnou podobu URL pro samotné články, detailní zobrazení konkrétních FAQ odpovědí, výpisy kategorií a štítky vám záměrně nedefinujeme. Je čistě na vás navrhnout logický a hierarchický URL strom (zda zvolíte např. `/blog/kategorie/nazev-clanku`, `/faq/doprava-a-platba/konkretni-dotaz` nebo jiné řešení), který bude připravený na budoucí škálování a z pohledu SEO/GEO pro rok 2026 naprosto neprůstřelný. Zde se ukáže, kdo umí přemýšlet jako opravdový softwarový architekt.
- **Design a Research:** Web musí být optimalizovaný pro čtenáře i boty. Je na vás provést rešerši nejnovějších postupů pro SEO/GEO v roce 2026 a tyto poznatky (např. LLM-friendly formátování, zero-click search optimalizace) do UI/UX přímo zakomponovat.
- **Struktura článku:** Každý blogový příspěvek musí povinně podporovat a vizuálně integrovat:
  - Kategorizaci a štítkování (tags).
  - Vložená videa (nativní přehrávač nebo embed).
  - Modul pro hlasovou nahrávku (voice-over článku pro lepší přístupnost a konzumaci obsahu).
  - 3 až 6 FAQ otázek a odpovědí dynamicky vložených přímo v těle článku.
- **Strukturovaná data:** Naprostou samozřejmostí je dynamické a validní generování Schema.org (JSON-LD) pro články (např. `Article`, `BlogPosting`) i samotné FAQ (`FAQPage`). Tyto struktury musí odpovídat aktuálním požadavkům pro Rich Snippets a AI odpovědi.
- **Pokročilá správa médií:** Články musí obsahovat náhledové obrázky (cover image) a možnost vložení obrázků do textu. Frontend musí obrázky servírovat v next-gen formátech (WebP/AVIF), využívat lazy-loading a automaticky vynucovat vyplnění alt textů v CMS, což je pro GEO (pochopení kontextu umělou inteligencí) kritické.
- **Interní prolinkování (Související články):** Na konci nebo vedle každého článku musí systém automaticky nabízet 2-3 související články (na základě stejné kategorie nebo štítků). Vyhledávače a AI modely toto vyžadují pro pochopení kontextu a hloubky vašeho webu.
- **Mobile-First a Responzivita:** Výsledný web i administrace musí být 100% responzivní. Vyhledávače a AI enginy hodnotí weby primárně podle mobilního zobrazení (Mobile-First Indexing), proto musí být rychlost a čitelnost na mobilních zařízeních bezchybná.

### 2. Požadavky na Backend a CMS (Administrace)

Správa obsahu musí být inteligentní a maximálně automatizovaná, aby redaktorům šetřila čas a chránila web před technickými chybami.

- **Správa obsahu:** Intuitivní rozhraní pro CRUD operace (Create, Read, Update, Delete) nad články a FAQ entitami v rámci zvoleného projektu.
- **Multi-projektová architektura (Multi-tenancy):** CMS musí být navrženo pro agenturní využití. Vyžadujeme možnost v administraci přidávat, upravovat a odebírat nezávislé projekty. Obsah (články, FAQ, média) musí být striktně vázán na konkrétní projekt. Každý projekt musí vygenerovat vlastní zabezpečený API endpoint (chráněný např. API klíčem), přes který si frontend daného klienta data stáhne.
- **SEO/GEO Score Checker (Automatický validátor):** Při psaní článku (v reálném čase nebo při uložení draftu) CMS automaticky zanalyzuje obsah a udělí mu skóre na základě parametrů pro rok 2026 (např. hustota entit, čitelnost pro AI modely, přítomnost strukturovaných dat, existence voice-overu). Redaktor musí vidět, co má zlepšit, než článek publikuje. Klidně zapojte AI pro scoring článků.
- **Automatizace indexace:** Publikační proces musí být proaktivní:
  - Při vydání nebo aktualizaci článku se musí automaticky přegenerovat `sitemap.xml`. Kolik jich bude je na vás, cíl je jednoduchost pro vyhledávače. (Pozor: Generování sitemap i pingování musí fungovat nezávisle pro každý projekt/doménu zvlášť, logiku uložení URL adres si navrhněte sami).
  - CMS okamžitě a automaticky odešle ping/informaci do Google Search Console a využije IndexNow API pro okamžitou indexaci v dalších enginech (Bing, Seznam atd.).
- **Automatický Redirect Systém (Zero 404 Policy):** Na webu nesmí nikdy vzniknout mrtvý odkaz s chybou 404 po manipulaci s obsahem.
  - Smaže-li redaktor článek trvale, systém ho vyřadí ze sitemapy a automaticky vytvoří 301 přesměrování na nadřazenou kategorii, případně na hlavní stránku `/blog`.
  - Pokud redaktor článek pouze skryje (unpublish/draft), systém nasadí 302 přesměrování (dočasné).
- **Zabezpečení a Autentizace:** CMS nesmí být veřejně přístupné. Vyžadujeme nasazení funkční autentizace (např. NextAuth, Supabase Auth, Clerk nebo vlastní JWT). Přístup k CRUD operacím musí mít pouze autorizovaný uživatel (redaktor/admin).

### 3. Technologický stack

Kvalitní architektura je základem úspěchu. Vyžadujeme moderní a škálovatelné technologie:

- **Frontend:** Musí využívat Server-Side Rendering (SSR) pro zaručenou indexovatelnost.
- **Databáze:** Relační přístup je pro tento typ dat ideální. Povolujeme výhradně PostgreSQL, případně moderní cloudová řešení nad ním (např. Supabase, NeonDB).
- **Deployment:** Aplikace musí být plně funkční a nasazená v produkčním prostředí na platformách jako AWS Amplify, Vercel nebo jejich přímých ekvivalentech.

## Pravidla odevzdání

1. **Zdrojový kód:** Celý projekt musí být verzován rozpoznatelnými commity a dostupný ve veřejném (nebo pro hodnotitele zpřístupněném) repozitáři na GitHubu.
2. **Dokumentace:** Repozitář musí obsahovat kvalitní dokumentaci tj. soubor `README.md`. Ten bude obsahovat:
   - Představení projektu a vámi zvoleného technologického stacku.
   - Detailní kroky ke spuštění projektu lokálně (instalace závislostí, nastavení `.env` proměnných, inicializace databáze).
   - Vysvětlení vaší aplikované SEO/GEO 2026 strategie.
3. **Živé URL:** Součástí repozitáře (hned v úvodu README) musí být funkční odkaz na nasazenou online aplikaci.
4. **AI Generovaná dokumentace API (Backend):** Čas jsou peníze a ruční psaní dokumentace endpointů je minulostí. Vyžadujeme, abyste pro dokumentaci logiky vašeho backendu a jednotlivých endpointů využili AI nástroj (např. Mintlify, AI vygenerovaný Swagger/OpenAPI přes LLM, GitHub Copilot apod.). Očekáváme, že si práci usnadníte a necháte AI popsat, jak vaše API funguje. Odkaz na tuto vygenerovanou dokumentaci (nebo příslušný Markdown/JSON soubor) musí být jasně uveden v hlavním `README.md`.
5. **Testovací data (Seed):** Abychom mohli vaši aplikaci okamžitě otestovat, musí repozitář obsahovat "seed" skript, který po spuštění naplní databázi testovacím obsahem (např. 1 administrátorský účet, 10 ukázkových článků napříč 3 kategoriemi a 5 FAQ).

---

**Poznámka k vývoji (AI-First přístup):** Kódovat takto komplexní multi-tenant architekturu se SEO/GEO automatizací kompletně ručně by vám zabralo týdny, ne-li měsíce. Nechceme po vás, abyste znovu objevovali kolo. Očekáváme a přímo vás vyzýváme, abyste na maximum využili moderní AI kódovací asistenty pro generování, testovacích dat, napojení API a tvorbu dokumentace.

**Ale pozor:** Vaším hlavním úkolem v této soutěži není být „psavcem kódu", ale softwarovým architektem. Nenechte AI vygenerovat neudržovatelný „spaghetti" kód plný bezpečnostních děr. Budeme navíc hodnotit čistotu architektury, logické oddělení vrstev a to, jak dobře jste AI nástroje dokázali ukočírovat směrem k robustnímu a škálovatelnému výsledku.

Těšíme se na vaše řešení. Přistupujte k tomuto projektu ne jako k cvičení, ale jako k produkční platformě, která má za cíl ovládnout organické vyhledávání zítřka.

Pokud to bude opravdu skvěle vytvořené, tak to od vás koupím a budeme to využívat v naší firmě.

Hodně štěstí!
