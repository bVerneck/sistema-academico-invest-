# Atividade Avaliativa — Programação Web I

## Sistema de Gerenciamento Acadêmico — Aula 11

### 1. Ordem dos arquivos JavaScript

A ordem utilizada nas páginas é:

1. `js/dados.js`
2. `js/storage.js`
3. `js/app.js`

Essa ordem é necessária porque `dados.js` declara os arrays iniciais que serão utilizados pela aplicação. Em seguida, `storage.js` define as constantes e funções de persistência. Por último, `app.js` carrega os registros, manipula os dados e atualiza a interface. Se `app.js` fosse carregado antes dos outros arquivos, poderia tentar utilizar variáveis ou funções que ainda não foram declaradas.

### 2. Por que um objeto não é armazenado diretamente no LocalStorage?

O Web Storage armazena valores no formato de texto. Quando um objeto é passado diretamente para `localStorage.setItem()`, ele é convertido para uma representação textual comum, que não preserva sua estrutura. Para manter as propriedades e os valores do objeto, é necessário utilizar `JSON.stringify()` antes de salvar e `JSON.parse()` depois de recuperar.

### 3. Serialização

Serialização é a conversão de um objeto ou array JavaScript em uma string JSON. No projeto, essa operação é realizada por `JSON.stringify()` antes de salvar os dados no LocalStorage.

### 4. Desserialização

Desserialização é a conversão de uma string JSON de volta para um objeto ou array JavaScript. No projeto, essa operação é realizada por `JSON.parse()` depois que os dados são recuperados do LocalStorage.

### 5. Por que utilizar o prefixo `academico_` nas chaves?

O prefixo identifica que as chaves pertencem ao Sistema Acadêmico e reduz o risco de conflito com outras aplicações que utilizem o mesmo armazenamento do navegador. As chaves ficam organizadas como `academico_alunos`, `academico_cursos`, `academico_matriculas` e `academico_usuarios`.

### 6. Por que não armazenar o total de alunos separadamente?

O total pode ser calculado diretamente com `alunos.length`. Salvar o total separadamente criaria uma informação duplicada que poderia ficar desatualizada quando um aluno fosse cadastrado ou removido. O Dashboard deve apresentar os valores calculados a partir dos arrays carregados.

### 7. Fluxo do cadastro de aluno

O formulário recebe os dados digitados pelo usuário. O evento de envio utiliza `preventDefault()` para impedir o recarregamento automático, cria o objeto do aluno, adiciona o registro ao array com `push()`, salva o array com `salvarDados()` e, por fim, atualiza a listagem. O LocalStorage recebe uma string JSON produzida por `JSON.stringify()`.

### 8. Para que serve `try...catch`?

O bloco `try` executa uma operação que pode gerar uma exceção. Se ocorrer um erro, o fluxo passa para o bloco `catch`, que permite tratar a situação sem interromper toda a aplicação. No projeto, ele protege principalmente a leitura e a conversão dos dados armazenados. Se o conteúdo não for um JSON válido, a função retorna o valor padrão.

### 9. Quais campos não deveriam ser armazenados no LocalStorage em uma aplicação real?

Não devem ser armazenadas senhas em texto, tokens de autenticação, segredos de sessão, dados bancários, informações de pagamento ou outros dados pessoais sensíveis. O LocalStorage pode ser acessado por scripts executados na mesma origem da aplicação e não substitui um armazenamento seguro no servidor. Nesta atividade, os usuários possuem somente `id`, `nome`, `perfil` e `status`.

### 10. Diferença entre LocalStorage e SessionStorage

1. Após atualizar a página com F5, os dados de ambos permanecem disponíveis.
2. O LocalStorage continua armazenado mesmo depois de fechar a aba ou o navegador, até que seja removido.
3. O SessionStorage fica associado à sessão da aba e é encerrado quando essa aba é fechada.
4. Para os registros acadêmicos desta atividade, o LocalStorage é mais adequado porque os dados precisam continuar disponíveis depois da atualização e do fechamento da página.

### 11. Por que `removeItem()` normalmente é mais seguro do que `clear()`?

`removeItem()` apaga somente a chave informada. Já `clear()` remove todas as chaves do LocalStorage da origem atual, inclusive aquelas que podem pertencer a outras partes do mesmo site. Por isso, remover apenas a chave necessária reduz o risco de apagar dados que não fazem parte da operação.

