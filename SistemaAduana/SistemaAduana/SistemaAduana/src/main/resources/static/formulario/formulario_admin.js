// Función para validar RUT (la misma que usamos para viajeros y funcionarios, ahora con validación de patrones comunes)
function validarRut(rut) {
    // Limpiar el RUT de puntos y guiones
    rut = rut.replace(/\./g, '').replace('-', '');

    // Permite "K" como dígito verificador
    if (rut.length < 2) return false; // El RUT debe tener al menos un número y un DV

    const cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();

    // Validar que el cuerpo sean solo números
    if (!/^\d+$/.test(cuerpo)) return false;

    // --- NUEVA VALIDACIÓN: Patrones de RUTs inválidos comunes ---
    // Ejemplos: 11111111-1, 22222222-2, 12345678-9, 98765432-1, etc.
    // Aunque pasen el dígito verificador, son patrones sospechosos.

    // 1. RUTs con todos los dígitos iguales (ej: 11111111, 22222222)
    const primerDigito = cuerpo.charAt(0);
    const esDigitosRepetidos = cuerpo.split('').every(char => char === primerDigito);
    if (esDigitosRepetidos) {
        return false; // RUT inválido por dígitos repetidos
    }

    // 2. RUTs con secuencias ascendentes o descendentes simples (ej: 12345678, 87654321)
    // Se verifica si el cuerpo es una secuencia simple (ej: 12345678, 23456789, 98765432)
    let esSecuenciaAscendente = true;
    let esSecuenciaDescendente = true;
    for (let i = 0; i < cuerpo.length - 1; i++) {
        const digitoActual = parseInt(cuerpo.charAt(i));
        const digitoSiguiente = parseInt(cuerpo.charAt(i + 1));

        if (digitoActual + 1 !== digitoSiguiente) {
            esSecuenciaAscendente = false;
        }
        if (digitoActual - 1 !== digitoSiguiente) {
            esSecuenciaDescendente = false;
        }
    }
    if (esSecuenciaAscendente || esSecuenciaDescendente) {
        return false; // RUT inválido por secuencia numérica
    }
    // -----------------------------------------------------------

    // Algoritmo de validación del dígito verificador
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

// Función para validar contraseña segura (la misma que usamos para viajeros y funcionarios)
function validarPasswordSegura(password) {
    if (password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe contener al menos una letra mayúscula.'
        });
        return false;
    }
    if (!/[a-z]/.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe contener al menos una letra minúscula.'
        });
        return false;
    }
    if (!/[0-9]/.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe contener al menos un número.'
        });
        return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe contener al menos un carácter especial.'
        });
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registroForm").addEventListener("submit", function(e) {
        e.preventDefault(); // Evita el envío de formulario por defecto

        const rut = document.getElementById("rut").value.trim();
        const password = document.getElementById("password").value;

        // 1. Validar RUT (estructura y dígito verificador, y patrones comunes)
        if (!validarRut(rut)) {
            Swal.fire({
                icon: 'error',
                title: 'RUT Inválido',
                text: 'El RUT ingresado no tiene un formato válido o es un patrón de RUT inválido común. Por favor, verifique y reintente.' // Mensaje actualizado
            }).then(() => {
                document.getElementById("rut").value = "";
                document.getElementById("rut").focus();
            });
            return;
        }

        // 2. Validar Contraseña Segura
        if (!validarPasswordSegura(password)) {
            document.getElementById("password").value = "";
            document.getElementById("password").focus();
            return;
        }

        // Si todas las validaciones del frontend pasan, procede a enviar el formulario
        const formData = new FormData(this);

        // Normalizar el RUT antes de enviarlo al backend, para asegurar el formato sin puntos ni guiones
        formData.set('rut', rut.replace(/\./g, '').replace('-', ''));

        fetch("/admin/guardar", { // Asegúrate de que esta URL sea correcta para tu backend
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                return response.text().then(errorText => {
                    throw new Error(errorText || "Error desconocido al registrar.");
                });
            }
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: data
            }).then(() => {
                // Redirige al usuario a la página de login de administradores después de un registro exitoso
                window.location.href = "http://localhost:8080/login/login_admin.html"; 
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error al Registrar',
                text: error.message // Mostrar el mensaje de error capturado (incluyendo los del backend)
            });
            console.error('Error en el fetch:', error);
        });
    });
});