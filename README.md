# Reisų valdymas – demonstracinė aplikacija

Neutralus reisų, užsakymų, transporto užimtumo ir vairuotojų darbų prototipas.

## Įkėlimas į GitHub Pages

1. Išskleiskite ZIP failą kompiuteryje.
2. GitHub sukurkite saugyklą, pavyzdžiui, `reisu-valdymas`.
3. Pasirinkite **Add file → Upload files** ir įkelkite VISUS išskleistus failus į saugyklos šakninį katalogą. `index.html`, `style.css`, `model.js` ir `app.js` turi būti viename lygyje. Nekelkite paties ZIP ar viską apgaubiančio aplanko.
4. Išsaugokite pakeitimus (**Commit changes**).
5. Atverkite **Settings → Pages**.
6. Pasirinkite **Deploy from a branch**, šaką **main**, katalogą **/(root)** ir **Save**.
7. Kai publikavimas baigsis, atverkite GitHub Pages pateiktą nuorodą.

Nereikia npm, kompiliavimo, serverio ar API raktų. Visi programėlės ištekliai pateikti pakete ir susieti santykiniais keliais, todėl ji veikia ir saugyklos poaplankyje.

Oficiali instrukcija: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Galimybės

- Reisų apžvalga ir užsakymų registravimas.
- Dienos ir savaitės dispečerio planas, technikos bei vairuotojų priskyrimas.
- Užimtumo konfliktų ir techninių parametrų patikros.
- Vairuotojo ekranas, būsenų keitimas ir darbo užbaigimas.
- Planuotų ir faktinių kilometrų, valandų bei kainos palyginimas.
- CSV eksportas.

## Demonstraciniai duomenys

Duomenys pavyzdiniai. Pakeitimai saugomi tik naudojamos naršyklės vietinėje atmintyje; tarp naudotojų ar įrenginių jie nesinchronizuojami. Mygtukas „Atkurti demo duomenis“ grąžina pradinius pavyzdžius. Šis paketas naudoja atskirus neutralius duomenų raktus.

Vairuotojo pasirinkimas yra demonstracinė funkcija, o ne prisijungimas ar teisių valdymas. Nėra tikrų GPS, žemėlapių, el. pašto ar kitų išorinių sistemų integracijų.

## Patikrinimas

Atliktos JavaScript sintaksės, užsakymų validavimo, kainų, konfliktų, šešių ekranų generavimo, būsenų eigos ir formų logikos patikros. Patikrinti vietinių failų keliai bei ZIP struktūra. Vizualinė patikra tikroje naršyklėje neatlikta. Tai nėra antivirusinio patikrinimo pažyma.
