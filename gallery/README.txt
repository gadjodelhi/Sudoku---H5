Wszystko na razie zostaje bez zmian, dodajemy tylko nastepujace feature'y:

Indeks galerii
==============================================
- zmiana kolejnosci zdjec drag&dropem (native HTML5)
- usuwanie zdjec
- dodawanie nowych zdjec (automatycznie wykrywa czy to wersja 100x100, 920x760 czy 990)
- edycja zdjecia (tytul/nowe obrazki)

Lista galerii
==============================================
- usuniecie galerii
- edycja (kategoria, miniaturka, nazwa, permalink, opis, big, ...)
- dodanie galerii
- zmiana kolejnosci galerii


1. Zmiana kolejnosci zdjec drag&dropem
	- FE: na razie jqueryui, ajax wysyla liste wszystkich zdjec (nazwa sredniego zdjecia)
	- BE: replace wszystkich zdjec, wszystkie komentarze z galerii ida na koniec

2. Usuwanie zdjec
	- FE: wysylane jest nazwa sredniego zdjecia
	- BE: zdjecie jest zakomentowywane

3. Dodawanie nowych zdjec:
	- FE: tytul zdjecia + 2 pola na plik (miniaturka robi sie sama), progress uploadu
	- BE: upload, robienie miniaturki, dodanie zdjecia na koncu

4. Edycja zdjecia:
	- FE: j.w., + hidden z aktualna nazwa sredniego zdjecia
	- BE: podmiana danych na danej pozycji, ewentualnie utworzenie miniaturki ze sredniego zdjecia

5. Usuniecie galerii
	- FE: wysylany id galerii
	- BE: usuwanie galerii

6. Edycja
	- FE: kategoria, tytul, opis, id, big, miniaturka
	- BE: zamiana danych, upload miniaturki
	
7. Dodanie galerii
	- FE:. j.w.
	- BE: dodanie galerii na poczatku XMLa
	
8. Zmiana kolejnosci galerii
	- FE: wysylana jest list galerii danej kategorii
	- BE: galerie sa przesuwane na koniec w nowej kolejnosci
	
