/**
 * Facit-data från Form i fokus B FACIT
 * Manuellt rensad från PDF (flerkolumnslayout ger rörig textutläsning).
 *
 * Struktur: varje nyckel är ett övningsnamn; värdet är [[nr, svar], ...]
 * Används av pdfFacitImport.gs → fyllFacitPDF()
 */

// ---------------------------------------------------------------------------
// VERB
// ---------------------------------------------------------------------------

var VERB_FACIT = {

  "5 Imperativ": [
    [2,  "Slipa den"],
    [3,  "Klä på dig"],
    [4,  "Var tyst"],
    [5,  "Skynda dig"],
    [6,  "Ta en taxi"],
    [7,  "Rör på dig"],
    [8,  "Sy dina egna kläder"],
    [9,  "Stig upp"],
    [10, "Tvätta dig"],
    [11, "Anmäl dig"],
    [12, "Kör försiktigt"],
    [13, "Säg upp dig"],
    [14, "Bre en macka"],
    [15, "Drick lite vatten"],
    [16, "Sluta röka"],
    [17, "Ät"],
    [18, "Stanna hemma"],
    [19, "Motionera mera"],
    [20, "Åk till Paris"]
  ],

  "10 Pluskvamperfekt - avslutad aktivitet": [
    [2,  "hon hade tagit penicillin"],
    [3,  "hon hade brutit benet"],
    [4,  "han hade fyllt 85 år"],
    [5,  "hon hade målat om det"],
    [6,  "de hade tränat mycket"],
    [7,  "det hade legat framme länge"],
    [8,  "han hade flyttat"],
    [9,  "de hade läst mycket"],
    [10, "han hade förlorat sina pengar"],
    [11, "han hade vunnit pengar"],
    [12, "hon hade fått blommor"],
    [13, "hon hade glömt dem"],
    [14, "de hade åkt på semester"],
    [15, "hon hade klippt sig"],
    [16, "han hade rökt länge"],
    [17, "hon hade släckt lampan"],
    [18, "de hade badat länge i havet"],
    [19, "hon hade bott där länge"],
    [20, "hon bara hade sovit 2 timmar"]
  ],

  "11 Pluskvamperfekt - preteritum": [
    [2,  "vann han SM"],
    [3,  "fick han punktering"],
    [4,  "träffade han en ny kvinna"],
    [5,  "blev han nervös"],
    [6,  "tog vattnet slut"],
    [7,  "ringde jag polisen"],
    [8,  "svimmade hon"],
    [9,  "rymde han"],
    [10, "mådde hon bättre"],
    [11, "gjorde Trelleborg mål"],
    [12, "vrickade han foten"],
    [13, "började motorn krångla"],
    [14, "fick jag jobb"],
    [15, "gick TV:n sönder"]
  ],

  "12 Preteritum - futurum preteritum": [
    [2,  "hon skulle ha gäster"],
    [3,  "hon inte skulle flytta"],
    [4,  "hon skulle stiga upp tidigt"],
    [5,  "tåget skulle gå först kl. 5"],
    [6,  "hon skulle ta en långpromenad"],
    [7,  "hon skulle handla mycket"],
    [8,  "hon hade fyllt 80 år"],
    [9,  "hon skulle tävla i OS"],
    [10, "han skulle lämna sitt land"],
    [11, "hon skulle åka till Indien"],
    [12, "hon skulle dra ut en tand"],
    [13, "hon snart skulle föda barn"],
    [14, "hon skulle sy kläder till sina barn"],
    [15, "de inte skulle vissna"],
    [16, "de skulle få högre lön"],
    [17, "han skulle köra långt"],
    [18, "han snart skulle gifta sig"],
    [19, "han skulle köra upp nästa dag"],
    [20, "de skulle fira silverbröllop"]
  ],

  "13 Pluskvamperfekt - futurum preteritum": [
    [2,  "skulle vi köpa en båt"],
    [3,  "skulle hon ta ut delpension"],
    [4,  "skulle hon börja ett nytt liv"],
    [5,  "skulle han bila till Paris"],
    [6,  "skulle jag lämna tillbaka den på biblioteket"],
    [7,  "skulle de flytta in"],
    [8,  "skulle han ge sig iväg"],
    [9,  "skulle hon köpa en video"],
    [10, "skulle han meddela personalen"],
    [11, "skulle han börja med ett nytt"],
    [12, "skulle han börja på universitetet"],
    [13, "skulle de skaffa barn"],
    [14, "skulle hon stanna och tanka"],
    [15, "skulle vi ha lugn och ro"]
  ],

  "14 Preteritumsystemet": [
    [2,  "hade städat"],
    [3,  "hade hört av sig"],
    [4,  "hade haft"],
    [5,  "tänkte ... skulle göra"],
    [6,  "blev"],
    [7,  "skulle tentera"],
    [8,  "bodde"],
    [9,  "fick ... skulle komma"],
    [10, "hade sagt upp mig ... skulle acceptera"],
    [11, "hade vilat"],
    [12, "hade varit ... lekt"],
    [13, "väckte ... skulle åka"],
    [14, "hade glömt"],
    [15, "hade klätt på"],
    [16, "hade sovit"],
    [17, "berättade"],
    [18, "hade varit"],
    [19, "hade jobbat"],
    [20, "hade varit ... fick"],
    [21, "skulle röka"],
    [22, "hade lagt"],
    [23, "skulle fortsätta ... bestämde"],
    [24, "skulle göra"],
    [25, "skulle gå ... fick"]
  ],

  "19 Perfekt particip - predikativt (1)": [
    [1,  "postat"],
    [2,  "tvättade"],
    [3,  "anställd"],
    [4,  "beställt"],
    [5,  "tömda"],
    [6,  "läst"],
    [7,  "väckt"],
    [8,  "stekta"],
    [9,  "klädd"],
    [10, "sått"],
    [11, "sydda"],
    [12, "skriven"],
    [13, "stulet"],
    [14, "strukna"],
    [15, "målade"],
    [16, "stängt"],
    [17, "såld"],
    [18, "serverad"],
    [19, "lastade"],
    [20, "försvunna"],
    [21, "lämnat"],
    [22, "bjudna"],
    [23, "reparerad"],
    [24, "packade"]
  ],

  "21 Perfekt particip - predikativt (2)": [
    [2,  "intresserad"],
    [3,  "skrivet"],
    [4,  "irriterad"],
    [5,  "gjorda"],
    [6,  "kända"],
    [7,  "anställda"],
    [8,  "klädd"],
    [9,  "vald"],
    [10, "trodd"],
    [11, "utbildad"],
    [12, "försvunnen"],
    [13, "knäppt"],
    [14, "överraskade"],
    [15, "presenterade"],
    [16, "förföljd"],
    [17, "sedd"],
    [18, "sålt"],
    [19, "sydda"],
    [20, "buren"],
    [21, "badade"],
    [22, "lurade"],
    [23, "tagen"],
    [24, "informerade"],
    [25, "målad"],
    [26, "lättad"],
    [27, "stängt"],
    [28, "stulen"],
    [29, "oroade"],
    [30, "irriterad"],
    [31, "tillåtet"],
    [32, "erbjuden"],
    [33, "slitna"],
    [34, "sprucket"],
    [35, "missförstådd"]
  ],

  "22 Perfekt particip - attributivt": [
    [2,  "tvättade"],
    [3,  "berömda"],
    [4,  "flugna"],
    [5,  "byggda"],
    [6,  "startade"],
    [7,  "grillad"],
    [8,  "spädda"],
    [9,  "stulna"],
    [10, "tappade"],
    [11, "strukna"],
    [12, "lånade"],
    [13, "sänkta"],
    [14, "sådda"],
    [15, "beställda"],
    [16, "lagda"],
    [17, "putsade"],
    [18, "städade ... bäddade"],
    [19, "torkade"],
    [20, "sprucket"]
  ],

  "23 Perfekt particip - predikativt och attributivt": [
    [2,  "bredda"],
    [3,  "uppvaktad"],
    [4,  "tillåtet"],
    [5,  "smalt"],
    [6,  "trafikerade"],
    [7,  "höjda"],
    [8,  "upplysta ... försenat"],
    [9,  "klädd"],
    [10, "dukade"],
    [11, "berömd"],
    [12, "brutna"],
    [13, "sytt"],
    [14, "misstänkt ... förhörd"],
    [15, "översatt"]
  ],

  "25 Perfekt particip - partikelverb": [
    [2,  "uppäten ... uppdrucket"],
    [3,  "hemkommen"],
    [4,  "uppstigna"],
    [5,  "omklädda"],
    [6,  "omtyckt"],
    [7,  "insatta"],
    [8,  "isydda"],
    [9,  "ifylld"],
    [10, "felparkerade"],
    [11, "avstängt"],
    [12, "bortsprungna"],
    [13, "uppringd"],
    [14, "nerpackade"],
    [15, "uppknäppt"]
  ],

  "29 Passiv konstruktion med -s": [
    [2,  "renoverats"],
    [3,  "höjas"],
    [4,  "serveras"],
    [5,  "förvaras"],
    [6,  "avbröts"],
    [7,  "byggdes"],
    [8,  "brutits"],
    [9,  "drogs av"],
    [10, "ska säljas"],
    [11, "varvas"],
    [12, "penslas ... gräddas"],
    [13, "kläs om"],
    [14, "greps"],
    [15, "sys/sälj(e)s"],
    [16, "skalas ... skär(e)s ... stek(e)s"],
    [17, "vattnas"],
    [18, "odlas"],
    [19, "bres"],
    [20, "lad(e)s in"],
    [21, "frankeras"],
    [22, "tvättas"],
    [23, "störas"],
    [24, "granskas"],
    [25, "varslats"],
    [26, "sälj(e)s ... sytts"],
    [27, "införs"],
    [28, "öppnas"],
    [29, "byggas"],
    [30, "brytas"],
    [31, "grundades"],
    [32, "varvas"],
    [33, "granskas"],
    [34, "avbrytas"],
    [35, "förvaras"]
  ],

  "34 Transitiva och intransitiva verb (Ja/Nej)": [
    [3,  "Ja"], [4,  "Ja"], [5,  "Ja"], [6,  "Ja"], [7,  "Ja"],
    [8,  "Nej"],[9,  "Ja"], [10, "Nej"],[11, "Nej"],[12, "Ja"],
    [13, "Nej"],[14, "Ja"], [15, "Nej"],[16, "Ja"], [17, "Nej"],
    [18, "Ja"], [19, "Ja"], [20, "Nej"],[21, "Ja"], [22, "Ja"],
    [23, "Ja"], [24, "Ja"], [25, "Nej"],[26, "Ja"], [27, "Ja"],
    [28, "Ja"], [29, "Ja"], [30, "Nej"],[31, "Ja"], [32, "Ja"],
    [33, "Ja"], [34, "Nej"],[35, "Ja"], [36, "Nej"],[37, "Ja"],
    [38, "Ja"], [39, "Ja"], [40, "Ja"], [41, "Nej"],[42, "Ja"],
    [43, "Nej"],[44, "Ja"], [45, "Ja"], [46, "Nej"],[47, "Ja"],
    [48, "Ja"], [49, "Ja"], [50, "Ja"]
  ]
};