### 12. A busca deve alterar os dados persistidos?

Não. A busca apenas seleciona quais registros serão exibidos na interface. Ela não cadastra, remove nem modifica os objetos do array original, portanto não precisa chamar `salvarDados()`.

### 13. O filtro deve alterar os dados persistidos?

Não. O filtro modifica somente a visualização dos registros. Os dados originais continuam no array e no LocalStorage sem alterações.

### 14. Regra de persistência

- Cadastro: salvar.
- Remoção: salvar.
- Alteração: salvar.
- Busca: não salvar.
- Filtro: não salvar.

### 15. Diagnóstico de erro 1

Código analisado:

```javascript
localStorage.setItem("alunos", alunos);
```

O problema é que o array está sendo enviado diretamente ao LocalStorage. O armazenamento recebe texto e não preserva corretamente a estrutura do array. A forma adequada é:

```javascript
localStorage.setItem("academico_alunos", JSON.stringify(alunos));
```

### 16. Diagnóstico de erro 2

Código analisado:

```javascript
const alunos = localStorage.getItem("alunos");
alunos.push(novoAluno);
```

O problema é que `getItem()` retorna uma string ou `null`, e não um array JavaScript. É necessário verificar se existe conteúdo e converter o JSON com `JSON.parse()` antes de utilizar métodos de array, como `push()`.

### 17. Diagnóstico de erro 3

Código analisado:

```javascript
JSON.parse("texto inválido");
```

O conteúdo não representa um JSON válido. Por isso, `JSON.parse()` lança uma exceção do tipo `SyntaxError`. A operação deve ser protegida por `try...catch`, permitindo retornar um valor padrão e manter a aplicação funcionando.

### 18. Diagnóstico de erro 4

Foi utilizada a chave `academico_alunos` para salvar e `academico_aluno` para recuperar. Como os nomes são diferentes, o navegador considera que são duas chaves distintas. A recuperação retorna `null` se a segunda chave não existir. As operações precisam utilizar exatamente a mesma constante de chave.

### 19. Diagnóstico de erro 5

Se o cadastro executar `alunos.push(novoAluno)` e atualizar a interface sem chamar `salvarDados()`, a alteração existirá somente na memória JavaScript daquela página. Depois de F5, o array será carregado novamente a partir dos dados persistidos e o novo aluno não estará mais presente.

### 20. Questões teóricas

**1. O que é persistência?**

É a capacidade de manter os dados armazenados para que continuem disponíveis mesmo depois de atualizar ou fechar uma página, conforme o tipo de armazenamento utilizado.

**2. O que é Web Storage?**

É uma API do navegador que permite armazenar dados no formato de chave e valor, utilizando LocalStorage ou SessionStorage.

**3. Qual a diferença entre LocalStorage e SessionStorage?**

O LocalStorage mantém os dados até que sejam removidos. O SessionStorage mantém os dados durante a sessão da aba e é encerrado quando ela é fechada.

**4. O que significa JSON?**

JSON significa JavaScript Object Notation. É um formato textual utilizado para representar e trocar dados estruturados.

**5. Para que serve `JSON.stringify()`?**

Converte um objeto ou array JavaScript em uma string JSON.

**6. Para que serve `JSON.parse()`?**

Converte uma string JSON válida em um objeto ou array JavaScript.

**7. O que é serialização?**

É a conversão de uma estrutura de dados, como objeto ou array, em um formato que pode ser armazenado ou transmitido. Nesta atividade, é feita com `JSON.stringify()`.

**8. O que é desserialização?**

É a conversão dos dados serializados de volta para uma estrutura utilizável pela aplicação. Nesta atividade, é feita com `JSON.parse()`.

**9. O que faz `localStorage.setItem()`?**

Armazena um valor associado a uma chave no LocalStorage. O valor é guardado como texto.

**10. O que faz `localStorage.getItem()`?**

Recupera o valor associado a uma chave. Se a chave não existir, retorna `null`.

**11. O que faz `removeItem()`?**

Remove do armazenamento a chave informada e o valor associado a ela.

**12. Qual o risco de utilizar `clear()`?**

