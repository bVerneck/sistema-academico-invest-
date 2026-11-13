function copiarRegistros(registros) {
    return registros.map((registro) => ({ ...registro }));
}

function carregarColecao(chave, dadosIniciais) {
    const dados = carregarDados(chave, dadosIniciais);

    if (!Array.isArray(dados)) {
        return copiarRegistros(dadosIniciais);
    }

    return copiarRegistros(dados.filter((registro) => registro && typeof registro === "object" && !Array.isArray(registro)));
}

let alunos = carregarColecao(STORAGE_KEYS.alunos, alunosIniciais);
let cursos = carregarColecao(STORAGE_KEYS.cursos, cursosIniciais);
let matriculas = carregarColecao(STORAGE_KEYS.matriculas, matriculasIniciais);
let usuarios = carregarColecao(STORAGE_KEYS.usuarios, usuariosIniciais);

function gerarNovoId(colecao = alunos) {
    if (colecao.length === 0) {
        return 1;
    }

    const ids = colecao
        .map((registro) => Number(registro.id))
        .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
        return 1;
    }

    return Math.max(...ids) + 1;
}

function criarElemento(tag, texto, classe) {
    const elemento = document.createElement(tag);

    if (texto !== undefined && texto !== null) {
        elemento.textContent = texto;
    }

    if (classe) {
        elemento.className = classe;
    }

    return elemento;
}

function criarBotao(texto, classe, acao, id) {
    const botao = criarElemento("button", texto, classe);
    botao.type = "button";
    botao.dataset.acao = acao;
    botao.dataset.id = String(id);
    return botao;
}

function criarLink(texto, destino) {
    const link = criarElemento("a", texto, "link-acao");
    link.href = destino;
    return link;
}

function adicionarInformacao(container, rotulo, valor) {
    const paragrafo = criarElemento("p");
    const titulo = criarElemento("strong", rotulo + ": ");
    const conteudo = document.createTextNode(
        valor === undefined || valor === null || valor === "" ? "Não informado" : String(valor)
    );

    paragrafo.append(titulo, conteudo);
    container.appendChild(paragrafo);
}

function adicionarStatus(container, status) {
    const paragrafo = criarElemento("p");
    const etiqueta = criarElemento(
        "span",
        status || "Não informado",
        "status " + (status === "ativo" ? "status-ativo" : "status-inativo")
    );

    paragrafo.append(criarElemento("strong", "Status: "), etiqueta);
    container.appendChild(paragrafo);
}

function renderizarVazio(container, mensagem) {
    container.textContent = "";
    container.appendChild(criarElemento("p", mensagem, "vazio"));
}

