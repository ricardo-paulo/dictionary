import { Term } from "../AVL.js"

function getTermOfCard (wordCard) {
    
    if (wordCard.className != 'word-card') {
        console.error(`O parâmetro (wordCard) ${wordCard} é inválido! O parâmetro precisa ser uma div com classe word-card`)
        return
    }

    const defPortuguese = wordCard.querySelector('.card-title').innerText
    const defHigh_valiryan = wordCard.querySelector('.sub-word').innerText
    const defDescription = wordCard.querySelector('.description').innerText
    
    const descriptionComponents = defDescription.split(', ')
    const defClassification = descriptionComponents[0]
    const defVerbalTime = descriptionComponents[1]
    const defGender = descriptionComponents[2]

    return new Term(
        defHigh_valiryan,
        defPortuguese,
        defClassification,
        defVerbalTime,
        defGender
    )

}

export default getTermOfCard