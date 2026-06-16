const hamburguer =
document.getElementById("hamburguer");

const menu =
document.getElementById("menu");

const overlay =
document.getElementById("menuOverlay");

hamburguer.addEventListener("click", () => {

```
menu.classList.toggle("ativo");

overlay.classList.toggle("ativo");
```

});

overlay.addEventListener("click", () => {

```
menu.classList.remove("ativo");

overlay.classList.remove("ativo");
```

});
