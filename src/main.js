import {AVL, Term} from "./AVL.js"
import fillWordsList from "./functions/fillWordsList.js"
import clearFormFields from "./functions/clearFormFields.js"
import getTermOfCard from "./functions/termDataFromCard.js"
import fillTermsTree from "./functions/fillTermsTree.js"
import setRandomDef from "./functions/setRandomDef.js"
import setAsideInfo from "./functions/setAsideInfo.js"

const tree = new AVL()
await fillTermsTree(tree)
const wordsList = document.getElementById('words-list')
fillWordsList(tree, wordsList, 'inorder')
await setRandomDef()
setAsideInfo(tree)

const filterButtons = document.getElementById('filter-buttons')
let activeFilterButton = document.getElementById('inorder-button')

const editFormFields = {
    formPortuguese: document.getElementById('portuguese-input'),
    formHigh_valyrian: document.getElementById('high_valyrian-input'),
    formClassification: document.getElementById('classification-input'),
    formVerbalTime: document.getElementById('verbal_time-input'),
    formGender: document.getElementById('gender-input')
}
const deleteModal = document.getElementById('deleteModal')
const delModalBody = deleteModal.querySelector('.modal-body')

let oldTerm = null
updateCardEvents()

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
    updateCardEvents()

})

document.querySelectorAll('.cancel-op').forEach((button) => {

    button.addEventListener('click', () => {

        clearFormFields(editFormFields)
        delModalBody.replaceChildren([])
        oldTerm = null

    })

})

document.getElementById('create-button').addEventListener('click', () => {
    oldTerm = null
})

document.getElementById('save-button').addEventListener('click', () => {
    
    const inputTerm = new Term(
        editFormFields.formHigh_valyrian.value,
        editFormFields.formPortuguese.value,
        editFormFields.formClassification.value,
        editFormFields.formVerbalTime.value,
        editFormFields.formGender.value
    )

    const duplicateTerm = tree.fullSearchTerm({
        portuguese: inputTerm.portuguese,
        high_valyrian: inputTerm.high_valyrian,
        classification: inputTerm.classification,
        verbal_time: inputTerm.verbal_time,
        gender: inputTerm.gender
    })
    
    // Se oldTerm != null, então é uma atualização de termo. Caso contrário é uma criação.
    if (oldTerm) {
        if (duplicateTerm && !duplicateTerm.isEqualsTo(oldTerm)) {
            
            alert('Os campos inseridos já fazem parte de um termo existente!')
            editFormFields.formPortuguese.focus()
            return

        } else {
            tree.updateTerm(oldTerm, inputTerm)
        }
    } else {

        if (duplicateTerm) {

            alert(`O termo inserido já existe!`)
            clearFormFields(editFormFields)
            return

        } else {
            tree.addTerm(inputTerm)
        }

    }

    clearFormFields(editFormFields)

    wordsList.replaceChildren([])
    fillWordsList(tree, wordsList, activeFilterButton.name)
    updateCardEvents()
    setAsideInfo(tree)
    oldTerm = null
})

document.getElementById('delete-button').addEventListener('click', () => {

    tree.deleteTerm(oldTerm)

    wordsList.replaceChildren([])
    fillWordsList(tree, wordsList, activeFilterButton.name)
    updateCardEvents()
    delModalBody.replaceChildren([])
    setAsideInfo(tree)
    oldTerm = null

})

document.getElementById('editModal').addEventListener('hidden.bs.modal', () => {

    clearFormFields(editFormFields)
    oldTerm = null

})

document.getElementById('deleteModal').addEventListener('hidden.bs.modal', () => {

    delModalBody.replaceChildren([])    
    oldTerm = null

})

document.getElementById('search-bar').addEventListener('keyup', (event) => {

    if (event.key == 'Enter') {
        
        const langSelect = document.getElementById('language-select')
        const searchBar = document.getElementById('search-bar')
        const langObject = Object.defineProperty({}, langSelect.value, { 
            value: searchBar.value
        })

        if (searchBar.value.trim() == '') {
         
            searchBar.classList.add('is-invalid')

            setTimeout(() => {
                searchBar.classList.remove('is-invalid')
            }, 1000)
            
            return

        }
        const foundTerms = tree.searchTermLike(langObject)
        
        if (foundTerms.length > 0) {

            wordsList.replaceChildren([])

            foundTerms.forEach((term) => {

                const foundTermCard = document.createElement('definition-card')
                foundTermCard.setAttribute('card-title', term.portuguese)
                foundTermCard.setAttribute('card-sub-word', term.high_valyrian)
                const description = `${term.classification}, ${term.verbal_time}, ${term.gender}`
                foundTermCard.setAttribute('card-description', description)
                wordsList.appendChild(foundTermCard)

            })
            
        } else {
            
            const langName = langSelect.selectedOptions.item(0).innerText
            searchBar.blur()
            alert(`O termo "${searchBar.value}" em ${langName} não foi encontrado!`)
            searchBar.focus()
            
        }
            
        updateCardEvents()

    }

})

function updateCardEvents () {
    
    document.querySelectorAll('.option-edit').forEach((editButton) => {

        editButton.addEventListener('click', (event) => {

            const option = event.target.closest('button')

            if (!option) 
                return

            const oldTermCard = event.target.closest('.word-card')
            const cardTerm = getTermOfCard(oldTermCard)

            oldTerm = tree.fullSearchTerm({
                portuguese: cardTerm.portuguese,
                high_valyrian: cardTerm.high_valyrian,
                classification: cardTerm.classification,
                verbal_time: cardTerm.verbal_time,
                gender: cardTerm.gender
            })

            editFormFields.formPortuguese.value = oldTerm.portuguese
            editFormFields.formHigh_valyrian.value = oldTerm.high_valyrian
            editFormFields.formClassification.value = oldTerm.classification
            editFormFields.formVerbalTime.value = oldTerm.verbal_time
            editFormFields.formGender.value = oldTerm.gender

        })
        
    })

    document.querySelectorAll('.option-delete').forEach((deleteButton) => {

        deleteButton.addEventListener('click', (event) => {

            const option = event.target.closest('button')

            if (!option) 
                return

            const oldTermCard = event.target.closest('.word-card')
            const cardTerm = getTermOfCard(oldTermCard)

            oldTerm = tree.fullSearchTerm({
                portuguese: cardTerm.portuguese,
                high_valyrian: cardTerm.high_valyrian,
                classification: cardTerm.classification,
                verbal_time: cardTerm.verbal_time,
                gender: cardTerm.gender
            })

            const reducedCard = oldTermCard.cloneNode(true)
            reducedCard.querySelector('.dropdown').remove()
            delModalBody.appendChild(reducedCard)

        })

    })

}