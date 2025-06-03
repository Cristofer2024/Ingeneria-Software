// Función que actualiza el formulario según el tipo de usuario seleccionado
function actualizarFormulario() {
    let tipoUsuario = document.getElementById("tipoUsuario").value;
    let camposExtra = document.getElementById("camposExtra");
    camposExtra.innerHTML = ""; // Limpia los campos previos

    if (tipoUsuario === "viajero") {
        camposExtra.innerHTML += `
            <label for="nacionalidad">Nacionalidad:</label>
            <input type="text" id="nacionalidad" required>
            <label for="fechaNacimiento">Fecha de Nacimiento:</label>
            <input type="date" id="fechaNacimiento" required>
        `;
    } else if (tipoUsuario === "funcionario") {
        camposExtra.innerHTML += `
            <label for="especialidad">Especialidad:</label>
            <input type="text" id="especialidad" required>

            <label for="organismo">Organismo:</label>
            <select id="organismo">
                <option value="Aduana">Aduana</option>
                <option value="SAG">SAG</option>
                <option value="PDI">PDI</option>
            </select>
        `;
    }
}

// Función para mostrar mensajes flotantes
function mostrarMensaje(texto, tipo) {
    let mensaje = document.getElementById("mensaje");

    let icono = tipo === "success" ? "✅" : tipo === "error" ? "❌" : "ℹ️";
    
    mensaje.innerHTML = `${icono} <strong>${texto}</strong>`; // Agrega iconos
    
    mensaje.className = `show ${tipo}`; // Aplica estilos según el tipo

    setTimeout(() => {
        mensaje.className = "hide"; // Animación de desaparición
    }, 3000);
}


// Función para verificar si el RUT ya está registrado en la base de datos
async function rutYaRegistrado(rut) {
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    let endpoint = "";

    if (tipoUsuario === "admin") {
        endpoint = "http://localhost:9090/api/admin";
    } else if (tipoUsuario === "viajero") {
        endpoint = "http://localhost:9090/api/viajero";
    } else if (tipoUsuario === "funcionario") {
        endpoint = "http://localhost:9090/api/funcionario_aduana";
    }

    try {
        const response = await fetch(`${endpoint}/buscarPorRut/${rut}`);
        const existe = await response.json();
        return existe;
    } catch (error) {
        console.error("Error al verificar RUT:", error);
        return false;
    }
}

// Validaciones y envío del formulario
document.getElementById("registroForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita que el formulario se recargue

    let email = document.getElementById("email").value;
    let contrasena = document.getElementById("contrasena").value;
    let rut = document.getElementById("rut").value;

    // Validación de email
    if (!email.includes("@")) {
        mostrarMensaje("El email debe ser válido.", "error");
        return;
    }

    // Validación de contraseña
    if (contrasena.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
    }

    // Validación de RUT (Formato chileno: 12345678-K)
    if (!/^[0-9]+-[0-9Kk]$/.test(rut)) {
        mostrarMensaje("El RUT debe tener el formato correcto (Ejemplo: 12345678-K).", "error");
        return;
    }

    // Validación de RUT duplicado en BD
    if (await rutYaRegistrado(rut)) {
        mostrarMensaje("Este RUT ya está registrado en la base de datos.", "error");
        return;
    }

    enviarDatos(); // Si pasa las validaciones, se envían los datos al backend
});


// Función para enviar los datos a Spring Boot

function enviarDatos() {
    let tipoUsuario = document.getElementById("tipoUsuario").value;
    let usuario = {
        rut: document.getElementById("rut").value,
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        contrasena: document.getElementById("contrasena").value,
    };

    if (tipoUsuario === "viajero") {
        usuario.nacionalidad = document.getElementById("nacionalidad").value;
        usuario.fechaNacimiento = document.getElementById("fechaNacimiento").value;
    } else if (tipoUsuario === "funcionario") {
        usuario.especialidad = document.getElementById("especialidad").value;
        usuario.organismo = document.getElementById("organismo").value;
    }

    // Seleccionar el endpoint correcto según el usuario
    let endpoint = "";
    if (tipoUsuario === "admin") {
        endpoint = "http://localhost:9090/api/admin";
    } else if (tipoUsuario === "viajero") {
        endpoint = "http://localhost:9090/api/viajero";
    } else if (tipoUsuario === "funcionario") {
        endpoint = "http://localhost:9090/api/funcionario_aduana";
    }

    // Enviar datos al endpoint seleccionado
    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
    .then(response => response.text())
    .then(data => {
    mostrarMensaje("Usuario registrado correctamente!", "success");

    // Esperar 1 segundo antes de redirigir para que se vea el mensaje
    setTimeout(() => {
        const tipoUsuario = document.getElementById("tipoUsuario").value;

        if (tipoUsuario === "admin") {
            window.location.href = "../home/admin_home.html";
        } else if (tipoUsuario === "viajero") {
            window.location.href = "../home/viajero_home.html";
        } else if (tipoUsuario === "funcionario") {
            window.location.href = "../home/funcionario_home.html";
        }
    }, 1000);
})

    .catch(error => mostrarMensaje("Error al registrar el usuario", "error"));
}
// mostrarMensaje("Usuario registrado correctamente!", "success");
// mostrarMensaje("Error al procesar la solicitud.", "error");
// mostrarMensaje("Revisa los datos antes de enviarlos.", "info");

