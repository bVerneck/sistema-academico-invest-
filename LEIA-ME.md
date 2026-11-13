# Sistema Acadêmico — Aula 11

## Como executar

1. Extraia a pasta do projeto.
2. Abra a pasta no Visual Studio Code.
3. Inicie o arquivo `index.html` com a extensão Live Server.
4. Utilize o menu para acessar Dashboard, Alunos, Cursos, Matrículas e Usuários.

## Estrutura

```text
sistema-academico-aula11/
├── index.html
├── alunos.html
├── aluno-form.html
├── cursos.html
├── curso-form.html
├── matriculas.html
├── matricula-form.html
├── usuarios.html
├── usuario-form.html
├── css/
│   └── style.css
├── js/
│   ├── dados.js
│   ├── storage.js
│   └── app.js
├── respostas-atividade.md
└── LEIA-ME.md
```

## Ordem dos scripts

Todas as páginas carregam os arquivos nesta ordem:

1. `dados.js`, que contém os registros iniciais.
2. `storage.js`, que define as chaves e as funções de persistência.
3. `app.js`, que carrega os dados, registra os eventos e atualiza a interface.

Essa ordem garante que as variáveis e funções necessárias já estejam disponíveis quando a aplicação for inicializada.

## Persistência

O sistema utiliza as seguintes chaves:

- `academico_alunos`
- `academico_cursos`
- `academico_matriculas`
- `academico_usuarios`

Os dados são convertidos com `JSON.stringify()` antes de serem armazenados e recuperados com `JSON.parse()`.

## Funcionalidades

- Dashboard com totais calculados a partir dos registros.
- Cadastro, edição e remoção de alunos, cursos, matrículas e usuários.
- Busca e filtro de alunos sem alterar os dados persistidos.
- Alteração de status de aluno com persistência.
- Visualização de detalhes dos alunos.
- Restauração dos dados iniciais dos alunos.
- Restauração de todos os registros iniciais pelo Dashboard.
- Tratamento de conteúdo JSON inválido.
- Geração de identificadores a partir do maior ID existente.
- Usuários armazenados somente com identificador, nome, perfil e status.

## Armazenamento local

Os registros são mantidos no LocalStorage do navegador. Para conferir as chaves, abra as ferramentas de desenvolvedor e acesse Application, Storage e Local Storage.

A aplicação é uma atividade didática e não utiliza servidor ou banco de dados remoto.
