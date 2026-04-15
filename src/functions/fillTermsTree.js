import terms from '../../data/data.json' with {type: 'json'}
import { Term } from '../AVL.js';

function fillTermsTree (AVLtree) {
    terms.forEach(term => {
        const parsedTerm = new Term (
            term.high_valyrian, term.portuguese, term.classification, 
            term.verbal_time, term.gender)
    
    
        AVLtree.addTerm(parsedTerm)
    });
}

export default fillTermsTree