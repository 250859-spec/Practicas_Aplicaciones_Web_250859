
const pista = document.querySelector(".carrusel-pista");
const tarjetas = [...document.querySelectorAll(".favorito-card")];
const anterior = document.querySelector(".carrusel-flecha.anterior");
const siguiente = document.querySelector(".carrusel-flecha.siguiente");
const indicadores = [...document.querySelectorAll(".carrusel-indicadores button")];

const modal = document.getElementById("modal-favoritos");
const modalTitulo = document.getElementById("modal-titulo");
const modalContenido = document.getElementById("modal-contenido");
const cerrarModal = document.getElementById("cerrar-modal");

let indice = 0;

function mostrarTarjeta(n) {
    indice = (n + tarjetas.length) % tarjetas.length;
    pista.style.transform = `translateX(-${indice * 100}%)`;

    indicadores.forEach((boton, i) => {
        boton.classList.toggle("activo", i === indice);
    });
}

anterior.addEventListener("click", () => mostrarTarjeta(indice - 1));
siguiente.addEventListener("click", () => mostrarTarjeta(indice + 1));

indicadores.forEach((boton, i) => {
    boton.addEventListener("click", () => mostrarTarjeta(i));
});

function abrirModal(tarjeta) {
    modalTitulo.textContent = tarjeta.querySelector("h3").textContent;
    modalContenido.replaceChildren();

    [...tarjeta.children].forEach(elemento => {
        if (elemento.matches(".favorito-info")) return;

        const copia = elemento.cloneNode(true);

        if (copia.matches("audio")) {
            copia.pause();
            copia.currentTime = 0;
        }

        modalContenido.appendChild(copia);
    });

    modal.hidden = false;
    cerrarModal.focus();
}

function cerrarVentana() {
    modalContenido.querySelectorAll("audio, video").forEach(media => {
        media.pause();
    });

    modal.hidden = true;
    modalContenido.replaceChildren();
}

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("click", evento => {
        if (evento.target.closest("audio, button")) return;
        abrirModal(tarjeta);
    });

    tarjeta.addEventListener("keydown", evento => {
        if (evento.target !== tarjeta) return;

        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirModal(tarjeta);
        }
    });
});

cerrarModal.addEventListener("click", cerrarVentana);

modal.addEventListener("click", evento => {
    if (evento.target === modal) cerrarVentana();
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && !modal.hidden) {
        cerrarVentana();
    }
});

mostrarTarjeta(0);
console.log("JavaScript conectado correctamente");