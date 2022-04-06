# Választási listás adatok vizualizálása

Az alábbi oldal segítségével a 2018-as és 2022-es országgyűlési választások listára leadott szavazatait lehet különféle módon vizualizálni. A beállításokat a bal alsó sarokban található csavarkulccsal lehet előhözni, és az alábbiakat lehet beállítani:

## Dokumentáció

1. Kiválasztott párt

Itt lehet kiválasztani hogy mely párt, illetve pártok szavazatainak számát szeretnénk látni. A bal oldalon a 2018-as, a jobb oldalon a 2022-es pártok szerepelnek, így össze lehet pl. hasonlítani, hogy a 2018-as ellenzéki pártok mennyi szavazatot szereztek, illetve vesztettek a 2022-es összefogáshoz (vagy összefogás + mi hazánkhoz) képest

2. Összehasonlítandó párt

Itt lehet kijelölni egy másik pártot, vagy pártokat. Az itteni szavazatok száma le lesz vonva az előzőleg kiválasztott pártok közül, így össze lehet hasonlítani, hogy a két kiválasztott párt közül melyik volt erősebb a megadott statisztikában (0 feletti érték esetén a kiválasztott, 0 alatti érték esetén az össehasonlítandó)

3. Összehasonlítás módja

Itt lehet kiválasztani hogy milyen módon szeretnénk a szavazatokat összehasonlítani. Az alábbi lehetőségek vannak:

- *2018-as eredmény (fő):* hány szavazatot adtak le a pártra összesen a megyében / körzetben
- *2018-as eredmény (%):* a leadott szavazatok az összes érvényes szavazat hány százaléka volt
- *2022-es eredmény (fő):* hány szavazatot adtak le a pártra összesen a megyében / körzetben
- *2022-es eredmény (%):* a leadott szavazatok az összes érvényes szavazat hány százaléka volt
- *Szavazóbázis különbség:* mennyivel több vagy kevesebb volt a 2018-ban leadott szavazatok száma a 2022-es leadott szavazatok számához képest
- *Százalékpontos különbség:* hány százalékkel volt több/kevesebb a 2018-ban leadott szavazatok száma a 2022-es leadott szavazatok számához képest

Van egy külön opció emellett a "Részvétel arányosítása". Ennél a gombnál a 2022-es szavazatok száma arányosan meg lesz növelve annyival, mint ha 2022-ben is annyian mentek volna el szavazni, mint 2022-ben.

4. Szinezési adatok

Itt lehet beállítani a határértékeket a színezéshez. Alapvetően az alábbi színek vannak alkalmazva:

- Negatív értékek piros-narancs színekkel vannak megjelenítve, ahol a piros a legnegatívabb, a narancs a 0-hoz legközelebb eső szám színe
- Pozitív értékek sárga-zöld színekkel vannak megjelenítve, ahol a zöld a legpozitívabb, míg a sárga a 0-hoz legközelebb eső érték színe

A csúszka két oldalán szzerepel a térképen látható legkisebb, és legnagyobb érték, a csúszka segítségével pedig el lehet tolni az origót, azaz a 0 pontot amihez a színek viszonyítva vannak mind a pozitív, mind a negatív irányba. Például ha kiválasztjuk a "2022-es eredmény" opciót, a csúszkát pedig eltoljuk -50-re, akkor csak azok az eredmények lesznek sárgával/zölddel szedve, amelyek legalább 50%, vagy annál magasabb értéket mutatnak.

A csúszka értékét kézzel is meg lehet adni a sor végén található dobozban a szám átírásával, valamint a Reset gomb megnyomásával vissza lehet állni az alapértelmezett értékre (0)

5. Nézet

Itt lehet beállítani, hogy megyei szintű vagy szavazókör szintű eredményekre vagyunk kíváncsiak

## Forrás

A 2018-as adatok a valasztas.hu letölthető adatálományából lettek kinyerve. Az adatok 100%-os feldolgozottságból vannak.
A 2022-es adatok a valasztas.hu-ról letöltött JSON adatsor feldolgozásából lettek kinyerve. Az adatok 98.97%-os feldolgozottságból vannak, és még hiányzanak belőle a külképviseleten és átjelentkezéssel leadott szavazatok.
## Licence

Copyright (c) Zsolt Sz. Sztupák <mail@sztupy.hu>

The application is licensed under the AGPL 3.0.

Data from index.hu and valasztas.hu
