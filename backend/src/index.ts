import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Habilita JSON no corpo das requisições
app.use(cors());
app.use(express.json());

// Lista de cursos (simula banco de dados)
const cursos = ["JavaScript", "Python", "Vue.js", "Java"];

// Interface TypeScript para matrícula
interface Matricula {
  nome: string;
  email: string;
  curso: string;
}

// Rota GET /cursos
app.get("/cursos", (req: Request, res: Response) => {
  res.status(200).json(cursos);
});

// Rota POST /matricula
app.post("/matricula", (req: Request, res: Response) => {
  const dados: Matricula = req.body;

  // Validação básica
  if (!dados.nome || !dados.email.includes("@") || !dados.curso) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }

  // Aqui você poderia salvar no banco (simulação)
  console.log("Matrícula recebida:", dados);

  return res.status(201).json({ mensagem: "Matrícula criada com sucesso" });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
