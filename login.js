const API_URL = "http://localhost:3000/login";

async function login() {

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if (!usuario || !senha) {
        alert("Preencha usuário e senha");
        return;
    }

    try {

        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario, senha })
        });

        const dados = await resposta.json();

        console.log("LOGIN RESPONSE:", dados);

        if (!dados.sucesso) {
            alert(dados.erro || "Login inválido");
            return;
        }

        localStorage.setItem("usuario", JSON.stringify({
            id_usuario: dados.usuario.id_usuario,
            usuario: dados.usuario.usuario,
            tipo: dados.usuario.tipo,
            referencia: dados.usuario.referencia,
            primeiro_login: dados.usuario.primeiro_login
        }));

        if (dados.usuario.primeiro_login == 1) {
            window.location.href = "trocarSenha.html";
            return;
        }

        window.location.href = "index.html";

    } catch (erro) {
        console.log(erro);
        alert("Erro ao conectar com o servidor");
    }
}