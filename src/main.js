import {AVL, Term} from "./AVL.js"
import fillWordsList from "./functions/fillWordsList.js"

const tree = new AVL()
const wordsList = document.getElementById('words-list')
fillWordsList(tree, wordsList, 'inorder')

const filterButtons = document.getElementById('filter-buttons')
let activeFilterButton = document.getElementById('inorder-button')

const formFields = {
    formPortuguese: document.getElementById('portuguese-input'),
    formHigh_valyrian: document.getElementById('high_valyrian-input'),
    formClassification: document.getElementById('classification-input'),
    formVerbalTime: document.getElementById('verbal_time-input'),
    formGender: document.getElementById('gender-input')
}

let oldTerm = null
updateCardEvents(tree, formFields, oldTerm)

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
    updateCardEvents(tree, formFields, oldTerm)

})

document.getElementById('modal-close-button').addEventListener('click', () => {
    Object.values(formFields).forEach((field) => {
        field.value = null
    })

    oldTerm = null
})

document.getElementById('modal-cancel-button').addEventListener('click', () => {
    Object.values(formFields).forEach((field) => {
        field.value = null
    })

    oldTerm = null
})

document.getElementById('modal-save-button').addEventListener('click', () => {
    
    const inputTerm = new Term(
        formFields.formHigh_valyrian.value,
        formFields.formPortuguese.value,
        formFields.formClassification.value,
        formFields.formVerbalTime.value,
        formFields.formGender.value
    )
    
    if (oldTerm) {
        tree.updateTerm(oldTerm, inputTerm)
    } else {
        tree.addTerm(inputTerm)
    }

    wordsList.replaceChildren([])
    fillWordsList(tree, wordsList, activeFilterButton.name)
    updateCardEvents(tree, formFields, oldTerm)
    oldTerm = null
})

function updateCardEvents () {
    
    document.querySelectorAll('.option-edit').forEach((element) => {

        element.addEventListener('click', (event) => {

            const option = event.target.closest('button')

            if (!option) 
                return

            if (option.name == 'edit-button') {
                
                const oldTermCard = event.target.closest('.word-card')
                //! Alterar para concordar com a tradução selecionada no dropdown de linguagem, ao lado da barra de pesquisa.
                const defPortuguese = oldTermCard.querySelector('.card-title').innerText
                const defHigh_valiryan = oldTermCard.querySelector('.sub-word').innerText
                
                oldTerm = tree.searchTerm({
                    portuguese: defPortuguese,
                    high_valyrian: defHigh_valiryan
                })

                formFields.formPortuguese.value = oldTerm.portuguese
                formFields.formHigh_valyrian.value = oldTerm.high_valyrian
                formFields.formClassification.value = oldTerm.classification
                formFields.formVerbalTime.value = oldTerm.verbal_time
                formFields.formGender.value = oldTerm.gender

            }

        })
        
    })

}