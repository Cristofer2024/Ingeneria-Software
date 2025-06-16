document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const rut = document.getElementById("rut").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const cargo = document.getElementById("cargo").value.trim();
        const organismo = document.getElementById("organismo").value;

        // 1. Validación de campos vacíos
        if (!nombre || !rut || !email || !password || !cargo || !organismo) {
            return Swal.fire("Campos incompletos", "Por favor completa todos los campos.", "warning");
        }

        // 2. Validación de RUT
        if (!validarRut(rut)) {
            return Swal.fire("RUT inválido", "El RUT ingresado no es válido.", "error");
        }

        // 3. Validación de email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Swal.fire("Email inválido", "Ingresa un correo electrónico válido.", "error");
        }

        // 4. Validación de contraseña segura
        const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regexPassword.test(password)) {
            return Swal.fire("Contraseña débil", "Debe tener al menos 8 caracteres, 1 mayúscula, 1 número y 1 símbolo.", "warning");
        }

        // 5. Verificar RUT duplicado (AJAX)
        const existe = await fetch(`/api/funcionario_aduana/buscarPorRut/${rut}`).then(res => res.json());
        if (existe) {
            return Swal.fire("RUT duplicado", "Ya existe un funcionario con este RUT.", "error");
        }

        // 6. Envío de datos al backend
        const funcionario = {
            nombre,
            rut,
            email,
            password,
            cargo,
            organismo
        };

        fetch("/api/funcionario_aduana", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(funcionario)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: "¡Registrado!",
                    text: "El funcionario fue registrado exitosamente.",
                    icon: "success",
                    confirmButtonText: "Ir al panel"
                }).then(result => {
                    if (result.isConfirmed) {
                        window.location.href = "../home/admin/funcionario"; // Página destino
                    }
                });
                form.reset();
            } else {
                Swal.fire("Error inesperado", "Hubo un error al guardar el funcionario.", "error");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire("Falla de red", "No se pudo conectar con el servidor.", "error");
        });
    });

    // ✅ Función para validar RUT chileno
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
