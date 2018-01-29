require('dotenv').config()

const request = require('request-promise');
const octokit = require('@octokit/rest')();

// Declare config //

const CHALLENGES = [
  'airport_challenge',
  'takeaway-challenge',
  'rps-challenge',
  'chitter-challenge',
  'bowling-challenge',
  'instagram-challenge',
  'news-summary-challenge'
]

octokit.authenticate({
  type: 'token',
  token: process.env.GITHUB_ACCESS_TOKEN
})

async function prsFor (challenge) {
  console.log(`Calculating submissions for ${challenge}...`)
  let response = await octokit.pullRequests.getAll({owner: 'makersacademy', repo: challenge, state: 'all', per_page: 100})
  let {data} = response
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response)
    data = data.concat(response.data)
  }
  return data
}

const submittedCount = (submitted, students) => {
  return students.map((student) => {
    return submitted.includes(student) ? 1 : 0
  }).reduce((sum, value) => {
    return sum += value
  })
}

const percentageSubmitted = (listOfListsOfStudents, pullRequesters) => {
  return listOfListsOfStudents.map((listOfStudents) => {
    const cohort = Object.keys(listOfStudents)[0]
    const students = Object.values(listOfStudents)[0]

    if(students.length == 0) { return }

    return {
      [cohort]: `${ ((submittedCount(pullRequesters, students) / students.length) * 100).toFixed(1) }%`
    }
  }).filter(hsh => hsh !== undefined)
}

async function printCohortRatios(challenges) {
  for(const challenge of challenges) {
    const pullRequests = await prsFor(challenge)
    console.log(`===== ${challenge} =====`)
    console.log(percentageSubmitted(listOfListsOfStudents, pullRequests.map(pr => pr.user.login)))
  }
}

printCohortRatios(CHALLENGES)

