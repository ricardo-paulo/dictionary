import checkBalancing from "./functions/checkBalancing.js"
import fillTermsTree from "./functions/fillTermsTree.js"

class Term {
    
    constructor (high_valyrian, portuguese, classification, verbal_time, gender) {
        this.high_valyrian = high_valyrian
        this.portuguese = portuguese
        this.classification = classification
        this.verbal_time = verbal_time
        this.gender = gender

        this.left = null
        this.right = null
        this.parent = null
    }

}

class AVL {

    constructor () {
        this.root = null

        fillTermsTree(this)
    }

    addTerm (newTerm) {
        if (!newTerm instanceof Term) {
            console.log(`O objeto: ${newTerm}\nNão é um objeto de Term válido.`)
            return
        }

        if (this.root === null) {
            this.root = newTerm
        } else {
            this.#addTermRecursively(newTerm, this.root)
        }

    }

    #addTermRecursively (newTerm, current) {
        const newTermToLeft = newTerm.portuguese <= current.portuguese
        
        if (newTermToLeft) {
            if (current.left === null) {
                current.left = newTerm
                newTerm.parent = current
                checkBalancing(newTerm, current, newTermToLeft)
            } else {
                this.#addTermRecursively(newTerm, current.left)
            }
        } else {
            if (current.right === null) {
                current.right = newTerm
                newTerm.parent = current
                checkBalancing(newTerm, current, newTermToLeft)
            } else {
                this.#addTermRecursively(newTerm, current.right)
            }
        }
    }

    determinateSide (target) {
        
        if (target.parent.left == target) {
            return 'left'
        } else if (target.parent.right == target) {
            return 'right'
        } else {
            return 'no-found'
        }

    }

    rotateTerm (anchorTerm, toLeft = true) {
        
        const anchorRotationDirection = this.determinateSide(anchorTerm)
        const childRotationDirection = anchorRotationDirection == 'left' ? 'right' : 'left'

        if (toLeft) {
            anchorTerm.parent[anchorRotationDirection] = anchorTerm[childRotationDirection]
        } else {
            anchorTerm.parent[anchorRotationDirection] = anchorTerm[childRotationDirection]
        }

    }

    print (current, order) {
        if (current === null)
            return

        switch (order) {
            case 'preorder':
                console.log(current.portuguese)
                this.print(current.left, order)
                this.print(current.right, order)
                break
            
            case 'postorder':
                this.print(current.left, order)
                this.print(current.right, order)
                console.log(current.portuguese)
                break

            case 'inorder':
                this.print(current.left, order)
                console.log(current.portuguese)
                this.print(current.right, order)
                break
            
            default:
                console.error('Entrada de ordem inválida!')
        }
    }
}

export {AVL, Term}