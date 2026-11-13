const STORAGE_KEYS = Object.freeze({
    alunos: "academico_alunos",
    cursos: "academico_cursos",
    matriculas: "academico_matriculas",
    usuarios: "academico_usuarios"
});

function salvarDados(chave, dados) {
    try {
        localStorage.setItem(chave, JSON.stringify(dados));
        return true;
    } catch (erro) {
        console.error("Erro ao salvar dados.", erro);
        return false;
    }
}

function carregarDados(chave, valorPadrao) {
    try {
        const dados = localStorage.getItem(chave);

        if (dados === null) {
            return valorPadrao;
        }

        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao carregar dados.", erro);
        return valorPadrao;
    }
}

function removerDados(chave) {
    try {
        localStorage.removeItem(chave);
        return true;
    } catch (erro) {
        console.error("Erro ao remover dados.", erro);
        return false;
    }
}
