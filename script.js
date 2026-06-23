const API_URL = "https://back-end-academia-six.vercel.app/";

// ============================
// PEGAR USUÁRIO
// ============================

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);

// sem login
if(!usuario){

    window.location.href = "login.html";
}

// ============================
// MENU
// ============================

const hamburguer =
document.getElementById("hamburguer");

const menu =
document.getElementById("menu");

const overlay =
document.getElementById("menuOverlay");

hamburguer.addEventListener("click", () => {

    menu.classList.toggle("ativo");

    overlay.classList.toggle("ativo");
});

overlay.addEventListener("click", () => {

    menu.classList.remove("ativo");

    overlay.classList.remove("ativo");
});

// ============================
// BOTÃO COMEÇAR
// ============================

const btnComecar =
document.getElementById("btnComecar");

if(btnComecar){

    btnComecar.addEventListener("click", () => {

        if(usuario.tipo === "admin"){

            window.location.href =
            "cadastro.html";

        } else {

            alert(
                "Apenas administradores podem acessar o cadastro"
            );
        }
    });
}

// ============================
// PERMISSÕES
// ============================

// aluno
if(usuario.tipo === "aluno"){

    esconderLink("linkCadastro");
    esconderLink("linkNotas");
    esconderLink("linkPersonais");
}

// instrutor
if(usuario.tipo === "instrutor"){

    esconderLink("linkCadastro");
    esconderLink("linkNotas");
}

// função esconder
function esconderLink(id){

    const el =
    document.getElementById(id);

    if(el){

        el.style.display = "none";
    }
}

// ============================
// MOSTRAR USUARIO
// ============================

const areaUsuario =
document.getElementById("usuarioLogado");

if(areaUsuario){

    areaUsuario.innerHTML = `
        ${usuario.usuario}
        (${usuario.tipo})
    `;
}

// ============================
// LOGIN / LOGOUT
// ============================

const btnEntrar =
document.getElementById("btnEntrar");

const btnLogout =
document.getElementById("btnLogout");

if(usuario){

    btnEntrar.style.display =
    "none";

    btnLogout.style.display =
    "inline-block";

} else {

    btnLogout.style.display =
    "none";
}

btnLogout.addEventListener("click", () => {

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
    "login.html";
});