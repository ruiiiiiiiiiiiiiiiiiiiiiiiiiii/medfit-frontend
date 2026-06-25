const API_URL =
"https://back-end-academia-six.vercel.app/planos";

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);

if(!usuario){

    window.location.href =
    "login.html";
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

let planoEditandoId = null;

// carregar planos
async function carregarPlanos(){

    const resposta =
    await fetch(API_URL);

    const dados =
    await resposta.json();

    const container =
    document.querySelector(
        ".planosContainer"
    );

    container.innerHTML = "";

    dados.planos.forEach(plano => {

        let botoes = "";

        // somente admin
        if(usuario.tipo === "admin"){

            botoes = `

                <button class="btn-editar"

                    onclick='editarPlano(
                        ${JSON.stringify(plano)}
                    )'>

                    Editar

                </button>

                <button class="btn-excluir"

                    onclick="
                        excluirPlano(
                            ${plano.id_plano}
                        )
                    ">

                    Excluir

                </button>
            `;
        }

        const card =
        document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

            <h3>Plano</h3>

            <p class="preco">

                R$
                ${Number(plano.valor)
                .toFixed(2)}

            </p>

            <ul>

                <li>
                    ${plano.descricao}
                </li>

                <li>

                    Duração:
                    ${plano.duracao_meses}
                    meses

                </li>

            </ul>

            <div class="botoes">

                ${botoes}

            </div>
        `;

        container.appendChild(card);
    });

    // esconder botão novo plano
    if(usuario.tipo !== "admin"){

        const btnNovo =
        document.getElementById(
            "btnNovoPlano"
        );

        if(btnNovo){

            btnNovo.style.display =
            "none";
        }
    }
}

// salvar
async function salvarPlano(){

    if(usuario.tipo !== "admin"){
        return;
    }

    const valor =
    document.getElementById("valor")
    .value;

    const duracao =
    document.getElementById("duracao")
    .value;

    const descricao =
    document.getElementById("descricao")
    .value;

    if(
        !valor ||
        !duracao ||
        !descricao
    ){

        alert("Preencha tudo!");
        return;
    }

    if(planoEditandoId){

        await fetch(
            `${API_URL}/${planoEditandoId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    valor,

                    duracao_meses:
                    duracao,

                    descricao
                })
            }
        );

        planoEditandoId = null;

    } else {

        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                valor,

                duracao_meses:
                duracao,

                descricao
            })
        });
    }

    fecharModal();

    carregarPlanos();
}

// editar
function editarPlano(plano){

    if(usuario.tipo !== "admin"){
        return;
    }

    abrirModal();

    document.getElementById("valor")
    .value = plano.valor;

    document.getElementById("duracao")
    .value = plano.duracao_meses;

    document.getElementById("descricao")
    .value = plano.descricao;

    planoEditandoId =
    plano.id_plano;
}

// excluir
async function excluirPlano(id){

    if(usuario.tipo !== "admin"){
        return;
    }

    if(
        !confirm("Excluir plano?")
    ) return;

    await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE"
        }
    );

    carregarPlanos();
}

// modal
function abrirModal(){

    if(usuario.tipo !== "admin"){
        return;
    }

    document.getElementById("modal")
    .style.display = "flex";
}

function fecharModal(){

    document.getElementById("modal")
    .style.display = "none";

    document.getElementById("valor")
    .value = "";

    document.getElementById("duracao")
    .value = "";

    document.getElementById("descricao")
    .value = "";
}

// iniciar
document.addEventListener(
    "DOMContentLoaded",
    carregarPlanos
);
const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.getElementById("sidebar");

const overlay =
document.getElementById("overlay");

if(menuBtn){

menuBtn.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "active"
        );

        overlay.classList.toggle(
            "active"
        );
    }
);

}

if(overlay){

overlay.addEventListener(
    "click",
    () => {

        sidebar.classList.remove(
            "active"
        );

        overlay.classList.remove(
            "active"
        );
    }
);

}