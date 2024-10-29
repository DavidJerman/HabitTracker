# Habit tracker

Ta aplikacija bo omogoča sledenje opravil, prehrane in športa/aktivnosti uporabnika.

Informacije o aplikaciji se nahajajo v naslednjem repozitoriju:
<https://github.com/DavidJerman/HabitTracker>

## Opis aplikacije

Aplikacija sestoji iz treh glavnih delov:

- TODO List – nekaj v stilu Google Tasks, torej omogoča dodajanje, urejanje in brisanje opravil,
- Prehrana – omogoča dodajanje obrokov, ki smo jih pojedli, hrani kalorije in druge informacije
  o zaužiti hrani,
- Šport – omogoča vnos aktivnosti in spodbuja uporabnika, da se več giba. Hrani informacije kot
  so tip aktivnosti, čas trajanja, dolžina itd.

Na kratko povedano bi lahko to aplikacijo opisali kot hibrid Google Tasks in Google Fit.

### TODO List

TODO list omogoča dodajanje opravil, ki jih želimo opraviti. Ta opravila se v glavnem delijo
na dva tipa opravil:

- enkratna opravila,
- ponavljajoča opravila.

Enkratna opravila imajo datum (in po možnosti uro), kdaj morajo biti opravljena. Ponavljajoča
opravila po drugi strani pa se lahko ponavljajo. Uporabnik lahko izbere, ali se to opravilo
ponavlja vsak dan, teden ali mesec. Pri tem lahko ob pogoju, da se ponavlja vsak teden, tudi
izbere, na katere dneve se opravilo ponavlja.

Opravila imajo dve stanji:

- neopravljeno (false),
- opravljeno (true).

V podatkovni strukturi se to odraža kot vrednost **true** ali **false** v polju **completed**.

Tako opravila potrebujejo naslednje lastnosti:

- ID opravila,
- ID uporabnika,
- datum, ko je bilo opravilo dodano,
- ponavljajoče opravilo:
    - dnevno,
    - tedensko:
        - dnevi v tednu,
    - mesečno,
- enkratno opravilo:
    - rok opravila,
- ime opravila,
- opis opravila,
- datum, ko je bilo opravil opravljeno

Dodatna funkcionalnost bi bila, da se opravila lahko organizira v sezname.

