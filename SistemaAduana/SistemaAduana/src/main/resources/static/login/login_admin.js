// Función para validar RUT (la misma que ya tienes, y es correcta para la estructura)
function validarRut(rut) {
    rut = rut.replace(/\./g, '').replace('-', '');

    if (rut.length < 2) return false;

    const cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();

    if (!/^\d+$/.test(cuerpo)) return false; // Asegura que el cuerpo sean solo dígitos

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    return dv === dvEsperado;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const rut = document.getElementById("rut").value.trim(); // .trim() para quitar espacios en blanco
        const password = document.getElementById("password").value;

        // Validar RUT en el frontend
        if (!validarRut(rut)) {
            Swal.fire({
                icon: 'error',
                title: 'RUT Inválido',
                text: 'El RUT ingresado no tiene un formato válido o es incorrecto. Por favor, verifique y reintente.'
            }).then(() => {
                document.getElementById("rut").value = ""; // Limpiar el campo
                document.getElementById("rut").focus(); // Poner el foco en el campo
            });
            return; // Detener la ejecución si el RUT es inválido
        }

        try {
            // Realizar la solicitud al backend para autenticar al administrador
            const response = await fetch(`http://localhost:8080/admin/buscarPorRut/${rut}/${password}`);
            
            if (response.ok) {
                const admin = await response.json(); // Cambiado de 'viajero' a 'admin'
                // Almacenar los datos del administrador en localStorage (si es necesario)
                localStorage.setItem("admin", JSON.stringify(admin)); 
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Hola ${admin.nombre}, has iniciado sesión correctamente como administrador.`,
                    showConfirmButton: false,
                    timer: 2000 // Ocultar automáticamente después de 2 segundos
                }).then(() => {
                    // Redirigir a la página de inicio de administradores
                    window.location.href = "/home/admin_home.html"; // Asegúrate de que esta sea la ruta correcta
                });
            } else {
                // Leer el mensaje de error del backend (ej. "Credenciales incorrectas")
                const errorMessage = await response.text();
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Credenciales',
                    text: errorMessage || "Usuario o contraseña de administrador incorrectos." // Muestra el mensaje del backend o uno por defecto
                }).then(() => {
                    document.getElementById("password").value = ""; // Limpiar solo la contraseña
                    document.getElementById("password").focus();
                });
            }
        } catch (error) {
            // Manejar errores de conexión o del servidor
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.'
            });
            console.error('Error al conectar con el servidor:', error);
        }
    });
});