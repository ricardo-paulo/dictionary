import { Term } from '../AVL.js';

async function fillTermsTree (AVLtree) {
    
    await fetch('http://localhost:3000/terms')
        .then(response => response.json())
        .then(data => {
            data.forEach(term => {
                const parsedTerm = new Term (
                    term.high_valyrian, term.portuguese, term.classification, 
                    term.verbal_time, term.gender)
            
            
                AVLtree.addTerm(parsedTerm)
            });
        })
        .catch(err => {
            console.log(err)
        })
    
}

export default fillTermsTree