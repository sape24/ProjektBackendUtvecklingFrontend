//skapar variablar av knapp elementen i html
let openButton = document.getElementById("open-menu")
let closeButton = document.getElementById("close-menu")


//skapar en eventlistener som lyssnar efter när användare klickar på dessa element
openButton.addEventListener('click', toggleMenu)
closeButton.addEventListener('click', toggleMenu)
//function som kollar ifall mobilmenyn visas eller inte när man trycker på respektive knapp, om den inte visas så visas den och vice versa. Den ändrar knappens css ifall display är none till block annars ändras den till none
function toggleMenu(){
    let mobileMenuEl = document.getElementById("mobilemenu")
    let style = window.getComputedStyle(mobileMenuEl)

    if(style.display === "none") {
        mobileMenuEl.style.display = "block";
    } else{
        mobileMenuEl.style.display = "none"
    }
}

const container = document.getElementById("menucontainer")                          //hämttar menucontainer där rätterna ska visas dynamiskt
if (container){                                                                       //kontrollerar om elementet finns för att hindra fel på andra sidor utan meny
    fetch("https://projektbackendwebbutveckling.onrender.com/api/menu")
    .then(response =>{
        if (!response.ok) throw new Error("Nätverksfel" + response.status)
        return response.json()
    })
    .then(menu =>{
        container.innerHTML = ""                                                          //rensar container från tidigare innehåll
        
        menu.forEach(dish => {                                                              //skapar HTML element för varje rätt och lägger till i menyn
            const article = document.createElement("article")
            article.classList.add("dish")

            const nameEl = document.createElement("h3")
            nameEl.textContent = dish.name

            const descEl = document.createElement("p")
            descEl.textContent = dish.description

            const priceEl = document.createElement("p")
            priceEl.textContent = `${dish.price} kr`

            const catEl = document.createElement("p")
            catEl.textContent = dish.category

            article.appendChild(nameEl)
            article.appendChild(descEl)
            article.appendChild(priceEl)
            article.appendChild(catEl)

            container.appendChild(article)
        });  
    })
    .catch(error=>{
        console.error("Fel vid hämtning av rätter", error)
        container.innerHTML = "<p>Kunde inte ladda menyn</p>"
    })
}


   
async function login() {                                         //asynkron funktion som hanterar inloggning        
const user = {
    username: document.getElementById("username").value,        //skapar ett objekt med värden från förmuläret
    password: document.getElementById("password").value           
}

if(!user.username || !user.password ){                       //validering om nått fält i förmuläret är tomt return så funktionen stoppas
    const error = document.getElementById("errormessage")
    error.textContent = ("Du måste fylla i alla fält!")             
    return                                                         
}

 try{
    let response = await fetch("https://projektbackendwebbutveckling.onrender.com/api/auth/login", {       //post förfrågan till api
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'                               //anger att det är json som skickas
    },
        body: JSON.stringify(user)                                         //user objekt blir json sträng
    });
    if (!response.ok){
            throw new Error ('Nätverksproblem - felaktigt svar från servern');
        }
        
    let data = await response.json();
        
    localStorage.setItem('token', data.token)                    //sparar jwt token i localstorage
    console.log("token sparad", data.token)
    console.log(data)
        
    window.location.href = "admin.html"                           //om all stämmer redirect till adminsidan
    }catch (error){
    console.error('Det uppstod ett fel:', error.message);
    document.getElementById("errormessage").textContent = "Inloggning misslyckades"
    }
} 

const form = document.getElementById("loginForm")                        //hämtar inloggnignsformuläret
if(form){                                                               //kontroll ifall formuläret finns så lägger det till en eventlistener med preventdefault för att hindra sidomladdning och sedan anropar login funktion
    form.addEventListener("submit", event =>{
        event.preventDefault()
        login()
    })
}