Hierarhija teh lastnosti je prikazana na diagramu [plan.svg](docs/plan.svg). Za odpiranje in 
urejanje si lahko namestite plugin/extension **Draw.io Integration** ali pa datoteko odprete 
in urejate na spletni strani [Draw.io](https://app.diagrams.net/). Za sam ogled datoteke pa
je dovolj že običajen pregledovalnik slik.

### Prehrana

Ta del aplikacije omogoča dodajanje jedi, ki smo jih pojedli. Pri tem uporablja obstoječ
spletni API, ki vrne informacije o kalorijah, količini ogljikovih hidratov, proteinov itd. Ti
podatki se nato seštejejo in na koncu dneva uporabnik lahko pogleda, ali je uporabnikova
prehrana primerna ali bi bilo treba izboljšati. Aplikacija poda tudi predloge, kaj spremeniti,
da se približamo bolj uravnovešeni prehrani.

Informacije, ki jih aplikacija shranjuje o jedeh/hrani so:

- ID obroka,
- ID uporabnika,
- datum, ko je bil obrok dodan,
- tip obroka (zajtrk, kosilo, večerja, malica),
- opombe,
- povprečna hranilna vrednost:
    - kalorije,
    - ogljikovi hidrati,
    - proteini,
    - maščobe:
        - nasičene,
        - nenasičene,
- sestavine. *

\* V primeru, da se dodajo sestavine, bi za vsako sestavino shranili še povprečno hranilno vrednost.
Druga opcija pa bi bila, da se naredi posebej tabela za sestavine.

Poleg navedenih hranilnih vrednosti, bi se lahko dodal še druge kot so vlakna, sol, vitamini itd.

V primeru, da jedi ni v PB, pa bi se lahko ročno dodale sestavine ali pa določila povprečna
hranilna vrednost ročno. Slednje bi bilo bolj preprosto za implementacijo. Pridobivanje podatkov
o hranilni vrednosti jedi pa se prepusti frontend-u, ki uporabi obstoječ spletni API.

### Šport

Ta del aplikacije omogoča shranjevanje in urejanje športnih aktivnosti. Na podlagi dodanih
aktivnosti izračuna čas gibanja in nam priporoči, ali bi se morali gibati več.

Dodane aktivnosti imajo naslednje lastnosti:

- ID aktivnosti,
- ID uporabnika,
- ime aktivnosti,
- opis aktivnosti,
- datum, ko je bila aktivnost dodana,
- tip aktivnosti,
- čas trajanja,
- porabljene kalorije.

Glede na tip aktivnosti pa se lahko dodajo še naslednje lastnosti:

- Tek, hoja, plavanje, kolesarjenje: dolžina in višinska razlika,

Poleg tega bi aplikacija lahko omogočala tudi dodajanje opomb in ostalih poljubnih 
lastnosti kot so npr. povprečni srčni utrip, pritisk, itd. Te podatke bi uporabnik zaenkrat
dodal sam, a v prihodnosti bi lahko podatki bili pridobljeni s pomočjo pametnih naprav kot 
je pametna ura.

Ta del aplikacije bi se lahko nadgradil še z bolj naprednim sledenjem raznih informacij
kot je število prehojenih korakov, srčni utrip tekom dneva, srčni pritisk tekom dneva,
teža uporabnika itd.

### Statistika

Ta del aplikacije uporabniku daje celoten pregled uporabnikovih navad. Torej, ali
opravila opravi vedno, koliko zamuja z opravljanjem opravil, ali se dovolj giba, ali je
prehrana uporabnika uravnovešena itd. Ta del je implementiran v frontend-u, da se izognemo
dodatnemu obremenjevanju strežnika in shranjevanju podatkov v bazo.

## Navodila za razvijalce

Aplikacija uporablja sklad MERN: MongoDB + Express + React + Node.

### Namestitev

Za delo s projektom je potrebno imeti nameščene vse omenjene tehnologije. V ta namen je za
razvoj potrebno prenesti in namestiti naslednje:

- [Node.js](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com/try/download/community)

Nato si kloniramo repozitorij.

#### Strežnik

V mapi `server` poženemo ukaz `npm install`, da namestimo vse potrebne module. Nato poženemo
MongoDB strežnik. Za zagon strežnika uporabimo ukaz `npm start`. Alternativno pa lahko uporabimo
tudi ukaz `node src/app.js`.

Za pravilno delovanje stre\nika je potrebno ustvariti datoteko `.env` v mapi `server` in vanjo
dodati naslednje spremenljivke:

```env
MONGODB_URI=mongodb://localhost:27017/habitTracker
CLIENT_PORT=<port>
JWT_SECRET=<secret>
```

Datoteka je v repozitoriju že dodana za lažjo uporabo.

### Dokumentacija

Dokumentacija je napisana v JSDoc in se nahaja v mapi `docs`, poleg tega pa tudi na GitHub
Pages. Za ogled dokumentacije obiščite [GitHub Pages](https://davidjerman.github.io/HabitTracker/).

V kolikor želite generirati dokumentacijo sami, uporabite ukaz `npm run gen_docs` v mapi `server`. Za
generiranje dokumentacije je potrebno namestiti `jsdoc` z ukazom `npm install -g jsdoc`. V primeru,
da želite generirati dokumentacijo ročno, uporabite ukaz `jsdoc -c jsdoc.json` v mapi `server`.
Generirana dokumentacija se nahaja v mapi `docs`.

Poleg tega je v mapi `docs` tudi diagram [plan.svg](docs/plan.svg), ki prikazuje strukturo celotne
aplikacije. Diagram [db.svg](docs/db.svg) pa prikazuje strukturo podatkovne baze oz. podatkov.
