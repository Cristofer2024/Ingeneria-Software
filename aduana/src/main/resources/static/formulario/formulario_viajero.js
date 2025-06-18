document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const rut = document.getElementById("rut").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const nacionalidad = document.getElementById("nacionalidad").value.trim();
        const fechaNacimiento = document.getElementById("fechaNacimiento").value;

        // 1. Campos vacíos
        if (!nombre || !rut || !email || !password || !nacionalidad || !fechaNacimiento) {
            return Swal.fire("Campos incompletos", "Por favor, completa todos los campos.", "warning");
        }

        // 2. RUT válido
        if (!validarRut(rut)) {
            return Swal.fire("RUT inválido", "El RUT ingresado no es válido.", "error");
        }

        // 3. Edad mínima
        if (!esMayorDeEdad(fechaNacimiento)) {
            return Swal.fire("Edad mínima", "Debes ser mayor de 18 años para registrarte.", "warning");
        }

        // 4. Email válido
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Swal.fire("Email inválido", "Ingresa un correo electrónico válido.", "error");
        }

        // 5. Contraseña segura
        const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regexPassword.test(password)) {
            return Swal.fire("Contraseña débil", "Debe tener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo.", "warning");
        }

        // 6. Verificar si el RUT ya existe (AJAX GET)
        const existe = await fetch(`/api/viajero/buscarPorRut/${rut}`).then(res => res.json());
        if (existe) {
            return Swal.fire("RUT duplicado", "Ya existe un viajero registrado con este RUT.", "error");
        }

        // Datos válidos
        const viajero = { nombre, rut, email, password, nacionalidad, fechaNacimiento };

        fetch("/api/viajero", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(viajero)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: "¡Registrado!",
                    text: "El viajero fue guardado exitosamente.",
                    icon: "success",
                    confirmButtonText: "Ir al inicio"
                }).then(result => {
                    if (result.isConfirmed) {
                        window.location.href = "../home/viajero_home.html";
                    }
                });
                form.reset();
            } else {
                Swal.fire("Error inesperado", "Algo falló al guardar. Intenta nuevamente.", "error");
            }
        })
        .catch(err => {
            console.error(err);
            Swal.fire("Error de red", "No se pudo conectar al servidor.", "error");
        });
    });

    // Función para validar RUT chileno
    function validarRut(rut) {
        rut = rut.replace(/\./g, "").replace(/-/g, "");
        const cuerpo = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();

        let suma = 0, multiplo = 2;
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo[i]) * multiplo;
            multiplo = multiplo < 7 ? multiplo + 1 : 2;
        }

        let dvEsperado = 11 - (suma % 11);
        dvEsperado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

        return dv === dvEsperado;
    }

    // Función para validar edad mínima
    function esMayorDeEdad(fecha) {
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        const edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        return (edad > 18 || (edad === 18 && m >= 0));
    }
});