Ele remove todas as chaves do LocalStorage da origem atual, podendo apagar dados que não pertencem à funcionalidade que está sendo executada.

**13. O que acontece quando `getItem()` não encontra uma chave?**

O método retorna `null`. A aplicação deve verificar essa ausência e utilizar um valor padrão, evitando tentar converter ou manipular um valor inexistente.

**14. Por que utilizar constantes para as chaves?**

Para centralizar os nomes, evitar erros de digitação e garantir que as operações de salvar, carregar e remover utilizem as mesmas chaves.

**15. Por que busca e filtro não precisam persistir?**

Porque alteram somente os registros apresentados na tela. Não modificam os dados originais armazenados.

**16. Por que o Dashboard não precisa ser salvo separadamente?**

Porque seus totais são calculados a partir dos arrays de alunos, cursos, matrículas e usuários. Assim, os números são atualizados conforme os registros mudam e não ficam duplicados no armazenamento.

**17. Para que serve `try...catch`?**

Para tratar exceções que podem ocorrer durante a execução de uma operação, permitindo que a aplicação apresente um comportamento alternativo em vez de parar inesperadamente.

**18. Por que LocalStorage não substitui banco de dados?**

Porque é um armazenamento local do navegador, limitado ao dispositivo e à origem, sem os recursos de um banco de dados para controle de acesso, consultas, transações, integridade, compartilhamento entre usuários e cópias centralizadas.

**19. Por que não armazenar senhas no LocalStorage?**

Porque scripts executados na mesma origem podem acessar esses dados. Uma vulnerabilidade como XSS pode permitir que informações armazenadas sejam lidas. Senhas devem ser tratadas no servidor, com armazenamento protegido por técnicas apropriadas de hash e autenticação.

**20. Qual a função do arquivo `storage.js`?**

Centralizar as operações de persistência da aplicação. Ele define as chaves utilizadas e as funções para salvar, carregar e remover dados, evitando repetir a mesma lógica em diferentes páginas.

### 21. Fluxo esperado do cadastro

1. O usuário preenche o formulário.
2. O evento `submit` é executado.
3. `preventDefault()` impede o envio tradicional da página.
4. A aplicação cria o objeto com os valores informados.
5. O objeto é adicionado ao array.
6. `JSON.stringify()` converte o array em texto JSON.
7. `localStorage.setItem()` persiste o conteúdo.
8. A listagem é atualizada para apresentar o novo registro.

### 22. Fluxo esperado na inicialização

1. A página é carregada.
2. A aplicação chama `localStorage.getItem()`.
3. Se existir conteúdo, `JSON.parse()` converte a string JSON.
4. Se não existir conteúdo ou ocorrer erro de conversão, os dados iniciais são utilizados.
5. Os arrays são enviados às funções de renderização.
6. O Dashboard calcula os totais com base nos arrays carregados.

### 23. Ordem dos scripts

Em todas as páginas, os arquivos são incluídos no final do `body`, nesta sequência:

```html
<script src="js/dados.js"></script>
<script src="js/storage.js"></script>
<script src="js/app.js"></script>
```

### 24. Testes práticos sugeridos

1. Abra a aplicação e confira os registros iniciais.
2. Cadastre um aluno e atualize a página.
3. Confira se o aluno continua na listagem.
4. Remova um aluno e atualize a página.
5. Confira se ele não reaparece.
6. Altere o status de um aluno e atualize a página.
7. Pesquise um aluno e aplique o filtro por status.
8. Confira que a busca e o filtro não alteram os dados salvos.
9. Cadastre, altere e remova cursos, matrículas e usuários.
10. Abra o DevTools em Application, Storage e Local Storage para conferir as quatro chaves.
11. Execute o teste de JSON inválido e confira o tratamento no console.
12. Clique em Restaurar dados iniciais na área de alunos.
13. Para testar a restauração geral após `localStorage.clear()`, volte ao Dashboard e clique em Restaurar todos os dados iniciais.

### 25. Observação sobre o armazenamento

Os dados ficam no navegador e no endereço de origem utilizado para abrir o projeto. Ao trocar de navegador, dispositivo ou endereço de origem, o armazenamento não é compartilhado. O LocalStorage utilizado nesta atividade tem finalidade didática e não substitui um banco de dados de uma aplicação real.
