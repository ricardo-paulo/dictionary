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

        if (typeof reference == 'string') {
            reference = this.searchTerm(reference, 'portuguese')
            if (!reference) {
                return null
            }
        }

        if (!(reference instanceof Term)) {
            console.error(`O parâmetro (reference) ${reference} passado é inválido!`)
        }


        return this.#checkBalancingRecursively(reference)
    }

    #checkBalancingRecursively (reference) {
        const bf = AVL.calcBF(reference)
        const isBalanced = Math.abs(bf) <= 1
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

    balanceUp (reference) {
        if (reference == null) 
            return

        const { isBalanced, desbTermSide } = this.checkBalancing(reference)

        if (!isBalanced) {
            this.#rotate(reference, desbTermSide)
        }

        this.balanceUp(reference.parent)
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
                this.balanceUp(current)
            } else {
                this.#addTermRecursively(newTerm, current.left)
            }
        } else {
            if (current.right === null) {
                current.right = newTerm
                newTerm.parent = current
                this.balanceUp(current)
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
    
    //Retorna o sucessor, o precedessor ou null.
    findAdjacent (term, sucessor = true) {
        if (typeof term == 'string')
            term = this.searchTerm(term, 'portuguese')

        if (!(term instanceof Term)) {
            console.error(`O parâmetro (term) ${term} é inválido!`)
            return null
        }

        if (term.right && sucessor) {
            return this.getLastTerm(term.right, 'left')
        } else {
            return this.getLastTerm(term.left, 'right')
        }

        return null
    }

    deleteTerm (target) {
        if (typeof target == 'string')
            target = this.searchTerm(target, 'portuguese')
        
        if (!(target instanceof Term)) {
            console.error(`O parâmetro (target) ${target} passado é inválido.`)
            return
        }

        let childrenCount = 0
        if (target.left)
            childrenCount++
        if (target.right)
            childrenCount++
        
        let substitute = null
        switch (childrenCount) {

            // O termo a ocupar o lugar do termo será seu sucessor.
            case 2:
                const sucessor = this.findAdjacent(target)
                if (sucessor) {
                    substitute = sucessor
                } else {
                    substitute = this.findAdjacent(target, false)
                } 
                break
            
            // O termo que irá ocupar o lugar do termo a ser deletado vai ser um filho, de forma direta.
            case 1:
                if (target.left) {
                    substitute = target.left
                } else {
                    substitute = target.right
                }
                break
        }

        // Define o lado que o alvo ocupa no seu pai (se tiver).
        let targetSideOnParent = null
        if (target != this.root && target.parent.left == target) {
            targetSideOnParent = 'left'
        } else if (target != this.root && target.parent.right == target) {
            targetSideOnParent = 'right'
        }

        if (substitute) {
            
            if (childrenCount == 2) {
                target.classification = substitute.classification
                target.gender = substitute.gender
                target.high_valyrian = substitute.high_valyrian
                target.portuguese = substitute.portuguese
                target.verbal_time = substitute.verbal_time

                this.balanceUp(substitute.parent)
                this.deleteTerm(substitute)
            } else {
                if (targetSideOnParent) {
                    target.parent[targetSideOnParent] = substitute
                    substitute.parent = target.parent
                } else {
                    this.root = substitute
                    substitute.parent = null
                }

                this.balanceUp(substitute.parent)
            }

        } else {

            if (!targetSideOnParent) {
                this.root = null
            } else {
                target.parent[targetSideOnParent] = null
                this.balanceUp(target.parent)
            }

        }

    }

    updateTerm (term, updatedTerm) {
        if (typeof term == 'string') {
            term = this.searchTerm(term, 'portuguese')
        }

        if (!(term instanceof Term)) {
            console.error(`O parâmetro (term) ${term} é inválido!`)
            return
        }
        
        if (!(updatedTerm instanceof Term)) {
            console.error(`O parâmetro (updatedTerm) ${updatedTerm} é inválido!`)
            return
        }

        if ((term.portuguese != updatedTerm.portuguese) ||
        term.high_valyrian != updatedTerm.high_valyrian) {

            this.deleteTerm(term)
            this.addTerm(updatedTerm)

        } else {

            term.classification = updatedTerm.classification
            term.gender = updatedTerm.gender
            term.verbal_time = updatedTerm.verbal_time

        }

    }

    getLastTerm (current, direction) {
        if (current[direction] == null) {
            return current
        }

        return this.getLastTerm(current[direction], direction)
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