

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
    if (!pista || tarjetas.length === 0) return;

    indice = (n + tarjetas.length) % tarjetas.length;

    const anchoTarjeta = tarjetas[indice].getBoundingClientRect().width;
    const espacio = parseFloat(getComputedStyle(pista).gap) || 0;

    pista.style.transform =
        `translateX(-${tarjetas.slice(0, indice).reduce((total, tarjeta) => total + tarjeta.getBoundingClientRect().width, 0) - (indice > 0 ? 0 : 0) + espacio * indice}px)`;

    indicadores.forEach((boton, i) => {
        boton.classList.toggle("activo", i === indice);
    });
}
anterior?.addEventListener("click", () => mostrarTarjeta(indice - 1));
siguiente?.addEventListener("click", () => mostrarTarjeta(indice + 1));

indicadores.forEach((boton, i) => {
    boton.addEventListener("click", () => mostrarTarjeta(i));
});

function abrirModal(tarjeta) {
    if (!modal || !modalTitulo || !modalContenido) return;

    modalTitulo.textContent =
        tarjeta.querySelector("h3")?.textContent || "Mi favorito";

    modalContenido.replaceChildren();

    const tipo = tarjeta.getAttribute("aria-label");

    
if (tipo === "Ver libro favorito") {
   const lector = document.createElement("iframe");
    lector.src = "assets/images/DAMIAN.pdf#toolbar=0&navpanes=0&view=FitH";
    lector.title = "Libro Damián";
    lector.style.width = "100%";
    lector.style.height = "75vh";
    lector.style.border = "none";
    lector.style.background = "#fff";

    modalContenido.appendChild(lector);



    } else if (tipo === "Ver película favorita") {
        const video = document.createElement("video");
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";

        const fuente = document.createElement("source");
        fuente.src = "videos/trailer_peli.mp4";
        fuente.type = "video/mp4";

        video.appendChild(fuente);
        video.appendChild(
            document.createTextNode("Tu navegador no puede reproducir este video.")
        );

        modalContenido.appendChild(video);

    } else {
        [...tarjeta.children].forEach(elemento => {
            if (elemento.classList.contains("favorito-info")) return;
            if (elemento.matches("audio")) return;
            modalContenido.appendChild(elemento.cloneNode(true));
        });

        const audioOriginal = tarjeta.querySelector("audio");

        if (audioOriginal) {
            modalContenido.appendChild(audioOriginal.cloneNode(true));
        }
    }

    modal.hidden = false;
}

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("click", evento => {
        if (evento.target.closest("audio, button, video, iframe")) return;
        abrirModal(tarjeta);
    });

    tarjeta.addEventListener("keydown", evento => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirModal(tarjeta);
        }
    });
});

function cerrarVentana() {
    if (!modal) return;

    modalContenido.querySelectorAll("video, audio").forEach(media => {
        media.pause();
    });

    modal.hidden = true;
    modalContenido.replaceChildren();
}

cerrarModal?.addEventListener("click", cerrarVentana);

modal?.addEventListener("click", evento => {
    if (evento.target === modal) cerrarVentana();
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && modal && !modal.hidden) {
        cerrarVentana();
    }
});

mostrarTarjeta(0);