// ---------------------------------------------------------------------------
// PRONOMEN
// ---------------------------------------------------------------------------

var PRONOMEN_FACIT = {

  "6 Reflexiva pronomen": [
    [2,  "tvätta sig"], [3,  "koncentrera sig"], [4,  "kamma mig"],
    [5,  "lära oss"],   [6,  "klä på sig"],      [7,  "lägga er"],
    [8,  "lägga oss"],  [9,  "klä av sig"],       [10, "akta dig"],
    [11, "gifta sig"],  [12, "sätta er"],          [13, "oroa sig"],
    [14, "bestämma mig"],[15,"anstränga sig"],     [16, "skynda oss"],
    [17, "måla sig"],   [18, "klä om er"],         [19, "raka sig"],
    [20, "presentera dig"],[21,"vänja sig"]
  ],

  "10 Possessiva pronomen": [
    [2,  "Hans byxor ... hans jacka"],
    [3,  "Vår son ... Våra döttrar"],
    [4,  "ditt ägg"],
    [5,  "hennes syster"],
    [6,  "era smörgåsar"],
    [7,  "min telefon"],
    [8,  "Deras lägenhet"],
    [9,  "mina pennor"],
    [10, "hennes man"],
    [11, "hans bil"],
    [12, "era böcker"],
    [13, "ditt efternamn"],
    [14, "ert telefonnummer"],
    [15, "hennes hem"],
    [16, "ens ... lärare"],
    [17, "din fru"],
    [18, "Hans företag"],
    [19, "Hennes händer"],
    [20, "er hund"],
    [21, "Ens personnummer"],
    [22, "Dina glasögon"],
    [23, "deras blommor ... deras post"],
    [24, "ens problem"],
    [25, "mitt skrivbord"]
  ],

  "11 Reflexiva possessiva pronomen": [
    [2,  "sin"],  [3,  "ditt"], [4,  "sina"], [5,  "sin"],
    [6,  "sina"], [7,  "min"],  [8,  "sitt"], [9,  "sitt"],
    [10, "sina"], [11, "sitt"], [12, "sina"], [13, "sitt"],
    [14, "sina"], [15, "era"],  [16, "sin"],  [17, "sin"],
    [18, "sin"],  [19, "vart"], [20, "sina"], [21, "sitt"],
    [22, "sin"],  [23, "sitt"], [24, "sina"], [25, "sin"]
  ],

  "21 Indefinita pronomen - självständiga (Andra/annat)": [
    [2,  "Andra"], [3,  "annat"], [4,  "annat"], [5,  "Andra"],
    [6,  "annat"], [7,  "annat"], [8,  "Andra"], [9,  "annat"],
    [10, "annat"], [11, "annat"], [12, "annat"], [13, "Annat"],
    [14, "andra"], [15, "Andra"]
  ],

  "23 Indefinita pronomen - självständiga (allt/alla)": [
    [2,  "allt ... alla"], [3,  "Alla"], [4,  "allt"], [5,  "allt"],
    [6,  "Alla"],          [7,  "allt"], [8,  "Alla"], [9,  "alla"],
    [10, "allt"],          [11, "alla"], [12, "Alla"], [13, "Allt"],
    [14, "Alla"],          [15, "allt"], [16, "allt"], [17, "allt"],
    [18, "alla"],          [19, "allt"], [20, "allt"]
  ],

  "24 Indefinita pronomen - förenade (fler/färre/få)": [
    [2,  "fler"], [3,  "färre"],      [4,  "få"],   [5,  "flest"],
    [6,  "fler ... fler"], [7, "få"], [8,  "färre"], [9,  "flest"],
    [10, "många"],[11, "många"],      [12, "få"],   [13, "fler"],
    [14, "fler"], [15, "flest"]
  ],

  "27 Interrogativa pronomen - förenade": [
    [2,  "yrke/utbildning/jobb/arbete"],
    [3,  "år"],
    [4,  "länder"],
    [5,  "hand"],
    [6,  "pengar"],
    [7,  "riktnummer"],
    [8,  "ämnen"],
    [9,  "sjukdom"],
    [10, "smörgåsar"],
    [11, "landskap"],
    [12, "människa/person"],
    [13, "musik"],
    [14, "material"],
    [15, "språk"]
  ],

  "28 Interrogativa pronomen - förenade och självständiga": [
    [2,  "Vilket"],    [3,  "Vilket"],    [4,  "Vilka"],
    [5,  "Vad ... för"],[6, "Vad"],       [7,  "Vilken"],
    [8,  "Vad ... för"],[9, "Vem"],       [10, "Vad ... för"],
    [11, "Vems"],      [12, "Vad ... för"],[13, "Vad"],
    [14, "Vilka"],     [15, "Vilket"],    [16, "Vilka"],
    [17, "Vad"],       [18, "Vilka"],     [19, "Vad"],
    [20, "Vilket"]
  ]
};

