var MEGYE_LAKOSOK = {
"BUDAPEST": 1328726 ,
"BARANYA": 309694 ,
"BÁCS–KISKUN": 424057 ,
"BÉKÉS":  291425 ,
"BORSOD–ABAÚJ–ZEMPLÉN":  539907 ,
"CSONGRÁD":  335810 ,
"FEJÉR":  344872 ,
"GYŐR–MOSON–SOPRON":  360048 ,
"HAJDÚ–BIHAR":  435284 ,
"HEVES":  245305 ,
"JÁSZ–NAGYKUN–SZOLNOK":  309838 ,
"KOMÁROM–ESZTERGOM":  248455 ,
"NÓGRÁD":  160796 ,
"PEST":  1008073 ,
"SOMOGY":  255831 ,
"SZABOLCS–SZATMÁR–BEREG":  459677 ,
"TOLNA":  186034 ,
"VAS":  207573 ,
"VESZPRÉM":  288071 ,
"ZALA":  228583
}

var MEGYE_MAX = MEGYE_LAKOSOK['BUDAPEST'];

var MEGYE_LAKOSOK_FIX = {}

for (var l in MEGYE_LAKOSOK) {
  MEGYE_LAKOSOK_FIX[l] = MEGYE_MAX / MEGYE_LAKOSOK[l];
}