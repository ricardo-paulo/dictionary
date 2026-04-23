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

    constructor (empty = false) {
        this.root = null

        if (!empty)
            fillTermsTree(this)
    }

    static calcHeight (reference) {
        const { counter, max } = this.#calcHeightRecursively(reference, 0, 0)
        
        return max

    }
    
    static #calcHeightRecursively (current, counter, max) {
        if (current == null) {
            return {counter, max}
        }
        
        counter++
        if (counter > max) 
            max = counter
        
        const result1 = this.#calcHeightRecursively(current.left, counter, max)
        const result2 = this.#calcHeightRecursively(current.right, counter, max)
        const resultsMajor = result1.max > result2.max ? result1.max : result2.max
        max = max < resultsMajor ? resultsMajor : max
        counter--
        
        return {counter, max}

    }

    static calcBF(reference) {
        const leftHeight = this.calcHeight(reference.left)
        const rightHeight = this.calcHeight(reference.right)
        const bf = leftHeight - rightHeight
        return bf
    }

    static rebuildAsAVL (current, tempAVL = new AVL(true)) {
        if (current == null) 
            return

        this.rebuildAsAVL(current.left, tempAVL)
        this.rebuildAsAVL(current.right, tempAVL)

        current.parent = null
        current.left = null
        current.right = null
        tempAVL.addTerm(current)

        return tempAVL
    }

    checkBalancing (reference) {

        if (typeof reference == 'string') 
            reference = this.searchTerm(reference, 'portuguese')

        if (!(reference instanceof Term)) {
            console.error(`O parâmetro (reference) ${reference} passado é inválido!`)
        }


        return this.checkBalancingRecursively(reference)
    }

    checkBalancingRecursively (reference) {
        const bf = AVL.calcBF(reference)
        const isBalanced = bf >= -1 && bf <= 1
        let desbTermSide = null

        if (!isBalanced) {
            if (bf > -1) {
                desbTermSide = 'left'
            } else {
                desbTermSide = 'right'
            }
        }

        return { isBalanced, desbTermSide }
    }

    checkUpBalancing (reference) {
        if (reference == null) 
            return

        const { isBalanced, desbTermSide } = this.checkBalancing(reference)

        if (!isBalanced) {
            this.#rotate(reference, desbTermSide)
        }

        this.checkUpBalancing(reference.parent)
    }

    // Método que faz rotação dos termos tanto simples quanto dupla.
    #rotate (desbTerm, desbTermSide) {
        if (!(desbTerm instanceof Term)) {
            console.error(`O objeto ${desbTerm} não é um objeto Term.`)
            return
        }
        
        let toRotateChild = desbTerm[desbTermSide]
        
        const bfRotateChild = AVL.calcBF(toRotateChild)
        const doubleRotateCase1 = bfRotateChild > 0 && desbTermSide == 'right'
        const doubleRotateCase2 = bfRotateChild < 0 && desbTermSide == 'left'
        if (doubleRotateCase1) {
            this.#rotate(toRotateChild, 'left')
            toRotateChild = desbTerm[desbTermSide]
        } else if (doubleRotateCase2) {
            this.#rotate(toRotateChild, 'right')
            toRotateChild = desbTerm[desbTermSide]
        }

        const rotationDirection = desbTermSide == 'left' ? 'right' : 'left'
        const orphanSubTree = toRotateChild[rotationDirection]
        

        // Se o termo desbalanceado for a raiz
        if (desbTerm.parent == null) {

            this.root = toRotateChild
            this.root.parent = null
            
            this.root[rotationDirection] = desbTerm
            desbTerm.parent = this.root

            desbTerm[desbTermSide] = orphanSubTree
            
            if (orphanSubTree) {
                orphanSubTree.parent = desbTerm
            }        

        } else {

            const desbTermParentSide = desbTerm.parent.left == desbTerm ? 'left' : 'right'
            
            desbTerm.parent[desbTermParentSide] = toRotateChild
            toRotateChild.parent = desbTerm.parent
            
            if (desbTerm[desbTermSide]) {
                desbTerm[desbTermSide] = toRotateChild[rotationDirection]
            }

            desbTerm.parent = toRotateChild

            toRotateChild[rotationDirection] = desbTerm
            
        }

    }

    addTerm (newTerm) {
        if (!(newTerm instanceof Term)) {
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
                this.checkUpBalancing(current)
            } else {
                this.#addTermRecursively(newTerm, current.left)
            }
        } else {
            if (current.right === null) {
                current.right = newTerm
                newTerm.parent = current
                this.checkUpBalancing(current)
            } else {
                this.#addTermRecursively(newTerm, current.right)
            }
        }
    }

    searchTerm (target, language) {
        if (typeof target != 'string') {
            console.error(`O parâmetro (target) "${target}" passado não é uma string!`)
            return
        }

        if (typeof language != 'string') {
            console.error(`O parâmetro (language) "${language}" passado não é uma string!`)
        }

        return this.#searchRecursively(this.root, target, language)
    }

    #searchRecursively (current, target, language) {
        if (current === null) {
            return null
        }

        if (current[language] == target)
            return current

        const resultLeft = this.#searchRecursively(current.left, target, language)
        if (resultLeft)
            return resultLeft

        const resultRight = this.#searchRecursively(current.right, target, language)
        if (resultRight) {
            return resultRight
        }

        return null
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