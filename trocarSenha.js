const API_URL =
"https://back-end-academia-six.vercel.app/usuarios/trocar-senha";

async function trocarSenha() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || !usuario.id_usuario) {
        alert("Usuário inválido. Faça login novamente.");
        localStorage.removeItem("usuario");
        window.location.href = "login.html";
        return;
    }

    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (!novaSenha || !confirmarSenha) {
        alert("Preencha todos os campos");
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert("As senhas não coincidem");
        return;
    }

    try {

        const resposta = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: usuario.id_usuario,
                senha: novaSenha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || "Erro ao alterar senha");
            return;
        }

        usuario.primeiro_login = 0;

        localStorage.setItem("usuario", JSON.stringify(usuario));

        alert("Senha alterada com sucesso");

        window.location.href = "index.html";

    } catch (erro) {
        console.log(erro);
        alert("Erro ao conectar com o servidor");
    }
}