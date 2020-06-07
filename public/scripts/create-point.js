
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then(states => {
        for(const state of states ) {
            ufSelect.innerHTML +=  `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML ="<option value>Selectione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then(cities => {
        for(const city of cities ) {
            citySelect.innerHTML +=  `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    })
}

document
.querySelector("select[name=uf]")
.addEventListener("change", getCities)




// itens de coleta

const itensToColetect = document.querySelectorAll(".items-grid li")

for (const item of itensToColetect) {
    item.addEventListener("click", handleSelectedItem)
}


const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    
    const itemLi = event.target //recupere le li sur lequel on a cliquer

    itemLi.classList.toggle("selected") //ajoute une classe selected a cet li
    
    const itemId = itemLi.dataset.id  //permet de trouver le id du li

    const alreadySelected = selectedItems.findIndex( item => { // ces trois lignes permettent de verifier si le li a deja été selectionner ou pas et retourne true ou false
        const itemfound = item == itemId
        return itemfound
    })

    if (alreadySelected >= 0 ) {
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        
        selectedItems = filteredItems
    }else {
        selectedItems.push(itemId)
    }

    collectedItems.value = selectedItems
    
}



