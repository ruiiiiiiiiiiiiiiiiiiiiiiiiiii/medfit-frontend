const API_URL =
"https://back-end-academia-six.vercel.app/alunos";

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
window.location.href = "login.html";
}
if(usuario.tipo === "instrutor"){

    alert(
        "Instrutores não possuem acesso a esta área."
    );

    window.location.href =
    "index.html";
}
// ESCONDER LINKS DO MENU

if(usuario.tipo === "aluno"){

    document.querySelector(
        'a[href="personais.html"]'
    )?.remove();

    document.querySelector(
        'a[href="nota.html"]'
    )?.remove();
}

if(usuario.tipo === "instrutor"){

    document.querySelector(
        'a[href="cadastro.html"]'
    )?.remove();

    document.querySelector(
        'a[href="nota.html"]'
    )?.remove();
}

let tabela;
let modalCadastro;
let btnNovoAluno;
let fecharCadastro;

let modoEdicao = false;
let idEditando = null;
let alunosCache = [];

// ======================
// MENU LATERAL
// ======================

function iniciarMenu() {

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if (!menuBtn || !sidebar || !overlay) return;

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

}

// ======================
// INICIAR
// ======================

window.addEventListener("DOMContentLoaded", () => {

iniciarMenu();

tabela = document.getElementById("tabelaAlunos");

modalCadastro = document.getElementById("modalCadastro");

btnNovoAluno = document.getElementById("btnNovoAluno");

fecharCadastro = document.getElementById("fecharCadastro");

if (usuario.tipo !== "admin" && btnNovoAluno) {
    btnNovoAluno.style.display = "none";
}

if (btnNovoAluno) {
    btnNovoAluno.addEventListener("click", () => {

        limparFormulario();

        modoEdicao = false;
        idEditando = null;

        modalCadastro.style.display = "flex";
    });
}

if (fecharCadastro) {
    fecharCadastro.addEventListener("click", () => {

        modalCadastro.style.display = "none";

        limparFormulario();

        modoEdicao = false;
        idEditando = null;
    });
}

if (modalCadastro) {
    modalCadastro.addEventListener("click", (e) => {

        if (e.target === modalCadastro) {

            modalCadastro.style.display = "none";

            limparFormulario();

            modoEdicao = false;
            idEditando = null;
        }
    });
}

const salvarAlunoBtn = document.getElementById("salvarAluno");

if (salvarAlunoBtn) {
    salvarAlunoBtn.addEventListener("click", cadastrarAluno);
}

carregarAlunos();

});

// ======================
// CARREGAR ALUNOS
// ======================

async function carregarAlunos() {

try {

    const resposta = await fetch(`${API_URL}/alunos`);

    if (!resposta.ok) {
        throw new Error("Erro ao carregar alunos");
    }

    const dados = await resposta.json();

    let alunos = dados.alunos || dados;

    alunosCache = alunos;

    if (usuario.tipo === "aluno") {

        alunos = alunos.filter(
            aluno => aluno.id_aluno == usuario.referencia
        );
    }

    tabela.innerHTML = "";

    alunos.forEach((aluno, index) => {

        let botoes = "";

        if (usuario.tipo === "admin") {

            botoes = `
                <button onclick="abrirEditar(${index})">
                    Editar
                </button>

                <button onclick="deletarAluno(${aluno.id_aluno})">
                    Excluir
                </button>
            `;
        }

        tabela.innerHTML += `
            <tr>

                <td>${aluno.nome || "-"}</td>

                <td>
                    <span
                        class="blur-click"
                        onclick="toggleBlur(this)">
                        ••••••••••
                    </span>

                    <span
                        class="real"
                        style="display:none;">
                        ${aluno.cpf || "-"}
                    </span>
                </td>

                <td>
                    ${formatarData(aluno.data_nascimento)}
                </td>

                <td>
                    ${aluno.sexo || "-"}
                </td>

                <td>
                    ${aluno.telefone || "-"}
                </td>

                <td class="col-endereco">

                    <div class="campo-blur">

                        <span
                            class="blur-click"
                            onclick="toggleBlur(this)">
                            ••••••••••••••••••••
                        </span>

                        <span
                            class="real"
                            style="display:none;">
                            ${aluno.endereco || "-"}
                        </span>

                    </div>

                </td>

                <td>
                    ${aluno.status || "-"}
                </td>

                <td>
                    ${aluno.senha || "-"}
                </td>

                <td>
                    ${botoes}
                </td>

            </tr>
        `;
    });

} catch (erro) {

    console.error(erro);

    alert("Erro ao carregar alunos.");
}

}

