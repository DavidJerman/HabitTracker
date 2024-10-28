# Habit tracker

Ta aplikacija bo omogočala sledenje opravil, prehrane in športa uporabnika.

Informacije o aplikaciji najdeš v naslednjem repozitoriju:
<https://github.com/DavidJerman/HabitTracker>

## Opis aplikacije

Aplikacija sestoji iz treh glavnih delov:

- TODO List - nekaj v stilu Google Tasks,
- Prehrana - omogoča dodajanje obrokov, ki smo jih pojedli, hrani kalorije itd.,
- Šport - omogoča vnos aktivnosti in spodbuja uporabnika, da se več giba.

Na kratko povedano bi lahko to aplikacijo opisali kot hibrid Google Tasks in Google Fit.

### TODO List

TODO list omogoča dodajanje opravil, ki jih želimo opraviti. Ta opravila se v glavnem delijo
na dva tipa opravil:

- enkratna opravila,
- ponavljajoča opravila.

Enkratna opravila imajo datum (in po možnosti uro) do kdaj morajo biti opravljena. Ponavljajoča
opravila po drugi strani pa se lahko ponavljajo. Uporabnik lahko zbere, ali se to opravilo
ponavlja vsak dan, teden ali mesec. Pri tem lahko ob pogoju da se ponavlja vsak teden tudi
izbere, na katere dneve se opravilo ponavlja.

Opravila imajo dve stanji:

- neopravljeno,
- opravljeno.

Tako opravila potrbujejo naslednje lastnosti:

- ID opravila,
- ID uporabnika,
- datum, ko je bilo opravilo dodano,
- ponavljajoce opravilo:
  - dnevno,
  - tedensko:
    - dnevi v tednu,
  - mesecno,
- neponavljajoce opravilo:
  - rok opravila,
- ime oparvila,
- opis opravila,
- stanje opravila (opravljeno?):
  - datum, ko je bilo opravil opravljeno

Dodatna funkcionalnost bi bila da se opravila lahko organizira v sezbane.

Hierarhija teh lastnosti je prikazana na diagramu [plan.svg](docs/plan.svg). Za odpiranje si
lahko namestite plugin/extension Draw.io Integration ali pa datoteko odprete in urejate na
spletni strani [Draw.io](https://app.diagrams.net/).

### Prehrana

Ta del aplikacije bi omogočal dodajanje jedi, ki smo jih pojedli. Pri tem uporablja obstoječ
spletni API, ki vrne informacije o kalorijah, količini ogljikovih hidratov, preoteinov itd. Ti
podatki se nato seštejejo in na koncu dneva uporabnik lahko pogleda, ali je uporabnikova
prehrana primerna ali bi bilo treba kaj izboljšati. Aplikacija poda tudi predloge, kaj spremeniti,
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
- sestavine*

\* V primeru, da se dodajo sestavine, bi za vsako sestavino shranili še povprečno hranilno vrednost.
   Druga opcija pa bi bila, da se naredi posebej tabela za sestavine.

Poleg navedenih hranilnih vrednosti, bi se lahko dodal še druge kot so vlakna, sol, vitamini itd.

V primeru, da jedi ni v PB, pa bi se lahko ročno dodale sestavine ali pa določila povprečna
hranilna vrednost ročno.

### Šport

Ta del aplikacije omogoča shranjevanje dodajanje športnih aktivnosti. Na podlagi dodanih
aktivnosti izračuna čas gibanja in nam priporoči ali bi se morali gibati več.

Dodane aktivnosti imajo naslednje lastnosti:

- ID aktivnosti,
- ID uporabnika,
- datum, ko je bila aktivnost dodana,
- tip aktivnosti,
- čas trajanja,

Glede na tip aktivnosti pa se lahko dodajo še naslednje lastnosti:

- Tek, hoja, plavanje, kolesarjenje: dolžina,

Poleg tega aplikacija omogoča tudi dodajanje opomb in ostalih poljubnih lastnosti kot so
npr. povprečni srčni utrip, pritisk, itd. Te podatke uporabnik zaenkrat doda sam, a v
prihodnosti bi lahko podatki bili pridobljeni s pomočjo pametnih naprav kot je pametna
ura.

Ta del aplikacije bi se lahko nadgradil še z bolj naprednim sledenje raznih informacij
kot je število prehojnih korakov, srčni utripo tekom dneva, srčni pritisk tekom dneva,
teža uporabnika itd.

### Statistika

Ta del aplikacije bi uporabniku dajal celoten pregled uporabnikovih navad. Torej, ali
opravila opravi vedno, koliko zamuja z opravljanjem opravil, ali se dovolj giba, ali je
prehrana uporabnika uravnovešena itd. Ta del bi se lahko v celoti naredil v front-endu.

## Uporabljene tehnologije

Aplikacija uporablja sklad MERN: MongoDB + Express + React + Node.