// ---------------------------------------------------------------------------
// ADJEKTIV (tillägg utöver övning 2, 3, 4 i pdfFacitImport.gs)
// ---------------------------------------------------------------------------

var ADJEKTIV_EXTRA_FACIT = {

  "7a Komparation - komparativ": [
    [1,  "lugnare"],          [2,  "nyare"],             [3,  "farligare"],
    [4,  "högre"],            [5,  "större"],            [6,  "lägre"],
    [7,  "bättre"],           [8,  "sämre"],             [9,  "mindre"],
    [10, "mer systematisk"],  [11, "mer optimistisk"],   [12, "mer praktisk"],
    [13, "mer chockad"],      [14, "mer spännande"],     [15, "mer beroende"],
    [16, "äldre"],            [17, "snabbare"],          [18, "mer komplicerad"],
    [19, "kortare"],          [20, "längre"],            [21, "säkrare"],
    [22, "mer förvånad"],     [23, "yngre"],             [24, "kraftigare"],
    [25, "lättare"],          [26, "grövre"],            [27, "mer skadad"],
    [28, "enklare"],          [29, "mer utvecklad"],     [30, "tyngre"],
    [31, "mer skrämmande"],   [32, "viktigare"],         [33, "modernare"],
    [34, "mer övertygad"],    [35, "svagare"],           [36, "fullare"],
    [37, "allvarligare"],     [38, "intressantare"],     [39, "hårdare"],
    [40, "mer typisk"],       [41, "gladare"],           [42, "duktigare"],
    [43, "försiktigare"],     [44, "belåtnare"],         [45, "klokare"],
    [46, "grymmare"],         [47, "magrare"],           [48, "grannare"],
    [49, "fetare"],           [50, "mer förstående"],    [51, "mildare"],
    [52, "mer pedantisk"],    [53, "flottare"],          [54, "kallare"],
    [55, "mer intresserad"],  [56, "svårare"]
  ],

  "7b Komparation - superlativ": [
    [1,  "lugnast, -e"],        [2,  "nyast, -e"],          [3,  "farligast, -e"],
    [4,  "högst, -a"],          [5,  "störst, -a"],         [6,  "lägst, -a"],
    [7,  "bäst, -a"],           [8,  "sämst, -a"],          [9,  "minst, -a"],
    [10, "mest systematisk, -a"],[11,"mest optimistisk, -a"],[12,"mest praktisk, -a"],
    [13, "mest chockad, -e"],   [14, "mest spännande, -"],  [15, "mest beroende, -"],
    [16, "äldst, -a"],          [17, "snabbast, -e"],       [18, "mest komplicerad, -e"],
    [19, "kortast, -e"],        [20, "längst, -a"],         [21, "säkrast, -e"],
    [22, "mest förvånad, -e"],  [23, "yngst, -a"],          [24, "kraftigast, -e"],
    [25, "lättast, -e"],        [26, "grövst, -a"],         [27, "mest skadad, -e"],
    [28, "enklast, -e"],        [29, "mest utvecklad, -e"], [30, "tyngst, -a"],
    [31, "mest skrämmande, -"], [32, "viktigast, -e"],      [33, "modernast, -e"],
    [34, "mest övertygad, -e"], [35, "svagast, -e"],        [36, "fullast, -e"],
    [37, "allvarligast, -e"],   [38, "intressantast, -e"],  [39, "hårdast, -e"],
    [40, "mest typisk, -a"],    [41, "gladast, -e"],        [42, "duktigast, -e"],
    [43, "försiktigast, -e"],   [44, "belåtnast, -e"],      [45, "klokast, -e"],
    [46, "grymmast, -e"],       [47, "magrast, -e"],        [48, "grannast, -e"],
    [49, "fetast, -e"],         [50, "mest förstående, -"], [51, "mildast, -e"],
    [52, "mest pedantisk, -a"], [53, "flottast, -e"],       [54, "kallast, -e"],
    [55, "mest intresserad, -e"],[56,"svårast, -e"]
  ],

  "8 Komparativ eller superlativ?": [
    [2,  "snyggast"],           [3,  "bättre"],
    [4,  "dummast"],            [5,  "mindre"],
    [6,  "svårare ... längre"], [7,  "senare"],
    [8,  "lägre"],              [9,  "mer praktiskt"],
    [10, "viktigast"],          [11, "säkrare ... tryggare"],
    [12, "mer spännande"],      [13, "grövre"],
    [14, "mest intresserad"],   [15, "magrare"]
  ],

  "10 Bestämd form superlativ": [
    [2,  "längsta"],    [3,  "minsta"],   [4,  "bästa"],
    [5,  "mörkaste"],   [6,  "yngsta"],   [7,  "billigaste"],
    [8,  "äldsta"],     [9,  "finaste"],  [10, "högsta"],
    [11, "bekvämaste"], [12, "vackraste"],[13, "mest krävande"],
    [14, "mest kända"], [15, "mest lästa"],[16,"mest intresserade"],
    [17, "mest komplicerade"],[18,"mest typiska"],[19,"mest optimistiska"],
    [20, "mest betydande"]
  ],

  "11 Komparativ eller superlativ + substantiv": [
    [2,  "äldre exemplar"],         [3,  "största problemet"],
    [4,  "yngst/-a, -e son"],       [5,  "sämre väder"],
    [6,  "vanligaste efternamnen"], [7,  "bästa egenskaper"],
    [8,  "skickligaste skådespelare"],[9, "senaste CD"],
    [10, "lägsta priserna"],        [11, "snyggaste kläderna"],
    [12, "minsta fågeln"],          [13, "mer givande diskussion"],
    [14, "mest omtyckt/-a, -e lärare"],[15,"mer avancerad teknik"],
    [16, "mest musikaliska eleverna"]
  ],

  "12 Bestämd form superlativ + substantiv": [
    [2,  "högsta önskan"],          [3,  "äldsta släkting"],
    [4,  "godaste maträtten"],      [5,  "största städerna"],
    [6,  "vackraste naturen"],      [7,  "trevligaste husdjuret"],
    [8,  "största problem"],        [9,  "mest musikaliska personen"],
    [10, "mest typiska maträtten"], [11, "sämsta ämne"],
    [12, "kallaste månaderna"],     [13, "viktigaste helgen"],
    [14, "roligaste sporten"],      [15, "mest lästa författaren"]
  ]
};

