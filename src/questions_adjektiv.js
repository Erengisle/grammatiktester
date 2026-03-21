// Tvåstegsformat: stage 1 = identifiera grupp, stage 2 = välj rätt form
// Grupp A: en, ett, någon/något/några, ingen/inget/inga, annan/annat/andra, varje, varenda, vilken/vilket/vilka, sådan/sådant/sådana
// Grupp B: den, det, de / den här, det här, de här / den där, det där, de där
// Grupp C: min/mitt/mina, din/ditt/dina, hans/hennes/deras, Evas (genitiv), denna/detta/dessa, samma, nästa, följande

export const ADJ_GROUP_ABC = [
  {
    id:"adjg01", type:"two_stage",
    word:"ledig – arbete",
    context:"Det finns inga ___ nu, så jag måste stämpla ett tag.",
    groupType:"adj_abc", correctGroup:"A",
    stageQ:"Välj rätt form av adjektiv och substantiv:",
    options:{A:"lediga arbeten",B:"ledigts arbete",C:"ledigt arbeten",D:"ledigna arbeten"},
    correct:"A"
  },
  {
    id:"adjg02", type:"two_stage",
    word:"hög – hus",
    context:"– Vilket hus bor du i? – I det ___ där borta.",
    groupType:"adj_abc", correctGroup:"B",
    stageQ:"Välj rätt form:",
    options:{A:"hög huset",B:"högt huset",C:"höga huset",D:"höge huset"},
    correct:"C"
  },
  {
    id:"adjg03", type:"two_stage",
    word:"ny – bil",
    context:"Deras ___ är röd.",
    groupType:"adj_abc", correctGroup:"C",
    stageQ:"Välj rätt form av adjektivet (adjektiv + substantiv):",
    options:{A:"ny bil",B:"nytt bil",C:"nya bil",D:"nye bil"},
    correct:"C"
  },
  {
    id:"adjg04", type:"two_stage",
    word:"snygg – jacka",
    context:"Vilken ___!",
    groupType:"adj_abc", correctGroup:"A",
    stageQ:"Välj rätt form:",
    options:{A:"snygg jacka",B:"snyggt jacka",C:"snygga jacka",D:"snygge jacka"},
    correct:"A"
  },
  {
    id:"adjg05", type:"two_stage",
    word:"gammal – bok",
    context:"Den ___ kostar mycket.",
    groupType:"adj_abc", correctGroup:"B",
    stageQ:"Välj rätt form:",
    options:{A:"gammal boken",B:"gammalt boken",C:"gamla boken",D:"gammals boken"},
    correct:"C"
  },
  {
    id:"adjg06", type:"two_stage",
    word:"liten – hund",
    context:"Min ___ är söt.",
    groupType:"adj_abc", correctGroup:"C",
    stageQ:"Välj rätt form av adjektivet:",
    options:{A:"liten hund",B:"litet hund",C:"lilla hund",D:"lite hund"},
    correct:"C"
  },
  {
    id:"adjg07", type:"two_stage",
    word:"ny – dag",
    context:"Varje ___ är annorlunda.",
    groupType:"adj_abc", correctGroup:"A",
    stageQ:"Välj rätt form:",
    options:{A:"ny dag",B:"nytt dag",C:"nya dag",D:"nye dag"},
    correct:"A"
  },
  {
    id:"adjg08", type:"two_stage",
    word:"stor – träd",
    context:"De ___ är höga.",
    groupType:"adj_abc", correctGroup:"B",
    stageQ:"Välj rätt form:",
    options:{A:"stor träden",B:"stort träden",C:"stora träden",D:"store träden"},
    correct:"C"
  },
  {
    id:"adjg09", type:"two_stage",
    word:"gammal – regel",
    context:"Samma ___ gäller alltid.",
    groupType:"adj_abc", correctGroup:"C",
    stageQ:"Välj rätt form:",
    options:{A:"gammal regler",B:"gammalt regler",C:"gamla regler",D:"gammals regler"},
    correct:"C"
  },
  {
    id:"adjg10", type:"two_stage",
    word:"rolig – program",
    context:"Det finns inget ___ på TV ikväll.",
    groupType:"adj_abc", correctGroup:"A",
    stageQ:"Välj rätt form (inget = ett-ord):",
    options:{A:"rolig program",B:"roligt program",C:"roliga program",D:"roligs program"},
    correct:"B"
  },
  {
    id:"adjg11", type:"two_stage",
    word:"stor – problem",
    context:"Det här ___ är svårt.",
    groupType:"adj_abc", correctGroup:"B",
    stageQ:"Välj rätt form:",
    options:{A:"stor problemet",B:"stort problemet",C:"stora problemet",D:"store problemet"},
    correct:"C"
  },
  {
    id:"adjg12", type:"two_stage",
    word:"lång – semester",
    context:"Nästa ___ ska jag resa.",
    groupType:"adj_abc", correctGroup:"C",
    stageQ:"Välj rätt form av adjektivet (semester = ett-ord):",
    options:{A:"lång semester",B:"långt semester",C:"långa semester",D:"länge semester"},
    correct:"C"
  },
  {
    id:"adjg13", type:"two_stage",
    word:"intressant – projekt",
    context:"Jag hoppas på något ___.",
    groupType:"adj_abc", correctGroup:"A",
    stageQ:"Välj rätt form (något = ett-ord):",
    options:{A:"intressant projekt",B:"intressants projekt",C:"intressanta projekt",D:"intressante projekt"},
    correct:"A"
  },
  {
    id:"adjg14", type:"two_stage",
    word:"ny – kläder",
    context:"De där ___ är dyra.",
    groupType:"adj_abc", correctGroup:"B",
    stageQ:"Välj rätt form:",
    options:{A:"ny kläderna",B:"nytt kläderna",C:"nya kläderna",D:"nye kläderna"},
    correct:"C"
  },
  {
    id:"adjg15", type:"two_stage",
    word:"gammal – hus",
    context:"Hennes ___ är stort.",
    groupType:"adj_abc", correctGroup:"C",
    stageQ:"Välj rätt form av adjektivet (hus = ett-ord):",
    options:{A:"gammal hus",B:"gammalt hus",C:"gamla hus",D:"gammals hus"},
    correct:"C"
  },
];

