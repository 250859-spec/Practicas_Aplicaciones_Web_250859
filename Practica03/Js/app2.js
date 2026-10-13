

const pista = document.querySelector(".carrusel-pista");
const ventana = document.querySelector(".carrusel-ventana");
const tarjetas = [...document.querySelectorAll(".favorito-card")];
const anterior = document.querySelector(".carrusel-flecha.anterior");
const siguiente = document.querySelector(".carrusel-flecha.siguiente");
const indicadores = [...document.querySelectorAll(".carrusel-indicadores button")];

const modal = document.getElementById("modal-favoritos");
const modalTitulo = document.getElementById("modal-titulo");
const modalContenido = document.getElementById("modal-contenido");
const cerrarModal = document.getElementById("cerrar-modal");

let indice = 0;
let toqueInicial = 0;

function mostrarTarjeta(n) {
    if (!pista || !ventana || !tarjetas.length) return;

    indice = (n + tarjetas.length) % tarjetas.length;

    pista.style.transform =
        `translateX(-${indice * ventana.clientWidth}px)`;

    indicadores.forEach((boton, i) => {
        boton.classList.toggle("activo", i === indice);
    });
}

anterior?.addEventListener("click", () => mostrarTarjeta(indice - 1));
siguiente?.addEventListener("click", () => mostrarTarjeta(indice + 1));

indicadores.forEach((boton, i) => {
    boton.addEventListener("click", () => mostrarTarjeta(i));
});

ventana?.addEventListener("touchstart", e => {
    toqueInicial = e.changedTouches[0].clientX;
}, { passive: true });

ventana?.addEventListener("touchend", e => {
    const diferencia = e.changedTouches[0].clientX - toqueInicial;

    if (Math.abs(diferencia) > 45) {
        mostrarTarjeta(indice + (diferencia < 0 ? 1 : -1));
    }
}, { passive: true });

window.addEventListener("resize", () => mostrarTarjeta(indice));

function abrirModal(tarjeta) {
    if (!modal || !modalTitulo || !modalContenido) return;

    modalTitulo.textContent =
        tarjeta.querySelector("h3")?.textContent || "Mi favorito";

    modalContenido.replaceChildren();

    const tipo = tarjeta.getAttribute("aria-label");

    if (tipo === "Ver película favorita") {
        const video = document.createElement("video");
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";

        const fuente = document.createElement("source");
        fuente.src = "videos/trailer_peli.mp4";
        fuente.type = "video/mp4";

        video.appendChild(fuente);
        modalContenido.appendChild(video);
        video.load();

    } else if (tipo === "Ver canción favorita") {
        const portada = tarjeta.querySelector(".portada-musica");

        if (portada) {
            modalContenido.appendChild(portada.cloneNode(true));
        }

        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "metadata";

        const fuente = document.createElement("source");
        fuente.src = "assets/images/like_animals.mp3";
        fuente.type = "audio/mpeg";

        audio.appendChild(fuente);
        modalContenido.appendChild(audio);
        audio.load();

    } else if (tipo === "Ver libro favorito") {
        const portada = tarjeta.querySelector(".portada-libro");

        if (portada) {
            modalContenido.appendChild(portada.cloneNode(true));
        }

        const lector = document.createElement("iframe");
        lector.src = "assets/images/DAMIAN.pdf";
        lector.title = "Libro favorito: Damián";

        modalContenido.appendChild(lector);
    }

    modal.hidden = false;
}

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("click", () => abrirModal(tarjeta));

    tarjeta.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrirModal(tarjeta);
        }
    });
});

function cerrarVentana() {
    if (!modal || !modalContenido) return;

    modalContenido.querySelectorAll("video, audio").forEach(media => {
        media.pause();
    });

    modal.hidden = true;
    modalContenido.replaceChildren();
}

cerrarModal?.addEventListener("click", cerrarVentana);

modal?.addEventListener("click", e => {
    if (e.target === modal) cerrarVentana();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal && !modal.hidden) {
        cerrarVentana();
    }
});

mostrarTarjeta(0);
