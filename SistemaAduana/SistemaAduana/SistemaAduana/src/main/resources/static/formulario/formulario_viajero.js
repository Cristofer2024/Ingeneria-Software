// Función para validar RUT (ahora con validación de patrones comunes)
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

// Función para validar fecha de nacimiento (la que ya tienes)
function validarFechaNacimiento() {
    const fechaInput = document.getElementById("fechaNacimiento").value;
    if (!fechaInput) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese la fecha de nacimiento.'
        });
        return false;
    }
    const fechaNacimiento = new Date(fechaInput);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00 para comparar solo fechas

    if (fechaNacimiento > hoy) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La fecha de nacimiento no puede ser mayor que la fecha actual.'
        });
        return false;
    }
    return true;
}

// Función para validar contraseña segura (la que ya tienes)
function validarPasswordSegura(password) {
    // Mínimo 8 caracteres
    if (password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return false;
    }
    // Al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe contener al menos una letra mayúscula.'
        });
        return false;
    }
    // Al menos una minúscula
    if (!/[a-z]/.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe contener al menos una letra minúscula.'
        });
        return false;
    }
    // Al menos un número
    if (!/[0-9]/.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe contener al menos un número.'
        });
        return false;
    }
    // Al menos un carácter especial (puedes ajustar esta expresión regular según tus preferencias)
    // Esta regex incluye la mayoría de los caracteres especiales comunes
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña Débil',
            text: 'La contraseña debe contener al menos un carácter especial.'
        });
        return false;
    }
    return true; // La contraseña cumple con todos los requisitos
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registroForm").addEventListener("submit", function(e) {
        e.preventDefault(); // Evita el envío de formulario por defecto

        const rut = document.getElementById("rut").value.trim();
        const password = document.getElementById("password").value; // Obtener la contraseña

        // 1. Validar RUT (estructura y dígito verificador, y patrones comunes)
        if (!validarRut(rut)) {
            Swal.fire({
                icon: 'error',
                title: 'Rut Inválido',
                text: 'El RUT ingresado no tiene un formato válido o es un patrón de RUT inválido común. Por favor, verifique y reintente.' // Mensaje actualizado
            }).then(() => {
                document.getElementById("rut").value = ""; // Limpia el campo
                document.getElementById("rut").focus(); // Pone el foco en el campo RUT
            });
            return; // Detiene el envío si el RUT es inválido
        }

        // 2. Validar Contraseña Segura
        if (!validarPasswordSegura(password)) {
            document.getElementById("password").value = ""; // Limpia el campo si no es segura
            document.getElementById("password").focus(); // Pone el foco en el campo contraseña
            return; // Detiene el envío si la contraseña no es segura
        }

        // 3. Validar Fecha de Nacimiento
        if (!validarFechaNacimiento()) {
            document.getElementById("fechaNacimiento").focus(); // Pone el foco en el campo fecha
            return; // Detiene el envío si la fecha es inválida
        }

        // Si todas las validaciones del frontend pasan, procede a enviar el formulario
        const formData = new FormData(this); // Crea un objeto FormData con los datos del formulario

        // Normalizar el RUT antes de enviarlo al backend, para asegurar el formato sin puntos ni guiones
        // Esto asume que tu backend espera el RUT sin puntos ni guiones para la inserción
        // y la búsqueda. Si espera con guion, ajusta accordingly.
        formData.set('rut', rut.replace(/\./g, '').replace('-', ''));


        fetch("/viajero/guardar", {
            method: "POST", // Método HTTP para enviar los datos
            body: formData // Cuerpo de la solicitud, conteniendo los datos del formulario
        })
        .then(response => {
            // Verifica si la respuesta HTTP es exitosa (código 2xx)
            if (response.ok) {
                return response.text(); // Si es exitosa, lee el cuerpo de la respuesta como texto
            } else {
                // Si la respuesta no es exitosa (ej. 409 Conflict, 500 Internal Server Error),
                // lee el cuerpo del error para obtener el mensaje específico del backend.
                return response.text().then(errorText => {
                    throw new Error(errorText || "Error desconocido al registrar."); // Lanza un error con el mensaje
                });
            }
        })
        .then(data => {
            // Este bloque se ejecuta si la respuesta del servidor es exitosa
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: data // Muestra el mensaje de éxito del backend (ej. "Registro exitoso")
            }).then(() => {
                // Redirige al usuario a la página de login después de un registro exitoso
                window.location.href = "http://localhost:8080/login/login_viajero.html";
            });
        })
        .catch(error => {
            // Este bloque se ejecuta si hay un error en la solicitud fetch o si se lanza un error en el bloque .then()
            Swal.fire({
                icon: 'error',
                title: 'Error al Registrar',
                text: error.message // Muestra el mensaje de error capturado (incluyendo los del backend como "Ya existe un usuario...")
            });
            console.error('Error en el fetch:', error); // Log del error para depuración
        });
    });
});
