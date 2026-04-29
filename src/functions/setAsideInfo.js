function setAsideInfo (AVLtree) {

    const treeBreadth = AVLtree.calcBreadth()
    // A contagem da altura é zero-based, ou seja, o primeiro nível é 0.
    const treeHeight = AVLtree.calcHeight(AVLtree.root)

    const breadthSpan = document.getElementById('breadth-span')
    breadthSpan.innerText = ` ${treeBreadth}`

    const heightSpan = document.getElementById('height-span')
    heightSpan.innerText = ` ${treeHeight}`

    console.log(treeBreadth, treeHeight)

}

export default setAsideInfo