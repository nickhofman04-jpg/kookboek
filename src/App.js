import { useState } from "react";

const CATS = ["Ontbijt","Lunch","Diner","Dessert","Snack","Hapjes","Overig"];
const DIFFS = ["Gemakkelijk","Gemiddeld","Moeilijk"];
const EMPTY_FORM = {title:"",description:"",category:"Diner",prepTime:"",cookTime:"",servings:"4",difficulty:"Gemiddeld",ingredients:[""],steps:[""]};
const STORAGE_KEY = "mijn-receptenboek-2025-v2";

function makeId(){return "r"+Date.now().toString(36)+Math.random().toString(36).slice(2);}

const CAT_COLORS = {
  Ontbijt:{icon:"🌅",light:{bg:"#FEF9EC",border:"#F59E0B",text:"#92400E"},dark:{bg:"#2A1F00",border:"#FBBF24",text:"#FDE68A"}},
  Lunch:  {icon:"🥗",light:{bg:"#ECFDF5",border:"#059669",text:"#064E3B"},dark:{bg:"#002A1A",border:"#34D399",text:"#A7F3D0"}},
  Diner:  {icon:"🍽️",light:{bg:"#FFF7ED",border:"#EA580C",text:"#7C2D12"},dark:{bg:"#2A0F00",border:"#FB923C",text:"#FDBA74"}},
  Dessert:{icon:"🍮",light:{bg:"#FDF2F8",border:"#DB2777",text:"#831843"},dark:{bg:"#2A001A",border:"#F472B6",text:"#FBCFE8"}},
  Snack:  {icon:"🥨",light:{bg:"#FFFBEB",border:"#D97706",text:"#78350F"},dark:{bg:"#1A1000",border:"#F59E0B",text:"#FDE68A"}},
  Hapjes: {icon:"🥂",light:{bg:"#EFF6FF",border:"#2563EB",text:"#1E3A8A"},dark:{bg:"#001230",border:"#60A5FA",text:"#BAE6FD"}},
  Overig: {icon:"🍴",light:{bg:"#F8FAFC",border:"#64748B",text:"#334155"},dark:{bg:"#1A1A1A",border:"#94A3B8",text:"#CBD5E1"}},
};
function getCatC(cat,dk){const m=CAT_COLORS[cat]||CAT_COLORS.Overig;return dk?m.dark:m.light;}
function getCatI(cat){return(CAT_COLORS[cat]||CAT_COLORS.Overig).icon;}

const CAT_GROUPS=[
  {label:"Dagelijkse maaltijden",cats:["Ontbijt","Lunch","Diner"]},
  {label:"Tussendoor & feest",cats:["Snack","Hapjes","Dessert"]},
  {label:"Overig",cats:["Overig"]},
];

