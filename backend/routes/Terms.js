import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const termsRouter = Router()
const termsFilePath = path.resolve('data/terms.json')

termsRouter.get('/terms', (req, res) => {
  const data = fs.readFileSync(termsFilePath, 'utf-8')
  res.json(JSON.parse(data))
})

termsRouter.get('/terms/:portuguese', (req, res) => {
  const data = fs.readFileSync(termsFilePath, 'utf-8')
  const file = JSON.parse(data)

  const searchWord = req.params.portuguese.toLowerCase()
  const result = file.find(item => item.portuguese.toLowerCase() === searchWord)
  
  if (result) { 
    res.json(result)
  } else { 
    res.json({ message: 'Termo não encontrado.' })
}})

termsRouter.post('/terms', (req, res) => {
  const data = fs.readFileSync(termsFilePath, 'utf-8')
  const file = JSON.parse(data)

  const newTerm = req.body
  file.push(newTerm)

  fs.writeFileSync(termsFilePath, JSON.stringify(file, null, 2))
  res.json({ message: 'Palavra adicionada ', term: newTerm})
})

termsRouter.put('/terms', (req, res) => {
  const data = fs.readFileSync(termsFilePath, 'utf-8')
  const file = JSON.parse(data)

  const targetTerm = req.body.before

  const termIndex = file.findIndex(term => {

    return term.portuguese.toLowerCase() == targetTerm.portuguese.toLowerCase()
    && term.high_valyrian.toLowerCase() == targetTerm.high_valyrian.toLowerCase()
    && term.classification.toLowerCase() == targetTerm.classification.toLowerCase()
    && term.verbal_time.toLowerCase() == targetTerm.verbal_time.toLowerCase()
    && term.gender.toLowerCase() == targetTerm.gender.toLowerCase()

  })
  
  if (termIndex >= 0) {
    
    const newTermData = req.body.after
    const foundTerm = file[termIndex]
  
    foundTerm.classification = newTermData.classification.toLowerCase()
    foundTerm.verbal_time = newTermData.verbal_time.toLowerCase()
    foundTerm.gender = newTermData.gender.toLowerCase()
  
    fs.writeFileSync(termsFilePath, JSON.stringify(file, null, 2))
    res.json({ message: 'Termo modificado.', newTerm: req.body.after})

  } else {
    res.json({ message: 'Termo não encontrado.', oldTerm: req.body.before })
  }

})

termsRouter.delete('/terms', (req, res) => {
  const data = fs.readFileSync(termsFilePath, 'utf-8')
  let file = JSON.parse(data)
  const targetTerm = req.body

  const beforeLenght = file.length

  const foundTerm = file.find(term => {
    return term.portuguese.toLowerCase() == targetTerm.portuguese.toLowerCase()
    && term.high_valyrian.toLowerCase() == targetTerm.high_valyrian.toLowerCase()
    && term.classification.toLowerCase() == targetTerm.classification.toLowerCase()
    && term.verbal_time.toLowerCase() == targetTerm.verbal_time.toLowerCase()
    && term.gender.toLowerCase() == targetTerm.gender.toLowerCase()
  })

  if (foundTerm) {

    file.pop(foundTerm)

    fs.writeFileSync(termsFilePath, JSON.stringify(file, null, 2))
    res.json({ message: 'Palavra removida.' })
  } else {
    return res.json({ message: 'Termo não encontrado.' })
  }

})

export { termsRouter }