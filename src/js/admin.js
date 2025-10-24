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

document.getElementById("logout").addEventListener("click", event =>{
    event.preventDefault()
    localStorage.removeItem("token")
    window.location.href = "index.html"
})

const showMenuButton = document.getElementById("showmenu")
const menuList = document.getElementById("menuList")
const token = localStorage.getItem("token")

showMenuButton.addEventListener("click", loadMenu)

async function loadMenu(){
    fetch("https://projektbackendwebbutveckling.onrender.com/api/menu")
    .then(response =>{
        if (!response.ok) throw new Error("Nätverksfel" + response.status)
        return response.json()
    })
    .then(menu =>{
        menuList.innerHTML = ""
        
        menu.forEach(dish => {
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
            editButton.addEventListener("click", () => editDish(dish))

            const deleteButton = document.createElement("button")
            deleteButton.textContent = "Ta bort"
            deleteButton.id = "deleteButton"
            deleteButton.addEventListener("click", () => deleteDish(dish.id))

            article.appendChild(nameEl)
            article.appendChild(descEl)
            article.appendChild(priceEl)
            article.appendChild(catEl)
            article.appendChild(editButton)
            article.appendChild(deleteButton)

            menuList.appendChild(article)
        });  
    })
    .catch(error=>{
        console.error("Fel vid hämtning av rätter", error)
        container.innerHTML = "<p>Kunde inte ladda menyn</p>"
    })
}
async function deleteDish(id){
    if (!token){
        alert("ingen token hittades")
        window.location.href = "login.html"
        return
    }

    try{
        const response = await fetch(`https://projektbackendwebbutveckling.onrender.com/api/menu/${id}`, {
        method: "DELETE",
        headers:{
            "Authorization": "Bearer " + token
        }
    })
    if(!response.ok) throw new Error ("Kunde inte ta bort rätt")
        await loadMenu()
    } catch (err){
        console.error(err)
    }
}
function editDish(dish){
    const article = document.createElement("article")
    article.classList.add("editDish")

    const title = document.createElement("h3")
    title.textContent = "Ändra rätt"

    const form = document.createElement("form")
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

    menuList.innerHTML = ""
    menuList.appendChild(article)

    form.addEventListener("submit", async event => {
        event.preventDefault()

        const updatedDish = {
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
            const response = await fetch(`https://projektbackendwebbutveckling.onrender.com/api/menu/${dish.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(updatedDish)
            })

            if (!response.ok) throw new Error ("Kunde inte uppdatera rätt")
            await loadMenu()
        } catch (err) {
            console.error("Fel vid uppdatering", err)
        }
    })
}

const addDishButton = document.getElementById("addDishButton")
const addDishContainer = document.getElementById("addDish")
const addForm = document.getElementById("addDishForm")

addDishButton.addEventListener("click", () =>{
    addDishContainer.classList.toggle("hidden")
})

addForm.addEventListener("submit", event => {
    event.preventDefault()
    addDish()
})

async function addDish(){
    const dish = {
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
        const response = await fetch("https://projektbackendwebbutveckling.onrender.com/api/menu",{
            method: "POST",
            headers:{
            "Content-Type": "application/json",   
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(dish)
    })
    if (!response.ok) throw new Error ("kunde inte lägga till rätt")
    addForm.reset()
    addDishContainer.classList.add("hidden")    
    await loadMenu()
    } catch(err){
    console.error("Fel inträffade vid tilläggning av rätt", err)
    }
}