async function setRandomDef () {

    const randomDefDiv = document.getElementById('random-definition')
    const termsArray = []

    await fetch('http://localhost:3000/api/terms')
        .then(response => response.json())
        .then(data => {

            const termIndex = Math.trunc(Math.random() * (data.length - 1))
            const randomTerm = data[termIndex]

            const randomTermCard = document.createElement('definition-card')
            
            randomTermCard.setAttribute('card-title', randomTerm.portuguese)
            randomTermCard.setAttribute('card-sub-word', randomTerm.high_valyrian)
            const description = `${randomTerm.classification}, ${randomTerm.verbal_time}, ${randomTerm.gender}`
            randomTermCard.setAttribute('card-description', description)
            randomDefDiv.appendChild(randomTermCard)
            randomTermCard.querySelector('.dropdown').remove()

        })
        .catch(err => {
            console.log(err)
        })

}

export default setRandomDef