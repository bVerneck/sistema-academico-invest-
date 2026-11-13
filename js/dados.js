const alunosIniciais = [
    {
        id: 1,
        nome: "Ana Paula Ribeiro",
        cpf: "012.345.678-90",
        email: "ana.ribeiro@email.com",
        nascimento: "",
        telefone: "",
        cidade: "",
        estado: "",
        status: "ativo"
    },
    {
        id: 2,
        nome: "Carlos Eduardo Lima",
        cpf: "123.456.789-01",
        email: "carlos.lima@email.com",
        nascimento: "",
        telefone: "",
        cidade: "",
        estado: "",
        status: "ativo"
    },
    {
        id: 3,
        nome: "Mariana Souza",
        cpf: "234.567.890-12",
        email: "mariana.souza@email.com",
        nascimento: "",
        telefone: "",
        cidade: "",
        estado: "",
        status: "inativo"
    }
];

const cursosIniciais = [
    {
        id: 1,
        nome: "Ciência da Computação",
        codigo: "CC001",
        duracao: 8,
        turno: "noturno",
        status: "ativo"
    },
    {
        id: 2,
        nome: "Análise e Desenvolvimento de Sistemas",
        codigo: "ADS001",
        duracao: 5,
        turno: "noturno",
        status: "ativo"
    },
    {
        id: 3,
        nome: "Sistemas de Informação",
        codigo: "SI001",
        duracao: 8,
        turno: "matutino",
        status: "inativo"
    }
];

const matriculasIniciais = [
    {
        id: 2026001,
        alunoId: 1,
        cursoId: 1,
        data: "2026-02-02",
        situacao: "ativa"
    },
    {
        id: 2026002,
        alunoId: 2,
        cursoId: 2,
        data: "2026-02-03",
        situacao: "ativa"
    },
    {
        id: 2026003,
        alunoId: 3,
        cursoId: 3,
        data: "2026-02-04",
        situacao: "trancada"
    }
];

const usuariosIniciais = [
    {
        id: 1,
        nome: "Josemar Cristiano",
        perfil: "administrador",
        status: "ativo"
    },
    {
        id: 2,
        nome: "Patrícia Gomes",
        perfil: "secretaria",
        status: "ativo"
    },
    {
        id: 3,
        nome: "Rafael Antunes",
        perfil: "professor",
        status: "inativo"
    }
];