// ---------------------------------------------------------------------------
// ADVERB
// ---------------------------------------------------------------------------

var ADVERB_FACIT = {

  "3 Frågande adverb": [
    [2,  "Hur många"], [3,  "Hur länge"],  [4,  "Hur mycket"],
    [5,  "Hur stora"], [6,  "Hur dags"],   [7,  "Hur lång"],
    [8,  "Hur ofta"],  [9,  "Hur stor"],   [10, "Hur stort"],
    [11, "Hur mycket"],[12, "Hur länge"],  [13, "Hur långt"],
    [14, "Hur länge"], [15, "Hur långt"],  [16, "Hur gammal"],
    [17, "Hur dags"],  [18, "Hur långt"],  [19, "Hur ofta"],
    [20, "Hur länge"], [21, "Hur många"],  [22, "Hur ofta"],
    [23, "Hur länge"], [24, "Hur många"],  [25, "Hur gamla"]
  ],

  "8 Rumsadverb": [
    [2,  "hemma"],          [3,  "utifrån"],         [4,  "hem"],
    [5,  "nere"],           [6,  "hemifrån"],         [7,  "ut"],
    [8,  "framme"],         [9,  "uppifrån"],         [10, "hemma"],
    [11, "därifrån/bortifrån"],[12,"in"],             [13, "där"],
    [14, "inifrån"],        [15, "upp"],              [16, "här"],
    [17, "nerifrån"],       [18, "fram"],             [19, "ute"],
    [20, "härifrån"],       [21, "hit"],              [22, "uppe"],
    [23, "ner"],            [24, "borta"],            [25, "framifrån"],
    [26, "inne"],           [27, "bort"]
  ],

  "9 Rumsadverb - adverb + preposition": [
    [2,  "hos"],  [3,  "till"], [4,  "på"],  [5,  "på"],
    [6,  "hos"],  [7,  "till"], [8,  "till"],[9,  "vid"],
    [10, "till"], [11, "vid"],  [12, "i"],   [13, "i"],
    [14, "till"], [15, "till"], [16, "i"],   [17, "hos"],
    [18, "i"],    [20, "på"]
  ],

  "10 Rumsadverb - adverb + adverb": [
    [1,  "dit"],          [2,  "där ... hit"],  [3,  "där ... dit"],
    [4,  "där ... dit"],  [5,  "där"],          [6,  "där ... dit"],
    [7,  "här ... hit ... här"],[8,"dit"],       [9,  "där ... dit"],
    [10, "där ... dit"],  [11, "hit ... här ... dit"],[12,"här"]
  ],

  "11 Rumsadverb": [
    [2,  "dit"],      [3,  "där"],      [4,  "här"],
    [5,  "dit"],      [6,  "därifrån"], [7,  "där"],
    [8,  "hit"],      [9,  "härifrån"], [10, "dit"],
    [11, "härifrån"], [12, "dit"],      [13, "där"],
    [14, "hit"],      [15, "Där"]
  ],

  "15 Sättsadverb": [
    [2,  "trevligt"], [4,  "vackert"],    [6,  "vackert"],
    [8,  "gott"],     [12, "dåligt"],     [14, "fult"],
    [15, "högt"],     [16, "högt"],       [18, "lugnt"],
    [20, "bra"],      [22, "fort"],       [23, "sakta"],
    [24, "noga"],     [26, "illa"],       [27, "tydligt"],
    [28, "falskt"],   [29, "annorlunda"], [30, "långsamt"]
  ],

  "17 Gradadverb": [
    [2,  "otroligt"],   [3,  "ungefär"],    [4,  "rätt"],
    [5,  "väldigt"],    [6,  "för"],        [7,  "alls"],
    [8,  "ungefär"],    [9,  "hemskt"],     [10, "fantastiskt"],
    [11, "lite"],       [12, "mycket"],     [13, "väldigt"],
    [14, "lagom"],      [15, "rätt"]
  ]
};

