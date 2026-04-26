import { AVL } from "../AVL.js"

function fillWordsList (tree, wordsList, order) {

    if (!(tree instanceof AVL)) {
        console.error(`O parâmetro passado em tree ${tree} é inválido!`)
    }

    if (!(wordsList instanceof HTMLElement)) {
        console.error(`O parâmetro passado em wordsList ${wordsList} é inválido!`)
    }

    fillRecursively(tree.root, wordsList, order)

}

function fillRecursively (current, wordsList, order) {
    if (!current) 
        return

    const definitionCard = document.createElement('definition-card')
    definitionCard.setAttribute('card-title', current.portuguese)
    definitionCard.setAttribute('card-sub-word', current.high_valyrian)
    const description = `${current.classification}, ${current.verbal_time}, ${current.gender}`
    definitionCard.setAttribute('card-description', description)

    switch (order) {
        case 'inorder':
            fillRecursively(current.left, wordsList, order)
            wordsList.appendChild(definitionCard)
            fillRecursively(current.right, wordsList, order)    
            break
        
        case 'preorder':
            wordsList.appendChild(definitionCard)
            fillRecursively(current.left, wordsList, order)
            fillRecursively(current.right, wordsList, order)
            break
        
        case 'postorder':
            fillRecursively(current.left, wordsList, order)
            fillRecursively(current.right, wordsList, order)
            wordsList.appendChild(definitionCard)
            break

    }

}

export default fillWordsList