// Komparationsgrupper:
// Grupp 1: –are, –ast  (de flesta adjektiv: rolig→roligare, roligast)
// Grupp 2: –re, –st med omljud  (hög, ung, tung, låg, lång, stor, grov)
// Grupp 3: oregelbundna  (gammal/äldre, liten/mindre, bra/bättre, dålig/sämre)
// Grupp 4: mer / mest  (adjektiv på –isk, perfekt particip, presens particip)

export const ADJ_KOMP = [
  {
    id:"komp01", type:"two_stage",
    word:"rolig",
    context:"",
    groupType:"comp_1234", correctGroup:"1",
    stageQ:"Välj komparativ form:",
    options:{A:"roligare",B:"roligre",C:"mer rolig",D:"roligaste"},
    correct:"A"
  },
  {
    id:"komp02", type:"two_stage",
    word:"gammal",
    context:"",
    groupType:"comp_1234", correctGroup:"3",
    stageQ:"Välj komparativ form:",
    options:{A:"gammaldare",B:"äldre",C:"gammalare",D:"gammare"},
    correct:"B"
  },
  {
    id:"komp03", type:"two_stage",
    word:"ung",
    context:"",
    groupType:"comp_1234", correctGroup:"2",
    stageQ:"Välj komparativ form:",
    options:{A:"ungare",B:"ungre",C:"yngre",D:"unge"},
    correct:"C"
  },
  {
    id:"komp04", type:"two_stage",
    word:"praktisk",
    context:"",
    groupType:"comp_1234", correctGroup:"4",
    stageQ:"Välj komparativ form:",
    options:{A:"praktiskare",B:"praktiskre",C:"mer praktisk",D:"mest praktisk"},
    correct:"C"
  },
  {
    id:"komp05", type:"two_stage",
    word:"bra",
    context:"",
    groupType:"comp_1234", correctGroup:"3",
    stageQ:"Välj komparativ form:",
    options:{A:"braare",B:"bättra",C:"bättre",D:"mer bra"},
    correct:"C"
  },
  {
    id:"komp06", type:"two_stage",
    word:"hög",
    context:"",
    groupType:"comp_1234", correctGroup:"2",
    stageQ:"Välj superlativ (obestämd form):",
    options:{A:"högast",B:"högre",C:"högst",D:"högest"},
    correct:"C"
  },
  {
    id:"komp07", type:"two_stage",
    word:"intresserad",
    context:"",
    groupType:"comp_1234", correctGroup:"4",
    stageQ:"Välj komparativ form:",
    options:{A:"intresseradare",B:"mer intresserad",C:"intresseradre",D:"intresseradast"},
    correct:"B"
  },
  {
    id:"komp08", type:"two_stage",
    word:"liten",
    context:"",
    groupType:"comp_1234", correctGroup:"3",
    stageQ:"Välj komparativ form:",
    options:{A:"litenare",B:"litnare",C:"mindres",D:"mindre"},
    correct:"D"
  },
  {
    id:"komp09", type:"two_stage",
    word:"snabb",
    context:"",
    groupType:"comp_1234", correctGroup:"1",
    stageQ:"Välj superlativ (obestämd form):",
    options:{A:"snabbast",B:"snabbest",C:"mest snabb",D:"snabbaste"},
    correct:"A"
  },
  {
    id:"komp10", type:"two_stage",
    word:"stor",
    context:"",
    groupType:"comp_1234", correctGroup:"2",
    stageQ:"Välj komparativ form:",
    options:{A:"storare",B:"störe",C:"större",D:"storar"},
    correct:"C"
  },
  {
    id:"komp11", type:"two_stage",
    word:"dålig",
    context:"",
    groupType:"comp_1234", correctGroup:"3",
    stageQ:"Välj komparativ form:",
    options:{A:"dåligare",B:"sämre",C:"dåligre",D:"mer dålig"},
    correct:"B"
  },
  {
    id:"komp12", type:"two_stage",
    word:"musikalisk",
    context:"",
    groupType:"comp_1234", correctGroup:"4",
    stageQ:"Välj superlativ (obestämd form):",
    options:{A:"musikaliskast",B:"mest musikalisk",C:"musikaliskest",D:"musikaliskre"},
    correct:"B"
  },
  {
    id:"komp13", type:"two_stage",
    word:"lång",
    context:"",
    groupType:"comp_1234", correctGroup:"2",
    stageQ:"Välj superlativ (obestämd form):",
    options:{A:"längast",B:"längest",C:"längst",D:"mest lång"},
    correct:"C"
  },
  {
    id:"komp14", type:"two_stage",
    word:"nyfiken",
    context:"",
    groupType:"comp_1234", correctGroup:"1",
    stageQ:"Välj komparativ form:",
    options:{A:"nyfiknare",B:"nyfikenare",C:"mer nyfiken",D:"nyfikare"},
    correct:"A"
  },
  {
    id:"komp15", type:"two_stage",
    word:"spännande",
    context:"",
    groupType:"comp_1234", correctGroup:"4",
    stageQ:"Välj komparativ form:",
    options:{A:"spännandemare",B:"mer spännande",C:"spännandeaste",D:"spännanst"},
    correct:"B"
  },
];

export const BUILT_IN_TESTS_ADJ = [
  {
    id:"adj-abc",
    title:"Adjektiv, uppgift 1 – böjningsgrupp A, B eller C",
    category:"Adjektiv – grupper",
    source:"",
    locked:true,
    questions:ADJ_GROUP_ABC
  },
  {
    id:"adj-komp",
    title:"Adjektiv, uppgift 2 – komparationsgrupp 1–4",
    category:"Adjektiv – komparering",
    source:"",
    locked:true,
    questions:ADJ_KOMP
  },
];

export const ADJ_CATEGORIES = [
  "Adjektiv – grupper",
  "Adjektiv – komparering",
];
