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
	- Emojit
	- Keskustelijan värinvalinta
	- Käyttäjänimien puhuminen
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
	- Omien tietojen luku, muokkaus ja tilin poistaminen

### TODO

- Käyttäjän poistaminen backendissä
- Testejä
- Huoneen käyttäjärajoituksen fiksumpi toteutus
- Routerin historia
- Virheet ja turhat riippuvuudet pois.
