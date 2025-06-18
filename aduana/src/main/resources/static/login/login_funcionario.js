document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const rut = document.getElementById("rut").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!rut || !password) {
            return Swal.fire("Campos vacíos", "Debes ingresar RUT y contraseña.", "warning");
        }

        if (!validarRut(rut)) {
            return Swal.fire("RUT inválido", "El RUT ingresado no es válido.", "error");
        }

        // Enviar al backend
        const response = await fetch(`/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rut, password, rol: "funcionario" })
        });

        if (response.ok) {
            const funcionario = await response.json(); // opcional
            Swal.fire({
                title: "Bienvenido",
                text: "Inicio de sesión exitoso",
                icon: "success",
                confirmButtonText: "Ir al panel"
            }).then(() => {
                window.location.href = "../home/funcionario_home.html"; // Cambia por tu ruta real
            });
        } else if (response.status === 401) {
            Swal.fire("Credenciales incorrectas", "El RUT o la contraseña no coinciden.", "error");
        } else {
            Swal.fire("Error", "No se pudo iniciar sesión. Intenta más tarde.", "error");
        }
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
});