// ======================
// EDITAR
// ======================

function abrirEditar(index) {

if (usuario.tipo !== "admin") return;

const aluno = alunosCache[index];

if (!aluno) return;

document.getElementById("nome").value = aluno.nome || "";
document.getElementById("cpf").value = aluno.cpf || "";

document.getElementById("dataNascimento").value =
    aluno.data_nascimento
        ? aluno.data_nascimento.split("T")[0]
        : "";

document.getElementById("sexo").value =
    aluno.sexo || "M";

document.getElementById("telefone").value =
    aluno.telefone || "";

document.getElementById("endereco").value =
    aluno.endereco || "";

document.getElementById("status").value =
    aluno.status || "ativo";

document.getElementById("senha").value =
    aluno.senha || "";

modoEdicao = true;
idEditando = aluno.id_aluno;

modalCadastro.style.display = "flex";

}

// ======================
// SALVAR
// ======================

async function cadastrarAluno() {

if (usuario.tipo !== "admin") return;

const dados = {

    nome:
        document.getElementById("nome").value.trim(),

    cpf:
        document.getElementById("cpf").value.trim(),

    data_nascimento:
        document.getElementById("dataNascimento").value,

    sexo:
        document.getElementById("sexo").value,

    telefone:
        document.getElementById("telefone").value.trim(),

    endereco:
        document.getElementById("endereco").value.trim(),

    status:
        document.getElementById("status").value,

    senha:
        document.getElementById("senha").value
};

if (!dados.nome || !dados.cpf) {

    alert("Preencha Nome e CPF");
    return;
}

try {

    let resposta;

    if (modoEdicao) {

        resposta = await fetch(
            `${API_URL}/alunos/${idEditando}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            }
        );

    } else {

        resposta = await fetch(
            `${API_URL}/alunos`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            }
        );
    }

    const res = await resposta.json();

    if (!resposta.ok) {

        throw new Error(
            res.mensagem || "Erro ao salvar"
        );
    }

    alert(
        res.mensagem || "Salvo com sucesso!"
    );

    modalCadastro.style.display = "none";

    limparFormulario();

    modoEdicao = false;
    idEditando = null;

    carregarAlunos();

} catch (erro) {

    console.error(erro);

    alert(
        erro.message || "Erro ao salvar"
    );
}

}

// ======================
// EXCLUIR
// ======================

async function deletarAluno(id) {

if (usuario.tipo !== "admin") return;

const confirmar = confirm(
    "Deseja realmente excluir este aluno?"
);

if (!confirmar) return;

try {

    const resposta = await fetch(
        `${API_URL}/alunos/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!resposta.ok) {
        throw new Error("Erro ao excluir");
    }

    carregarAlunos();

} catch (erro) {

    console.error(erro);

    alert("Erro ao excluir aluno.");
}

}

// ======================
// LIMPAR
// ======================

function limparFormulario() {

document.getElementById("nome").value = "";
document.getElementById("cpf").value = "";
document.getElementById("dataNascimento").value = "";
document.getElementById("sexo").value = "M";
document.getElementById("telefone").value = "";
document.getElementById("endereco").value = "";
document.getElementById("status").value = "ativo";
document.getElementById("senha").value = "";

}

// ======================
// DATA
// ======================

function formatarData(data) {

if (!data) return "-";

const d = new Date(data);

if (isNaN(d.getTime())) return "-";

return d.toLocaleDateString("pt-BR");

}

// ======================
// BLUR
// ======================

function toggleBlur(element) {

const real = element.nextElementSibling;

if (!real) return;

if (real.style.display === "none") {

    element.style.display = "none";
    real.style.display = "inline";

} else {

    element.style.display = "inline";
    real.style.display = "none";
}

}

document.addEventListener("click", (e) => {

if (e.target.classList.contains("real")) {

    e.target.style.display = "none";

    if (e.target.previousElementSibling) {
        e.target.previousElementSibling.style.display = "inline";
    }
}

});