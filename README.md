# RedFlag Privacy Guardian

English title: RedFlag Privacy Guardian

RedFlag Privacy Guardian je Chrome ekstenzija namijenjena za brzu i jednostavnu provjeru uslova korištenja (Terms of Service / ToS), politike privatnosti (Privacy Policy), te drugih pravnih dokumenata prije nego što kliknete na „Prihvatam“. Alat analizira tekst dokumenta, detektuje rizične klauzule i upozorava korisnika na potencijalno problematične odredbe vezane za privatnost, praćenje, dijeljenje podataka, ograničenja odgovornosti i druge nepoželjne uslove.

Ova verzija je u Beta fazi i namijenjena je testiranju, povratnim informacijama korisnika i daljnjem poboljšanju prije šire distribucije.

## Šta alat radi

RedFlag Privacy Guardian pomaže korisnicima da:
- analiziraju Terms of Service (ToS), Privacy Policy i druge dokumente,
- pronalaze klauzule koje mogu ugroziti privatnost ili prava korisnika,
- prepoznaju praćenje, personalizirane reklame i sumnjive tracker tehnologije,
- detektuju nepoštene, nejasne ili opasne odredbe u ugovorima,
- upozoravaju na poznate rizične ili sumnjive domene,
- blokiraju poznate tracker i ad-tech elemente gdje je to moguće,
- prikazuju rezultate u jednostavnom popup interfejsu.

## Glavne funkcionalnosti

- Automatsko skeniranje aktivne stranice za Terms of Service / Privacy Policy
- Ručni unos teksta za brzu analizu dokumenta
- Učitavanje PDF ugovora i analiza sadržaja
- OCR podrška za slike i fotografije ugovora (kamera ili upload)
- Detekcija rizičnih klauzula u više jezika: bosanski, engleski, njemački i španski
- Objašnjenja u jednostavnom jeziku za komplikovane pravne klauzule
- Blokiranje poznatih tracker domena i reklamnih servisa
- Dark mode korisnički interfejs i jednostavan pregled rezultata
- Lokalna obrada podataka bez slanja sadržaja dokumenta na server

## Kako radi

Ekstenzija radi u pozadini kao Chrome service worker i content script. Ona:

1. skenira aktivnu stranicu i traži linkove ka dokumentima poput Uslova korištenja ili Politike privatnosti,
2. analizira pronađeni tekst lokalno u browseru,
3. provjerava tekst prema unaprijed definiranim pravilima za detekciju rizičnih klauzula,
4. prikazuje rezultat u popup prozoru sa opisima i izvodima iz dokumenta,
5. blokira poznate tracker i reklamne mreže, gdje Chrome deklarativna pravila to dopuštaju.

## Upute za instalaciju na Desktopu (Chrome)

Napomena: Ovaj projekat je razvijen kao Chrome ekstenzija i radi na desktop verzijama Chrome/Chromium browsera.

### Koraci

1. Preuzmite ovaj projekat sa GitHub-a ili klonirajte repozitorij:
   ```bash
   git clone https://github.com/vaklop11-dot/redflag-guardian.git
   cd redflag-guardian
   ```

2. Uverite se da imate sve potrebne fajlove u root direktoriju projekta:
   - manifest.json
   - background.js
   - content.js
   - popup.html
   - popup.js
   - analyzer.js
   - i18n.js
   - plainlanguage.js
   - blocklist.json
   - rules.json
   - icon.svg
   - folder `icons/`
   - folder `lib/` ako je uključen u projekat

3. Otvorite Chrome i idite na:
   ```text
   chrome://extensions/
   ```

4. U gornjem desnom uglu uključite opciju:
   - Developer mode

5. Kliknite na dugme:
   - Load unpacked

6. Odaberite folder projekta `redflag-guardian` koji ste klonirali ili preuzeli.

7. Ekstenzija će biti učitana i spremna za upotrebu.

8. Kliknite na ikonu RedFlag ekstenzije u Chrome toolbar-u da otvorite popup i počnete sa analizom.

### Dodatne napomene