function formatarData(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = String(data).split("-");

    if (partes.length !== 3) {
        return data;
    }

    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function formatarOpcao(valor) {
    if (!valor) {
        return "Não informado";
    }

    return String(valor)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function renderizarAlunos(lista = alunos) {
    const container = document.querySelector("#lista-alunos");

    if (!container) {
        return;
    }

    container.textContent = "";

    const contador = document.querySelector("#contador-alunos");

    if (contador) {
        contador.textContent = lista.length + (lista.length === 1 ? " aluno encontrado." : " alunos encontrados.");
    }

    if (lista.length === 0) {
        renderizarVazio(container, "Nenhum aluno encontrado.");
        return;
    }

    lista.forEach((aluno) => {
        const card = criarElemento("article", undefined, "card");
        card.appendChild(criarElemento("h3", aluno.nome));
        adicionarInformacao(card, "CPF", aluno.cpf);
        adicionarInformacao(card, "E-mail", aluno.email);
        adicionarStatus(card, aluno.status);

        const detalhes = document.createElement("details");
        detalhes.appendChild(criarElemento("summary", "Detalhes"));
        adicionarInformacao(detalhes, "Identificador", aluno.id);
        adicionarInformacao(detalhes, "Nascimento", formatarData(aluno.nascimento));
        adicionarInformacao(detalhes, "Telefone", aluno.telefone);
        adicionarInformacao(detalhes, "Cidade", aluno.cidade);
        adicionarInformacao(detalhes, "Estado", aluno.estado);
        card.appendChild(detalhes);

        const acoes = criarElemento("div", undefined, "acoes");
        acoes.appendChild(criarLink("Editar", "aluno-form.html?id=" + encodeURIComponent(aluno.id)));
        acoes.appendChild(
            criarBotao(
                aluno.status === "ativo" ? "Inativar" : "Ativar",
                "botao-secundario",
                "alternar-status-aluno",
                aluno.id
            )
        );
        acoes.appendChild(criarBotao("Remover", "botao-perigo", "remover-aluno", aluno.id));
        card.appendChild(acoes);
        container.appendChild(card);
    });
}

function renderizarCursos() {
    const container = document.querySelector("#lista-cursos");

    if (!container) {
        return;
    }

    if (cursos.length === 0) {
        renderizarVazio(container, "Nenhum curso cadastrado.");
        return;
    }

    container.textContent = "";

    cursos.forEach((curso) => {
        const card = criarElemento("article", undefined, "card");
        card.appendChild(criarElemento("h3", curso.nome));
        adicionarInformacao(card, "Código", curso.codigo);
        adicionarInformacao(card, "Turno", formatarOpcao(curso.turno));
        adicionarInformacao(card, "Duração", curso.duracao + " semestres");
        adicionarStatus(card, curso.status);

        const acoes = criarElemento("div", undefined, "acoes");
        acoes.appendChild(criarLink("Editar", "curso-form.html?id=" + encodeURIComponent(curso.id)));
        acoes.appendChild(criarBotao("Remover", "botao-perigo", "remover-curso", curso.id));
        card.appendChild(acoes);
        container.appendChild(card);
    });
}

function renderizarMatriculas() {
    const container = document.querySelector("#lista-matriculas");

    if (!container) {
        return;
    }

    if (matriculas.length === 0) {
        renderizarVazio(container, "Nenhuma matrícula cadastrada.");
        return;
    }

    container.textContent = "";

    matriculas.forEach((matricula) => {
        const aluno = alunos.find((item) => item.id === Number(matricula.alunoId));
        const curso = cursos.find((item) => item.id === Number(matricula.cursoId));
        const card = criarElemento("article", undefined, "card");

        card.appendChild(criarElemento("h3", "Matrícula " + matricula.id));
        adicionarInformacao(card, "Aluno", aluno ? aluno.nome : "Aluno não encontrado");
        adicionarInformacao(card, "Curso", curso ? curso.nome : "Curso não encontrado");
        adicionarInformacao(card, "Data", formatarData(matricula.data));
        adicionarInformacao(card, "Situação", formatarOpcao(matricula.situacao));

        const acoes = criarElemento("div", undefined, "acoes");
        acoes.appendChild(criarLink("Editar", "matricula-form.html?id=" + encodeURIComponent(matricula.id)));
        acoes.appendChild(criarBotao("Remover", "botao-perigo", "remover-matricula", matricula.id));
        card.appendChild(acoes);
        container.appendChild(card);
    });
}

function renderizarUsuarios() {
    const container = document.querySelector("#lista-usuarios");

    if (!container) {
        return;
    }

    if (usuarios.length === 0) {
        renderizarVazio(container, "Nenhum usuário cadastrado.");
        return;
    }

    container.textContent = "";

    usuarios.forEach((usuario) => {
        const card = criarElemento("article", undefined, "card");
        card.appendChild(criarElemento("h3", usuario.nome));
        adicionarInformacao(card, "Identificador", usuario.id);
        adicionarInformacao(card, "Perfil", formatarOpcao(usuario.perfil));
        adicionarStatus(card, usuario.status);

        const acoes = criarElemento("div", undefined, "acoes");
        acoes.appendChild(criarLink("Editar", "usuario-form.html?id=" + encodeURIComponent(usuario.id)));
        acoes.appendChild(criarBotao("Remover", "botao-perigo", "remover-usuario", usuario.id));
        card.appendChild(acoes);
        container.appendChild(card);
    });
}

function atualizarDashboard() {
    const totalAlunos = document.querySelector("#total-alunos");
    const totalCursos = document.querySelector("#total-cursos");
    const totalMatriculas = document.querySelector("#total-matriculas");
    const totalUsuariosAtivos = document.querySelector("#total-usuarios-ativos");

    if (totalAlunos) {
        totalAlunos.textContent = alunos.length;
    }

    if (totalCursos) {
        totalCursos.textContent = cursos.length;
    }

    if (totalMatriculas) {
        totalMatriculas.textContent = matriculas.length;
    }

    if (totalUsuariosAtivos) {
        totalUsuariosAtivos.textContent = usuarios.filter((usuario) => usuario.status === "ativo").length;
    }
}

function filtrarAlunos() {
    const campoBusca = document.querySelector("#busca-alunos");
    const campoStatus = document.querySelector("#filtro-status-alunos");
    const termo = campoBusca ? normalizarTexto(campoBusca.value.trim()) : "";
    const status = campoStatus ? campoStatus.value : "todos";

    const resultado = alunos.filter((aluno) => {
        const conteudo = normalizarTexto(
            [aluno.nome, aluno.cpf, aluno.email].filter(Boolean).join(" ")
        );
        const correspondeBusca = conteudo.includes(termo);
        const correspondeStatus = status === "todos" || aluno.status === status;

        return correspondeBusca && correspondeStatus;
    });

    renderizarAlunos(resultado);
}

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function alterarStatusAluno(id, novoStatus) {
    const aluno = alunos.find((item) => item.id === Number(id));

    if (!aluno) {
        return;
    }

    aluno.status = novoStatus;

    if (!salvarDados(STORAGE_KEYS.alunos, alunos)) {
        alert("Não foi possível salvar a alteração.");
        return;
    }

    filtrarAlunos();
    atualizarDashboard();
}

function removerAluno(id) {
    const indice = alunos.findIndex((item) => item.id === Number(id));

    if (indice === -1) {
        return;
    }

    const aluno = alunos[indice];
    const possuiMatriculas = matriculas.some((item) => Number(item.alunoId) === aluno.id);
    const confirmacao = possuiMatriculas
        ? "Remover este aluno e as matrículas vinculadas a ele?"
        : "Deseja remover este aluno?";

    if (!confirm(confirmacao)) {
        return;
    }

    alunos.splice(indice, 1);
    matriculas = matriculas.filter((item) => Number(item.alunoId) !== aluno.id);

    const alunosSalvos = salvarDados(STORAGE_KEYS.alunos, alunos);
    const matriculasSalvas = salvarDados(STORAGE_KEYS.matriculas, matriculas);

    if (!alunosSalvos || !matriculasSalvas) {
        alert("Não foi possível concluir a remoção no armazenamento.");
    }

    filtrarAlunos();
    renderizarMatriculas();
    atualizarDashboard();
}

function removerCurso(id) {
    const indice = cursos.findIndex((item) => item.id === Number(id));

    if (indice === -1) {
        return;
    }

    const curso = cursos[indice];
    const possuiMatriculas = matriculas.some((item) => Number(item.cursoId) === curso.id);
    const confirmacao = possuiMatriculas
        ? "Remover este curso e as matrículas vinculadas a ele?"
        : "Deseja remover este curso?";

    if (!confirm(confirmacao)) {
        return;
    }

    cursos.splice(indice, 1);
    matriculas = matriculas.filter((item) => Number(item.cursoId) !== curso.id);

    const cursosSalvos = salvarDados(STORAGE_KEYS.cursos, cursos);
    const matriculasSalvas = salvarDados(STORAGE_KEYS.matriculas, matriculas);

    if (!cursosSalvos || !matriculasSalvas) {
        alert("Não foi possível concluir a remoção no armazenamento.");
    }

    renderizarCursos();
    renderizarMatriculas();
    atualizarDashboard();
}

function removerMatricula(id) {
    const indice = matriculas.findIndex((item) => item.id === Number(id));

    if (indice === -1 || !confirm("Deseja remover esta matrícula?")) {
        return;
    }

    matriculas.splice(indice, 1);

    if (!salvarDados(STORAGE_KEYS.matriculas, matriculas)) {
        alert("Não foi possível salvar a remoção.");
        return;
    }

    renderizarMatriculas();
    atualizarDashboard();
}

function removerUsuario(id) {
    const indice = usuarios.findIndex((item) => item.id === Number(id));

    if (indice === -1 || !confirm("Deseja remover este usuário?")) {
        return;
    }

    usuarios.splice(indice, 1);

    if (!salvarDados(STORAGE_KEYS.usuarios, usuarios)) {
        alert("Não foi possível salvar a remoção.");
        return;
    }

    renderizarUsuarios();
    atualizarDashboard();
}

function restaurarAlunos() {
    alunos = copiarRegistros(alunosIniciais);

    if (!salvarDados(STORAGE_KEYS.alunos, alunos)) {
        alert("Não foi possível restaurar os alunos.");
        return;
    }

    const busca = document.querySelector("#busca-alunos");
    const filtro = document.querySelector("#filtro-status-alunos");

    if (busca) {
        busca.value = "";
    }

    if (filtro) {
        filtro.value = "todos";
    }

    renderizarAlunos(alunos);
    atualizarDashboard();
}

function restaurarDadosIniciais() {
    if (!confirm("Restaurar todos os registros iniciais? Os dados atuais serão substituídos.")) {
        return;
    }

    alunos = copiarRegistros(alunosIniciais);
    cursos = copiarRegistros(cursosIniciais);
    matriculas = copiarRegistros(matriculasIniciais);
    usuarios = copiarRegistros(usuariosIniciais);

    const resultados = [
        salvarDados(STORAGE_KEYS.alunos, alunos),
        salvarDados(STORAGE_KEYS.cursos, cursos),
        salvarDados(STORAGE_KEYS.matriculas, matriculas),
        salvarDados(STORAGE_KEYS.usuarios, usuarios)
    ];

    if (resultados.some((resultado) => !resultado)) {
        alert("Alguns dados não puderam ser restaurados.");
    }

    renderizarAlunos();
    renderizarCursos();
    renderizarMatriculas();
    renderizarUsuarios();
    atualizarDashboard();

    const mensagem = document.querySelector("#mensagem-dashboard");

    if (mensagem) {
        mensagem.textContent = "Dados iniciais restaurados.";
    }
}

function preencherSelect(select, registros, textoInicial, obterTexto) {
    if (!select) {
        return;
    }

    select.textContent = "";

    const opcaoInicial = criarElemento("option", textoInicial);
    opcaoInicial.value = "";
    select.appendChild(opcaoInicial);

    registros.forEach((registro) => {
        const opcao = criarElemento("option", obterTexto(registro));
        opcao.value = registro.id;
        select.appendChild(opcao);
    });

    select.disabled = registros.length === 0;
}

function obterIdDaUrl() {
    return new URLSearchParams(window.location.search).get("id");
}

function configurarFormularioAluno() {
    const form = document.querySelector("#form-aluno");

    if (!form) {
        return;
    }

    const idAtual = obterIdDaUrl();
    const alunoAtual = idAtual ? alunos.find((item) => item.id === Number(idAtual)) : null;
    const titulo = document.querySelector("#titulo-form-aluno");

    if (idAtual && !alunoAtual) {
        alert("Aluno não encontrado.");
        window.location.href = "alunos.html";
        return;
    }

    if (alunoAtual) {
        titulo.textContent = "Alterar Aluno";
        document.querySelector("#aluno-id").value = alunoAtual.id;
        document.querySelector("#aluno-nome").value = alunoAtual.nome || "";
        document.querySelector("#aluno-cpf").value = alunoAtual.cpf || "";
        document.querySelector("#aluno-nascimento").value = alunoAtual.nascimento || "";
        document.querySelector("#aluno-email").value = alunoAtual.email || "";
        document.querySelector("#aluno-telefone").value = alunoAtual.telefone || "";
        document.querySelector("#aluno-cidade").value = alunoAtual.cidade || "";
        document.querySelector("#aluno-estado").value = alunoAtual.estado || "";
        document.querySelector("#aluno-status").value = alunoAtual.status || "ativo";
    }

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const dados = {
            nome: document.querySelector("#aluno-nome").value.trim(),
            cpf: document.querySelector("#aluno-cpf").value.trim(),
            nascimento: document.querySelector("#aluno-nascimento").value,
            email: document.querySelector("#aluno-email").value.trim(),
            telefone: document.querySelector("#aluno-telefone").value.trim(),
            cidade: document.querySelector("#aluno-cidade").value.trim(),
            estado: document.querySelector("#aluno-estado").value.trim().toUpperCase(),
            status: document.querySelector("#aluno-status").value
        };

        const cpfDuplicado = alunos.some(
            (item) => item.cpf === dados.cpf && item.id !== Number(idAtual)
        );

        if (cpfDuplicado) {
            alert("Já existe um aluno cadastrado com este CPF.");
            return;
        }

        if (alunoAtual) {
            const indice = alunos.findIndex((item) => item.id === Number(idAtual));
            alunos[indice] = { ...alunos[indice], ...dados };
        } else {
            alunos.push({ id: gerarNovoId(alunos), ...dados });
        }

        if (!salvarDados(STORAGE_KEYS.alunos, alunos)) {
            alert("Não foi possível salvar o aluno.");
            return;
        }

        window.location.href = "alunos.html";
    });
}

