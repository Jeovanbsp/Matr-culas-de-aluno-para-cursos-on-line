<template>
  <div class="form-container">
    <h2>Matrícula Online</h2>

    <form @submit.prevent="enviarFormulario">
      <!-- Nome -->
      <div class="campo">
        <label for="nome">Nome Completo:</label>
        <input
          id="nome"
          v-model="nome"
          type="text"
          placeholder="Digite seu nome"
        />
        <p v-if="erros.nome" class="erro">{{ erros.nome }}</p>
      </div>

      <!-- Email -->
      <div class="campo">
        <label for="email">E-mail:</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Digite seu e-mail"
        />
        <p v-if="erros.email" class="erro">{{ erros.email }}</p>
      </div>

      <!-- Curso -->
      <div class="campo">
        <label for="curso">Selecione o curso:</label>
        <select id="curso" v-model="curso">
          <option disabled value="">-- Escolha um curso --</option>
          <option v-for="c in cursos" :key="c">{{ c }}</option>
        </select>
        <p v-if="erros.curso" class="erro">{{ erros.curso }}</p>
      </div>

      <!-- Mensagem de sucesso -->
      <p v-if="mensagemSucesso" class="sucesso">{{ mensagemSucesso }}</p>

      <!-- Botão -->
      <button type="submit" :disabled="carregando">
        {{ carregando ? "Enviando..." : "Enviar Matrícula" }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "FormularioMatricula",
  data() {
    return {
      nome: "",
      email: "",
      curso: "",
      cursos: [], // carregado do backend
      erros: {},
      carregando: false,
      mensagemSucesso: "",
      API_URL: "http://localhost:3000", // endereço do backend
    };
  },
  mounted() {
    // Carrega cursos do backend ao montar o componente
    fetch(`${this.API_URL}/cursos`)
      .then(res => res.json())
      .then(data => {
        this.cursos = data;
      })
      .catch(err => {
        console.error("Erro ao carregar cursos:", err);
      });
  },
  methods: {
    validarFormulario() {
      this.erros = {};
      this.mensagemSucesso = "";

      if (!this.nome) this.erros.nome = "O nome é obrigatório.";
      if (!this.email.includes("@"))
        this.erros.email = "Digite um e-mail válido.";
      if (!this.curso) this.erros.curso = "Selecione um curso.";

      return Object.keys(this.erros).length === 0;
    },

    async enviarFormulario() {
      if (!this.validarFormulario()) return;

      this.carregando = true;

      const dados = {
        nome: this.nome,
        email: this.email,
        curso: this.curso,
      };

      try {
        const res = await fetch(`${this.API_URL}/matricula`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });

        const resultado = await res.json();

        if (res.status === 201) {
          this.mensagemSucesso = resultado.mensagem;
          this.nome = "";
          this.email = "";
          this.curso = "";
        } else {
          this.mensagemSucesso = resultado.erro || "Erro ao enviar matrícula.";
        }
      } catch (err) {
        console.error(err);
        this.mensagemSucesso = "Erro ao enviar matrícula.";
      } finally {
        this.carregando = false;
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 450px;
  margin: 50px auto;
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.campo {
  margin-bottom: 18px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;
}

input:focus,
select:focus {
  border-color: #42b883;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background: #42b883;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #369870;
}

button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.erro {
  color: #e74c3c;
  font-size: 0.9em;
  margin-top: 4px;
}

.sucesso {
  color: #27ae60;
  font-weight: bold;
  margin-bottom: 12px;
  white-space: pre-line; /* mantém quebras de linha na mensagem */
}
</style>