const listOfListsOfStudents = [
  {"November 2013": ["gianniGG", "koomerang", "anath26", "nkeszler", "ericat", "GiacomoPatella", "HannahKnights", "kenmasco", "larahy", "MatzFan", "NisarTahir", "jamesgraham09", "TomGroombridge", "SimonWoolf", "TomShacham", "astux7", "traviagio"]}, 
  {"January 2014": ["ayaz0206", "kalle10", "plawtr", "ab-thomas", "Berta-G", "biwek", "ColinFrankish", "jorjahung", "Maikon", "mfolsom", "nabin369", "NotTheUsual", "Roy-Gardiner", "MihaiLiviuCojocar", "CrowdHailer", "Rolando-Barbella"]}, 
  {"February 2014": ["ajcumine", "alexgaudiosi", "HannahCRW", "mariogintili", "MarkMekhaiel", "MichaelSid", "richardcurteis", "RossHepburn", "yan0va", "overnet", "tyrollins", "Charliebr73", "duboff", "fitstek", "itsSanzo", "khushkaran", "insidae", "manjic", "noreika", "tiffaniechia", "shadchnev", "sarahseewhy", "fredmcgroarty"]}, 
  {"March  2014": ["robindoble", "dbugsy", "Em01", "StephanMusgrave", "loulai", "apostoiis", "colinbfmarshall", "josephwolf", "llexileon", "mazzastar", "NicoSa", "Scott123454", "stefaniacardenas", "JoshFB", "willhall88", "muhanad40", "sroop"]}, 
  {"May 2014": ["mserino", "nyeeles", "nadavmatalon", "jchb9", "codepreneur", "federicomaffei", "jbk1", "juliatan", "jwhyte88", "painted", "fzrh", "Arepo", "katehamilton247", "NicolaiDTH"]}, 
  {"June 2014": ["cmew3", "michielstigter", "theCultLeaderFace", "lisaar", "Bayonnaise", "jeantroiani", "aitkenster", "csharpd", "jamieallen59", "yoshdog", "joedowdell", "thejennywang", "0xff6a", "HanWax", "petemmccarthy", "TalalK", "marcoaam", "M-E-T-H-O-Dman", "tbeeley", "HanWax", "EdwardAndress", "zoeabryant"]}, 
  {"August 2014": ["AppMaster32", "benjamintillett", "kikrahau", "yasuba", "ElliotLewis8923", "Mervodactyl", "michballard", "ch2ch3", "Jrmcneil", "NineInchNade", "Nickrhys", "flickoid", "leopoldkwok", "globalavocado", "byverdu", "roidriscoll", "Andy010", "spike01", "henryaj", "ruthearle", "silver-io", "sjmog", "gypsydave5", "binaryberry", "jjromeo"]}, 
  {"September 2014": ["HatStephens", "zshnr", "fadieh", "jamesascarter", "deniseyu", "bmordan", "elenagarrone", "camillavk", "EllaNancyFay", "annayerofeyeva", "craigh44", "MadameSardine", "Schlap", "alexfakhri", "karinnielsen", "mala23", "NicolePell", "SBLLB", "Scully87", "slstevens", "yvettecook", "AndrewHarrison", "andrewhercules", "barr-code", "danjocutler", "galicians", "ananogal"]}, 
  {"October 2014": ["benhutchinson", "ablease", "langesi", "mmmmmmmmmmmmmmmmmmmmmm", "ctrembath", "chandley", "chrisjbatts", "JKiely", "nickbdyer", "mishal1", "shanhasan", "Benc93", "ralake", "imarkwick", "giorgia-amici", "danielobembe", "abridger", "Callisto13", "Tr1ckX", "1278dale"]}, 
  {"December 2014": ["kierangoodacre", "HannahCarney", "lukeclewlow", "marcinwal", "bebbs", "emilysas", "guspowell", "indiadearlove", "jacobmitchinson", "jindai1783", "andygnewman", "isoworg", "stepholdcorn", "tekhuy", "ptolemybarnes", "jakealvarez", "clint77", "sandagolcea", "JackRubio26", "jjlakin", "olucas92", "iggyster3", "ciawalsh", "BibianaC"]}, 
  {"February 2015": ["Diego-Romero", "loris-fo", "ErikAGriffin", "guidovitafinzi", "jjnewman", "sphaughton", "sebastienpires", "veliancreate", "eddbrown", "vvirgitti", "meads58", "costassarris", "GabeMaker", "louisebeh", "RizAli", "alexparkinson1", "Pau1fitz", "philbrockwell1984", "wardymate", "braunsnow", "tomcoakes", "tommasobratto", "TStrothjohann", "katebeavis", "kevinlanzon"]}, 
  {"March 2015": ["PaulWallis42", "Nadav-Rosenberg", "domaro", "GBouffard", "M1lena", "Munded", "sanjsanj", "Tomiblanchard", "Stacca", "saramoohead", "massud", "jaymuk", "GJMcGowan", "bk8296", "phoebehugh", "kanishkwalia", "armi1189", "rjlynch", "maxlweaver", "jflm", "maciejk77"]}, 
  {"Ronin March 2015": ["DanBlakeman", "Gwasanaethau", "jadeKing", "RBGeomaticsRob", "pavlrd", "ilyafaybisovich", "ejbyne", "Icicleta", "augustinas", "joejknowles", "JordanMaker"]}, 
  {"April 2015": ["ashleigh090990", "zanetton", "stefan22", "timoxman", "danwhitston", "dan-bolger", "cmanessis", "timrobertson0122", "curlygirly", "andygout", "MollieS", "dwatson62", "CharlieKenny", "rodcul", "AlexHandy1", "bagolol", "smarbaf", "AnnaKL", "uzomao"]}, 
  {"June 2015": ["mohamedIssaq", "DataMinerUK", "duskyshelf", "kfcrobbie", "leggsimon", "lroliphant", "natstar93", "zdajani", "FaisalChoura", "salman-karim", "arnottmj", "gerard-morera", "KateWilkinson", "fakeharxy", "aleckz", "cwgmiller", "jonathansayer", "jonathanngkh", "TheoLeanse", "Triffanys101", "katsuraku", "elinnet", "MassimilianoMura", "jackhalltipping"]}, 
  {"July 2015": ["raphlevy", "richgeog", "adrianw1832", "dregules", "bgraves14", "Yorkshireman", "Kyvyas", "ljones140", "ojlamb", "tealpaintedduck", "zlahham", "leon-wee", "benhawker", "katylouise", "christopheralcock", "haroonhassan", "giusepped", "emily-jane", "7091lapS", "anitacanita", "UpstatePedro", "reteshbajaj", "GabyML", "sivanpatel", "Teeohbee", "benja2208", "Fadi-Hakim"]}, 
  {"Ronin July 2015": ["RichardCharman", "parmsang", "JoshuaTatterton", "squarebe", "winnieau"]}, 
  {"September 2015": ["emilyworrall", "UsmanJ", "matt-paul", "harrietc52", "Proskurina", "trwh", "lucetzer", "danielstpaul", "dbatten4", "sarahkristinepedersen", "adellanno", "Adrian1707", "zsid", "chweeks", "chn-challenger", "alexanderLM", "Benaud12", "timhyson", "jongmin141215", "davidbebb", "catherinestevenson", "AlexPerson", "bat020", "gavinwcheng", "TJQKAs", "hvenables", "archiefielding", "phillipclarke29", "aaronkendall", "MoeSadoon", "KyleMacPherson", "nathanielgreen"]}, 
  {"Ronin October 2015": ["k0zakinio", "jrose111284", "blancopado", "forty9er", "youngmanr", "yevdyko", "DeathRay1977", "d9nny"]}, 
  {"October 2015": ["EleniSkouroupathi", "hsheikhm", "OctavianRotari", "MahmudH", "ALRW", "thisdotrob", "RajeevHejib", "ivan-sathianathan", "jbhdeconinck", "rochester234", "Alaanzr", "mongolianprincess", "ezzye", "mariann013", "ChukaEbi", "FergusLemon", "mateja683", "Mattia46", "hasulica", "samover", "djtango", "NULL-OPERATOR", "asweeney41", "DovileSand", "gwpmad", "dearshrewdwit"]}, 
  {"November 2015": ["angusjfw", "emmabeynon", "Tmgree", "AlanGabbianelli", "saratateno", "giamir", "camillacolser", "ric9176", "Andrew47", "Wardrt", "gareth4192", "genzade", "TY231618", "Htunny", "Adzz", "trcrossley", "ColinMcCulloch", "gimi-q", "DanielaGSB", "michaellennox", "charlieperson", "edwardkerry", "jamiebrown201", "JBorrell", "Willibaur", "Wynndow", "klssmith", "SmithKirk", "jelgar1", "trbradley"]}, 
  {"January 2016": ["Yiorgoss", "AlexAvlonitis", "heather-camcam", "esbaddeley", "HannSO", "tishayaem", "sara6", "tsetsova", "marion-lv", "JonnyPickard", "rufusraghunath", "ScottGledhill", "mdee123", "2blastoff", "seanhawkridge", "arnoldmanzano", "innlouvate", "Jeremy-Barrass", "mic-css", "vickymg", "rachelthecodesmith", "ZeshanRasul", "eilw", "michaeljcollinsuk", "hwgordon247", "ViolaCrellin", "Itsindigo", "JoeWroe"]}, 
  {"Ronin January 2016": ["BjoernWagner", "MattGough", "RPiper93", "bargru83", "fareedpatel", "DouglasRose", "katie210", "valogopedina", "MarcoBgn", "hedudelgado", "yanyil", "frazerWatson", "ggwc82", "irynahowarth", "jaxdid", "MatDrake", "reissjohnson", "markcmhill", "russellvaughan", "Finble", "jwhekk", "tcpickard94", "drjparry", "MarcusBullock"]}, 
  {"February 2016": ["kylebuttner", "chris-parker", "rhiannonruth", "adilw3nomad", "hkp108", "NickMountjoy", "ccfz", "claudiagreen", "JojSh", "tobenna", "kevinpmcc", "gvonkoss", "eripheebs", "hawksdoves", "junyuanxue", "shaneoston72", "jazzygasper", "SimonGlancy", "hanfak", "AnnemarieKohler", "acookson91", "sachinkaria", "paulalexrees", "yasgreen93", "robota-x", "MisaOgura", "peteburch223", "MuriloDalRi", "olmesm", "peteburch223", "Managram"]}, 
  {"April 2016": ["HannaEb", "GeekG1rl", "OMGDuke", "jackrim1", "josephchin19293", "gerauf", "iammatthewward", "Rb2030", "llcclarke", "jackhardy1", "Melodija", "harrim91", "Vollcode", "elibar-uk", "Wil0", "sitypop", "harrywynnwill", "pixelandpage", "macebake", "wrumble", "bpstein", "knowerlittle", "ChrisKummelstedt", "flimflamjim"]}, 
  {"Ronin April 2016": ["AdamSkuse", "nmrichards", "naridas", "Adaymesa", "ollieh-m", "MariaRomero", "omajul85", "RichardWatkins1", "SergioETrillo", "missamynicholson", "festinalent3", "letianw91", "MaxProvin", "rahulrama", "DXTimer", "hnamitha1", "RobinHeathcote", "chriscoates"]}, 
  {"May 2016": ["toby676", "kennbarr", "Jojograndjojo", "rmarmer1", "Andy-Bell", "unalterable", "pkenrick", "lomlo", "andreamazza89", "chdezmar", "mbutlerw", "a-mellor", "sdawes", "hassanrad", "srp2930", "timchipperfield", "elena-vi", "tobywilkins", "Alex-Swann", "riyapabari", "vannio", "marlondc", "fahmahmood", "joestephens", "Harker16", "alterenzo", "srMarquinho", "hoodsuphopeshigh", "AnnaHollandSmith", "awye765", "gtormiston", "cameronepstein", "kpuwal", "mtaner", "hassanrad", "abdullamahmood", "LukaszGr", "LukeAveil", "apoorva-saxena"]}, 
  {"July 2016": ["nikklein", "wosborne", "mjosephmiller", "tchungnz", "beccapearce", "twilliams1988", "sus111", "JAstbury", "malimichael", "grmillsy1", "terrytilley", "yurizhuravel", "agakow", "dan-cl", "soph-g", "iamzakr", "JackOddy", "CONDOTH1", "NJBow", "j-luong", "rylangooch", "lukew244"]}, 
  {"Ronin July 2016": ["AppsDJ", "nomi811", "9sarah0", "mzishtiaq", "acsauk", "SlipperyJ", "SamedYalniz", "joseck0510", "nfabacus", "jaggs92", "liskowsky", "Frunez", "BJudge", "Rob-rls", "cyberplanner", "mannieg", "6eff", "richo225", "Procras", "lukecartledge", "adamjbrowner", "hannako", "arukompas", "prashantmathias", "joesweeny", "ogirginc", "albiebabie", "bkluczynski", "samjbro", "JulieLev", "jonnymoore12", "benjamin-white", "alwinruby"]}, 
  {"August 2016": ["jameshamann", "tam-borine", "andrea6859", "Matty79", "mfperkins", "nephast", "jh2633", "Lawrence-Dawson", "Tim3tang", "MrJons", "BenRoss92", "mrmurtz", "AbigailMcP", "TomStuart92", "lsewilson", "rosieallott", "supasuma", "ercekal", "peter-miklos", "alfie-ab", "johnnydee8", "ewansheldon", "littlethao", "jamesstonehill"]}, 
  {"Ronin September 2016": ["DavidAMAnderson", "souljuse", "antonyCastineiras", "glynester", "hanrattyjen", "LawrenceHunt", "B-raw", "crispinandrews", "michkles", "alexanderwjrussell", "Swinston88", "James-SteelX", "amaalali", "amidabrian51", "tomnunn", "liamtlr", "francesmx", "tadasmajeris", "darrenf54321", "Tomy8s", "IainDK", "crsanghani", "chrmsan", "stejgregory", "andygjenkins", "james1968"]}, 
  {"September 2016": ["calveym", "elizabethvenner", "ALucking1", "JeanCheviot", "asifhafeez", "stuartcooper", "lcbeh", "nspencer8", "eunkenlow", "groundberry", "KPobeeNorris", "KPobeeNorris", "MalinnaLeach", "RoystonHenson", "MrChristoff", "roryai", "diok22", "cgulli", "abeddow91", "DagmaraSz", "powderham", "nicoleshasha", "Juli0GT", "Katy600", "LaszloBogacsi", "fbell123", "rgollancz", "meeshyep", "AkramRasikh", "JG075", "ManuCiao", "RachaelMahon", "fmlharrison", "misterbl", "twp88", "lilian2112", "lauraweston", "ktsein", "Elizabeth555"]}, 
  {"November 2016": ["jjen6894", "rorygrieve", "jimmygoldshine", "jennaramdenee", "pelensky", "dinespoulsen", "GeorgeSeeger", "mavesonzini", "Unicornelia", "agata-anastazja", "fenglish", "ejatkin", "louisaspicer", "sultanhq", "ajbater", "CourtneyLO", "kwilson541", "mikehurl", "oscar-barlow", "rus64", "CrystalPea", "malinpatel", "simonconway1979", "bryonywatson1", "TudorTacal", "naomipenn", "trose16", "keomony", "cjcoops", "Chrixs", "aabolade", "Gweaton", "tomfuller", "JWKelly29", "agata-anastazja"]}, 
  {"Remote January 2017": ["samjones1001", "Putterhead", "BasileKoko", "BenJohnCarson", "treborb", "gbhachu", "thesedatedprince", "olwend", "adrianeyre", "J-Marriott", "JamesTurnerGit", "herecomesjaycee", "Justinio14"]}, 
  {"January 2017": ["kateloschinina", "Holden4", "mikefieldmay", "varvarra", "mbgimot", "kathicks", "MicaW", "bnzene", "shezdev", "artfulgarfunk", "rossbenzie", "nenoch", "sim-ware", "bwk103", "laurenrosie", "frankiefy", "mrenrich84", "Taziva", "sliute", "Sammckay12", "edytawrobel", "pedrocastanheira77", "schlattk", "bvjones", "tamarlehmann", "SerjeyD", "dylanrhodius", "rkclark", "Johnhalk"]}, 
  {"February 2017": ["Sophie5", "rorymcgit", "allthatilk", "ledleds", "Noora-q", "evebalog", "bermalh", "tvfb85", "AliceArmstrong", "joemaidman", "AAMani5", "ClemCB", "FloraHarvey", "katiekoschland", "nryn", "tvfb85", "ayanit1", "azntastic", "Christos-Paraskeva", "Stafeeva", "aleximm1", "JohnChangUK"]}, 
  {"March 2017": ["Alicespyglass", "j-rods", "connie-reinholdsson", "emmpak", "w-schwier", "petewilkins", "eugeniaguerrero", "exchai93", "scrampin", "UltimateCoder00", "Simba14", "jackbittiner", "ruanodendaal", "freddyfallon", "honjintang", "AlexJukes", "kittysquee", "nazwhale", "mghlm", "whatsrupp", "edwardwardward", "allbecauseyoutoldmeso", "gekographe", "colinturner"]}, 
  {"Remote April 2017": ["sophieklm", "adc17", "JessicaBarclay", "danielemanuel", "DSeanGray", "SimonTanner", "chrisjmit", "milesillsley", "anaalta", "jonathanelliot", "Robert-G-J", "enonnai", "BenNoonan1991", "sblausten", "FiddlersCode", "axcochrane", "adamerdemer"]}, 
  {"April 2017": ["ns-winter", "therealtimhawkins", "thomasdrayton", "baileytalks", "bruxelles86", "pkassar", "sulaimancode", "henryhobhouse", "ffasolin", "TimRobinson1", "anthony-crisp", "saralynnazuk", "JayWebDevCom", "itsalwaysbenny", "adamjohnsnow", "hyper0009", "immafirestarter", "BertZZ", "baree99", "Linh91", "G9A2HvK9", "motri", "ilarne"]}, 
  {"May 2017": ["charlottebrf", "michaelbjacobson", "panteha", "wemmm", "spencerbf", "Kynosaur", "cdscally", "lubosmichalic", "y0m0", "AaronRodrigues", "bannastre", "alexanders89", "Dino982", "Charliefea", "RSijelmass", "tobywinter", "georn", "prSathan", "kkavita92", "sampritchard", "SiAshbery", "elenamorton", "dmcd84", "jjadeseravla", "marioribeiro", "rogrenke", "Simo72"]}, 
  {"June 2017": ["mihobo", "Hempy49", "MarySalemme", "vhonebon1", "alistairkung", "terminalobject", "jinimcoroneo", "tbscanlon", "corina", "jkingharman"]}, 
  {"Remote July 2017": ["petrakh", "aballal", "ckiteou", "i-hardy", "meta-morpho-sys", "congcongbo", "langphil", "memunyawiri", "BDCraven", "EOSullivanBerlin", "paulmillen"]}, 
  {"July 2017": ["annalaise", "jransome", "Alexander-Blair", "funmia", "AlisonWoodman", "adoolaeghe", "oleglukyanov", "Benjamin-Hughes", "artemisxen", "SaphMB", "Nandhini31", "chuk-chuk", "kitkat119", "theartofnowt", "ryandav", "tobold"]}, 
  {"Blue July 2017": ["nick-otter", "willjsporter", "manoadamro", "Samellenrider", "ofrost617", "puyanwei", "alessiobortone2", "gsgkw", "david-div", "abitravers1989", "rolandosorbelli", "elizabethcsw", "FreddieCodes", "stephengeller", "LizH90", "Denisglb", "jenniferbacon01"]}, 
  {"August 2017": ["KKOA", "jameshughes7", "KINGROKOKO", "rorybot", "ComaToastUK", "wmcabangon", "neroshan12", "LuanvP", "Marcus-UK", "sunali1", "etiennemustow", "racoll", "mengchenwang", "gijoeuk", "benjaminsunderland", "diaryofdiscoveries"]}, 
  {"September 2017": ["chayyasyal", "oliviaberesford", "hugosykes", "RMCollins175", "andyrow123", "timjones10", "cdunham1989", "oliverpople", "alexiscarlier", "haletothewood", "Christine-horrocks", "TomSpencerLondon", "ainsleybc", "Pablo123GitHub", "mormolis", "CanaceWong", "alexscotttonge", "jonsanders101", "AramSimonian", "edlowther"]}, 
  {"October 2017": ["tmerrr", "somemarsupials", "ethicalDev", "cazwazacz", "ajdavey8", "Vanals", "gabrielabud", "antoniobelmar", "evadinckel", "joecowton", "Eustaquio122", "IPbianco", "LewisYoul", "RobertClayton", "olegfkl", "mariekerkstoel", "SuzanneHuldt", "cristhiandas", "majdeddine", "Yolantele", "thatdania", "tabrza", "peterwdj"]}, 
  {"November 2017": ["Mnargh", "samuel-c-johnson", "newtdogg", "joepike", "LarsFin", "lea-rsm", "Calum-W", "ewintram", "VarunCodes", "ker-an", "Ciancion", "Le5tes", "kkumshayev", "Meepit", "umairb1", "tallpress", "Xin00163", "rskyte", "GeorgeWhiting", "charlesemery15", "lunaticnick", "Albion31"]}, 
  {"December 2017": ["philb56", "AlexandraGF", "edpe", "rcvink", "SimonBao", "AnjanaLP", "domvernon", "AttyC", "bpourian", "jenniferemshepherd", "MissDove", "alextwilson", "alexse5121", "lewmoore", "Leigan0", "Gleoman", "reenz", "GiadaSimonetti", "samuelmaker", "ealitten", "Tagrand", "elliewem"]}, 
  {"January 2018": ["DKeen0123", "lwkchan", "tamasmagyarhunor88", "hannahlillis", "serenahathi", "heatherstock", "l3w15", "marcusfgardiner", "telgi", "kaaristrack", "stilley85", "Kotauror", "CarlosTrapet", "charliestrudwick", "noel1uk", "BenChallenor", "MatthewBurstein", "Jestfer", "JoshuaJFHolloway", "jennymarin1989"]}
]