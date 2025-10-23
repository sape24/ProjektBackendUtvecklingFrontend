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

const container = document.getElementById("menucontainer")

fetch("https://projektbackendwebbutveckling.onrender.com/api/menu")
    .then(response =>{
        if (!response.ok) throw new Error("Nätverksfel" + response.status)
        return response.json()
    })
    .then(menu =>{
        container.innerHTML = ""
        
        menu.forEach(dish => {
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