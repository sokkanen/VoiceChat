Työaikakirjanpito
-----------------

päivä | aika | mitä tein
------|----- | ---------
3.5   | 1    | Aloitus, Suunnittelu, repo
6.5   | 1    | Frontin alkeisversio 
7.5   | 2    | Ensimmäinen bäkkäriversio. Bäkki juttelee frontille Socket.io:lla
7.5   | 2    | Viesti välittyy molempiin suuntiin. Alkeellinen chat toimii.
11.5  | 2    | TekstiChatin hahmottelua. Tekstichatin piilotusmahdollisuus.
13.5  | 3    | Viestin läpikäynnin hahmottelua, animoidun "hymiön" kuvat.
14.5  | 2    | Kirjaimittain animoitu pää toimii (melkein)
22.5  | 4    | Puhe toimii (Chromella). Synkronointi OK. Käyttäjähallinnan alkeet bäkkärillä
22.5  | 1    | Notifikaatio. Ilmoitus muuttuneesta käyttäjänimestä
28.5  | 2    | Käyttäjälistan hallintaa
29.5  | 2    | Jokaisella käyttäjällä oma puhuva pää. Oikea pää puhuu tekstit.
29.5  | 1    | Käyttäjänimi päivittyy kaikille. Notifikaation parannus.
30.5  | 3    | React Router. Huonenäkymän ja rekisteröinnin hahmottelua.
3.6   | 3    | Huoneiden luonti, listaus, päivitys.
7.6   | 3    | Huoneiden uniikit nimet, huoneisiin liittymisen hahmottelua
9.6   | 2    | Huoneet aukeavat listauksesta. Käyttäjien / viestien erittely huoneiden välillä ei vielä toimi.
10.6  | 2    | Viestit menevät oikeaan chattiin. Huone toimii myös refresh jälkeen.
10.6  | 3    | Ilmoitusten optimointia ja refaktorointia usealle chathuoneelle.
11.6  | 2    | Oikeat käyttäjät oikeissa huoneissa. Socketin säätöä
12.6  | 1    | Redux käyttöön tilahallinnan helpottamiseksi
13.6  | 4    | Store toimii. Neljä tilaa storessa
18.6  | 2    | Redux devtools käyttöön. Lisää reducereita. SocketServicen hahmottelua.
19.6  | 3    | Viestit toimivat oikein huoneesta siirtymisessä
7.7   | 3    | Käyttäjäilmoitukset paremmaksi. Käyttäjähallintaa huoneiden välillä. Rekisteröinnin alkeet
8.7   | 2    | Postgres ja .env konfigurointi.
9.7   | 1    | Bäkkärin erillisiin komponentteihin. 
11.7  | 4    | bcrypt, jsonwebtoken, uuid ja psql:n taulut bäkkäriin. Uusi käyttäjä frontilta tietokantaan. Validointi.
12.7  | 1    | kirjautuminen toimii, mutta käyttäjänimi ei vielä välity chattiin.
13.7  | 5    | Rekisteröityneen ja rekisteröitymättömän näkymät. Chat toimimaan uudella nimimerkkisysteemillä.
14.7  | 1    | Rekisteröitymätön käyttäjä ei voi valita rekiströityneen nimimerkkiä.
14.7  | 2    | Huoneiden tallennus ja haku tietokannasta. Huoneen poistopainike huoneen luojalle.
14.7  | 3    | Privaattihuoneiden tallennus ja haku. Näkymä vain huoneeseen kutsutuille ja huoneen perustajalle.
16.7  | 1    | Privaattihuoneiden käyttäjien haku ja palautus.
17.7  | 2    | Privaattihuoneiden hallinnoinnin hahmottelua ja rakentamista.
18.7  | 2    | Privaattihuoneisiin kutsuminen 90% valmis. Oman chattinaaman toteutuksen suunnittelua.
20.7  | 2    | Chat erittelee rekisteröityneet. Socketin säätöä. Korjauksia kirjautumiseen ja uloskirjautumiseen.
21.7  | 2    | Kutsuminen toimii (Ei vielä ilmoitusta kutsutulle.) ja kutsun status palautuu kutsuikkunaan.
21.7  | 2    | Kutsu näkyy kutsutulla. Kutsun voi hylätä ja hyväksyä. Privaattihuoneet ja kutsut päivittyvät valinnan mukaan.
22.7  | 1    | Huoneiden poistaminen.
23.7  | 2    | Webcam-kirjastojen vertailua ja kokeilua. Toimiva alkeellinen kamera ohjelmassa.
28.7  | 1    | Toimiva kuvauslooppi.
8.8   | 4    | Validointia kaavakkeille. Socketin toiminnan optimointia, kyselyiden parantelua. Omat kuvat Reduxiin. Mongon hahmottelua.
9.8   | 2    | Kuvien reduxoinnin parannus, Oma kuvasarja toimii chatissa lokaalisti (Käyttäjien kuvia ei vielä erotella.). Kuvien ottaminen rekiströityneille.
15.8  | 2    | Käyttäjähallinnan suuri refaktorointi -> Kaikki toiminnot huoneeseen (Valmistautuminen käyttäjän kuviin -> datamäärän ja tietoliikenteen minimointi).
16.8  | 3    | Kuvaustoiminnon ja kuvien tallennuksen parannus. Kuvat menevät onnistuneesti Stringinä MongoDB-kantaan.
18.8  | 2    | Omien käyttäjäkuvien tallennus ja päivitys ulkoiseen Mongo-tietokantaan toimii.
18.8  | 2    | Käyttäjäkuvat haetaan sisäänkirjautumisen yhteydessä ja liitetään chattikäyttäjään. Kuvat renderöityvät oikein. Chatin säätöä. 
18.8  | 2    | Huoneiden järjestäminen, sivutus ja haku.
19.8  | 2    | Huoneiden maksimikäyttäjämäärä. Rajoituksen hahmottelua bäkillä ja frontissa.
19.8  | 3    | Huoneiden rajoitus toimii sekä normaali- että privaattihuoneille. Sivutuksen parannus.
20.8  | 3    | Alkeellinen käyttäjähallinta. Frontin build toimii. Herokun asetukset.
21.8  | 2    | Sovellus toimimaan Herokussa kaikilla ominaisuuksilla. 
22.8  | 3    | Bootstrap-aloitus, selaimen tunnistus, koodin siistimistä.
24.8  | 2    | Äänenvalinnan hahmottelua ja opettelua. Dynaaminen etusivu (Säätyy ikkunan leveydestä.)
24.8  | 2    | Reitityksen parannus, kielenvalinta.
25.8  | 2    | Kielenvalinnan parannus ja info, käyttäjänimien puhuminen, huoneen bootstrapia. Käyttäjäkuvakkeiden rivitys. Huoneen bootstrap.
26.8  | 2    | Kuvat uusiksi, Bootstrap, "typing" huoneeseen. Punaista pois konsolista.
26.8  | 2    | Nimimerkin näyttäminen. Huoneen ja huonelistauksen päivittäminen.
27.8  | 2    | Huoneiden lisäämisen, järjestämisen ja poistamisen korjaaminen. Huonelistauksen bootstrap
28.8  | 3    | Uuden käyttäjän lomakkeen bootstrap. Bootstrap: App, login, invites, NewUserForm. Emojit
29.8  | 1    | Notifikaation parannus, rajoitteita viestin pituuteen.
30.8  | 1    | Automaattisesti alasrullaava tekstichatti. Tekstichatin koon valinta.
4.9   | 1    | Chathuoneen asettelua, ikkunankoon parempi seuranta (ei valmis), Clientin timeoutin selvittäminen
YHT   | 136