function configurarFormularioCurso() {
    const form = document.querySelector("#form-curso");

    if (!form) {
        return;
    }

    const idAtual = obterIdDaUrl();
    const cursoAtual = idAtual ? cursos.find((item) => item.id === Number(idAtual)) : null;

    if (idAtual && !cursoAtual) {
        alert("Curso não encontrado.");
        window.location.href = "cursos.html";
        return;
    }

    if (cursoAtual) {
        document.querySelector("#titulo-form-curso").textContent = "Alterar Curso";
        document.querySelector("#curso-id").value = cursoAtual.id;
        document.querySelector("#curso-nome").value = cursoAtual.nome || "";
        document.querySelector("#curso-codigo").value = cursoAtual.codigo || "";
        document.querySelector("#curso-duracao").value = cursoAtual.duracao || "";
        document.querySelector("#curso-turno").value = cursoAtual.turno || "";
        document.querySelector("#curso-status").value = cursoAtual.status || "ativo";
    }

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const dados = {
            nome: document.querySelector("#curso-nome").value.trim(),
            codigo: document.querySelector("#curso-codigo").value.trim(),
            duracao: Number(document.querySelector("#curso-duracao").value),
            turno: document.querySelector("#curso-turno").value,
            status: document.querySelector("#curso-status").value
        };

        const codigoDuplicado = cursos.some(
            (item) => normalizarTexto(item.codigo) === normalizarTexto(dados.codigo) && item.id !== Number(idAtual)
        );

        if (codigoDuplicado) {
            alert("Já existe um curso cadastrado com este código.");
            return;
        }

        if (cursoAtual) {
            const indice = cursos.findIndex((item) => item.id === Number(idAtual));
            cursos[indice] = { ...cursos[indice], ...dados };
        } else {
            cursos.push({ id: gerarNovoId(cursos), ...dados });
        }

        if (!salvarDados(STORAGE_KEYS.cursos, cursos)) {
            alert("Não foi possível salvar o curso.");
            return;
        }

        window.location.href = "cursos.html";
    });
}

