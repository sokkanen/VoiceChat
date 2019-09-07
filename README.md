## VoiceChat

### Demo

Ohjelman tämänhetkinen versio löytyy osoitteesta https://synthchat.herokuapp.com/

#### Tuntikirjanpito

[Tuntikirjanpito](https://github.com/sokkanen/VoiceChat/blob/master/dokumentaatio/tuntikirjanpito.md)

### Yleistä

VoiceChat on selaimen puhesyntetisaattoria käyttävä chat -ohjelma.

Ohjelma on rakennettu stackille  React - NodeJS - Postgresql / MongoDb.

Ohjelman keskeiset ominaisuudet:

- Keskustelu muiden käyttäjien kanssa tekstin välityksellä
- Keskustelu muiden käyttäjien kanssa selaimen tekstistä puheeksi ominaisuudella.
	- Interaktiivinen puhuva pää / hymiö (Animoitu puhe)
- Keskusteluhuoneet
	- Huoneiden käyttäjämäärän rajoittaminen
- Rekisteröitymättömät käyttäjät
  - Keskustelu julkisisssa huoneissa
- Rekisteröityneet käyttäjät
	- Personoitava puhuva pää (Kuvat webcamilla)
	- Yksityishuoneet
	- Kutsuminen yksityishuoneeseen

### TODO

- Käyttäjän hallintapaneeli
- Testejä
- Käyttäjärajoituksen fiksumpi toteutus
- Chatti rullaamaan alas aina uudesta viestistä.
- Kuvienoton säätö (Kamera pois -painike, siistimpi rullaus.)
- Routerin historia
- Virheet ja turhat riippuvuudet pois.
