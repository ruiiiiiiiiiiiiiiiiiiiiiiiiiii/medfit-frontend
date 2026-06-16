const API_URL = "http://localhost:3000";

const usuario = JSON.parse(
localStorage.getItem("usuario")
);

if(!usuario){
    window.location.href = "login.html";
}

if(usuario.tipo === "aluno"){

    alert(
        "Você não possui acesso a esta página."
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
let modal;
let btnNovo;
let fechar;

let modoEdicao = false;
let idEditando = null;

// MENU
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if (menuBtn) {
menuBtn.addEventListener("click", () => {
sidebar.classList.toggle("active");
overlay.classList.toggle("active");
});
}

if (overlay) {
overlay.addEventListener("click", () => {
sidebar.classList.remove("active");
overlay.classList.remove("active");
});
}

window.onload = () => {

tabela = document.getElementById(
    "tabelaInstrutores"
);

modal = document.getElementById(
    "modal"
);

btnNovo = document.getElementById(
    "btnNovo"
);

fechar = document.getElementById(
    "fechar"
);

if (
    btnNovo &&
    usuario.tipo !== "admin"
) {
    btnNovo.style.display = "none";
}

if (btnNovo) {

    btnNovo.onclick = () => {

        limpar();

        modoEdicao = false;

        idEditando = null;

        modal.style.display = "flex";
    };
}

if (fechar) {

    fechar.onclick = () => {

        modal.style.display = "none";
    };
}

carregarInstrutores();

};

// =====================
// CARREGAR
// =====================

async function carregarInstrutores() {

try {

    const res =
    await fetch(
        `${API_URL}/instrutores`
    );

    const dados =
    await res.json();

    let lista =
    dados.instrutores || dados;

    if (
        usuario.tipo ===
        "instrutor"
    ) {

        lista =
        lista.filter(
            i =>
            i.id_instrutor ==
            usuario.referencia
        );
    }

    tabela.innerHTML = "";

    lista.forEach(i => {

        let botoes = "";

        if (
            usuario.tipo ===
            "admin"
        ) {

            botoes = `
                <button
                    class="btn-editar"
                    onclick="abrirEditar(${i.id_instrutor})">
                    Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="deletar(${i.id_instrutor})">
                    Excluir
                </button>
            `;
        }

        tabela.innerHTML += `
            <tr>

                <td>

                    <img
                        class="foto"
                        src="${i.foto || 'https://picsum.photos/120'}"

                        onerror="
                            this.src='https://picsum.photos/120';
                        "
                    >

                </td>

                <td>${i.nome}</td>

                <td>${i.cpf}</td>

                <td>${i.telefone || "-"}</td>

                <td>${i.email || "-"}</td>

                <td>${i.especialidade || "-"}</td>

                <td>
                    R$ ${i.salario || "-"}
                </td>

                <td>
                    ${botoes}
                </td>

            </tr>
        `;
    });

} catch (erro) {

    console.error(erro);

    alert(
        "Erro ao carregar instrutores"
    );
}

}

// =====================
// EDITAR
// =====================

async function abrirEditar(id) {

try {

    const res =
    await fetch(
        `${API_URL}/instrutores`
    );

    const dados =
    await res.json();

    const lista =
    dados.instrutores || dados;

    const instrutor =
    lista.find(
        i =>
        i.id_instrutor == id
    );

    if (!instrutor) return;

    document.getElementById(
        "nome"
    ).value =
    instrutor.nome || "";

    document.getElementById(
        "cpf"
    ).value =
    instrutor.cpf || "";

    document.getElementById(
        "telefone"
    ).value =
    instrutor.telefone || "";

    document.getElementById(
        "email"
    ).value =
    instrutor.email || "";

    document.getElementById(
        "especialidade"
    ).value =
    instrutor.especialidade || "";

    document.getElementById(
        "salario"
    ).value =
    instrutor.salario || "";

    document.getElementById(
        "foto"
    ).value =
    instrutor.foto || "";

    modoEdicao = true;

    idEditando = id;

    modal.style.display = "flex";

} catch (erro) {

    console.error(erro);
}

}

// =====================
// SALVAR
// =====================

async function salvar() {

if (
    usuario.tipo !== "admin"
) {
    return;
}

const dados = {

    nome:
    document.getElementById(
        "nome"
    ).value,

    cpf:
    document.getElementById(
        "cpf"
    ).value,

    telefone:
    document.getElementById(
        "telefone"
    ).value,

    email:
    document.getElementById(
        "email"
    ).value,

    especialidade:
    document.getElementById(
        "especialidade"
    ).value,

    salario:
    document.getElementById(
        "salario"
    ).value,

    foto:
    document.getElementById(
        "foto"
    ).value
};

if (
    !dados.nome ||
    !dados.cpf
) {

    alert(
        "Preencha Nome e CPF"
    );

    return;
}

try {

    if (modoEdicao) {

        await fetch(
            `${API_URL}/instrutores/${idEditando}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(
                    dados
                )
            }
        );

    } else {

        await fetch(
            `${API_URL}/instrutores`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(
                    dados
                )
            }
        );
    }

    modal.style.display =
    "none";

    limpar();

    modoEdicao = false;

    idEditando = null;

    carregarInstrutores();

} catch (erro) {

    console.error(erro);

    alert(
        "Erro ao salvar instrutor"
    );
}

}

document.addEventListener(
"click",
e => {

    if (
        e.target.id ===
        "salvar"
    ) {

        salvar();
    }
}

);

// =====================
// EXCLUIR
// =====================

async function deletar(id) {

if (
    usuario.tipo !== "admin"
) {
    return;
}

const confirmar =
confirm(
    "Deseja excluir este instrutor?"
);

if (!confirmar) return;

try {

    await fetch(
        `${API_URL}/instrutores/${id}`,
        {
            method: "DELETE"
        }
    );

    carregarInstrutores();

} catch (erro) {

    console.error(erro);

    alert(
        "Erro ao excluir"
    );
}

}

// =====================
// LIMPAR
// =====================

function limpar() {

document.getElementById(
    "nome"
).value = "";

document.getElementById(
    "cpf"
).value = "";

document.getElementById(
    "telefone"
).value = "";

document.getElementById(
    "email"
).value = "";

document.getElementById(
    "especialidade"
).value = "";

document.getElementById(
    "salario"
).value = "";

document.getElementById(
    "foto"
).value = "";

}

// FECHAR AO CLICAR FORA

window.addEventListener(
"click",
e => {

    if (
        e.target === modal
    ) {

        modal.style.display =
        "none";
    }
}

);