function configurarFormularioMatricula() {
    const form = document.querySelector("#form-matricula");

    if (!form) {
        return;
    }

    const selectAluno = document.querySelector("#matricula-aluno");
    const selectCurso = document.querySelector("#matricula-curso");
    preencherSelect(selectAluno, alunos, "Selecione o aluno", (aluno) => aluno.nome);
    preencherSelect(selectCurso, cursos, "Selecione o curso", (curso) => curso.nome);

    const idAtual = obterIdDaUrl();
    const matriculaAtual = idAtual
        ? matriculas.find((item) => item.id === Number(idAtual))
        : null;

    if (idAtual && !matriculaAtual) {
        alert("Matrícula não encontrada.");
        window.location.href = "matriculas.html";
        return;
    }

    if (matriculaAtual) {
        document.querySelector("#titulo-form-matricula").textContent = "Alterar Matrícula";
        document.querySelector("#matricula-id").value = matriculaAtual.id;
        selectAluno.value = matriculaAtual.alunoId;
        selectCurso.value = matriculaAtual.cursoId;
        document.querySelector("#matricula-data").value = matriculaAtual.data || "";
        document.querySelector("#matricula-situacao").value = matriculaAtual.situacao || "";
    }

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const dados = {
            alunoId: Number(selectAluno.value),
            cursoId: Number(selectCurso.value),
            data: document.querySelector("#matricula-data").value,
            situacao: document.querySelector("#matricula-situacao").value
        };

        const alunoExiste = alunos.some((item) => item.id === dados.alunoId);
        const cursoExiste = cursos.some((item) => item.id === dados.cursoId);

        if (!alunoExiste || !cursoExiste) {
            alert("Selecione um aluno e um curso válidos.");
            return;
        }

        if (matriculaAtual) {
            const indice = matriculas.findIndex((item) => item.id === Number(idAtual));
            matriculas[indice] = { ...matriculas[indice], ...dados };
        } else {
            matriculas.push({ id: gerarNovoId(matriculas), ...dados });
        }

        if (!salvarDados(STORAGE_KEYS.matriculas, matriculas)) {
            alert("Não foi possível salvar a matrícula.");
            return;
        }

        window.location.href = "matriculas.html";
    });
}