const ALL = [
  {id:"a01",title:"Varkenswangen in donker bier",category:"Diner",description:"Zacht gestoofde varkenswangen in Leffe bruin. Comfort food op zijn best.",prepTime:"20 min",cookTime:"3 uur",servings:"4",difficulty:"Gemiddeld",ingredients:["1,2 kg varkenswangen","2 flesjes Leffe bruin","2 uien, grof gesneden","3 wortelen, in stukken","3 stengels bleekselderij","4 teentjes knoflook","2 el bruine suiker","2 el Dijonmosterd","3 takjes tijm","2 laurierblaadjes","Bloem om te bestuiven","Zout en peper","Zonnebloemolie"],steps:["Dep de wangen droog, kruid met zout en peper, bestuif met bloem.","Braad rondom goudbruin in hete olie. Haal eruit.","Fruit ui, wortel, selderij en knoflook 5 min in dezelfde pot.","Voeg suiker toe en karameliseer. Roer de mosterd erdoor.","Doe de wangen terug, overgiet met bier, voeg tijm en laurier toe.","Laat 2,5 tot 3 uur sudderen op laag vuur met deksel.","Zeef de saus en reduceer tot mooie binding.","Serveer met puree of frietjes."]},
  {id:"a02",title:"Vol-au-vent",category:"Diner",description:"De Belgische klassieker met kip, champignons en gehaktballetjes in romige blanke saus.",prepTime:"30 min",cookTime:"45 min",servings:"6",difficulty:"Gemiddeld",ingredients:["1 kip of 4 kippenpoten","200g champignons in schijfjes","150g kleine varkensgehaktballetjes","1 ui","2 wortelen","1 prei","60g boter","60g bloem","500ml kippenbouillon","200ml room","2 eierdooiers","Sap van een halve citroen","Nootmuskaat, zout en witte peper","6 vol-au-vent schelpjes"],steps:["Kook de kip 45 min. Pluk het vlees. Bewaar 500ml kookvocht.","Bak champignons goudbruin. Kook de balletjes gaar in bouillon.","Maak een roux: smelt boter, voeg bloem toe, roer 2 min.","Voeg bouillon al roerend toe. Laat 5 min sudderen.","Roer eierdooiers en room erdoor van het vuur af.","Voeg kip, champignons en balletjes toe. Kruid goed.","Warm schelpjes op in de oven op 180 graden en vul royaal."]},
  {id:"a03",title:"Lasagne met 4-uurs bolognese",category:"Diner",description:"Een bolognese die urenlang pruttelt voor een diepe, rijke smaak.",prepTime:"30 min",cookTime:"4,5 uur",servings:"6",difficulty:"Gemiddeld",ingredients:["500g rundergehakt","200g varkensgehakt","200g pancetta fijngesneden","2 uien fijngesnipperd","3 wortelen fijn","3 stengels selderij fijn","4 teentjes knoflook","200ml rode wijn","2 blikken gepelde tomaten","2 el tomatenpuree","150ml volle melk","Lasagnebladen","75g boter voor bechamel","75g bloem voor bechamel","900ml melk voor bechamel","Nootmuskaat","200g geraspte Parmezaan"],steps:["Bak pancetta krokant. Voeg groenten toe, fruit 10 min.","Voeg knoflook en gehakt toe, bak rul en bruin.","Blus met rode wijn, laat verdampen.","Voeg tomaten, tomatenpuree en melk toe. Pruttel 4 uur op laag vuur.","Maak bechamel: roux, warme melk toevoegen al roerend.","Bouw op in ovenschaal: saus, pasta, bechamel, Parmezaan. Herhaal.","Dek af met folie, bak 40 min op 180 graden. Haal folie eraf, 15 min extra."]},
  {id:"a04",title:"Spaghetti Carbonara",category:"Diner",description:"De echte Romeinse carbonara. Geen room! Zijdezacht en onweerstaanbaar.",prepTime:"10 min",cookTime:"15 min",servings:"4",difficulty:"Gemiddeld",ingredients:["400g spaghetti","200g guanciale of pancetta","4 eieren","2 extra eierdooiers","100g Pecorino Romano geraspt","50g Parmezaan geraspt","Royaal gemalen zwarte peper","Zout voor het pastawater"],steps:["Kook pasta al dente. Bewaar 200ml kookwater.","Klop eieren, dooiers en kaas met veel zwarte peper.","Bak guanciale krokant in droge pan. Haal van het vuur.","Doe afgegieten pasta bij het spek met pan van het vuur.","Voeg ei-kaasmengsel toe. Roer snel, voeg kookwater toe tot zijdezachte saus.","Serveer direct met extra Pecorino. Nooit room toevoegen!"]},
  {id:"a05",title:"Vlaamse stoverij",category:"Diner",description:"Het ultieme Belgische stoofvlees. Donker bier, brood met mosterd en geduld.",prepTime:"20 min",cookTime:"3 uur",servings:"6",difficulty:"Gemakkelijk",ingredients:["1,5 kg runderstoofvlees in grote blokken","2 uien in halve ringen","2 flesjes Westmalle Dubbel","2 sneetjes bruinbrood","Dijonmosterd voor op het brood","3 laurierblaadjes","4 takjes tijm","1 el bruine suiker","Zout en peper","Olie"],steps:["Braad vlees goudbruin aan. Zet apart.","Fruit uien, voeg suiker toe en karameliseer.","Doe vlees terug, overgiet met bier.","Leg boterhammen met mosterdkant naar beneden bovenop het vlees. Voeg kruiden toe.","Stoof 2,5 uur op laag vuur. Het brood lost op en bindt de saus.","Serveer met frietjes."]},
  {id:"a06",title:"Entrecote met cafe de Paris boter",category:"Diner",description:"Een mooi stuk vlees bakken is een kunst. Met zelfgemaakte kruidenboter.",prepTime:"15 min",cookTime:"10 min",servings:"2",difficulty:"Gemakkelijk",ingredients:["2 entrecotes van 250g op kamertemperatuur","Zout en grof gemalen peper","Olie","100g zachte boter","1 tl kappertjes","1 ansjovisfilet","1 tl Dijonmosterd","0,5 tl kerriepoeder","1 tl dragon","1 tl peterselie","Sap van een halve citroen"],steps:["Meng de boter met alle kruiden, rol in plasticfolie en laat 1 uur koelen.","Haal vlees 30 min vooraf uit de koelkast. Dep droog en kruid.","Verhit gietijzeren pan gloeiend heet. Bak 2-3 min per kant voor medium-rare.","Voeg de laatste minuut boter toe en bast het vlees.","Laat 5 min rusten. Serveer met dikke schijf cafe de Paris boter."]},
  {id:"a07",title:"Cote de boeuf voor twee",category:"Diner",description:"Een entrecote met been, dik gesneden. Eenvoud troef voor echt vleesvolk.",prepTime:"10 min",cookTime:"20 min",servings:"2",difficulty:"Gemakkelijk",ingredients:["1 cote de boeuf van 700g","Grof zeezout","Zwarte peper","2 el olie met hoog rookpunt","3 el boter","4 teentjes knoflook gekneusd","4 takjes rozemarijn","4 takjes tijm"],steps:["Haal het vlees 1 uur voor gebruik uit de koelkast.","Verhit gietijzeren pan gloeiend heet.","Kruid vlees net voor het bakken. Bak 3-4 min per kant.","Voeg boter, knoflook en kruiden toe. Bast continu.","Zet in de oven op 180 graden: 8-10 min voor medium-rare (55 graden kern).","Laat minstens 10 min rusten. Snij in plakken en serveer."]},
  {id:"a08",title:"Slow cooked varkensribbetjes 6 uur",category:"Diner",description:"Zes uur op lage temperatuur. Het vlees valt letterlijk van het bot.",prepTime:"25 min",cookTime:"6 uur",servings:"4",difficulty:"Gemakkelijk",ingredients:["1,5 kg varkensribbetjes","2 el bruine suiker","1 el zout","1 el gerookt paprikapoeder","1 tl knoflookpoeder","1 tl uienpoeder","1 tl zwarte peper","1 tl komijn","0,5 tl cayennepeper","200ml BBQ-saus","3 el honing","2 el appelciderazijn","1 el Worcestershiresaus","2 teentjes knoflook geperst"],steps:["Verwijder het witte vlies van de onderkant van de ribben.","Wrijf de rub royaal in. Wikkel in folie en laat minstens 2 uur in de koelkast.","Oven op 140 graden. Leg de ribbetjes in gesloten aluminiumfolie. Bak 5 uur.","Meng alle saus-ingredienten en laat 5 min inkoken.","Haal de ribben uit de folie. Verhoog oven naar 200 graden.","Kwast de saus over de ribben. Bak 30-40 min, elke 10 min opnieuw kwastend.","Laat 5 min rusten voor het aansnijden."]},
  {id:"a09",title:"Slow cooked rundsribbetjes in rode wijn",category:"Diner",description:"Dikke runderribbetjes gesmoord in rode wijn met rozemarijn.",prepTime:"25 min",cookTime:"5 uur",servings:"4",difficulty:"Gemiddeld",ingredients:["2 kg rundsribbetjes (beef short ribs)","1 fles rode wijn (Shiraz of Malbec)","400ml runderbouillon","2 uien in kwarten","1 bol knoflook gehalveerd","3 wortelen grof gesneden","3 stengels selderij grof gesneden","2 el tomatenpuree","3 takjes rozemarijn","3 laurierblaadjes","Zout en peper","2 el olie"],steps:["Dep de ribbetjes droog en kruid royaal.","Braad rondom donkerbruin aan in gietijzeren pot. Haal eruit.","Fruit ui, knoflook, wortel en selderij 5 min. Voeg tomatenpuree toe, bak 2 min.","Blus met rode wijn. Voeg bouillon, rozemarijn en laurier toe.","Leg de ribbetjes terug. Breng aan de kook. Dek af en zet 4-5 uur in de oven op 150 graden.","Haal ribbetjes eruit als het vlees van het bot valt.","Zeef de saus en reduceer tot rijke glaze. Giet over de ribbetjes."]},
  {id:"a10",title:"Aziatische sticky ribbetjes",category:"Diner",description:"Zoet, zout, plakkerig en onweerstaanbaar. Aziatische smaken op hun best.",prepTime:"20 min",cookTime:"2,5 uur",servings:"4",difficulty:"Gemakkelijk",ingredients:["1,2 kg varkensribbetjes","4 el sojasaus","3 el hoisinsaus","2 el rijstwijnazijn","2 el honing","2 el bruine suiker","3 teentjes knoflook geraspt","2 cm verse gember geraspt","1 tl vijfkruidenpoeder","1 tl sesamolie","Sesamzaadjes","Groene ui","Rode chili"],steps:["Meng marinade. Leg ribbetjes erin en laat minstens 2 uur marineren.","Oven op 150 graden. Ribbetjes in gesloten folie met marinade. Bak 2 uur.","Haal ribbetjes uit de folie. Laat de sappen inkoken tot glaze.","Verhoog oven naar 200 graden. Bestrijk met glaze.","Bak 20-25 min extra, regelmatig bestrijken, tot mooi glanzend.","Garneer met sesamzaadjes, groene ui en rode chili."]},
  {id:"a11",title:"BBQ spareribs met rub",category:"Diner",description:"Low and slow is de enige manier. Vallend van het bot, karameliserende rub.",prepTime:"20 min",cookTime:"3,5 uur",servings:"4",difficulty:"Gemiddeld",ingredients:["2 kg spareribs (baby back)","3 el bruine suiker","2 el paprikapoeder","1 el knoflookpoeder","1 el uienpoeder","1 tl cayennepeper","1 el zout","2 tl zwarte peper","1 tl komijn","150ml BBQ-saus","2 el honing","1 el appelciderazijn"],steps:["Verwijder het vlies van de onderkant van de ribs.","Wrijf de rub royaal in. Een nacht marineren in plasticfolie.","Oven op 140 graden. Bak ribs in gesloten folie 2,5 uur.","Verhoog oven naar 200 graden. Smeer glaze en bak 20-30 min extra.","Elke 10 min opnieuw glazuren. Laat 5 min rusten."]},
  {id:"a12",title:"Pulled pork van de BBQ",category:"Diner",description:"Een hele varkensschouder, langzaam gerookt. De ultieme BBQ-uitdaging.",prepTime:"30 min",cookTime:"10 uur",servings:"10",difficulty:"Moeilijk",ingredients:["2,5 kg varkensschouder met been","3 el bruine suiker","2 el gerookt paprikapoeder","1 el zout","1 el zwarte peper","1 tl knoflookpoeder","1 tl uienpoeder","100ml appelsap","50ml appelciderazijn","Brioche bolletjes","Coleslaw"],steps:["Wrijf schouder in met rub, een nacht in de koelkast.","BBQ instellen op 110-120 graden indirect. Rookhout toevoegen.","Doel: 95 graden kerntemperatuur. Sprenkel elke 2 uur de spritze.","Na 6 uur wikkel je in butcher paper.","Na 8-10 uur van de BBQ. Laat 1 uur rusten.","Pull het vlees met twee vorken. Serveer op brioche met coleslaw."]},
  {id:"a13",title:"Japanse Tonkotsu Ramen",category:"Diner",description:"De heilige graal van ramen. Rijke, troebele varkensbottensoep.",prepTime:"30 min",cookTime:"8 uur",servings:"4",difficulty:"Moeilijk",ingredients:["1,5 kg varkensbotten (ruggenmerg en poten)","300g buikspek heel stuk","4 eieren","200g ramen noodles","60ml sojasaus voor tare","30ml mirin voor tare","1 el sake voor tare","1 ui gehalveerd en geroosterd","6 cm verse gember","4 teentjes knoflook","Groene ui","Bamboe scheuten","Nori","Sesamzaadjes","Chili olie"],steps:["Blancheer botten 5 min in kokend water. Giet af, spoel schoon.","Breng opnieuw aan de kook met aromaten. Laat 6-8 uur pruttelen. Troebel is goed!","Zeef de bouillon.","Buikspek: bind op, bak aan en laat 2 uur sudderen in sojasaus, mirin en sake. Snij in schijfjes.","Ramen-eieren: kook 6,5 min, marineer 4 uur in speksaus-kookvocht.","Assembleer: 2 el tare in kom, hete bouillon, noodles, spek, ei, toppings."]},
  {id:"a14",title:"Soja-gelakte kip (Teriyaki)",category:"Diner",description:"Die glanzende, kleverige kip. Zoet, zout, umami in balans.",prepTime:"10 min",cookTime:"20 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["8 kippendijen zonder vel","80ml sojasaus","60ml mirin","40ml sake","3 el suiker","2 teentjes knoflook geraspt","2 cm verse gember geraspt","2 el sesamolie","Sesamzaadjes","Groene ui"],steps:["Meng saus. Marineer de kip minstens 1 uur.","Bak de kip rondom goudbruin in sesamolie.","Voeg marinade toe. Laat inkoken op hoog vuur, regelmatig draaien (10-12 min).","De saus moet glanzend en kleverig zijn. Serveer op rijst met sesam en groene ui."]},
  {id:"a15",title:"Beef and Broccoli",category:"Diner",description:"Mals rundvlees en knapperige broccoli in een rijke oestersaus.",prepTime:"20 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["500g entrecote in dunne plakjes","400g broccoli in roosjes","4 teentjes knoflook","2 cm verse gember","4 el oestersaus","3 el sojasaus","1 el rijstwijnazijn","1 el suiker","1 tl sesamolie","1 el maizena","100ml runderbouillon","2 el olie","Gestoomde rijst"],steps:["Marineer het vlees 15 min in sojasaus en maizena.","Blancheer broccoli 2 min. Giet af en koel direct.","Verhit wok gloeiend heet. Bak vlees in porties snel aan. Haal eruit.","Bak knoflook en gember 30 sec. Voeg broccoli toe, bak 2 min.","Doe vlees terug. Voeg saus toe en roer tot alles glanst en indikt.","Serveer op rijst."]},
  {id:"a16",title:"Garnalen wok met citroengras",category:"Diner",description:"Pittige, aromatische garnalen met citroengras, chili en kokos.",prepTime:"15 min",cookTime:"10 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["500g rauwe garnalen gepeld","2 stengels citroengras fijngesneden","3 rode chilipepers","4 teentjes knoflook","2 cm verse gember","200ml kokosmelk","2 el vissaus","1 el bruine suiker","1 el limoensap","Verse koriander","2 el olie","Rijst of rijstnoedels"],steps:["Verhit olie in wok op hoogste stand.","Bak citroengras, chili, knoflook en gember 1 min.","Voeg garnalen toe en bak 2-3 min tot roze en gaar.","Voeg kokosmelk, vissaus en suiker toe. Laat 2 min inkoken.","Voeg limoensap toe. Serveer met rijst en koriander."]},
  {id:"a17",title:"Thai basil scampi",category:"Diner",description:"Pittige scampi's met Thaise basilicum, knoflook en vissaus.",prepTime:"10 min",cookTime:"10 min",servings:"2",difficulty:"Gemakkelijk",ingredients:["300g rauwe scampi's gepeld","4 teentjes knoflook","3 sjalotten in plakjes","2 rode chilipepers","Grote bos Thaise basilicum","2 el oestersaus","1 el vissaus","1 el sojasaus","1 tl suiker","2 el olie","Gestoomde rijst"],steps:["Meng de saus ingredienten.","Verhit olie in wok op hoogste stand. Bak knoflook en chili 30 sec.","Voeg sjalotten toe en bak nog 1 min.","Voeg scampi's toe en bak 2-3 min tot roze.","Voeg de saus toe en roer goed.","Haal van het vuur. Roer basilicum erdoor. Serveer direct op rijst."]},
  {id:"a18",title:"Koreaanse bibimbap",category:"Diner",description:"Rijstkom met gekleurde groenten, rundergehakt, zacht ei en gochujang saus.",prepTime:"30 min",cookTime:"20 min",servings:"2",difficulty:"Gemiddeld",ingredients:["300g kortkorrelige rijst","200g rundergehakt","200g verse spinazie","2 wortelen geraspt","200g tauge","4 champignons in plakjes","2 eieren","2 el gochujang","1 el sesamolie","1 el rijstazijn","1 tl suiker","1 tl sojasaus"],steps:["Kook de rijst.","Bak gehakt met sojasaus en sesamolie rul.","Bak elke groente apart kort in sesamolie met sojasaus.","Bak de eieren spiegelei met vloeibare dooier.","Verdeel rijst in kommen. Schik groenten en vlees in vakken.","Leg het spiegelei bovenop. Voeg gochujang saus toe en meng voor het eten."]},
  {id:"a19",title:"Vis in zoetzure saus",category:"Diner",description:"Knapperig gefrituurde vis in een levendige zoetzure saus.",prepTime:"20 min",cookTime:"20 min",servings:"4",difficulty:"Gemiddeld",ingredients:["600g stevige witvis in stukken","100g maizena","1 ei","Zout","1 rode paprika","1 gele paprika","1 ui in kwarten","1 wortel in schijfjes","4 el tomatenketchup","3 el rijstazijn","3 el suiker","2 el sojasaus","100ml ananassap","1 el maizena voor de saus","Olie om te frituren"],steps:["Meng maizena, ei en zout tot beslag. Haal de vis erdoor.","Frituur in olie van 180 graden goudbruin en knapperig (3-4 min). Houd warm.","Meng alle saus-ingredienten.","Bak ui, wortel en paprika 3 min in een wok.","Voeg de saus toe en laat indikken al roerend.","Leg de vis op een schotel. Giet de saus eroverheen. Direct serveren."]},
  {id:"a20",title:"Japanse karaage kip",category:"Snack",description:"Knapperige gefrituurde kip Japanse stijl. Ongelofelijk verslavend.",prepTime:"20 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["700g kippendijfilet in hapklare stukken","4 el sojasaus","2 el sake","2 el mirin","3 teentjes knoflook geraspt","2 cm verse gember geraspt","100g maizena","50g bloem","Olie om te frituren","Mayonaise","Citroen","Gesneden kool"],steps:["Marineer kip minstens 30 min (liefst 2 uur).","Meng maizena en bloem.","Haal de kip door het bloemmengsel.","Frituur in olie van 170 graden in porties: 5-6 min tot goudbruin.","Frituur nog 1 min op 190 graden voor extra knapperigheid.","Serveer met mayonaise, citroen en gesneden kool."]},
  {id:"a21",title:"Kippenrisotto (een pan)",category:"Diner",description:"Alles in een pan. Smeuig, snel en nauwelijks afwas.",prepTime:"15 min",cookTime:"35 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["600g kippendijfilet in stukken","300g arborio rijst","1 ui fijngesnipperd","3 teentjes knoflook","150ml droge witte wijn","1 L warme kippenbouillon","200ml room","100g Parmezaan geraspt","200g verse spinazie","Olijfolie","Rasp van 1 citroen","Zout en peper"],steps:["Bak kip goudbruin in olie. Haal eruit.","Fruit ui en knoflook zacht in dezelfde pan.","Voeg rijst toe en roer 2 min. Blus met wijn.","Voeg bouillon lepel voor lepel toe al roerend gedurende 18-20 min.","Doe kip terug. Voeg room en Parmezaan toe.","Voeg spinazie toe en laat slinken. Breng op smaak met citroenrasp."]},
  {id:"a22",title:"Spaanse chorizo stoofschotel",category:"Diner",description:"Pittige chorizo, kikkererwten en tomaten. Vol van smaak, in 30 min klaar.",prepTime:"10 min",cookTime:"25 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["300g chorizo in plakjes","2 blikken kikkererwten (800g)","1 blik gepelde tomaten (400g)","1 ui","4 teentjes knoflook","1 rode paprika","1 tl gerookt paprikapoeder","1 tl komijn","200ml kippenbouillon","Handvol spinazie","Olijfolie","Verse peterselie"],steps:["Bak chorizo krokant. Haal eruit en laat het vet in de pan.","Fruit ui en paprika zacht. Voeg knoflook en specerijen toe.","Voeg tomaten en bouillon toe. Laat 10 min sudderen.","Voeg kikkererwten en chorizo toe. Verwarm nog 10 min.","Voeg spinazie toe de laatste 2 min. Serveer met krokant brood."]},
  {id:"a23",title:"Lemon chicken orzo (een pan)",category:"Diner",description:"Kip, orzo pasta en spinazie in een citroenige bouillon.",prepTime:"10 min",cookTime:"25 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["600g kippendijfilet","300g orzo pasta","1 ui","3 teentjes knoflook","Rasp van 1 citroen","Sap van 1 citroen","1 L kippenbouillon","200g verse spinazie","100g cherrytomaatjes gehalveerd","50g Parmezaan geraspt","1 tl tijm","Olijfolie","Zout en peper"],steps:["Kruid kip. Bak goudbruin in olie. Haal eruit en snij in stukjes.","Fruit ui en knoflook in dezelfde pan.","Voeg orzo, bouillon, citroenrasp en tijm toe. Breng aan de kook.","Laat 8-10 min koken al roerend.","Voeg kip, spinazie en tomaten toe tot spinazie slinkt.","Voeg citroensap en Parmezaan toe. Breng op smaak."]},
  {id:"a24",title:"Shakshuka",category:"Ontbijt",description:"Eieren gepocheerd in pittige tomatensaus. Een pan, indrukwekkend resultaat.",prepTime:"10 min",cookTime:"20 min",servings:"2",difficulty:"Gemakkelijk",ingredients:["4 tot 6 eieren","1 ui","3 teentjes knoflook","2 rode paprika's","1 blik gepelde tomaten (400g)","1 tl komijn","1 tl paprikapoeder","0,5 tl cayennepeper","2 el olijfolie","Verse peterselie","Stokbrood"],steps:["Fruit ui zacht in olie. Voeg paprika toe, bak 5 min.","Voeg knoflook en specerijen toe, bak 1 min.","Voeg tomaten toe, plet ze en laat 10 min sudderen.","Maak kuiltjes. Breek een ei in elk kuiltje.","Dek af: 5 min voor zachte dooier, 8 min voor steviger.","Bestrooi met peterselie. Serveer direct uit de pan."]},
  {id:"a25",title:"Escalivada - geroosterde groentensaus",category:"Diner",description:"Catalaans gerecht: groenten volledig roosteren en dan pureen tot rokerige saus.",prepTime:"10 min",cookTime:"1 uur",servings:"4",difficulty:"Gemakkelijk",ingredients:["3 rode paprika's","2 aubergines","2 grote uien ongepeld","1 bol knoflook ongepeld","2 courgettes optioneel","4 el extra vierge olijfolie","1 el rode wijnazijn","Zout en peper","Verse peterselie of basilicum"],steps:["Verwarm de oven op 220 graden. Leg alle groenten HEEL en ONGEPELD op een bakplaat.","Besprenkel met olijfolie. Zet in de hete oven.","Laat 45-60 min roosteren. De paprika's mogen zwart worden van buiten, dat is goed!","Doe de paprika's in een kom met deksel. Laat 15 min staan zodat de schil los komt.","Pel de paprika's. Pers de knoflook uit de schil. Schep vruchtvlees van aubergine en courgette.","Blend alles met olijfolie, azijn, zout en peper. Mix tot gewenste textuur.","Heerlijk als dip, saus bij vlees, op brood of door pasta."]},
  {id:"a26",title:"Ossobuco alla Milanese",category:"Diner",description:"Langzaam gestoofde kalfschenkel met gremolata. Italiaans op zijn best.",prepTime:"20 min",cookTime:"2 uur",servings:"4",difficulty:"Gemiddeld",ingredients:["4 kalfsschenkels van 4cm dik","1 ui","2 wortelen","3 stengels selderij","3 teentjes knoflook","200ml droge witte wijn","400ml kalfsbouillon","1 blik gepelde tomaten (400g)","Bloem om te bestuiven","Boter","Olie","Zout en peper","Rasp van 1 citroen voor gremolata","2 teentjes knoflook fijngehakt voor gremolata","Bos verse peterselie fijngehakt voor gremolata"],steps:["Kruid schenkels, bestuif met bloem. Braad rondom goudbruin. Haal eruit.","Fruit groenten zacht. Blus met witte wijn.","Voeg bouillon en tomaten toe. Leg schenkels terug.","Dek af en stoof 1,5 tot 2 uur op laag vuur. Vlees moet van het bot vallen.","Meng gremolata en strooi erover bij het serveren."]},
  {id:"a27",title:"Penne all'arrabbiata",category:"Diner",description:"Pittige tomatensaus met knoflook en chili. Simpel, eerlijk en perfect.",prepTime:"5 min",cookTime:"20 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400g penne","4 teentjes knoflook fijngesneden","1 a 2 tl gedroogde chili naar smaak","1 blik San Marzano tomaten (400g)","4 el olijfolie","Verse peterselie","Parmezaan om te raspen","Zout"],steps:["Verhit olijfolie. Bak knoflook zacht. Voeg chili toe, bak 30 sec.","Voeg tomaten toe, plet ze grof. Breng op smaak. Laat 15 min sudderen.","Kook penne al dente. Bewaar 100ml kookwater.","Meng pasta met de saus. Voeg kookwater toe indien nodig.","Serveer direct met peterselie en Parmezaan."]},
  {id:"a28",title:"Pizza Margherita",category:"Diner",description:"Dun deeg, San Marzano tomaten en buffelburrata. Niets meer nodig.",prepTime:"30 min",cookTime:"12 min",servings:"4",difficulty:"Gemiddeld",ingredients:["500g tipo 00 bloem","7g droge gist","325ml lauw water","1 tl zout","1 tl suiker","1 blik San Marzano tomaten (400g)","2 teentjes knoflook","2 el olijfolie","Zout en basilicum voor de saus","300g buffelburrata of mozzarella","Verse basilicum","Olijfolie"],steps:["Los gist op in lauw water met suiker. Laat 10 min staan.","Meng bloem en zout. Voeg gistwater toe en kneed 10 min.","Verdeel in 4 bolletjes. Laat 1-2 uur rijzen.","Maak de saus: mix tomaten grof met knoflook en olijfolie.","Oven zo heet mogelijk (250 graden). Gebruik een pizzasteen indien mogelijk.","Rol deeg dun uit. Smeer saus erop. Voeg kaas toe. Bak 8-12 min."]},
  {id:"a29",title:"Saltimbocca alla Romana",category:"Diner",description:"Kalfsvlees met Parmaham en salie in witte wijn. Klaar in 15 minuten.",prepTime:"15 min",cookTime:"12 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["8 dunne kalfscallopines","8 plakken Parmaham","8 verse salieblaadjes","50g boter","100ml droge witte wijn","Zout en peper","Tandenstokers"],steps:["Leg op elke callopine een saliebladje en een plak Parmaham. Zet vast met tandenstoker.","Kruid de vleeskant licht met zout en peper.","Bak op de hamkant goudbruin in boter (2-3 min). Draai om, bak nog 1-2 min. Haal eruit.","Blus met witte wijn. Schraap de aanbaksels los. Reduceer licht.","Serveer met de saus en geroosterde polenta of tagliatelle."]},
  {id:"a30",title:"Burrata met geroosterde tomaten",category:"Hapjes",description:"Romige burrata op een bedje van geroosterde kerstomaatjes.",prepTime:"5 min",cookTime:"25 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["2 bollen burrata","400g cherrytomaatjes","4 teentjes knoflook","3 el olijfolie","1 tl honing","Verse basilicum","Verse tijm","Zout en peper","Krokant brood of ciabatta"],steps:["Verwarm de oven op 200 graden.","Leg tomaten op een bakplaat met knoflook, tijm en olijfolie. Kruid.","Druppel de honing erover. Rooster 20-25 min tot de tomaten barsten.","Verdeel de warme tomaten over een schaal.","Leg de burrata in het midden en scheur hem open.","Bestrooi met basilicum, besprenkel met olijfolie. Serveer met brood."]},
  {id:"a31",title:"Scampi's in knoflook-roomsaus",category:"Hapjes",description:"Sappige scampi's in een rijke roomsaus met knoflook en witte wijn.",prepTime:"10 min",cookTime:"12 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400g rauwe scampi's gepeld met staart","5 teentjes knoflook fijngesneden","150ml droge witte wijn","150ml room","2 el boter","Verse peterselie","Chilivlokken optioneel","Stokbrood om te dippen"],steps:["Smelt boter. Bak knoflook zacht, niet bruin.","Voeg chilivlokken toe indien gewenst.","Voeg scampi's toe en bak 1-2 min per kant tot roze.","Blus met witte wijn. Laat 2 min verdampen.","Voeg room toe en laat 3-4 min inkoken.","Bestrooi met peterselie. Serveer direct met stokbrood."]},
  {id:"a32",title:"Gegrilde halloumi met honing en chili",category:"Hapjes",description:"Knapperig gegrilde halloumi met een zoet-pittig glazuur.",prepTime:"5 min",cookTime:"6 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400g halloumi in plakjes van 1 cm","2 el honing","1 rode chilipeper fijngesneden","Sap van een halve citroen","Verse munt","Olijfolie"],steps:["Verhit een grillpan op hoog vuur. Bestrijk halloumi licht met olijfolie.","Gril 2-3 min per kant tot mooie grillstrepen.","Meng honing, chili en citroensap.","Leg de warme halloumi op een bord. Druppel het honingmengsel erover.","Bestrooi met verse munt. Direct serveren."]},
  {id:"a33",title:"Garnaalkroketten",category:"Hapjes",description:"De absolute Belgische klassieker. Romige garnaalragout in een krokant jasje.",prepTime:"45 min",cookTime:"5 min",servings:"4",difficulty:"Moeilijk",ingredients:["300g Noordzeegarnalen","60g boter","80g bloem","500ml volle melk warm","2 eierdooiers","Sap van een halve citroen","Nootmuskaat","Zout en peper","Bloem voor paneren","2 eieren losgeklopt","Paneermeel","Olie om te frituren","Peterselie","Citroen"],steps:["Maak een dikke bechamel: smelt boter, voeg bloem toe, voeg melk toe al roerend. Kook 10 min.","Roer eierdooiers en citroensap erdoor. Breng op smaak.","Roer de garnalen door de saus. Giet in platte schaal, dek af. Laat minstens 2 uur koelen.","Vorm kroketten. Paneer: bloem, ei, paneermeel, ei, paneermeel.","Frituur in olie van 180 graden goudbruin (3-4 min).","Serveer met gefrituurde peterselie en citroen."]},
  {id:"a34",title:"Spaghetti met gehaktsaus voor kinderen",category:"Diner",description:"De klassieker die geen enkel kind weigert. Met verborgen groenten in de saus.",prepTime:"15 min",cookTime:"40 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400g spaghetti","500g rundergehakt","1 ui","3 teentjes knoflook","2 wortelen geraspt","1 courgette geraspt","1 blik gepelde tomaten (400g)","2 el tomatenpuree","1 tl oregano","Zout en peper","Geraspte kaas"],steps:["Fruit ui en knoflook zacht. Voeg gehakt toe en bak rul.","Voeg geraspte wortel en courgette toe. Bak 3 min.","Voeg tomatenpuree, tomaten en oregano toe. Breng op smaak.","Laat 25-30 min sudderen op laag vuur.","Kook de spaghetti. Serveer met de saus en kaas."]},
  {id:"a35",title:"Kipnuggets uit de oven",category:"Snack",description:"Knapperige kipnuggets zonder frituren. Kinderen zijn er gek op.",prepTime:"20 min",cookTime:"20 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["600g kipfilet in hapklare stukken","100g paneermeel","50g Parmezaan geraspt","1 tl knoflookpoeder","1 tl paprikapoeder","Zout en peper","2 eieren losgeklopt","Bloem om te bestuiven","Olie spray"],steps:["Verwarm oven op 220 graden. Bekleed bakplaat met bakpapier.","Meng paneermeel, Parmezaan, knoflookpoeder, paprikapoeder en zout.","Bestuif de kip met bloem, dan door het ei, dan door het paneermengsel.","Leg op de bakplaat en spray in met olie.","Bak 18-20 min tot goudbruin en gaar. Halverwege omdraaien.","Serveer met ketchup of honing-mosterdsaus."]},
  {id:"a36",title:"Loempia's in de air fryer",category:"Snack",description:"Knapperig goudbruin zonder frituren. Snel en ongezond genoeg om lekker te zijn.",prepTime:"30 min",cookTime:"12 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["12 loempiavellen","300g varken- of kipgehakt","200g tauge","100g wortel geraspt","50g glasnoedels geweekt","3 teentjes knoflook","3 cm verse gember","3 el sojasaus","1 el sesamolie","1 el oestersaus","2 eieren","Olie spray","Zoetzure saus"],steps:["Week glasnoedels 5 min in kokend water. Giet af en snij kleiner.","Bak gehakt met knoflook en gember. Voeg wortel toe, bak 2 min.","Voeg tauge, glasnoedels en sauzen toe. Bak 2 min. Laat afkoelen. Meng 1 ei erdoor.","Leg loempiavel in een ruit. Leg 2 el vulling in het midden.","Vouw onderkant op, zijkanten naar binnen, rol op. Bestrijk rand met ei.","Spray in met olie. Bak in air fryer op 200 graden, 10-12 min, halverwege omdraaien."]},
  {id:"a37",title:"Macaroni met ham en kaas",category:"Diner",description:"Kindermacaroni maar dan goed gemaakt. Romige kaassaus en een krokante korst.",prepTime:"20 min",cookTime:"25 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400g macaroni","200g gekookte ham in blokjes","60g boter","60g bloem","700ml melk","200g Gouda geraspt","50g Parmezaan geraspt","1 tl mosterd","Nootmuskaat","Zout en peper","Paneermeel voor de korst"],steps:["Kook macaroni al dente. Giet af.","Maak kaassaus: roux met boter en bloem, warme melk toevoegen al roerend.","Roer kaas erdoor. Kruid met mosterd, nootmuskaat en zout.","Meng macaroni, ham en kaassaus. Giet in een ovenschaal.","Bestrooi met paneermeel en beetje Parmezaan.","Bak 20-25 min op 200 graden tot goudbruin."]},
  {id:"a38",title:"Pannenkoeken met appel en kaneel",category:"Ontbijt",description:"Dikke, luchtige pannenkoeken. Het perfecte weekend-ontbijt.",prepTime:"10 min",cookTime:"20 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["300g bloem","2 tl bakpoeder","1 el suiker","0,5 tl zout","0,5 tl kaneel","2 eieren","300ml melk","2 el gesmolten boter","2 appels fijn gesneden","Boter om te bakken","Ahornsiroop of honing"],steps:["Meng bloem, bakpoeder, suiker, zout en kaneel.","Klop eieren, melk en gesmolten boter samen.","Meng nat en droog door elkaar. Niet te veel roeren, klonterjes zijn OK.","Roer appelstukkjes erdoor.","Bak op middelhoog vuur in boter. Draai als er bubbeltjes verschijnen.","Serveer met ahornsiroop of honing."]},
  {id:"a39",title:"Chocolade lava cake",category:"Dessert",description:"Warme chocoladecake met vloeiend hart. Spectaculair simpel.",prepTime:"15 min",cookTime:"12 min",servings:"4",difficulty:"Gemiddeld",ingredients:["150g pure chocolade (70 procent)","100g boter","3 eieren","3 extra eierdooiers","80g suiker","50g bloem","Snufje zout","Boter voor de vormpjes","Cacaopoeder voor de vormpjes","Vanille-ijs"],steps:["Verwarm oven op 200 graden. Beboter 4 ramequins en bestuif met cacao.","Smelt chocolade en boter. Laat iets afkoelen.","Klop eieren, dooiers en suiker luchtig.","Vouw chocolademengsel erdoor. Voeg bloem en zout toe.","Giet in de vormpjes. Kan 24 uur vooraf worden gemaakt!","Bak 10-12 min. Rand gestold, midden zacht.","Keer direct om op een bord. Serveer met ijs."]},
  {id:"a40",title:"Tiramisu",category:"Dessert",description:"De Italiaanse klassieker. Espresso, mascarpone en amaretto.",prepTime:"30 min",cookTime:"0 min",servings:"8",difficulty:"Gemiddeld",ingredients:["500g mascarpone","4 eieren gescheiden","100g suiker","200ml sterke espresso afgekoeld","3 el amaretto of marsala","200g lange vingers (savoiardi)","Cacaopoeder om te bestuiven"],steps:["Klop eierdooiers met suiker tot dikke bleke massa.","Roer mascarpone erdoor tot glad en romig.","Klop eiwitten stijf. Spatel door het mascarponemengsel.","Meng espresso met amaretto.","Doop lange vingers kort in de espresso.","Laag vingers, laag creme, herhaal. Dek af en laat 6 uur of langer koelen.","Bestrooi voor serveren met cacaopoeder."]},
  {id:"a41",title:"Creme brulee",category:"Dessert",description:"Het klassieke Franse dessert. Dat moment van het kraken van de karamelkorst.",prepTime:"20 min",cookTime:"40 min",servings:"6",difficulty:"Gemiddeld",ingredients:["500ml slagroom","6 eierdooiers","80g suiker","Extra suiker voor de karamelkorst","1 vanillestokje"],steps:["Verwarm oven op 150 graden. Verwarm room met vanille tot net onder het kookpunt.","Klop dooiers met suiker. Giet warme room langzaam al roerend erbij.","Giet door zeef in ramequins. Bak in bain-marie 35-40 min.","Laat afkoelen. Minstens 4 uur koelen in de koelkast.","Bestrooi met suiker. Karameliseer met brandertje. Direct serveren."]},
  {id:"a42",title:"Tarte Tatin",category:"Dessert",description:"Omgekeerde appeltaart met karamel. Simpeler dan je denkt.",prepTime:"20 min",cookTime:"35 min",servings:"6",difficulty:"Gemiddeld",ingredients:["6 a 7 appels (Golden of Cox) in kwarten","150g suiker","80g boter","1 tl kaneel","1 rol bladerdeeg","Vanille-ijs"],steps:["Verwarm oven op 200 graden.","Smelt suiker in ovenbestendige pan tot goudbruine karamel. Voeg boter toe.","Leg appelpartjes dicht naast elkaar. Bestrooi met kaneel. Laat 5 min koken.","Bedek met het deeg. Druk de randen goed aan.","Bak 25-30 min goudbruin.","Laat 5 min rusten. Keer voorzichtig om op een bord. Serveer warm met ijs."]},
  {id:"a43",title:"Romesco saus",category:"Hapjes",description:"Catalaanse noten-paprikasaus. Geroosterde paprika's, amandelen en hazelnoten.",prepTime:"15 min",cookTime:"30 min",servings:"6",difficulty:"Gemakkelijk",ingredients:["4 rode paprika's geroosterd en gepeld","3 rijpe tomaten geroosterd","50g amandelen geroosterd","30g hazelnoten geroosterd","4 teentjes knoflook geroosterd","2 el rode wijnazijn","0,5 tl gerookt paprikapoeder","0,5 tl cayennepeper","100ml olijfolie","Zout"],steps:["Rooster paprika's en tomaten in de oven op 220 graden tot de schil zwart is (30 min).","Pel de paprika's na het stomen. Verwijder zaadjes.","Blend alles: paprika, tomaten, knoflook, noten, azijn en specerijen.","Voeg olijfolie er langzaam bij. Mix tot dikke, rustieke saus.","Breng op smaak. Serveer als dipsaus, bij gegrild vlees of als broodbeleg."]},
  {id:"a44",title:"Vitello tonnato",category:"Hapjes",description:"Italiaans zomers voorgerecht. Dun gesneden kalfsvlees met tonijn-kappertjessaus.",prepTime:"20 min",cookTime:"1 uur",servings:"6",difficulty:"Gemiddeld",ingredients:["600g kalfsfricandeau","1 blik tonijn op water","4 el mayonaise","2 el kappertjes","2 ansjovisfilets","Sap van 1 citroen","2 el olijfolie","Laurier en tijm","Zwarte peper","Extra kappertjes voor garnering","Citroen en peterselie voor garnering"],steps:["Pocheer kalfsvlees zacht in water met laurier, tijm en peper (45-60 min, nooit koken).","Laat afkoelen in het kookvocht. Snij in flinterdunne plakjes.","Blend alle tonijnsaus-ingredienten glad. Breng op smaak.","Leg de kalfsvleesplakjes dakpansgewijs op een schaal.","Smeer de tonijnsaus royaal erover.","Garneer met kappertjes, citroen en peterselie. Laat 1 uur rusten voor serveren."]},
  {id:"a45",title:"Nasi goreng",category:"Diner",description:"Indonesisch gebakken rijst. Kleurrijk, smakelijk en bijna elk kind is er dol op.",prepTime:"15 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400g gekookte rijst liefst van de dag voordien","200g kipfilet in kleine blokjes","100g gekookte ham","2 eieren","1 ui fijngesnipperd","3 teentjes knoflook","2 el ketjap manis","1 el sojasaus","Olie","Komkommer","Lente-ui","Kroepoek"],steps:["Bak de kip gaar in olie. Haal eruit.","Bak ui en knoflook zacht in de pan.","Voeg de rijst toe en bak op hoog vuur, goed roerend.","Maak ruimte in de pan. Kluts eieren en roer rul.","Voeg kip en ham toe. Meng alles door elkaar.","Kruid met ketjap manis en sojasaus. Serveer met komkommer, lente-ui en kroepoek."]},
  {id:"a46",title:"Zelfgemaakte pizza voor kinderen",category:"Diner",description:"Kinderen kneden zelf het deeg en kiezen hun toppings.",prepTime:"30 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["500g bloem","7g droge gist","300ml lauw water","2 el olijfolie","1 tl zout","1 tl suiker","1 blik gepelde tomaten (400g)","1 tl oregano","Knoflookpoeder","Geraspte kaas","Gekookte ham","Paprika","Olijven","Champignons","Mais"],steps:["Los gist op in lauw water met suiker. 10 min laten staan.","Meng bloem en zout. Voeg gistwater en olijfolie toe. Kneed 8 min.","Laat 1 uur rijzen op een warme plek.","Maak de snelle saus: mix tomaten met oregano, knoflookpoeder en zout.","Laat kinderen zelf hun deeg uitrollen en beleggen.","Oven op 230 graden. Bak 12-15 min tot goudbruin."]},
  {id:"a47",title:"Zelfgemaakte meringue",category:"Dessert",description:"Luchtig, knapperig van buiten en zacht van binnen. De basis voor Eton Mess, pavlova en veel meer. Eens je de techniek kent, lukt het altijd.",prepTime:"20 min",cookTime:"1,5 uur",servings:"8",difficulty:"Gemiddeld",ingredients:["3 eiwitten op kamertemperatuur","150g fijne kristalsuiker of basterdsuiker","1 tl witte wijnazijn of citroensap","1 tl maizena optioneel voor een zachtere binnenkant","Snufje zout"],steps:["Verwarm de oven voor op 100 graden. Bekleed een bakplaat met bakpapier.","Zorg dat de kom en garde VETVRIJ zijn. Veeg eventueel af met citroensap. Zelfs een druppel vet maakt de eiwitten kapot.","Klop de eiwitten met het snufje zout op middelhoge snelheid tot zachte pieken.","Voeg de suiker toe, 1 eetlepel per keer, terwijl je blijft kloppen op hoge snelheid. Wacht telkens tot de suiker volledig opgenomen is. Dit duurt 8-10 minuten.","Het mengsel is klaar als het glanzend en stijf is, en je er geen suikerkorrels meer tussen voelt wanneer je wat tussen je vingers wrijft.","Vouw de azijn en maizena er voorzichtig door met een spatel.","Schep of spuit hoopjes op het bakpapier voor meringue-nestjes, of smeer uit tot een grote cirkel voor pavlova.","Bak 1 uur 15 min op 100 graden. Zet de oven UIT en laat de meringues volledig afkoelen in de oven met de deur dicht, minstens 1 uur liefst een nacht. Nooit de oven openen tijdens het bakken!","Bewaar in een luchtdichte doos, niet in de koelkast. Tot 1 week houdbaar."]},
  {id:"a48",title:"Eton Mess",category:"Dessert",description:"Een klassiek Engels dessert van knapperige meringue, vers geslagen room en rijpe aardbeien. Snel gemaakt, altijd indrukwekkend.",prepTime:"15 min",cookTime:"0 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["500g verse aardbeien","400ml slagroom (minstens 35% vet)","2 el poedersuiker","1 tl vanille-extract","6 meringue-nestjes (zelfgemaakt of kant-en-klaar)","1 el suiker voor de aardbeien","Verse munt optioneel"],steps:["Snij de aardbeien in kwarten. Doe de helft in een kom, voeg 1 el suiker toe en plet licht met een vork zodat er sap vrijkomt. Laat 10 minuten trekken. De andere helft bewaar je als garnering.","Klop de slagroom op met de poedersuiker en het vanille-extract tot zachte pieken. Niet te stijf: je wil een luchtige, romige textuur die nog net van de lepel glijdt.","Breek de meringue-nestjes in grove stukken. Bewaar een paar mooie grote stukken apart voor de garnering bovenop.","Schep de geplete aardbeien met hun sap door de slagroom. Vouw daarna de gebroken meringue er voorzichtig door. Niet te veel mengen: een marmeren effect van wit, rood en creme is precies wat je wil.","Schep in hoge glazen of op een mooie schaal. Garneer met de bewaarde aardbeienpartjes, de grote meringuestukken en eventueel verse munt.","Direct serveren voor de knapperigste meringue. Als je hem vooraf maakt, bewaar dan de slagroom, aardbeien en meringue apart en meng op het laatste moment."]},
  {id:"b01",title:"Gyoza (Japanse dumplings)",category:"Hapjes",description:"Knapperig van buiten, sappig van binnen. Met een pittige dipsaus.",prepTime:"40 min",cookTime:"10 min",servings:"4",difficulty:"Gemiddeld",ingredients:["300g varkensgehakt","200g Chinese kool fijngehakt","3 teentjes knoflook geraspt","2 cm verse gember geraspt","2 el sojasaus","1 el sesamolie","1 tl suiker","30 gyoza-vellen","2 el olie","100ml water","Sojasaus voor dipsaus","Rijstazijn voor dipsaus","Chili-olie voor dipsaus"],steps:["Bestrooi kool met zout, laat 10 min staan en knijp het vocht eruit.","Meng gehakt, kool, knoflook, gember, sojasaus, sesamolie en suiker.","Leg 1 tl vulling op elk velletje. Bevochtig de rand en vouw dicht met kleine plooitjes.","Verhit olie in een pan. Bak dumplings op de platte kant 2-3 min tot goudbruin.","Voeg water toe en dek af. Stoom 5 min tot het water verdampt is.","Serveer met dipsaus van sojasaus, azijn en chili-olie."]},
  {id:"b02",title:"Edamame met zeezout en chili",category:"Hapjes",description:"Simpelste Japanse snack. Vijf minuten werk, altijd een hit.",prepTime:"2 min",cookTime:"5 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["500g diepgevroren edamame in de schil","1 el grof zeezout","1 tl chilivlokken","1 tl sesamolie","Sap van een halve limoen"],steps:["Kook edamame 4-5 min in gezouten water.","Giet af en schud droog.","Meng sesamolie, chilivlokken en limoensap.","Giet over de edamame en gooi goed door.","Bestrooi met grof zeezout. Serveer warm of op kamertemperatuur."]},
  {id:"b03",title:"Bao buns met pulled pork",category:"Hapjes",description:"Zachte gestoomde broodjes gevuld met sappig gestoofde buikspek.",prepTime:"30 min",cookTime:"2 uur",servings:"6",difficulty:"Gemiddeld",ingredients:["500g varkensbuikspek","12 kant-en-klare bao buns","4 el hoisinsaus","2 el sojasaus","2 el rijstwijnazijn","2 el bruine suiker","3 teentjes knoflook","2 cm gember","Komkommer in dunne plakjes","Gesneden lente-ui","Koriander","Geroosterde sesamzaadjes"],steps:["Meng hoisin, soja, azijn, suiker, knoflook en gember. Marineer het spek minstens 1 uur.","Bak spek aan in een pan. Voeg marinade toe met 100ml water.","Sudder 1,5-2 uur op laag vuur tot het vlees uit elkaar valt.","Trek het vlees in stukken met twee vorken. Laat de saus inkoken tot glaze.","Stoom de bao buns 8-10 min.","Vul elk broodje met pulled pork, komkommer, lente-ui en koriander."]},
  {id:"b04",title:"Tempura groenten en garnalen",category:"Hapjes",description:"Luchtig Japans beslag. Knapperiger dan krokant.",prepTime:"20 min",cookTime:"15 min",servings:"4",difficulty:"Gemiddeld",ingredients:["300g rauwe garnalen gepeld","1 courgette in plakjes","1 rode paprika in reepjes","200g broccoli in kleine roosjes","150g ijskoude bloem","200ml ijskoud bruiswater","1 ei","Zout","Olie om te frituren","Sojasaus","Dashi of bouillon voor dipsaus","Mirin voor dipsaus","Geraspte daikon optioneel"],steps:["Meng bloem, ei en ijskoud bruiswater. Niet te veel roeren — klonters zijn OK en gewenst!","Verhit olie op 180 graden.","Dep groenten en garnalen droog. Haal door het beslag.","Frituur in porties 2-3 min tot net goudbruin.","Haal eruit op keukenpapier.","Maak dipsaus: verwarm soja, dashi en mirin. Serveer tempura direct — anders wordt het slap."]},
  {id:"b05",title:"Korean fried chicken wings",category:"Hapjes",description:"Dubbel gefrituurd voor extra knapperigheid. Met gochujang glazuur.",prepTime:"20 min",cookTime:"20 min",servings:"4",difficulty:"Gemiddeld",ingredients:["1 kg kippenvleugels","100g maizena","50g bloem","1 tl zout","1 tl knoflookpoeder","Olie om te frituren","3 el gochujang","2 el honing","2 el sojasaus","1 el rijstwijnazijn","2 teentjes knoflook geraspt","1 el sesamolie","Sesamzaadjes","Lente-ui"],steps:["Dep de vleugels goed droog.","Meng maizena, bloem, zout en knoflookpoeder. Haal de vleugels erdoor.","Frituur op 160 graden gedurende 8 min. Haal eruit en laat 5 min rusten.","Frituur opnieuw op 190 graden gedurende 4-5 min. Nu zijn ze extra knapperig!","Maak de saus: meng gochujang, honing, soja, azijn, knoflook en sesamolie.","Gooi de warme vleugels door de saus. Garneer met sesam en lente-ui."]},
  {id:"b06",title:"Miso soep met tofu en wakame",category:"Hapjes",description:"De Japanse troostesoep. In 10 minuten klaar.",prepTime:"5 min",cookTime:"10 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["1 L dashi bouillon of groentebouillon","4 el witte misopasta","200g zachte tofu in blokjes","2 el gedroogde wakame zeewier","3 lente-uitjes fijngesneden","1 el sojasaus"],steps:["Week de wakame 5 min in koud water. Giet af.","Breng de bouillon aan de kook.","Verlaag het vuur. Los de misopasta op in een beetje warme bouillon en voeg toe.","Voeg tofu en wakame toe. Niet meer laten koken.","Voeg sojasaus toe. Serveer direct in kommen met lente-ui."]},
  {id:"b07",title:"Gyudon — Japanse biefstuk rijstkom",category:"Hapjes",description:"Snelle Japanse rijstkom met dun gesneden rundvlees en gekarameliseerde ui.",prepTime:"10 min",cookTime:"15 min",servings:"2",difficulty:"Gemakkelijk",ingredients:["300g rundvlees zeer dun gesneden (rosbief of entrecote)","2 uien in halve ringen","200ml dashi of runderbouillon","4 el sojasaus","2 el mirin","1 el sake","1 el suiker","2 porties gestoomde rijst","2 eieren","Ingelegde rode gember","Lente-ui"],steps:["Fruit de ui 5 min in olie tot licht goudbruin.","Voeg dashi, sojasaus, mirin, sake en suiker toe. Breng aan de kook.","Voeg het vlees toe. Kook 3-4 min op middelhoog vuur.","Kluts de eieren en giet over het vlees. Dek af, laat 1 min opstijven.","Serveer over rijst. Garneer met gember en lente-ui."]},
  {id:"b08",title:"Agedashi tofu",category:"Hapjes",description:"Knapperig gefrituurde tofu in een warme dashi saus. Klassiek Japans bistrogerecht.",prepTime:"15 min",cookTime:"10 min",servings:"2",difficulty:"Gemiddeld",ingredients:["400g zachte tofu","Maizena om te bestuiven","Olie om te frituren","300ml dashi","3 el sojasaus","3 el mirin","Geraspte daikon","Geraspte gember","Lente-ui","Katsuobushi (bonito vlokken)"],steps:["Wikkel de tofu in keukenpapier en laat 30 min uitlekken.","Snij in blokken. Bestuif royaal met maizena.","Frituur op 180 graden goudbruin (3-4 min). Houd warm.","Maak de saus: breng dashi, sojasaus en mirin aan de kook.","Leg de tofu in een kom. Giet de hete saus eromheen.","Garneer met daikon, gember, lente-ui en katsuobushi."]},
  {id:"b09",title:"Takoyaki (octopus balletjes)",category:"Hapjes",description:"Streetfood uit Osaka. Knapperig van buiten, gesmolten van binnen.",prepTime:"20 min",cookTime:"15 min",servings:"4",difficulty:"Moeilijk",ingredients:["200g bloem","2 eieren","600ml dashi of kippenbouillon","200g gekookte octopus in kleine stukjes","Lente-ui fijngesneden","Ingelegde gember fijngesneden","Tempura restjes optioneel","Olie","Takoyaki saus of okonomiyakisaus","Japanse mayonaise","Katsuobushi (bonito vlokken)","Aonori (gedroogde zeewier)"],steps:["Meng bloem, eieren en dashi tot een vloeibaar beslag.","Verhit een takoyaki-pan goed in. Vet elk gaatje in met olie.","Giet het beslag in elk gaatje. Voeg octopus, ui en gember toe.","Draai de balletjes om met een satéprikker als de randen stollen.","Blijf draaien tot ze rondom goudbruin en knapperig zijn.","Serveer met saus, mayonaise, katsuobushi en aonori."]},
  {id:"b10",title:"Kimchi pancakes (Kimchijeon)",category:"Hapjes",description:"Pittige, knapperige Koreaanse pannenkoekjes met kimchi.",prepTime:"10 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["200g kimchi grof gesneden","150g bloem","1 ei","150ml kimchi-sap of water","3 lente-uitjes","1 tl sesamolie","Olie om in te bakken","Sojasaus voor dipsaus","Rijstazijn voor dipsaus","Sesamzaadjes voor dipsaus"],steps:["Meng bloem, ei, kimchi-sap en sesamolie tot een beslag.","Roer kimchi en lente-ui erdoor.","Verhit royaal olie in een pan. Giet beslag erin en druk plat.","Bak 3-4 min per kant op middelhoog vuur tot krokant en goudbruin.","Maak dipsaus: meng sojasaus, azijn en sesamzaadjes.","Snij in stukken en serveer direct met dipsaus."]},
  {id:"b11",title:"Pad See Ew",category:"Diner",description:"Thaise roergebakken rijstnoedels met broccoli en ei. Smoky en smakelijk.",prepTime:"15 min",cookTime:"10 min",servings:"2",difficulty:"Gemakkelijk",ingredients:["200g brede rijstnoedels vers of geweekt","200g kipfilet in reepjes","200g Chinese broccoli of gewone broccoli","2 eieren","4 el sojasaus","2 el oestersaus","1 el vissaus","1 tl suiker","3 teentjes knoflook","2 el olie"],steps:["Meng de sauzen en suiker.","Verhit wok gloeiend heet. Bak knoflook 30 sec.","Voeg kip toe en bak gaar. Voeg broccoli toe, bak 2 min.","Voeg de noedels toe. Druk ze plat tegen de hete wok voor kleur (smoky effect).","Maak ruimte. Kluts de eieren en laat half opstijven, dan mengen.","Voeg de saus toe en roer alles goed door. Serveer direct."]},
  {id:"b12",title:"Tom Kha Gai (kokossoep)",category:"Diner",description:"Thaise kokosmelksoep met citroengras en kip. Zacht, aromatisch en troostend.",prepTime:"15 min",cookTime:"20 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400ml kokosmelk","400ml kippenbouillon","300g kippendijfilet in reepjes","200g champignons in schijfjes","2 stengels citroengras gekneusd","4 blaadjes citroenblad (kaffir lime)","3 cm galanga of gember in plakjes","3 el vissaus","2 el limoensap","1 tl palmsuiker of bruine suiker","2 rode chilipepers","Verse koriander"],steps:["Breng bouillon aan de kook met citroengras, citroenblad en galanga.","Voeg kokosmelk toe. Laat 5 min sudderen.","Voeg kip toe en gaar 8 min op middelhoog vuur.","Voeg champignons toe, kook nog 3 min.","Breng op smaak met vissaus, limoensap en suiker.","Garneer met koriander en chilipepers. Verwijder de aromatische takken voor het serveren."]},
  {id:"c01",title:"Babi pangang",category:"Diner",description:"Geroosterd varkensvlees in een zoet-pikante saus. Een Chinees-Indonesisch klassiek gerecht.",prepTime:"20 min",cookTime:"1,5 uur",servings:"4",difficulty:"Gemiddeld",ingredients:["800g varkensbuik of varkensribben","Marinade: 4 el sojasaus, 2 el hoisinsaus, 2 el honing, 2 el rijstwijnazijn, 3 teentjes knoflook geraspt, 1 tl vijfkruidenpoeder, 1 tl gemberpoeder, 1 tl sesamolie, rode kleurstof optioneel","Saus: 200ml kippenbouillon, 2 el tomatenketchup, 2 el hoisinsaus, 1 el suiker, 1 tl maizena opgelost in water"],steps:["Meng alle marinade-ingredienten. Leg het varkensvlees erin en marineer minstens 4 uur, liefst een nacht.","Verwarm de oven op 180 graden. Leg het vlees op een rooster boven een bakplaat met water.","Rooster 45 min. Keer halverwege en bestrijk met extra marinade.","Verhoog de oven naar 220 graden en rooster nog 15-20 min tot de randjes licht gekarameliseerd zijn.","Maak de saus: breng bouillon aan de kook met ketchup, hoisinsaus en suiker. Bind met maizena.","Snij het vlees in plakjes en serveer met de saus en gestoomde rijst."]},
  {id:"c02",title:"Nasi goreng met kip",category:"Diner",description:"Indonesisch gebakken rijst met kip, ei en een rijke ketjap-smaak. Snel en smakelijk.",prepTime:"15 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400g gekookte rijst van de dag voordien","300g kipfilet in kleine blokjes","2 eieren","1 ui fijngesnipperd","3 teentjes knoflook geraspt","2 cm verse gember geraspt","3 el ketjap manis","1 el sojasaus","1 tl sambal oelek","1 tl trassi optioneel","2 el olie","Komkommer in plakjes","Lente-ui","Gefrituurde uitjes","Kroepoek","Atjar tjampoer optioneel"],steps:["Verhit de olie in een grote wok. Bak ui, knoflook en gember 2 min.","Voeg de kip toe en bak gaar op hoog vuur (5-6 min).","Schuif alles naar de rand. Kluts de eieren in de pan en roer rul.","Voeg de koude rijst toe. Bak op hoog vuur al roerend tot de rijst loszit.","Voeg ketjap manis, sojasaus en sambal toe. Roer goed door.","Serveer op een bord gegarneerd met komkommer, lente-ui, gefrituurde uitjes en kroepoek."]},
  {id:"c03",title:"Bami goreng met kip",category:"Diner",description:"Indonesisch gebakken mie met kip en groenten. De noedelversie van nasi goreng.",prepTime:"15 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["400g gekookte eiermie of tarwenoedels","300g kipfilet in reepjes","2 eieren","1 ui in halve ringen","3 teentjes knoflook geraspt","2 cm verse gember geraspt","100g tauge","2 wortelen in julienne","3 lente-uitjes in ringen","3 el ketjap manis","1 el sojasaus","1 tl sambal oelek","2 el olie","Gefrituurde uitjes","Kroepoek"],steps:["Kook de mie al dente als dat nog niet gedaan is. Laat afkoelen.","Verhit olie in een wok. Bak ui, knoflook en gember 2 min.","Voeg de kip toe en bak gaar op hoog vuur.","Voeg wortel toe, bak 2 min. Voeg tauge en lente-ui toe, bak 1 min.","Schuif alles naar de rand. Kluts de eieren in de pan en roer rul.","Voeg de mie toe. Voeg ketjap manis, sojasaus en sambal toe. Roer goed door op hoog vuur.","Serveer met gefrituurde uitjes en kroepoek."]},
  {id:"c04",title:"Kippenblokjes met lookboter",category:"Diner",description:"Sappige kipblokjes gebakken in een rijke knoflookboter. Simpel, lekker en snel klaar.",prepTime:"10 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["700g kipfilet in blokjes van 3 cm","6 teentjes knoflook fijngesneden","80g boter","2 el olijfolie","2 el sojasaus","1 el oestersaus","1 tl suiker","Verse peterselie of lente-ui","Zout en peper","Gestoomde rijst of gebakken aardappelen"],steps:["Kruid de kipblokjes met zout en peper.","Verhit de olie in een ruime pan op hoog vuur. Bak de kip rondom goudbruin (5-6 min). Haal eruit.","Zet het vuur lager. Smelt de boter in dezelfde pan.","Voeg de knoflook toe en bak zacht en geurig (2 min), niet laten verbranden.","Voeg sojasaus, oestersaus en suiker toe. Roer even door.","Doe de kip terug in de pan. Roer goed om zodat alles bedekt is met de lookboter.","Bestrooi met peterselie of lente-ui. Serveer direct met rijst."]},
  {id:"c05",title:"Chop-shoy met zeevruchten",category:"Diner",description:"Roergebakken zeevruchten met knapperige groenten in een lichte saus. Snel en fris.",prepTime:"20 min",cookTime:"15 min",servings:"4",difficulty:"Gemakkelijk",ingredients:["200g rauwe garnalen gepeld","200g inktvisringen","200g sint-jakobsschelpen of mosselen","200g Chinese kool of gewone kool in reepjes","2 wortelen in julienne","100g tauge","3 stengels bleekselderij in plakjes","1 paprika in reepjes","4 teentjes knoflook","2 cm verse gember","3 el oestersaus","2 el sojasaus","1 el rijstwijnazijn","1 tl sesamolie","1 el maizena opgelost in 50ml water","2 el olie","Gestoomde rijst"],steps:["Bereid alle groenten en zeevruchten voor.","Meng oestersaus, sojasaus, rijstwijnazijn en sesamolie tot de saus.","Verhit wok gloeiend heet. Bak knoflook en gember 30 sec.","Voeg de zeevruchten toe en bak 2-3 min. Haal eruit zodra ze gaar zijn.","Bak in dezelfde wok de wortel 2 min, dan kool, paprika en selderij 2 min, dan tauge 1 min.","Voeg de saus toe en roer. Bind met maizena tot lichte saus.","Doe de zeevruchten terug. Roer even door. Serveer direct met rijst."]},
  {id:"c06",title:"Gebakken kippenballetjes in zoet-zure saus",category:"Diner",description:"Knapperige kipballetjes in een levendige zoet-zure saus. Geliefd bij jong en oud.",prepTime:"25 min",cookTime:"20 min",servings:"4",difficulty:"Gemiddeld",ingredients:["600g kipfilet fijngehakt of gemalen","1 ei","3 el maizena","2 lente-uitjes fijngesneden","2 teentjes knoflook geraspt","1 tl sojasaus","Zout en peper","Olie om te frituren","Zoet-zure saus: 4 el tomatenketchup, 3 el rijstazijn, 3 el suiker, 2 el sojasaus, 100ml ananassap of appelsap, 1 el maizena","1 rode paprika in blokjes","1 groene paprika in blokjes","1 ui in kwarten"],steps:["Meng kipgehakt met ei, maizena, lente-ui, knoflook, sojasaus, zout en peper.","Vorm kleine balletjes van 3-4 cm.","Frituur de balletjes in olie van 175 graden goudbruin en gaar (4-5 min). Laat uitlekken.","Meng alle saus-ingredienten.","Bak ui en paprika 3 min in een scheut olie op hoog vuur.","Voeg de saus toe en laat indikken al roerend.","Doe de kipballetjes erbij en roer goed om. Serveer direct met rijst."]},
  {id:"c07",title:"Wan Tan soep",category:"Lunch",description:"Lichte Chinese soep met gevulde deegpakketjes. Klassiek en troostend.",prepTime:"40 min",cookTime:"15 min",servings:"4",difficulty:"Gemiddeld",ingredients:["24 wan tan vellen (te koop in Aziatische supermarkt)","Vulling: 300g varkensgehakt, 200g garnalen fijngehakt, 3 lente-uitjes, 2 teentjes knoflook geraspt, 1 el sojasaus, 1 el oestersaus, 1 tl sesamolie, 1 tl gemberpoeder, peper","Soep: 1,5 L kippenbouillon, 2 el sojasaus, 1 tl sesamolie, zout en witte peper","Pak choi of spinazie","Lente-ui en sesamzaadjes voor garnering"],steps:["Meng alle vulling-ingredienten goed door elkaar.","Leg een wan tan vel voor je. Leg een theelepel vulling in het midden.","Bevochtig de randen met water. Vouw dicht tot een driehoek en druk de lucht eruit.","Vouw de twee punten naar elkaar toe en druk vast.","Breng een pot gezouten water aan de kook. Kook de wan tans 4-5 min tot ze boven drijven.","Breng de bouillon aan de kook met sojasaus en sesamolie. Breng op smaak.","Voeg pak choi toe de laatste 2 min. Schep wan tans in kommen, overgiet met bouillon. Garneer met lente-ui."]},
  {id:"c08",title:"Kikkerbillen met lookboter",category:"Hapjes",description:"Een klassieker van de Chinese keuken. Malse kikkerbillen gebakken in een geurige knoflookboter.",prepTime:"15 min",cookTime:"12 min",servings:"4",difficulty:"Gemiddeld",ingredients:["800g kikkerbillen (ontdooid en drooggedept)","8 teentjes knoflook fijngesneden","100g boter","2 el olijfolie","2 el sojasaus","1 el oestersaus","Sap van een halve citroen","Verse peterselie fijngesneden","Zout en peper","Bloem om te bestuiven"],steps:["Dep de kikkerbillen droog. Kruid met zout en peper en bestuif licht met bloem.","Verhit de olie in een ruime pan op middelhoog vuur. Bak de kikkerbillen 3-4 min per kant tot goudbruin. Haal eruit.","Giet overtollig vet weg. Smelt de boter in dezelfde pan op laag vuur.","Voeg de knoflook toe en bak 2 min zacht en geurig.","Voeg sojasaus en oestersaus toe. Roer even door.","Doe de kikkerbillen terug. Roer goed om. Besprenkel met citroensap.","Bestrooi met peterselie. Serveer direct met stokbrood of rijst."]},
  {id:"c09",title:"Dim sum assortiment",category:"Hapjes",description:"Klassieke Chinese hapjes: gestoomde en gebakken deegpakketjes met verschillende vullingen.",prepTime:"1 uur",cookTime:"20 min",servings:"4",difficulty:"Moeilijk",ingredients:["Deeg: 300g bloem, 180ml kokend water, snufje zout","Vulling 1 (varken-garnaal): 200g varkensgehakt, 150g garnalen fijngehakt, 2 lente-uitjes, 1 el sojasaus, 1 el oestersaus, 1 tl sesamolie, 1 tl maizena, gember","Vulling 2 (groenten): 200g fijngesneden kool, 100g tauge, 2 lente-uitjes, 1 el sojasaus, 1 tl sesamolie","Dipsaus: 4 el sojasaus, 2 el rijstazijn, 1 tl sesamolie, geraspte gember, chiliolie"],steps:["Meng bloem, zout en kokend water. Kneed tot soepel deeg. Laat 30 min rusten onder een vochtige doek.","Bereid beide vullingen: meng alle ingredienten goed.","Rol het deeg dun uit. Steek rondjes van 8 cm uit.","Leg een theelepel vulling in het midden. Vouw dicht en ploooi de rand mooi.","Stoom de dim sum 8-10 min in een bamboestomer of gewone stomer bekleed met bakpapier.","Voor gebakken versie: leg in pan met beetje olie, voeg 50ml water toe, dek af en stoom 6 min tot water verdampt is. Laat dan de onderkant krokant bakken (2 min).","Serveer met de dipsaus."]},
  {id:"c10",title:"Chinees ravioli met garnalen in pikante olie",category:"Hapjes",description:"Zachte deegpakketjes gevuld met garnalen, geserveerd in een vurige rode chiliolie. Spectaculair.",prepTime:"45 min",cookTime:"10 min",servings:"4",difficulty:"Gemiddeld",ingredients:["24 won ton vellen of zelfgemaakt deeg","Vulling: 400g rauwe garnalen fijngehakt, 3 lente-uitjes, 2 teentjes knoflook geraspt, 1 cm gember geraspt, 1 el sojasaus, 1 tl sesamolie, zout en peper","Pikante olie: 4 el chiliolie (Lao Gan Ma of zelfgemaakt), 2 el sojasaus, 1 el rijstazijn, 1 tl suiker, 1 teentje knoflook geraspt, 1 cm gember geraspt","Garnering: lente-ui, sesamzaadjes, geroosterde pinda's grof gehakt"],steps:["Meng alle vulling-ingredienten goed door elkaar.","Leg een won ton vel voor je. Leg een theelepel garnaalvulling in het midden.","Bevochtig de randen, vouw dicht en druk goed aan zodat er geen lucht in zit.","Kook de ravioli 4-5 min in ruim kokend gezouten water tot ze boven drijven.","Meng ondertussen alle ingredienten voor de pikante olie in een kom.","Schep de gekookte ravioli in de pikante olie. Roer voorzichtig om.","Garneer met lente-ui, sesamzaadjes en pinda's. Direct serveren."]},
];


const LIGHT = {bg:"#FAF7F2",surf:"#FFFFFF",surfAlt:"#F5F0E8",brd:"#E5D9C8",brdSoft:"#EDE5D8",tx:"#2C2012",txM:"#6B5A42",txF:"#A8926E",acc:"#C25C2A",accHov:"#A34920",accTx:"#FFFFFF",hBg:"#FFFFFF",hBrd:"#E5D9C8",inBg:"#FFFFFF",inBrd:"#D4C4A8",dng:"#DC2626",dngBg:"#FEF2F2",dngBrd:"#FECACA",sbBg:"#F5F0E8"};
const DARK =  {bg:"#1A1512",surf:"#252018",surfAlt:"#2E2820",brd:"#3D3428",brdSoft:"#342D22",tx:"#F0EBE2",txM:"#A89880",txF:"#6B5840",acc:"#E07840",accHov:"#C96428",accTx:"#1A1512",hBg:"#1A1512",hBrd:"#2E2820",inBg:"#252018",inBrd:"#3D3428",dng:"#F87171",dngBg:"#3B1111",dngBrd:"#7F1D1D",sbBg:"#141210"};

function printRecipe(rec) {
  const win = window.open("","_blank");
  const ings = (rec.ingredients||[]).map(function(ig){ return "<li>"+ig+"</li>"; }).join("");
  const stps = (rec.steps||[]).map(function(st){ return "<li><span>"+st+"</span></li>"; }).join("");
  win.document.write("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>"+rec.title+"</title><style>body{font-family:Georgia,serif;max-width:660px;margin:36px auto;padding:0 18px;color:#1a1a1a;line-height:1.6;}h1{font-size:1.8rem;margin-bottom:6px;}p.d{color:#555;font-style:italic;margin-bottom:14px;}div.m{font-size:.85rem;color:#666;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #eee;}h2{font-size:1.1rem;margin:20px 0 8px;border-bottom:1px solid #eee;padding-bottom:5px;}ul,ol{padding-left:0;list-style:none;}ul li{padding:5px 0;border-bottom:1px solid #f5f5f5;font-size:.9rem;}ul li::before{content:'- ';color:#C25C2A;font-weight:bold;}ol{counter-reset:s;}ol li{counter-increment:s;display:flex;gap:10px;margin-bottom:10px;}ol li::before{content:counter(s);background:#C25C2A;color:#fff;border-radius:50%;min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;flex-shrink:0;margin-top:2px;}</style></head><body><h1>"+rec.title+"</h1>"+(rec.description?"<p class='d'>"+rec.description+"</p>":"")+"<div class='m'>"+(rec.prepTime?"Voorbereid: "+rec.prepTime+"  ":"")+(rec.cookTime?"Kooktijd: "+rec.cookTime+"  ":"")+(rec.servings?rec.servings+" porties":"")+"</div><h2>Ingredienten</h2><ul>"+ings+"</ul><h2>Bereidingswijze</h2><ol>"+stps+"</ol></body></html>");
  win.document.close();
  setTimeout(function(){ win.print(); }, 400);
}

function printShopList(shopRecs) {
  const win = window.open("","_blank");
  let body = "";
  shopRecs.forEach(function(rec) {
    body += "<h2>"+getCatI(rec.category)+" "+rec.title+"</h2><ul>";
    (rec.ingredients||[]).forEach(function(ing){ body += "<li>"+ing+"</li>"; });
    body += "</ul>";
  });
  win.document.write("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Boodschappenlijst</title><style>body{font-family:Georgia,serif;max-width:600px;margin:36px auto;padding:0 18px;color:#1a1a1a;}h1{font-size:1.6rem;margin-bottom:4px;}p.sub{color:#666;font-size:.9rem;margin-bottom:20px;}h2{font-size:1rem;margin:18px 0 8px;padding-bottom:5px;border-bottom:1px solid #eee;color:#C25C2A;}ul{list-style:none;padding:0;}li{display:flex;align-items:flex-start;gap:10px;padding:5px 0;border-bottom:1px solid #f5f5f5;font-size:.88rem;}li::before{content:'';display:inline-block;width:14px;height:14px;border:2px solid #C25C2A;border-radius:3px;flex-shrink:0;margin-top:2px;}</style></head><body><h1>Boodschappenlijst</h1><p class='sub'>"+shopRecs.length+" recept"+(shopRecs.length>1?"en":"")+" geselecteerd</p>"+body+"</body></html>");
  win.document.close();
  setTimeout(function(){ win.print(); }, 400);
}

async function fetchFromUrl(url) {
  const SYS = "Geef ALLEEN een JSON-object terug zonder markdown. Structuur: {\"title\":\"\",\"description\":\"\",\"category\":\"Ontbijt|Lunch|Diner|Dessert|Snack|Hapjes|Overig\",\"prepTime\":\"\",\"cookTime\":\"\",\"servings\":\"\",\"difficulty\":\"Gemakkelijk|Gemiddeld|Moeilijk\",\"ingredients\":[],\"steps\":[]}";
  const payload = {model:"claude-sonnet-4-20250514",max_tokens:1500,system:SYS,messages:[{role:"user",content:"Haal het recept op van deze URL en geef als JSON: "+url}],tools:[{type:"web_search_20250305",name:"web_search"}]};
  const resp = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const data = await resp.json();
  const txts = data.content.filter(function(blk){ return blk.type==="text"; }).map(function(blk){ return blk.text; }).join("");
  return JSON.parse(txts.replace(/```json|```/g,"").trim());
}
async function fetchFromText(rawText) {
  const SYS = "Geef ALLEEN een JSON-object terug zonder markdown. Structuur: {\"title\":\"\",\"description\":\"\",\"category\":\"Ontbijt|Lunch|Diner|Dessert|Snack|Hapjes|Overig\",\"prepTime\":\"\",\"cookTime\":\"\",\"servings\":\"\",\"difficulty\":\"Gemakkelijk|Gemiddeld|Moeilijk\",\"ingredients\":[],\"steps\":[]}";
  const payload = {model:"claude-sonnet-4-20250514",max_tokens:1500,system:SYS,messages:[{role:"user",content:"Structureer dit recept als JSON:\n\n"+rawText}]};
  const resp = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const data = await resp.json();
  const txts = (data.content.find(function(blk){ return blk.type==="text"; })||{}).text||"";
  return JSON.parse(txts.replace(/```json|```/g,"").trim());
}
async function fetchFromImage(b64data, mimeType) {
  const SYS = "Geef ALLEEN een JSON-object terug zonder markdown. Structuur: {\"title\":\"\",\"description\":\"\",\"category\":\"Ontbijt|Lunch|Diner|Dessert|Snack|Hapjes|Overig\",\"prepTime\":\"\",\"cookTime\":\"\",\"servings\":\"\",\"difficulty\":\"Gemakkelijk|Gemiddeld|Moeilijk\",\"ingredients\":[],\"steps\":[]}";
  const payload = {model:"claude-sonnet-4-20250514",max_tokens:1500,system:SYS,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:mimeType,data:b64data}},{type:"text",text:"Haal het recept uit deze afbeelding en geef als JSON."}]}]};
  const resp = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const data = await resp.json();
  const txts = (data.content.find(function(blk){ return blk.type==="text"; })||{}).text||"";
  return JSON.parse(txts.replace(/```json|```/g,"").trim());
}
function fileToBase64(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function() { resolve(reader.result.split(",")[1]); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

export default function App() {
  const [recipes,      setRecipes]      = useState(function(){ const v = lsGet(STORAGE_KEY, null); return (Array.isArray(v) && v.length > 0) ? v : ALL; });
  const [view,         setView]         = useState("grid");
  const [selected,     setSelected]     = useState(null);
  const [formData,     setFormData]     = useState(EMPTY_FORM);
  const [editingId,    setEditingId]    = useState(null);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [activeCat,    setActiveCat]    = useState("Alles");
  const [isDark,       setIsDark]       = useState(function(){ return lsGet(STORAGE_KEY+"-theme", false); });
  const [importTab,    setImportTab]    = useState("url");
  const [importSt,     setImportSt]     = useState(null);
  const [importMsg,    setImportMsg]    = useState("");
  const [urlInput,     setUrlInput]     = useState("");
  const [textInput,    setTextInput]    = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [delConfirm,   setDelConfirm]   = useState(null);
  const [shopItems,    setShopItems]    = useState(function(){ return lsGet(STORAGE_KEY+"-shop", {}); });
  const [shopChecked,  setShopChecked]  = useState(function(){ return lsGet(STORAGE_KEY+"-check", {}); });
  const [showShop,     setShowShop]     = useState(false);

  const T = isDark ? DARK : LIGHT;

  function saveRecipes(updated) {
    setRecipes(updated);
    lsSet(STORAGE_KEY, updated);
  }
  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    lsSet(STORAGE_KEY+"-theme", next);
  }
  function saveShopItems(updated) {
    setShopItems(updated);
    lsSet(STORAGE_KEY+"-shop", updated);
  }
  function saveShopChecked(updated) {
    setShopChecked(updated);
    lsSet(STORAGE_KEY+"-check", updated);
  }

  function toggleShopItem(recipeId) {
    const next = Object.assign({}, shopItems);
    if (next[recipeId]) { delete next[recipeId]; } else { next[recipeId] = true; }
    saveShopItems(next);
  }
  function toggleCheck(key) {
    const next = Object.assign({}, shopChecked, { [key]: !shopChecked[key] });
    saveShopChecked(next);
  }
  function clearShop() { saveShopItems({}); saveShopChecked({}); }

  function resetImport() { setImportSt(null); setImportMsg(""); setUrlInput(""); setTextInput(""); setPhotoPreview(null); }
  function openAdd() { setFormData(EMPTY_FORM); setEditingId(null); setImportTab("url"); resetImport(); setView("form"); }
  function openEdit(rec) { setFormData(Object.assign({}, rec)); setEditingId(rec.id); resetImport(); setView("form"); }
  function openDetail(rec) { setSelected(rec); setView("detail"); }
  function closeAll() { setView("grid"); setSelected(null); setDelConfirm(null); }

  function applyImported(data) {
    setFormData({
      title: data.title||"", description: data.description||"",
      category: CATS.indexOf(data.category)>=0 ? data.category : "Overig",
      prepTime: data.prepTime||"", cookTime: data.cookTime||"",
      servings: data.servings||"4",
      difficulty: DIFFS.indexOf(data.difficulty)>=0 ? data.difficulty : "Gemiddeld",
      ingredients: (data.ingredients&&data.ingredients.length) ? data.ingredients : [""],
      steps: (data.steps&&data.steps.length) ? data.steps : [""],
    });
  }

  async function doUrlImport() {
    if (!urlInput.trim()) return;
    setImportSt("loading"); setImportMsg("🌐 Recept ophalen...");
    try { applyImported(await fetchFromUrl(urlInput.trim())); setImportSt("success"); setImportMsg("Recept geimporteerd! Controleer en pas aan."); }
    catch(err) { setImportSt("error"); setImportMsg("Ophalen mislukt. Probeer tekst-import."); }
  }
  async function doTextImport() {
    if (!textInput.trim()) return;
    setImportSt("loading"); setImportMsg("Analyseren...");
    try { applyImported(await fetchFromText(textInput.trim())); setImportSt("success"); setImportMsg("Recept verwerkt!"); }
    catch(err) { setImportSt("error"); setImportMsg("Verwerking mislukt."); }
  }
  async function doImageImport(file) {
    const allowed = ["image/jpeg","image/png","image/gif","image/webp"];
    if (allowed.indexOf(file.type)<0) { setImportSt("error"); setImportMsg("Gebruik JPEG, PNG of WebP."); return; }
    setPhotoPreview(URL.createObjectURL(file));
    setImportSt("loading"); setImportMsg("Afbeelding analyseren...");
    try {
      const b64 = await fileToBase64(file);
      applyImported(await fetchFromImage(b64, file.type));
      setImportSt("success"); setImportMsg("Recept herkend!");
    } catch(err) { setImportSt("error"); setImportMsg("Herkenning mislukt."); }
  }

  async function handleSave() {
    if (!formData.title.trim()) { alert("Vul een naam in."); return; }
    const cleaned = Object.assign({}, formData, {
      ingredients: formData.ingredients.filter(function(ig){ return ig.trim(); }),
      steps: formData.steps.filter(function(st){ return st.trim(); }),
    });
    let updated;
    if (editingId) {
      updated = recipes.map(function(rec){ return rec.id===editingId ? Object.assign({},cleaned,{id:editingId}) : rec; });
    } else {
      updated = [Object.assign({},cleaned,{id:makeId()})].concat(recipes);
    }
    await saveRecipes(updated);
    closeAll();
  }
  async function handleDelete(id) {
    const updated = recipes.filter(function(rec){ return rec.id !== id; });
    await saveRecipes(updated);
    closeAll();
  }
  function updateField(field, idx, val) {
    const arr = formData[field].slice(); arr[idx] = val;
    setFormData(Object.assign({}, formData, { [field]: arr }));
  }
  function addField(field) { setFormData(Object.assign({}, formData, { [field]: formData[field].concat([""]) })); }
  function removeField(field, idx) {
    const arr = formData[field].filter(function(_, i){ return i!==idx; });
    setFormData(Object.assign({}, formData, { [field]: arr.length ? arr : [""] }));
  }

  const filtered = recipes.filter(function(rec) {
    if (activeCat!=="Alles" && rec.category!==activeCat) return false;
    if (searchTerm && rec.title.toLowerCase().indexOf(searchTerm.toLowerCase())<0 && (rec.description||"").toLowerCase().indexOf(searchTerm.toLowerCase())<0) return false;
    return true;
  });
  const shopRecs = recipes.filter(function(rec){ return shopItems[rec.id]; });
  const shopCount = shopRecs.length;
  function catCount(cat){ return recipes.filter(function(rec){ return rec.category===cat; }).length; }

  function getGroups() {
    if (activeCat!=="Alles") return [{label:activeCat,icon:getCatI(activeCat),items:filtered}];
    const result = [];
    CAT_GROUPS.forEach(function(grp) {
      grp.cats.forEach(function(cat) {
        const items = filtered.filter(function(rec){ return rec.category===cat; });
        if (items.length>0) result.push({label:cat,icon:getCatI(cat),items:items});
      });
    });
    return result;
  }

  const groups = getGroups();

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Inter:wght@400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body,#root{font-family:'Inter',sans-serif;background:${T.bg};color:${T.tx};min-height:100vh;}
    .app{min-height:100vh;display:flex;flex-direction:column;}
    input,textarea,select{color:${T.tx};background:${T.inBg};border:1.5px solid ${T.inBrd};border-radius:8px;font-family:'Inter',sans-serif;font-size:.89rem;padding:9px 12px;transition:border-color .2s;width:100%;}
    input:focus,textarea:focus,select:focus{outline:none;border-color:${T.acc};}
    input::placeholder,textarea::placeholder{color:${T.txF};}
    textarea{resize:vertical;line-height:1.6;}

    /* Buttons */
    .btn{display:inline-flex;align-items:center;gap:5px;padding:8px 15px;border:none;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;font-size:.83rem;font-weight:500;transition:all .15s;line-height:1.2;}
    .ba{background:${T.acc};color:${T.accTx};} .ba:hover{background:${T.accHov};} .ba:disabled{opacity:.4;cursor:not-allowed;}
    .bg{background:transparent;color:${T.tx};border:1.5px solid ${T.brd};} .bg:hover{border-color:${T.acc};color:${T.acc};}
    .bi{background:transparent;color:${T.txM};border:1.5px solid ${T.brd};padding:7px 10px;} .bi:hover{border-color:${T.acc};color:${T.acc};}
    .bd{background:${T.dngBg};color:${T.dng};border:1.5px solid ${T.dngBrd};} .bd:hover{opacity:.85;}
    .bs{background:${T.surfAlt};color:${T.txM};border:1.5px solid ${T.brd};} .bs:hover{border-color:${T.acc};color:${T.acc};}
    .bs.on{background:${T.acc}22;color:${T.acc};border-color:${T.acc}66;}
    .bsm{padding:6px 12px;font-size:.78rem;}

    /* Header */
    .hdr{background:${T.hBg};border-bottom:1.5px solid ${T.hBrd};padding:0 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:50;height:56px;}
    .logo{font-family:'Playfair Display',serif;font-size:1.2rem;color:${T.tx};display:flex;align-items:center;gap:6px;flex-shrink:0;}
    .logo em{color:${T.acc};font-style:normal;}
    .sw{flex:1;max-width:260px;position:relative;}
    .sw input{padding-left:30px;font-size:.84rem;}
    .sic{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:${T.txF};pointer-events:none;font-size:13px;}
    .hr{margin-left:auto;display:flex;align-items:center;gap:7px;}
    .hc{color:${T.txF};font-size:.75rem;}
    .shopbadge{position:absolute;top:-6px;right:-6px;background:${T.acc};color:${T.accTx};border-radius:10px;font-size:.6rem;font-weight:700;padding:1px 5px;line-height:1.4;}

    /* Layout */
    .layout{display:flex;flex:1;}

    /* Sidebar */
    .sidebar{width:200px;flex-shrink:0;background:${T.sbBg};border-right:1.5px solid ${T.brd};padding:14px 8px;overflow-y:auto;position:sticky;top:56px;height:calc(100vh - 56px);}
    .glbl{font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${T.txF};padding:0 6px;margin-bottom:4px;margin-top:12px;}
    .glbl:first-child{margin-top:0;}
    .cbtn{display:flex;align-items:center;gap:6px;width:100%;padding:7px 6px;border:none;border-radius:7px;background:transparent;cursor:pointer;font-family:'Inter',sans-serif;font-size:.82rem;color:${T.txM};transition:all .15s;text-align:left;line-height:1.2;}
    .cbtn:hover{background:${T.surfAlt};color:${T.tx};}
    .cbtn.on{background:${T.acc}18;color:${T.acc};font-weight:600;}
    .cic{font-size:13px;width:18px;text-align:center;flex-shrink:0;}
    .ccnt{margin-left:auto;font-size:.68rem;color:${T.txF};background:${T.brd};padding:1px 5px;border-radius:9px;flex-shrink:0;}
    .cbtn.on .ccnt{background:${T.acc}30;color:${T.acc};}

    /* Content */
    .content{flex:1;min-width:0;}
    .sgrid{padding:20px;}
    .ssec{margin-bottom:28px;}
    .shdr{font-family:'Playfair Display',serif;font-size:1rem;color:${T.txM};margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid ${T.brd};display:flex;align-items:center;gap:6px;}
    .shdr em{font-style:normal;font-size:.7rem;color:${T.txF};font-family:'Inter',sans-serif;font-weight:400;margin-left:2px;}
    .srow{display:flex;flex-wrap:wrap;gap:12px;}

    /* CARD STACK - bigger and readable */
    .cstack{position:relative;width:220px;cursor:pointer;flex-shrink:0;}
    .cstack::before,.cstack::after{content:'';position:absolute;left:0;right:0;border-radius:10px;border:1.5px solid ${T.brd};background:${T.surf};}
    .cstack::before{top:8px;bottom:-8px;transform:rotate(2.5deg);opacity:.5;}
    .cstack::after{top:4px;bottom:-4px;transform:rotate(1.2deg);opacity:.68;}
    .cfront{position:relative;z-index:1;background:${T.surf};border:1.5px solid ${T.brd};border-radius:10px;padding:14px 14px 12px;height:80px;display:flex;flex-direction:column;justify-content:space-between;transition:all .18s;box-shadow:0 2px 8px rgba(44,32,18,.07);}
    .cstack:hover .cfront{transform:translateY(-4px) rotate(-.5deg);box-shadow:0 8px 20px rgba(44,32,18,.14);border-color:${T.acc}55;}
    .cbar{position:absolute;top:0;left:0;right:0;height:3px;border-radius:10px 10px 0 0;}
    .ctit{font-family:'Playfair Display',serif;font-size:.95rem;font-weight:700;color:${T.tx};line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
    .cmeta{display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap;}
    .cpip{font-size:.7rem;color:${T.txF};white-space:nowrap;}

    /* Overlay & Panel */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,${isDark?.7:.4});z-index:100;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:20px 12px;backdrop-filter:blur(6px);}
    .panel{background:${T.surf};border-radius:14px;width:100%;max-width:740px;border:1.5px solid ${T.brd};position:relative;animation:su .22s ease;}
    @keyframes su{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
    .px{position:absolute;top:11px;right:11px;background:${T.surfAlt};border:1.5px solid ${T.brd};border-radius:7px;color:${T.txM};width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:all .15s;z-index:1;}
    .px:hover{color:${T.tx};}

    /* Detail */
    .dh{padding:24px 28px 18px;border-bottom:1.5px solid ${T.brd};position:relative;}
    .dhstr{position:absolute;top:0;left:0;right:0;height:4px;border-radius:14px 14px 0 0;}
    .dcat{font-size:.66rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:7px;}
    .dtit{font-family:'Playfair Display',serif;font-size:1.65rem;line-height:1.25;margin-bottom:9px;}
    .ddesc{font-size:.89rem;color:${T.txM};line-height:1.7;margin-bottom:14px;}
    .dmeta{display:flex;gap:16px;flex-wrap:wrap;}
    .dml{font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;color:${T.txF};display:block;margin-bottom:2px;}
    .dmv{font-weight:600;font-size:.84rem;}
    .dbody{display:grid;grid-template-columns:220px 1fr;}
    .dcol{padding:18px 24px;}
    .dcol:first-child{border-right:1.5px solid ${T.brd};}
    .dsec{font-family:'Playfair Display',serif;font-size:1rem;margin-bottom:10px;color:${T.tx};}
    .il{list-style:none;}
    .ii{display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid ${T.brdSoft};font-size:.85rem;line-height:1.45;color:${T.txM};}
    .ii:last-child{border-bottom:none;}
    .idot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:6px;}
    .sl{list-style:none;}
    .si{display:flex;gap:10px;margin-bottom:12px;}
    .snum{border-radius:50%;width:22px;height:22px;min-width:22px;display:flex;align-items:center;justify-content:center;font-size:.67rem;font-weight:700;margin-top:2px;}
    .stxt{font-size:.87rem;line-height:1.7;color:${T.txM};padding-top:2px;}
    .dact{display:flex;gap:6px;flex-wrap:wrap;padding:13px 24px;border-top:1.5px solid ${T.brd};}
    .delbox{background:${T.dngBg};border:1.5px solid ${T.dngBrd};border-radius:9px;padding:12px 15px;margin:0 24px 12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
    .delbox p{color:${T.dng};font-size:.83rem;flex:1;}

    /* Shopping list */
    .shopanel{background:${T.surf};border-radius:14px;width:100%;max-width:500px;border:1.5px solid ${T.brd};position:relative;animation:su .22s ease;}
    .shoph{padding:18px 22px 13px;border-bottom:1.5px solid ${T.brd};display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
    .shoptit{font-family:'Playfair Display',serif;font-size:1.25rem;flex:1;}
    .shopbody{padding:16px 22px;max-height:62vh;overflow-y:auto;}
    .shoprtit{font-weight:600;font-size:.87rem;color:${T.tx};margin-bottom:6px;margin-top:14px;padding-bottom:4px;border-bottom:1px solid ${T.brdSoft};display:flex;align-items:center;gap:5px;}
    .shoprtit:first-child{margin-top:0;}
    .shopitem{display:flex;align-items:flex-start;gap:9px;padding:5px 0;border-bottom:1px solid ${T.brdSoft};cursor:pointer;}
    .shopitem:last-child{border-bottom:none;}
    .shopitem input[type=checkbox]{width:15px;height:15px;accent-color:${T.acc};flex-shrink:0;cursor:pointer;margin-top:2px;}
    .shopitem label{font-size:.85rem;color:${T.txM};cursor:pointer;flex:1;line-height:1.45;}
    .shopitem.done label{text-decoration:line-through;opacity:.38;}
    .shopftr{padding:11px 22px;border-top:1.5px solid ${T.brd};display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;}

    /* Form */
    .fh{padding:18px 26px 13px;border-bottom:1.5px solid ${T.brd};}
    .ft{font-family:'Playfair Display',serif;font-size:1.3rem;margin-bottom:3px;}
    .fs{color:${T.txM};font-size:.81rem;}
    .fb{padding:16px 26px;}
    .fg{margin-bottom:13px;}
    .fl{display:block;font-size:.69rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${T.txF};margin-bottom:5px;}
    .frow{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
    .fact{display:flex;gap:7px;justify-content:flex-end;margin-top:15px;padding-top:12px;border-top:1.5px solid ${T.brd};}
    .li{display:flex;gap:6px;margin-bottom:6px;align-items:flex-start;}
    .ln{background:${T.acc};color:${T.accTx};border-radius:50%;width:19px;height:19px;min-width:19px;display:flex;align-items:center;justify-content:center;font-size:.63rem;font-weight:700;margin-top:9px;}
    .ld{background:${T.acc};border-radius:50%;width:6px;height:6px;min-width:6px;margin-top:12px;}
    .rmb{background:none;border:none;cursor:pointer;color:${T.txF};font-size:.87rem;padding:5px;border-radius:4px;transition:all .15s;flex-shrink:0;}
    .rmb:hover{color:${T.dng};background:${T.dngBg};}
    .addb{background:none;border:1.5px dashed ${T.brd};color:${T.txF};width:100%;padding:6px;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif;font-size:.79rem;transition:all .18s;margin-top:2px;}
    .addb:hover{border-color:${T.acc};color:${T.acc};}
    .itabs{display:flex;border:1.5px solid ${T.brd};border-radius:8px;overflow:hidden;margin-bottom:10px;}
    .itab{flex:1;padding:8px 4px;background:transparent;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;font-size:.77rem;color:${T.txM};transition:all .15s;border-right:1.5px solid ${T.brd};}
    .itab:last-child{border-right:none;}
    .itab.on{background:${T.acc};color:${T.accTx};}
    .itab:hover:not(.on){color:${T.acc};}
    .ip{background:${T.surfAlt};border:1.5px solid ${T.brd};border-radius:9px;padding:12px;margin-bottom:10px;}
    .ipt{font-family:'Playfair Display',serif;font-size:.92rem;margin-bottom:3px;}
    .ipd{font-size:.78rem;color:${T.txM};margin-bottom:9px;}
    .irow{display:flex;gap:6px;}
    .ist{margin-top:7px;padding:6px 10px;border-radius:6px;font-size:.79rem;font-weight:500;}
    .ist.loading{background:${isDark?"#172334":"#EFF6FF"};color:${isDark?"#60A5FA":"#1E40AF"};}
    .ist.success{background:${isDark?"#14291A":"#F0FDF4"};color:${isDark?"#4ADE80":"#166534"};}
    .ist.error{background:${T.dngBg};color:${T.dng};}
    .dz{border:1.5px dashed ${T.brd};border-radius:8px;padding:18px 12px;text-align:center;cursor:pointer;transition:all .18s;position:relative;background:${T.surfAlt};}
    .dz:hover{border-color:${T.acc};}
    .dz input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
    .pp{margin-top:7px;border-radius:6px;overflow:hidden;max-height:120px;display:flex;justify-content:center;}
    .pp img{max-height:120px;max-width:100%;object-fit:contain;}
    .div{display:flex;align-items:center;gap:10px;margin:12px 0;color:${T.txF};font-size:.7rem;font-weight:600;letter-spacing:.07em;text-transform:uppercase;}
    .div::before,.div::after{content:'';flex:1;border-top:1.5px solid ${T.brd};}

    /* MOBILE */
    @media(max-width:640px){
      .sidebar{display:none;}
      .hdr{height:52px;padding:0 12px;gap:8px;}
      .logo{font-size:1rem;}
      .sw{max-width:none;flex:1;}
      .hc{display:none;}
      .sgrid{padding:12px;}
      .srow{gap:10px;}
      /* Mobile cards: 2 columns */
      .cstack{width:calc(50% - 5px);}
      .ctit{font-size:.88rem;}
      .cpip{font-size:.67rem;}
      /* Mobile detail: single column */
      .panel{border-radius:12px;}
      .dbody{grid-template-columns:1fr;}
      .dcol:first-child{border-right:none;border-bottom:1.5px solid ${T.brd};}
      .dh{padding:18px 16px 14px;}
      .dact{padding:11px 16px;}
      .delbox{margin:0 16px 11px;padding:10px 13px;}
      .dcol{padding:14px 16px;}
      .dtit{font-size:1.35rem;}
      /* Mobile form */
      .fh{padding:16px 16px 12px;}
      .fb{padding:14px 16px;}
      .frow{grid-template-columns:1fr;}
      /* Mobile shop */
      .shopanel{border-radius:12px;}
      .shoph{padding:14px 16px 11px;}
      .shopbody{padding:12px 16px;max-height:55vh;}
      .shopftr{padding:10px 16px;}
      /* Mobile overlay: bottom sheet style */
      .overlay{align-items:flex-end;padding:0;}
      .panel{border-radius:16px 16px 0 0;max-width:100%;max-height:92vh;overflow-y:auto;-webkit-overflow-scrolling:touch;}
      .shopanel{border-radius:16px 16px 0 0;max-width:100%;}
      /* Mobile section header */
      .shdr{font-size:.92rem;}
    }
    @media(max-width:380px){
      .cstack{width:calc(50% - 4px);}
      .ctit{font-size:.82rem;}
    }
  `;

  return (
    <div className="app">
      <style>{css}</style>
      <header className="hdr">
        <div className="logo">📖 Mijn <em>Receptenboek</em></div>
        <div className="sw">
          <span className="sic">⌕</span>
          <input placeholder="Zoek een recept..." value={searchTerm} onChange={function(e){ setSearchTerm(e.target.value); }} />
        </div>
        <div className="hr">
          <span className="hc">{recipes.length} recepten</span>
          <button className="btn bi" onClick={function(){ setShowShop(true); }} title="Boodschappenlijst" style={{position:"relative"}}>
            🛒
            {shopCount>0 && <span className="shopbadge">{shopCount}</span>}
          </button>
          <button className="btn bi" onClick={toggleDark} title="Thema">{isDark?"☀️":"🌙"}</button>
          <button className="btn ba" onClick={openAdd}>+ Nieuw</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <button className={"cbtn"+(activeCat==="Alles"?" on":"")} onClick={function(){ setActiveCat("Alles"); }}>
            <span className="cic">📖</span>Alle recepten<span className="ccnt">{recipes.length}</span>
          </button>
          {CAT_GROUPS.map(function(grp) {
            return (
              <div key={grp.label}>
                <div className="glbl">{grp.label}</div>
                {grp.cats.map(function(cat) {
                  return (
                    <button key={cat} className={"cbtn"+(activeCat===cat?" on":"")} onClick={function(){ setActiveCat(cat); }}>
                      <span className="cic">{getCatI(cat)}</span>{cat}<span className="ccnt">{catCount(cat)}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </aside>

        <main className="content">
          <div className="sgrid">
            {filtered.length===0 ? (
              <div style={{textAlign:"center",padding:"50px 20px"}}>
                <div style={{fontSize:"2.5rem",marginBottom:"10px"}}>🔍</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",marginBottom:"8px"}}>Geen recepten gevonden</div>
                <p style={{color:T.txM,marginBottom:"18px"}}>Pas de categorie aan of voeg een nieuw recept toe.</p>
                <button className="btn ba" onClick={openAdd}>+ Recept toevoegen</button>
              </div>
            ) : groups.map(function(grp) {
              return (
                <div key={grp.label} className="ssec">
                  <div className="shdr"><span>{grp.icon}</span>{grp.label}<em>({grp.items.length})</em></div>
                  <div className="srow">
                    {grp.items.map(function(rec) {
                      const cc = getCatC(rec.category, isDark);
                      return (
                        <div key={rec.id} className="cstack" onClick={function(){ openDetail(rec); }}>
                          <div className="cfront">
                            <div className="cbar" style={{background:cc.border}} />
                            <div className="ctit" style={{fontSize: rec.title.length > 35 ? '.72rem' : rec.title.length > 22 ? '.82rem' : '.95rem'}}>{rec.title}</div>
                            <div className="cmeta">
                              {rec.prepTime && <span className="cpip">⏱ {rec.prepTime}</span>}
                              {rec.servings && <span className="cpip">👥 {rec.servings}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* DETAIL */}
      {view==="detail" && selected && (
        <div className="overlay" onClick={function(e){ if(e.target===e.currentTarget) closeAll(); }}>
          <div className="panel" style={{maxWidth:760}}>
            <button className="px" onClick={closeAll}>✕</button>
            <div className="dh">
              <div className="dhstr" style={{background:getCatC(selected.category,isDark).border}} />
              <div className="dcat" style={{color:getCatC(selected.category,isDark).border}}>{getCatI(selected.category)} {selected.category}</div>
              <div className="dtit">{selected.title}</div>
              {selected.description && <p className="ddesc">{selected.description}</p>}
              <div className="dmeta">
                {selected.prepTime && <div><span className="dml">Voorbereid</span><span className="dmv">⏱ {selected.prepTime}</span></div>}
                {selected.cookTime && <div><span className="dml">Kooktijd</span><span className="dmv">🔥 {selected.cookTime}</span></div>}
                {selected.servings && <div><span className="dml">Porties</span><span className="dmv">👥 {selected.servings}</span></div>}
                {selected.difficulty && <div><span className="dml">Niveau</span><span className="dmv">📊 {selected.difficulty}</span></div>}
              </div>
            </div>
            <div className="dbody">
              <div className="dcol">
                <div className="dsec">Ingredienten</div>
                <ul className="il">
                  {(selected.ingredients||[]).map(function(ing, idx) {
                    return (
                      <li key={idx} className="ii">
                        <span className="idot" style={{background:getCatC(selected.category,isDark).border,marginTop:"6px"}} />
                        <span>{ing}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="dcol">
                <div className="dsec">Bereidingswijze</div>
                <ol className="sl">
                  {(selected.steps||[]).map(function(step, idx) {
                    return (
                      <li key={idx} className="si">
                        <div className="snum" style={{background:getCatC(selected.category,isDark).border,color:isDark?"#1A1512":"#fff"}}>{idx+1}</div>
                        <div className="stxt">{step}</div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
            {delConfirm===selected.id && (
              <div className="delbox">
                <p>Weet je zeker dat je <strong>"{selected.title}"</strong> wil verwijderen?</p>
                <div style={{display:"flex",gap:"6px"}}>
                  <button className="btn bg bsm" onClick={function(){ setDelConfirm(null); }}>Annuleren</button>
                  <button className="btn bd bsm" onClick={function(){ handleDelete(selected.id); }}>Ja, verwijderen</button>
                </div>
              </div>
            )}
            <div className="dact">
              <button className={"btn bs bsm"+(shopItems[selected.id]?" on":"")} onClick={function(){ toggleShopItem(selected.id); }}>
                {shopItems[selected.id]?"🛒 In lijst":"🛒 Naar lijst"}
              </button>
              <button className="btn bg bsm" onClick={function(){ printRecipe(selected); }}>🖨️ Afdrukken</button>
              <button className="btn bg bsm" onClick={function(){ closeAll(); setTimeout(function(){ openEdit(selected); }, 60); }}>✏️ Bewerken</button>
              <button className="btn bd bsm" onClick={function(){ setDelConfirm(selected.id); }}>🗑️ Verwijderen</button>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING LIST */}
      {showShop && (
        <div className="overlay" onClick={function(e){ if(e.target===e.currentTarget) setShowShop(false); }}>
          <div className="shopanel">
            <button className="px" onClick={function(){ setShowShop(false); }}>✕</button>
            <div className="shoph">
              <div className="shoptit">🛒 Boodschappenlijst</div>
              {shopCount>0 && <span style={{background:T.acc,color:T.accTx,borderRadius:"12px",fontSize:".71rem",fontWeight:700,padding:"2px 8px"}}>{shopCount} recept{shopCount>1?"en":""}</span>}
            </div>
            <div className="shopbody">
              {shopRecs.length===0 ? (
                <div style={{textAlign:"center",padding:"32px 16px",color:T.txF}}>
                  <div style={{fontSize:"2.2rem",marginBottom:"8px"}}>🛍️</div>
                  <p>Geen recepten in de lijst.</p>
                  <p style={{fontSize:".8rem",marginTop:"4px"}}>Open een recept en druk op "Naar lijst".</p>
                </div>
              ) : shopRecs.map(function(rec) {
                return (
                  <div key={rec.id}>
                    <div className="shoprtit">
                      <span>{getCatI(rec.category)}</span>{rec.title}
                      <button className="btn bg bsm" style={{marginLeft:"auto",fontSize:".68rem",padding:"2px 7px"}} onClick={function(){ toggleShopItem(rec.id); }}>✕</button>
                    </div>
                    {(rec.ingredients||[]).map(function(ing, idx) {
                      const key = rec.id+"||"+idx;
                      return (
                        <div key={key} className={"shopitem"+(shopChecked[key]?" done":"")} onClick={function(){ toggleCheck(key); }}>
                          <input type="checkbox" readOnly checked={!!shopChecked[key]} onChange={function(){ toggleCheck(key); }} onClick={function(e){ e.stopPropagation(); }} />
                          <label>{ing}</label>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {shopRecs.length>0 && (
              <div className="shopftr">
                <button className="btn bg bsm" onClick={function(){
                  const allKeys = [];
                  shopRecs.forEach(function(rec){ (rec.ingredients||[]).forEach(function(_, idx){ allKeys.push(rec.id+"||"+idx); }); });
                  const allDone = allKeys.every(function(key){ return shopChecked[key]; });
                  const next = {};
                  allKeys.forEach(function(key){ next[key] = !allDone; });
                  saveShopChecked(next);
                }}>Alles selecteren</button>
                <button className="btn bg bsm" onClick={function(){ printShopList(shopRecs); }}>🖨️ Afdrukken</button>
                <button className="btn bg bsm" onClick={function(){
                  const lines = [];
                  shopRecs.forEach(function(rec){ lines.push(rec.title); (rec.ingredients||[]).forEach(function(ing){ lines.push("- "+ing); }); lines.push(""); });
                  if (navigator.clipboard) navigator.clipboard.writeText(lines.join("\n"));
                }}>📋 Kopieer</button>
                <button className="btn bd bsm" onClick={clearShop}>🗑️ Wis lijst</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FORM */}
      {view==="form" && (
        <div className="overlay" onClick={function(e){ if(e.target===e.currentTarget) closeAll(); }}>
          <div className="panel">
            <button className="px" onClick={closeAll}>✕</button>
            <div className="fh">
              <div className="ft">{editingId?"Recept bewerken":"Nieuw recept toevoegen"}</div>
              <div className="fs">Importeer via URL, tekst of foto, of vul zelf in.</div>
            </div>
            <div className="fb">
              {!editingId && (
                <div>
                  <div className="itabs">
                    {[["url","🔗 URL"],["tekst","📋 Tekst"],["foto","📸 Foto"]].map(function(pair) {
                      return <button key={pair[0]} className={"itab"+(importTab===pair[0]?" on":"")} onClick={function(){ setImportTab(pair[0]); resetImport(); }}>{pair[1]}</button>;
                    })}
                  </div>
                  {importTab==="url" && (
                    <div className="ip">
                      <div className="ipt">Via URL</div>
                      <div className="ipd">Plak een link van een receptensite.</div>
                      <div className="irow">
                        <input placeholder="https://www.lekkerlekker.be/recept/..." value={urlInput} onChange={function(e){ setUrlInput(e.target.value); }} onKeyDown={function(e){ if(e.key==="Enter") doUrlImport(); }} style={{flex:1}} />
                        <button className="btn ba" onClick={doUrlImport} disabled={importSt==="loading"} style={{flexShrink:0}}>{importSt==="loading"?"⏳":"Haal op"}</button>
                      </div>
                      {importSt && <div className={"ist "+importSt}>{importMsg}</div>}
                    </div>
                  )}
                  {importTab==="tekst" && (
                    <div className="ip">
                      <div className="ipt">Tekst plakken</div>
                      <div className="ipd">Kopieer tekst van een recept en plak hier.</div>
                      <textarea style={{minHeight:90,marginBottom:8}} placeholder="Plak hier de tekst van het recept..." value={textInput} onChange={function(e){ setTextInput(e.target.value); }} />
                      <button className="btn ba" onClick={doTextImport} disabled={importSt==="loading"||!textInput.trim()}>{importSt==="loading"?"Analyseren...":"Verwerk tekst"}</button>
                      {importSt && <div className={"ist "+importSt} style={{marginTop:7}}>{importMsg}</div>}
                    </div>
                  )}
                  {importTab==="foto" && (
                    <div className="ip">
                      <div className="ipt">Via foto</div>
                      <div className="ipd">Upload een foto van een kookboek, magazine of Instagram-screenshot.</div>
                      <div className="dz" onDragOver={function(e){ e.preventDefault(); }} onDrop={function(e){ e.preventDefault(); var file=e.dataTransfer.files[0]; if(file) doImageImport(file); }}>
                        <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={function(e){ if(e.target.files[0]) doImageImport(e.target.files[0]); }} />
                        <div style={{fontSize:"1.4rem",marginBottom:"4px"}}>📷</div>
                        <div style={{fontWeight:500,color:T.txM,fontSize:".83rem"}}>{importSt==="loading"?"Analyseren...":"Klik of sleep een foto hier"}</div>
                        <div style={{color:T.txF,fontSize:".73rem",marginTop:"2px"}}>JPEG, PNG, WebP</div>
                      </div>
                      {photoPreview && <div className="pp"><img src={photoPreview} alt="preview" /></div>}
                      {importSt && importSt!=="loading" && <div className={"ist "+importSt} style={{marginTop:7}}>{importMsg}</div>}
                    </div>
                  )}
                  <div className="div">of vul handmatig in</div>
                </div>
              )}
              <div className="fg"><label className="fl">Naam *</label><input placeholder="bijv. Spaghetti Carbonara" value={formData.title} onChange={function(e){ setFormData(Object.assign({},formData,{title:e.target.value})); }} /></div>
              <div className="fg"><label className="fl">Beschrijving</label><textarea style={{minHeight:52}} placeholder="Korte omschrijving..." value={formData.description} onChange={function(e){ setFormData(Object.assign({},formData,{description:e.target.value})); }} /></div>
              <div className="frow">
                <div className="fg"><label className="fl">Categorie</label><select value={formData.category} onChange={function(e){ setFormData(Object.assign({},formData,{category:e.target.value})); }}>{CATS.map(function(cat){ return <option key={cat}>{cat}</option>; })}</select></div>
                <div className="fg"><label className="fl">Moeilijkheid</label><select value={formData.difficulty} onChange={function(e){ setFormData(Object.assign({},formData,{difficulty:e.target.value})); }}>{DIFFS.map(function(dif){ return <option key={dif}>{dif}</option>; })}</select></div>
              </div>
              <div className="frow">
                <div className="fg"><label className="fl">Voorbereidingstijd</label><input placeholder="bijv. 15 min" value={formData.prepTime} onChange={function(e){ setFormData(Object.assign({},formData,{prepTime:e.target.value})); }} /></div>
                <div className="fg"><label className="fl">Kooktijd</label><input placeholder="bijv. 30 min" value={formData.cookTime} onChange={function(e){ setFormData(Object.assign({},formData,{cookTime:e.target.value})); }} /></div>
              </div>
              <div className="fg"><label className="fl">Porties</label><input style={{maxWidth:100}} placeholder="bijv. 4" value={formData.servings} onChange={function(e){ setFormData(Object.assign({},formData,{servings:e.target.value})); }} /></div>
              <div className="fg">
                <label className="fl">Ingredienten</label>
                {formData.ingredients.map(function(ing, idx) {
                  return (
                    <div key={idx} className="li">
                      <div className="ld" />
                      <input placeholder="bijv. 200g spaghetti" value={ing} onChange={function(e){ updateField("ingredients",idx,e.target.value); }} />
                      <button className="rmb" onClick={function(){ removeField("ingredients",idx); }}>✕</button>
                    </div>
                  );
                })}
                <button className="addb" onClick={function(){ addField("ingredients"); }}>+ Ingrediënt toevoegen</button>
              </div>
              <div className="fg">
                <label className="fl">Bereidingsstappen</label>
                {formData.steps.map(function(step, idx) {
                  return (
                    <div key={idx} className="li">
                      <div className="ln">{idx+1}</div>
                      <textarea style={{minHeight:46}} placeholder={"Stap "+(idx+1)+"..."} value={step} onChange={function(e){ updateField("steps",idx,e.target.value); }} />
                      <button className="rmb" onClick={function(){ removeField("steps",idx); }}>✕</button>
                    </div>
                  );
                })}
                <button className="addb" onClick={function(){ addField("steps"); }}>+ Stap toevoegen</button>
              </div>
              <div className="fact">
                <button className="btn bg" onClick={closeAll}>Annuleren</button>
                <button className="btn ba" onClick={handleSave}>{editingId?"Opslaan":"Recept toevoegen"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}