// ---------------------------------------------------------------------------
// KONJUNKTIONER
// ---------------------------------------------------------------------------

var KONJUNKTIONER_FACIT = {

  "2 Samordnande konjunktioner": [
    [2,  "eller"], [3,  "eller"], [4,  "och"],   [5,  "och"],
    [6,  "eller"], [7,  "och"],   [8,  "eller"], [9,  "så"],
    [10, "eller"], [11, "men"],   [12, "men"],   [13, "och"],
    [14, "eller"], [15, "men"],   [16, "utan"],  [17, "så"],
    [18, "men"],   [19, "eller"], [20, "utan"]
  ]
};

// ---------------------------------------------------------------------------
// PREPOSITIONER
// ---------------------------------------------------------------------------

var PREPOSITIONER_FACIT = {

  "1a Prepositioner - av, bakom, bland, efter (s.214)": [
    [2,  "bakom"],         [3,  "av"],   [4,  "bland ... efter"],
    [5,  "efter"],         [6,  "av"],   [7,  "efter"],
    [8,  "bakom"],         [9,  "efter"],[10, "av"],
    [11, "bakom"],         [12, "efter"],[13, "efter"],
    [14, "av"],            [15, "bland"]
  ],

  "1b Prepositioner - enligt, framför, från, för (s.214)": [
    [2,  "för ... för"],   [3,  "enligt"],  [4,  "för"],
    [5,  "för"],           [6,  "framför"], [7,  "för"],
    [8,  "enligt"],        [9,  "framför"], [10, "för"],
    [11, "enligt"],        [12, "framför"], [13, "från"],
    [14, "för"],           [15, "för"]
  ],

  "1c Prepositioner - före, genom, hos, i, inom (s.215)": [
    [2,  "genom"], [3,  "inom"], [4,  "före"],  [5,  "hos"],
    [6,  "genom"], [7,  "före"], [8,  "hos"],   [9,  "i"],
    [10, "i"],     [11, "hos"],  [12, "genom"], [13, "inom"],
    [14, "i"],     [15, "i"]
  ],

  "1d Prepositioner - längs, med, mellan, mot, om (s.216)": [
    [2,  "om"],     [3,  "längs"],   [4,  "om"],
    [5,  "mot"],    [6,  "med"],     [7,  "mot"],
    [8,  "om"],     [9,  "mot"],     [10, "längs"],
    [11, "mellan"], [12, "om"],      [13, "mellan"],
    [14, "om"],     [15, "mot"]
  ],

  "1e Prepositioner - omkring, på, under, utom, över (s.217)": [
    [2,  "omkring"], [3,  "på"],    [4,  "under"],
    [5,  "på"],      [6,  "på"],    [7,  "omkring"],
    [8,  "under"],   [9,  "över"],  [10, "utom"]
  ]
};
