import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

const terms = "../data/terms.json";

app.get("/terms", (req, res) => {
  const dados = fs.readFileSync(terms, "utf-8");
  res.json(JSON.parse(dados));
});


app.get("/terms/:palavra", (req, res) => {
  const dados = fs.readFileSync(terms, "utf-8");
  const arquivo = JSON.parse(dados);

  const busca = req.params.palavra.toLowerCase(); 
  const resultado = arquivo.find(item => item.portuguese.toLowerCase() === busca ); 
  
  if (resultado) { 
    res.json(resultado); 
  } else { 
    res.json({ mensagem: "Termo não encontrado" });
}});


app.post("/terms", (req, res) => {
  const dados = fs.readFileSync(terms, "utf-8");
  const arquivo = JSON.parse(dados);

  const nova = req.body;
  arquivo.push(nova);

  fs.writeFileSync(terms, JSON.stringify(arquivo, null, 2));
  res.json({ mensagem: "Palavra adicionada ", palavra: nova});
});


app.put("/terms/:palavra", (req, res) => {
  const dados = fs.readFileSync(terms, "utf-8");
  const arquivo = JSON.parse(dados);
  const busca = req.params.palavra.toLowerCase();

  const novaLista = arquivo.map(item => {
  if (item.portuguese.toLowerCase() === busca) {
  return req.body; 
  }
  return item;
  });

  fs.writeFileSync(terms, JSON.stringify(novaLista, null, 2));

  res.json({ mensagem: "dado atualizado", dados: req.body });
});



app.delete("/terms/:palavra", (req, res) => {
  const dados = fs.readFileSync(terms, "utf-8");
  let arquivo = JSON.parse(dados);

  const busca = req.params.palavra.toLowerCase().trim();

  const tamanhoAntes = arquivo.length;

  arquivo = arquivo.filter(item =>
    item.portuguese.toLowerCase().trim() !== busca
  );

  if (arquivo.length === tamanhoAntes) {
    return res.json({ mensagem: "Palavra não encontrada." });
  }

  fs.writeFileSync(terms, JSON.stringify(arquivo, null, 2));

  res.json({ mensagem: "Palavra removida." });
});


app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});