const usuario = JSON.parse(
localStorage.getItem("usuario")
);

if (!usuario) {

window.location.href = "login.html";

}

// APENAS ADMIN ACESSA NOTAS
if (usuario.tipo !== "admin") {

window.location.href = "index.html";

}

// ESCONDER LINKS DO MENU

if(usuario.tipo === "aluno"){

document.querySelector(
    'a[href="personais.html"]'
)?.remove();

document.querySelector(
    'a[href="notas.html"]'
)?.remove();

}

if(usuario.tipo === "instrutor"){

document.querySelector(
    'a[href="cadastro.html"]'
)?.remove();

document.querySelector(
    'a[href="notas.html"]'
)?.remove();

}

const API =
"https://back-end-academia-six.vercel.app/notas";

const form =
document.getElementById("formNota");

const lista =
document.getElementById("listaNotas");

const btnSalvar =
document.getElementById("btnSalvar");

const btnCancelar =
document.getElementById("btnCancelar");

let editandoId = null;

/* =========================
CARREGAR NOTAS
========================= */

async function carregarNotas() {

try {

const res =
await fetch("https://back-end-academia-six.vercel.app/notas");

if (!res.ok) {
    throw new Error(
        "Erro ao carregar notas"
    );
}

const data =
await res.json();

lista.innerHTML = "";

data.notas.forEach(nota => {

    const div =
    document.createElement("div");

    div.className =
    `nota ${nota.prioridade}`;

    div.innerHTML = `

        <h3>${nota.titulo}</h3>

        <p>
            ${nota.descricao}
        </p>

        <small>
            Tipo:
            ${nota.tipo}
        </small>

        <small>
            Prioridade:
            ${nota.prioridade}
        </small>

        <small>
            Setor:
            ${nota.setor || "N/A"}
        </small>

        <div class="acoes">

            <button
                class="editar-btn"
                onclick="editarNota(
                    ${nota.id},
                    ${JSON.stringify(nota.titulo)},
                    ${JSON.stringify(nota.descricao)},
                    ${JSON.stringify(nota.tipo)},
                    ${JSON.stringify(nota.prioridade)},
                    ${JSON.stringify(nota.setor || "")}
                )">

                Editar

            </button>

            <button
                class="delete-btn"
                onclick="excluirNota(${nota.id})">

                Excluir

            </button>

        </div>
    `;

    lista.appendChild(div);
});

} catch (erro) {

console.error(erro);

lista.innerHTML = `

    <div class="nota">

        <h3>
            Erro
        </h3>

        <p>
            Não foi possível carregar as notas.
        </p>

    </div>

`;

}

}

/* =========================
EDITAR
========================= */

function editarNota(
id,
titulo,
descricao,
tipo,
prioridade,
setor
) {

document.getElementById("titulo")
.value = titulo;

document.getElementById("descricao")
.value = descricao;

document.getElementById("tipo")
.value = tipo;

document.getElementById("prioridade")
.value = prioridade;

document.getElementById("setor")
.value = setor;

editandoId = id;

btnSalvar.textContent =
"Atualizar Nota";

window.scrollTo({
top:0,
behavior:"smooth"
});

}

/* =========================
CANCELAR
========================= */

btnCancelar.addEventListener(
"click",
() => {

form.reset();

editandoId = null;

btnSalvar.textContent =
"Salvar Nota";

}
);

/* =========================
SALVAR
========================= */

form.addEventListener(
"submit",

async (e) => {

e.preventDefault();

const nota = {

    titulo:
    document.getElementById("titulo")
    .value.trim(),

    descricao:
    document.getElementById("descricao")
    .value.trim(),

    tipo:
    document.getElementById("tipo")
    .value,

    prioridade:
    document.getElementById("prioridade")
    .value,

    status:"ativo",

    criado_por:"admin",

    setor:
    document.getElementById("setor")
    .value.trim(),

    visivel_para_todos:true,

    observacoes_internas:""
};

try {

    if (editandoId) {

        await fetch(
            `${API}/${editandoId}`,
            {
                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(nota)
            }
        );

        editandoId = null;

        btnSalvar.textContent =
        "Salvar Nota";

    } else {

        await fetch(
            API,
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(nota)
            }
        );
    }

    form.reset();

    carregarNotas();

} catch (erro) {

    console.error(erro);

    alert(
        "Erro ao salvar nota."
    );
}

}
);

/* =========================
EXCLUIR
========================= */

async function excluirNota(id) {

const confirmar =
confirm(
"Deseja excluir esta nota?"
);

if (!confirmar) {
return;
}

try {

await fetch(
    `${API}/${id}`,
    {
        method:"DELETE"
    }
);

carregarNotas();

} catch (erro) {

console.error(erro);

alert(
    "Erro ao excluir nota."
);

}

}

/* =========================
MENU
========================= */

const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.getElementById("sidebar");

const overlay =
document.getElementById("overlay");

if(menuBtn && sidebar && overlay){

menuBtn.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle("active");

        overlay.classList.toggle("active");
    }
);

overlay.addEventListener(
    "click",
    () => {

        sidebar.classList.remove("active");

        overlay.classList.remove("active");
    }
);

}

/* =========================
INICIAR
========================= */

carregarNotas();