function configurarFormularioUsuario() {
    const form = document.querySelector("#form-usuario");

    if (!form) {
        return;
    }

    const idAtual = obterIdDaUrl();
    const usuarioAtual = idAtual ? usuarios.find((item) => item.id === Number(idAtual)) : null;

    if (idAtual && !usuarioAtual) {
        alert("Usuário não encontrado.");
        window.location.href = "usuarios.html";
        return;
    }

    if (usuarioAtual) {
        document.querySelector("#titulo-form-usuario").textContent = "Alterar Usuário";
        document.querySelector("#usuario-id").value = usuarioAtual.id;
        document.querySelector("#usuario-nome").value = usuarioAtual.nome || "";
        document.querySelector("#usuario-perfil").value = usuarioAtual.perfil || "";
        document.querySelector("#usuario-status").value = usuarioAtual.status || "ativo";
    }

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const dados = {
            nome: document.querySelector("#usuario-nome").value.trim(),
            perfil: document.querySelector("#usuario-perfil").value,
            status: document.querySelector("#usuario-status").value
        };

        if (usuarioAtual) {
            const indice = usuarios.findIndex((item) => item.id === Number(idAtual));
            usuarios[indice] = { ...usuarios[indice], ...dados };
        } else {
            usuarios.push({ id: gerarNovoId(usuarios), ...dados });
        }

        if (!salvarDados(STORAGE_KEYS.usuarios, usuarios)) {
            alert("Não foi possível salvar o usuário.");
            return;
        }

        window.location.href = "usuarios.html";
    });
}

