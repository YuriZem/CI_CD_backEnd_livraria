📘 API Livraria — Node.js + Express + MongoDB
🧩 Visão Geral

Esta API foi desenvolvida em Node.js com o framework Express, utilizando o MongoDB como banco de dados.
O projeto implementa operações básicas de CRUD (Create, Read, Update, Delete) para gerenciamento de livros.

O objetivo é demonstrar uma aplicação back-end funcional com boas práticas, conexão assíncrona com banco de dados e integração em CI/CD (GitHub Actions).

⚙️ Tecnologias Utilizadas

Node.js 20+

Express

Mongoose

MongoDB Atlas

Jest (testes automatizados)

GitHub Actions (CI/CD)

🔌 Conexão com o Banco de Dados
const conect = await dbConnect();

conect.on("error", (error) => {
  console.log("Erro de conexão !!!!!", error);
});

conect.once("open", () => {
  console.log("Conexão com o banco feita com sucesso !!!!!");
});


Descrição:

O arquivo dbConnect.js realiza a conexão com o MongoDB Atlas.

Quando a conexão é bem-sucedida, exibe no console:
Conexão com o banco feita com sucesso !!!!!

Caso ocorra erro:
Erro de conexão !!!!! <mensagem de erro>

🖥️ Inicialização do Servidor
const app = express();
app.use(express.json());


Cria a instância do servidor Express.

Habilita o uso de JSON nas requisições (app.use(express.json())).

📚 Rotas da API
🟢 GET /

Rota raiz — retorna uma mensagem simples confirmando que o servidor está ativo.

Resposta:

"Curso de Node.js com Express"

🟢 GET /livros

Retorna a lista de todos os livros cadastrados no banco.

Comportamento:

200 OK → Retorna array de livros.

404 Not Found → Nenhum livro encontrado.

500 Internal Server Error → Falha ao acessar o banco.

Exemplo de resposta (200):

[
  { "_id": "675fbbe02f13b4567890abcd", "titulo": "O Hobbit", "autor": "J.R.R. Tolkien" },
  { "_id": "675fbbf72f13b4567890abce", "titulo": "1984", "autor": "George Orwell" }
]

🟢 GET /livros/:id

Busca um livro pelo seu id.

⚠️ Observação: Esta rota usa uma função auxiliar buscaLivro() que ainda precisa ser implementada.
Atualmente, ela acessa uma variável livros local, usada apenas como exemplo.

🟢 POST /add_livros

Cria um novo livro no banco.

Entrada:

{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis"
}


Respostas:

201 Created → Livro criado com sucesso.

500 Internal Server Error → Erro ao adicionar livro.

Exemplo:

{
  "_id": "675fbc102f13b4567890abcf",
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "__v": 0
}

🟢 PUT /livros/:id

Atualiza o título de um livro.

⚠️ Atualmente, a rota atualiza apenas o campo titulo em uma lista local.
Recomendado adaptar para usar o método livro.findByIdAndUpdate() do Mongoose.

🟢 DELETE /livros/:id

Remove um livro da lista.

⚠️ Assim como o PUT, esta rota ainda utiliza um array local (livros) e não o banco real.

🧠 Melhorias Futuras

Implementar a função buscaLivro(id) para consultas reais no banco.

Adaptar PUT e DELETE para operações Mongoose.

Adicionar autenticação JWT e middleware de validação.

Criar documentação em Swagger/OpenAPI.

🧪 Exemplo de Execução Local
# Instalar dependências
npm install

# Rodar servidor local
npm start

# Testar API
http://localhost:3000/livros

🌐 Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto:

DB_CONNECTION_STRING=mongodb+srv://<usuario>:<senha>@cluster0.dnsp8l8.mongodb.net/
PORT=3000

🚀 CI/CD

O pipeline no GitHub Actions executa:

Instalação de dependências (npm install);

Execução de testes automatizados (npm test);

[![Deploy Automático - Render](https://github.com/YuriZem/Alura-node-js-api-rest-express-mongodb/actions/workflows/cd.yml/badge.svg)](https://github.com/YuriZem/Alura-node-js-api-rest-express-mongodb/actions)



Deploy automático em ambiente Render.

👨‍💻 Autor

Yuri Vinicius
Projeto desenvolvido para fins acadêmicos, como demonstração de CI/CD e desenvolvimento back-end com Node.js e MongoDB.
