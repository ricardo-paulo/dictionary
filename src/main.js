import {AVL, Term} from "./AVL.js"
import fillWordsList from "./functions/fillWordsList.js"

const tree = new AVL()
const wordsList = document.getElementById('words-list')
fillWordsList(tree, wordsList, 'inorder')

const filterButtons = document.getElementById('filter-buttons')
let activeFilterButton = document.getElementById('inorder-button')

filterButtons.addEventListener('click', (event) => {

    // Verifica se o clique foi em um elemento do tipo 'button'
    const button = event.target.closest('button')

    if (!button) 
        return

    activeFilterButton.setAttribute('class', 'standard-button inactive')
    button.setAttribute('class', 'standard-button active')
    activeFilterButton = button
    
    wordsList.replaceChildren([])
    fillWordsList(tree, wordsList, button.name)

})

