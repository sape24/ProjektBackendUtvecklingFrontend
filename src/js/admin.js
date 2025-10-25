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

document.querySelectorAll(".logout").forEach(button =>{          //queryselector för att hämta logoutknapparna från mobil och desktopversion loopar genom båda och ger dom eventlisteners som tar bort token och skickar användaren till startsida
    button.addEventListener("click", event =>{         
    event.preventDefault()
    localStorage.removeItem("token")
    window.location.href = "index.html"
    })
})
    

const showMenuButton = document.getElementById("showmenu")                  //hämtar element från adminsidan för att visa och hantera menyn
const menuList = document.getElementById("menuList")
const token = localStorage.getItem("token")

showMenuButton.addEventListener("click", loadMenu)                           //laddar in menyn när användaren klicka på visa menyn med hjälp av eventlistener

async function loadMenu(){                                                    //funktion som hämtar menyn från api
    fetch("https://projektbackendwebbutveckling.onrender.com/api/menu")
    .then(response =>{
        if (!response.ok) throw new Error("Nätverksfel" + response.status)
        return response.json()
    })
    .then(menu =>{
        menuList.innerHTML = ""
        
        menu.forEach(dish => {                                        //loopar igenom varje rätt och skapar HTML element som visas i menyn
            const article = document.createElement("article")
            article.classList.add("adminDish")

            const nameEl = document.createElement("h3")
            nameEl.textContent = dish.name

            const descEl = document.createElement("p")
            descEl.textContent = dish.description

            const priceEl = document.createElement("p")
            priceEl.textContent = `${dish.price} kr`

            const catEl = document.createElement("p")
            catEl.textContent = dish.category

            const editButton = document.createElement("button")
            editButton.textContent = "Ändra"
            editButton.id = "editButton"
            editButton.addEventListener("click", () => editDish(dish))                     //skapar en ändra knapp som anropar editdish

            const deleteButton = document.createElement("button")
            deleteButton.textContent = "Ta bort"
            deleteButton.id = "deleteButton"
            deleteButton.addEventListener("click", () => deleteDish(dish.id))                //skapar en ta bort knapp som anropar deletedish med id

            article.appendChild(nameEl)
            article.appendChild(descEl)
            article.appendChild(priceEl)
            article.appendChild(catEl)
            article.appendChild(editButton)
            article.appendChild(deleteButton)

            menuList.appendChild(article)
        });  
    })
    .catch(error=>{                                                                 //felhantering vid misslyckad hämtning
        console.error("Fel vid hämtning av rätter", error)
        container.innerHTML = "<p>Kunde inte ladda menyn</p>"
    })
}
async function deleteDish(id){                                                              //funktion för att ta bort en rätt via api
    if (!token){                                                           
        alert("ingen token hittades")
        window.location.href = "login.html"
        return
    }

    try{
        const response = await fetch(`https://projektbackendwebbutveckling.onrender.com/api/menu/${id}`, {                //skicak delete förfrågan till backend med rätt id
        method: "DELETE",
        headers:{
            "Authorization": "Bearer " + token                                                           //skickar med JWT token för verifiering
        }
    })
    if(!response.ok) throw new Error ("Kunde inte ta bort rätt")                          //felhantering samt await loadmeny för att ladda om menyn efter borttagning
        await loadMenu()
    } catch (err){
        console.error(err)
    }
}
function editDish(dish){                                                                 //funktion för att redigera en rätt
    const article = document.createElement("article")
    article.classList.add("editDish")

    const title = document.createElement("h3")
    title.textContent = "Ändra rätt"

    const form = document.createElement("form")                                           //skapar formulär för redigering av rättens olika values
    form.id = "editForm"

    const nameInput = document.createElement("input")
    nameInput.type = "text"
    nameInput.id = "editName"
    nameInput.value = dish.name
    nameInput.required = true

    const descInput = document.createElement("input")
    descInput.type = "text"
    descInput.id = "editDesc"
    descInput.value = dish.description
    descInput.required = true

    const priceInput = document.createElement("input")
    priceInput.type = "number"
    priceInput.id = "editPrice"
    priceInput.value = dish.price
    priceInput.required = true

    const catInput = document.createElement("input")
    catInput.type = "text"
    catInput.id = "editCat"
    catInput.value = dish.category
    catInput.required = true

    const saveButton = document.createElement("button")
    saveButton.type = "submit"
    saveButton.textContent = "Spara"

    form.appendChild(nameInput)
    form.appendChild(descInput)
    form.appendChild(priceInput)
    form.appendChild(catInput)
    form.appendChild(saveButton)

    article.appendChild(title)
    article.appendChild(form)

    menuList.innerHTML = ""                                              //rensar listan och visar bara redigeringsformuläret
    menuList.appendChild(article)

    form.addEventListener("submit", async event => {                  //eventlistener för submit knapp när användaren spara ändringarna
        event.preventDefault()

        const updatedDish = {                                           //skapar ett objekt av värdena från formuläret för den uppdaterade rätten
            name: nameInput.value,
            description: descInput.value,
            price: priceInput.value,
            category: catInput.value
        }
        if (!token) {
            alert("Ingen token hittades")
            window.location.href = "login.html"
            return
        }

        try{
            const response = await fetch(`https://projektbackendwebbutveckling.onrender.com/api/menu/${dish.id}`, {            //skicak put förfrågan för att uppdatera rätten
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(updatedDish)
            })

            if (!response.ok) throw new Error ("Kunde inte uppdatera rätt")                               //laddar om menyn efter uppdatering
            await loadMenu()
        } catch (err) {
            console.error("Fel vid uppdatering", err)
        }
    })
}

const addDishButton = document.getElementById("addDishButton")
const addDishContainer = document.getElementById("addDish")
const addForm = document.getElementById("addDishForm")

addDishButton.addEventListener("click", () =>{                                                      //visar eller döljer formuläret för att lägga till ny rätt
    addDishContainer.classList.toggle("hidden")
})

addForm.addEventListener("submit", event => {                                                   //eventlistener för lägg till rätt formuläret med preventdefault
    event.preventDefault()
    addDish()
})

async function addDish(){                                                                      //funktion för att lägga till en ny rätt via api
    const dish = {                                                                                 //skapar ett objekt med värdena från formuläret för den nya rätten
        name: addForm.name.value,
        description: addForm.description.value,
        price: addForm.price.value,
        category: addForm.category.value
    }

    if(!token){
        alert("ingen token hitades")
        window.location.href = "login.html"
        return
    }

    try{
        const response = await fetch("https://projektbackendwebbutveckling.onrender.com/api/menu",{                    //skickar post förfrågan för att skapa ny rätt
            method: "POST",
            headers:{
            "Content-Type": "application/json",   
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(dish)
    })
    if (!response.ok) throw new Error ("kunde inte lägga till rätt")
    addForm.reset()                                                                                             //tömmer formuläret efter att rätten lagts till
    addDishContainer.classList.add("hidden")                                                                       //döljer formuläret igen
    await loadMenu()                                                                                              //laddar om menyn för att visa nya rätten
    } catch(err){
    console.error("Fel inträffade vid tilläggning av rätt", err)
    }
}