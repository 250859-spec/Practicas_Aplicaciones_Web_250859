
// Primera funcionalidad
console.log("Hola Mundo, desde JavaScript");

// Segunda funcionalidad: calcular edad
function calcularEdad() {
    const fecha = new Date(document.getElementById("fechaNacimiento").value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();

    if (hoy.getMonth() < fecha.getMonth() ||
        (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate())) {
        edad--;
    }

    const mensaje = document.getElementById("mensajeEdad");

    if (!document.getElementById("fechaNacimiento").value) {
        mensaje.textContent = "";
    } else if (fecha > hoy) {
        mensaje.textContent = "Fecha no válida.";
    } else if (edad >= 18) {
        mensaje.textContent = "El usuario es MAYOR de edad.";
    } else {
        mensaje.textContent = "El usuario es MENOR de edad.";
    }
}
