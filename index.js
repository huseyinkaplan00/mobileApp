import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
     databaseURL: "https://realtime-database-d9b62-default-rtdb.europe-west1.firebasedatabase.app/",
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "girdiler")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function () {
     let inputValue = inputFieldEl.value
     if (inputValue) {
          push(shoppingListInDB, inputValue)
          clearInputFieldEl()
     }
})

onValue(shoppingListInDB, function (snapshot) {
     if (snapshot.exists()) {
          let itemsArray = Object.entries(snapshot.val())

          clearShoppingListEl()

          for (let i = 0; i < itemsArray.length; i++) {
               let currentItem = itemsArray[i]
               let currentItemID = currentItem[0]
               let currentItemValue = currentItem[1]

               appendItemToShoppingListEl(currentItem)
          }
     } else {
          shoppingListEl.innerHTML = "No items here... yet"
     }
})

function clearShoppingListEl() {
     shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
     inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
     let itemID = item[0]
     let itemValue = item[1]

     let newEl = document.createElement("li")

     newEl.textContent = itemValue

     newEl.addEventListener("click", function () {
          let exactLocationOfItemInDB = ref(database, `girdiler/${itemID}`)

          remove(exactLocationOfItemInDB)
     })

     shoppingListEl.append(newEl)
}

//getting random photos

fetch("https://api.unsplash.com/photos/random/?client_id=pVVx382GHiGR3xCEd0DxcestWfJYO8BlUCSJ50PyGHA&query=note&count=1", { method: "GET" })
     .then((res) => {
          // console.log(res.status)
          // console.log(res.ok)
          if (!res.ok) {
               throw Error("Something Went Wrong With Unsplash API")
          }

          return res.json()
     })
     .then((data) => {
          let bg = data[0].urls.regular
          document.body.style.backgroundImage = `url(${bg})`
     })
     .catch((err) => {
          console.log(err)
          document.body.style.backgroundImage = `url(${`https://images.unsplash.com/photo-1611079830811-865ff4428d17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0Mjc3NzZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODAwNzk5MDE&ixlib=rb-4.0.3&q=80&w=1080`})`
     })
