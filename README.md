## Frontend för projekt
Frontend bygg med HTML, CSS och javascript. Använder fetch() för att kommunicera med REST-api. Består av en publik del för att visa meny samt representation av restaurang och en administrativ del för att hantera rätter i menyn.

## Inlogg till adminkonto

**Användarnamn** | `admin`
**Lösenord**     | `admin123`

## Sidor

| Sida             | Beskrivning                                                   | 
|------------------|---------------------------------------------------------------|
| **index.html**   | Startsida med bild samt information om restaurang.            |
| **menu.html**    | Publik sida som hämtar och visar menyn dynamiskt från API't   |
| **login.html**   | Inloggnignssida för administratören                           |
| **admin.html**   | Adminsida med CRUD funktioner för menyer, Kräver inloggning.  |

## Funktionalitet
### Publik del
- Hämtar och visar menyn från backend via fetch(".../api/menu")
- Responsiv design med hamburgermeny för mobil.
- Felhantering visas direkt i gränssnittet vid problem med anslutning.

### Administrativ del
- Inloggning med användarnamn och lösenord.
- JWT-token sparas i localstorage och skickas automatiskt med i alla skyddade API anrop.
- CRUD funktionalitet:
    - Visa meny - listar alla rätter
    - Lägg till rätt - formulär för att skapa ny rätt.
    - Ändra rätt - redigerar vald rätt
    - Ta bort rätt - raderar rätt från menyn.
- Utloggningsknapp som tar bort token och skickar användaren till startsidan.

## Tekniker

**HTML**
**CSS**
**Javascript**
**Parcel**
**Fetch API**
**Localstorage**

