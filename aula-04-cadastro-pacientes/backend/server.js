const express = require('express');
const cors = require('cors');

const app = express();


app.use(cors());          
app.use(express.json());  


const pacientes = [
  { id: 1, nome: 'Maria Silva', email: 'maria.silva@email.com', nascimento: '1990-04-12' },
  { id: 2, nome: 'João Pereira', email: 'joao.pereira@email.com', nascimento: '1985-11-30' },
  { id: 3, nome: 'Ana Costa', email: 'ana.costa@email.com', nascimento: '2001-07-08' },
];
let proximoId = 4;


app.get('/pacientes/total', (req, res) => {
  res.json({ total: pacientes.length });
});


app.get('/pacientes', (req, res) => {
  const nomeBuscado = typeof req.query.nome === 'string'
    ? req.query.nome.trim().toLowerCase()
    : '';

  const resultado = nomeBuscado
    ? pacientes.filter((p) => p.nome.toLowerCase().includes(nomeBuscado))
    : pacientes;

  res.json(resultado);
});


app.get('/pacientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const paciente = pacientes.find((p) => p.id === id);

  if (!paciente) {
    return res.status(404).json({ erro: 'Paciente não encontrado' });
  }

  res.json(paciente);
});


app.post('/pacientes', (req, res) => {
  const { nome, email, nascimento } = req.body ?? {};

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof nascimento !== 'string' || !nascimento.trim()
  ) {
    return res.status(400).json({ erro: 'Nome, e-mail e nascimento são obrigatórios' });
  }

 
  const emailJaExiste = pacientes.some(
    (p) => p.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (emailJaExiste) {
    return res.status(409).json({ erro: 'E-mail já cadastrado' });
  }

  const novoPaciente = { id: proximoId++, nome, email, nascimento };
  pacientes.push(novoPaciente);

  res.status(201).json(novoPaciente);
});


app.put('/pacientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const paciente = pacientes.find((p) => p.id === id);

  if (!paciente) {
    return res.status(404).json({ erro: 'Paciente não encontrado' });
  }

  const { nome, email, nascimento } = req.body ?? {};

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof nascimento !== 'string' || !nascimento.trim()
  ) {
    return res.status(400).json({ erro: 'Nome, e-mail e nascimento são obrigatórios' });
  }

  
  const emailDeOutroPaciente = pacientes.some(
    (p) => p.id !== id && p.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (emailDeOutroPaciente) {
    return res.status(409).json({ erro: 'E-mail já cadastrado' });
  }

  paciente.nome = nome;
  paciente.email = email;
  paciente.nascimento = nascimento;

  res.json(paciente);
});


app.delete('/pacientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = pacientes.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Paciente não encontrado' });
  }

  pacientes.splice(indice, 1);

  res.status(204).send(); 
});


const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
