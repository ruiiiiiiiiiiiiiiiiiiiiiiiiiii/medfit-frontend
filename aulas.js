const API_URL =
"https://back-end-academia-six.vercel.app/aulas";

const API_ALUNOS =
"https://back-end-academia-six.vercel.app/alunos";

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);
if(!usuario){
window.location.href = "login.html";
}

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

let aulaEditandoId = null;


// ======================
// MENU LATERAL
// ======================

function iniciarMenu(){

    const menuBtn =
    document.getElementById(
        "menuBtn"
    );

    const sidebar =
    document.getElementById(
        "sidebar"
    );

    const overlay =
    document.getElementById(
        "overlay"
    );

    if(
        !menuBtn ||
        !sidebar ||
        !overlay
    ){
        return;
    }

    menuBtn.onclick = () => {

        sidebar.classList.toggle(
            "active"
        );

        overlay.classList.toggle(
            "active"
        );
    };

    overlay.onclick = () => {

        sidebar.classList.remove(
            "active"
        );

        overlay.classList.remove(
            "active"
        );
    };
}


// ======================
// CARREGAR ALUNOS
// ======================

async function carregarAlunos(){

    try{

        const resposta =
        await fetch(API_ALUNOS);

        const dados =
        await resposta.json();

        const select =
        document.getElementById(
            "id_aluno"
        );

        select.innerHTML = `
            <option value="">
                Selecione um aluno
            </option>
        `;

        dados.alunos.forEach(aluno => {

            select.innerHTML += `
                <option value="${aluno.id_aluno}">
                    ${aluno.nome}
                </option>
            `;
        });

    }catch(erro){

        console.log(
            "Erro ao carregar alunos",
            erro
        );
    }
}


// ======================
// MODAL
// ======================

function abrirModal(){

    document.getElementById(
        "modal"
    ).style.display = "flex";
}

function fecharModal(){

    document.getElementById(
        "modal"
    ).style.display = "none";

    limparFormulario();

    aulaEditandoId = null;
}

function limparFormulario(){

    document.getElementById(
        "id_aluno"
    ).value = "";

    document.getElementById(
        "telefone"
    ).value = "";

    document.getElementById(
        "tipo_aula"
    ).value = "";

    document.getElementById(
        "id_instrutor"
    ).value = "";

    document.getElementById(
        "data_inicio"
    ).value = "";

    document.getElementById(
        "data_fim"
    ).value = "";

    document.getElementById(
        "status"
    ).value = "agendada";
}


// ======================
// LISTAR AULAS
// ======================

async function carregarAulas(){

    const resposta =
    await fetch(API_URL);

    const dados =
    await resposta.json();

    let aulas =
    dados.aulas;

    if(
        usuario.tipo ===
        "instrutor"
    ){

        aulas =
        aulas.filter(aula =>

            aula.id_instrutor ==
            usuario.referencia
        );
    }

    const lista =
    document.getElementById(
        "listaAulas"
    );

    lista.innerHTML = "";

    aulas.forEach(aula => {

        let botoes = "";

        if(
            usuario.tipo ===
            "admin"
        ){

            botoes = `
                <button
                    class="btn btn-edit"
                    onclick='editarAula(${JSON.stringify(aula)})'>

                    Editar

                </button>

                <button
                    class="btn btn-delete"
                    onclick='excluirAula(${aula.id_aula})'>

                    Excluir

                </button>
            `;
        }

        const card =
        document.createElement(
            "div"
        );

        card.classList.add(
            "card"
        );

        card.innerHTML = `

            <h3>
                ${aula.tipo_aula}
            </h3>

            <div class="info">

                <strong>Aluno:</strong>
                ${aula.nome_aluno || "-"}
                <br>

                <strong>Instrutor:</strong>
                ${aula.instrutor || "-"}
                <br>

                <strong>Início:</strong>
                ${formatarData(aula.data_inicio)}
                <br>

                <strong>Fim:</strong>
                ${formatarData(aula.data_fim)}

            </div>

            <span class="status">

                ${aula.status}

            </span>

            <div class="acoes">

                ${botoes}

            </div>
        `;

        lista.appendChild(
            card
        );
    });
}


// ======================
// SALVAR
// ======================

async function salvarAula(){

    const aula = {

        id_aluno:
        document.getElementById(
            "id_aluno"
        ).value,

        telefone:
        document.getElementById(
            "telefone"
        ).value,

        tipo_aula:
        document.getElementById(
            "tipo_aula"
        ).value,

        id_instrutor:
        document.getElementById(
            "id_instrutor"
        ).value,

        data_inicio:
        document.getElementById(
            "data_inicio"
        ).value,

        data_fim:
        document.getElementById(
            "data_fim"
        ).value,

        status:
        document.getElementById(
            "status"
        ).value
    };

    if(

        !aula.id_aluno ||

        !aula.tipo_aula ||

        !aula.id_instrutor

    ){

        alert(
            "Preencha os campos obrigatórios"
        );

        return;
    }

    if(aulaEditandoId){

        await fetch(

            `${API_URL}/${aulaEditandoId}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(aula)
            }
        );

    }else{

        await fetch(

            API_URL,

            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(aula)
            }
        );
    }

    fecharModal();

    carregarAulas();
}


// ======================
// EDITAR
// ======================

function editarAula(aula){

    aulaEditandoId =
    aula.id_aula;

    document.getElementById(
        "id_aluno"
    ).value =
    aula.id_aluno;

    document.getElementById(
        "telefone"
    ).value =
    aula.telefone || "";

    document.getElementById(
        "tipo_aula"
    ).value =
    aula.tipo_aula;

    document.getElementById(
        "id_instrutor"
    ).value =
    aula.id_instrutor;

    document.getElementById(
        "data_inicio"
    ).value =
    aula.data_inicio?.split("T")[0];

    document.getElementById(
        "data_fim"
    ).value =
    aula.data_fim?.split("T")[0];

    document.getElementById(
        "status"
    ).value =
    aula.status;

    abrirModal();
}


// ======================
// EXCLUIR
// ======================

async function excluirAula(id){

    if(

        !confirm(
            "Deseja excluir esta aula?"
        )

    ){
        return;
    }

    await fetch(

        `${API_URL}/${id}`,

        {
            method:"DELETE"
        }
    );

    carregarAulas();
}


// ======================
// FORMATAR DATA
// ======================

function formatarData(data){

    if(!data)
        return "-";

    return new Date(data)
    .toLocaleDateString(
        "pt-BR"
    );
}


// ======================
// INICIAR
// ======================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        iniciarMenu();

        carregarAlunos();

        carregarAulas();
    }
);