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

    checkBalancing (reference) {
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

    // TODO Implementar método que verifique e balanceie a árvore toda. (atualmente incompleto)
    // balanceAllTree (current) {
    //     if (current == null)
    //         return true

    //     const resultLeft = this.balanceTree(current.left)
    //     const resultRight = this.balanceTree(current.right)

    //     const { isBalanced, desbTermSide } = this.checkBalancing(current)
    //     if (!isBalanced)
    //         return false

    //     return resultLeft && resultRight

    // }

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