function registrarEventos() {
    const busca = document.querySelector("#busca-alunos");
    const filtro = document.querySelector("#filtro-status-alunos");
    const botaoRestaurarAlunos = document.querySelector("#btn-restaurar-alunos");
    const botaoRestaurarTodos = document.querySelector("#btn-restaurar-todos");

    if (busca) {
        busca.addEventListener("input", filtrarAlunos);
    }

    if (filtro) {
        filtro.addEventListener("change", filtrarAlunos);
    }

    if (botaoRestaurarAlunos) {
        botaoRestaurarAlunos.addEventListener("click", restaurarAlunos);
    }

    if (botaoRestaurarTodos) {
        botaoRestaurarTodos.addEventListener("click", restaurarDadosIniciais);
    }

    const listaAlunos = document.querySelector("#lista-alunos");

    if (listaAlunos) {
        listaAlunos.addEventListener("click", (evento) => {
            const botao = evento.target.closest("button[data-acao]");

            if (!botao) {
                return;
            }

            const id = Number(botao.dataset.id);

            if (botao.dataset.acao === "alternar-status-aluno") {
                const aluno = alunos.find((item) => item.id === id);

                if (aluno) {
                    alterarStatusAluno(id, aluno.status === "ativo" ? "inativo" : "ativo");
                }
            }

            if (botao.dataset.acao === "remover-aluno") {
                removerAluno(id);
            }
        });
    }

    const listaCursos = document.querySelector("#lista-cursos");

    if (listaCursos) {
        listaCursos.addEventListener("click", (evento) => {
            const botao = evento.target.closest("button[data-acao]");

            if (botao && botao.dataset.acao === "remover-curso") {
                removerCurso(Number(botao.dataset.id));
            }
        });
    }

    const listaMatriculas = document.querySelector("#lista-matriculas");

    if (listaMatriculas) {
        listaMatriculas.addEventListener("click", (evento) => {
            const botao = evento.target.closest("button[data-acao]");

            if (botao && botao.dataset.acao === "remover-matricula") {
                removerMatricula(Number(botao.dataset.id));
            }
        });
    }

    const listaUsuarios = document.querySelector("#lista-usuarios");

    if (listaUsuarios) {
        listaUsuarios.addEventListener("click", (evento) => {
            const botao = evento.target.closest("button[data-acao]");

            if (botao && botao.dataset.acao === "remover-usuario") {
                removerUsuario(Number(botao.dataset.id));
            }
        });
    }
}

function inicializarAplicacao() {
    renderizarAlunos();
    renderizarCursos();
    renderizarMatriculas();
    renderizarUsuarios();
    atualizarDashboard();
    registrarEventos();
    configurarFormularioAluno();
    configurarFormularioCurso();
    configurarFormularioMatricula();
    configurarFormularioUsuario();
}

inicializarAplicacao();
