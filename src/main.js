import {AVL, Term} from "./AVL.js"
import fillWordsList from "./functions/fillWordsList.js"
import clearFormFields from "./functions/clearFormFields.js"

const tree = new AVL()
const wordsList = document.getElementById('words-list')
fillWordsList(tree, wordsList, 'inorder')

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
updateCardEvents(tree, editFormFields, oldTerm)

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
    updateCardEvents(tree, editFormFields, oldTerm)

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
    
    if (oldTerm) {
        tree.updateTerm(oldTerm, inputTerm)
    } else {

        const similarTerm = tree.searchTerm({
            portuguese: inputTerm.portuguese,
            high_valyrian: inputTerm.high_valyrian
        })

        if (similarTerm && inputTerm.equals(similarTerm)) {
            alert(`O termo inserido já existe!`)
        } else {
            tree.addTerm(inputTerm)
        }
    }

    clearFormFields(editFormFields)

    wordsList.replaceChildren([])
    fillWordsList(tree, wordsList, activeFilterButton.name)
    updateCardEvents(tree, editFormFields, oldTerm)
    oldTerm = null
})

document.getElementById('delete-button').addEventListener('click', () => {

    const target = tree.searchTerm({
        portuguese: oldTerm.portuguese,
        high_valyrian: oldTerm.high_valyrian
    })

    tree.deleteTerm(target)

    wordsList.replaceChildren([])
    fillWordsList(tree, wordsList, activeFilterButton.name)
    updateCardEvents(tree, editFormFields, oldTerm)
    delModalBody.replaceChildren([])
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

function updateCardEvents () {
    
    document.querySelectorAll('.option-edit').forEach((editButton) => {

        editButton.addEventListener('click', (event) => {

            const option = event.target.closest('button')

            if (!option) 
                return

            const oldTermCard = event.target.closest('.word-card')
            const defPortuguese = oldTermCard.querySelector('.card-title').innerText
            const defHigh_valiryan = oldTermCard.querySelector('.sub-word').innerText
            
            oldTerm = tree.searchTerm({
                portuguese: defPortuguese,
                high_valyrian: defHigh_valiryan
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
            const defPortuguese = oldTermCard.querySelector('.card-title').innerText
            const defHigh_valiryan = oldTermCard.querySelector('.sub-word').innerText

            oldTerm = tree.searchTerm({
                portuguese: defPortuguese,
                high_valyrian: defHigh_valiryan
            })

            const reducedCard = oldTermCard.cloneNode(true)
            reducedCard.querySelector('.dropdown').remove()
            delModalBody.appendChild(reducedCard)

        })

    })

}