- Ako Chrome blokira određene datoteke ili skripte, provjerite da je folder ispravno odabran i da se svi resursi nalaze u root-u projekta.
- Za PDF i OCR funkcionalnost, obavezno je da direktorij `lib/` sadrži odgovarajuće biblioteke.

## Upute za instalaciju na Androidu (Kiwi Browser)

Kiwi Browser podržava Chrome ekstenzije i odličan je izbor za Android korisnike koji žele koristiti RedFlag na mobilnom uređaju.

### Koraci

1. Instalirajte Kiwi Browser sa Google Play Store-a.

2. U Kiwi Browser-u otvorite:
   ```text
   chrome://extensions
   ```
   ili koristite meni za upravljanje ekstenzijama.

3. Uključite opciju:
   - Developer mode / Developer options

4. U Android Chrome pregledniku ili u file menadžeru preuzmite projekat sa GitHub-a i raspakirajte ZIP.

5. Na uređaju otvorite folder sa raspakovanom ekstenzijom.

6. Pritisnite:
   - Load unpacked / Instaliraj ekstenziju
   - ili koristite opciju za uvoz ekstenzije u Kiwi Browser, ovisno o verziji aplikacije.

7. Odaberite folder sa ekstenzijom i potvrdite instalaciju.

8. Nakon instalacije, ekstenzija će biti dostupna u meniju i toolbar-u Kiwi Browser-a.

### Napomena za Android

- Izbor ekstenzija na Android uređajima može varirati ovisno o verziji Kiwi Browser-a i sistemskih postavki.
- Ako browser ne dozvoli instalaciju, provjerite da je Developer mode omogućen i da je folder sadržavao sve potrebne datoteke bez grešaka.

## Pravna napomena / Disclaimer

RedFlag Privacy Guardian je alat za pomoć korisnicima u identifikaciji potencijalno rizičnih ili problematičnih klauzula u tekstovima uslova korištenja, politika privatnosti, ugovora i sličnih dokumenata.

Ovaj alat nije pravni savjetnik i ne zamjenjuje konsultaciju sa ovlaštenim pravnim stručnjakom, advokatom ili pravnim savjetnikom. RedFlag služi isključivo za prepoznavanje i objašnjenje pojedinih odredbi i “fine print” sadržaja, ali ne pruža pravno mišljenje niti zamjenjuje profesionalnu pravnu analizu.

Za bilo kakvo pravno pitanje, ugovornu interpretaciju, spor ili procjenu rizika, preporučuje se savjetovanje sa licenciranim pravnim stručnjakom.

## Beta verzija

Ovaj projekat je trenutno u Beta fazi.

To znači da:
- funkcionalnosti mogu biti dodatno testirane i poboljšane,
- detekcija klauzula može zahtijevati dorade i ažuriranja,
- korisnički feedback je kritičan za stabilnost i kvalitetu,
- ekstenzija se preporučuje za testiranje, evaluaciju i daljnje razvoja prije finalnog puštanja.

Molimo korisnike da prijave bugove, nejasnoće i prijedloge putem GitHub Issues ili kroz kanale za podršku projekta.

## Podrška i doprinos

Ako želite da doprinesete razvoju projekta:

1. fork-ujte repozitorij,
2. napravite feature branch,
3. unesite promjene,
4. otvorite pull request sa detaljnim opisom promjena.

## Licenca

Ovaj projekat je licenciran pod MIT licencom. Za detalje pogledajte datoteku `LICENSE`.

## Repo i kontakt

- GitHub: https://github.com/vaklop11-dot/redflag-guardian

## Napomena o privatnosti

RedFlag Privacy Guardian radi lokalno u browseru i ne šalje sadržaj vaših dokumenata na vanjski server. Uloga alata je da pomogne korisniku da lakše prepozna potencijalno problematične klauzule, ali nije zamjena za pravni pregled.

---

English version:

# RedFlag Privacy Guardian

RedFlag Privacy Guardian is a Chrome extension designed to quickly review Terms of Service, Privacy Policies, and contracts before you click “Accept.” It analyzes document text, detects risky clauses, and warns users about privacy-related, tracking, data-sharing, and other potentially problematic terms.

This Beta release is intended for testing, user feedback, and further refinement before broader public use.
