document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const rut = document.getElementById("rut").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const nivelAcceso = document.getElementById("nivelAcceso").value;


        // 1. Validación de campos
        if (!nombre || !rut || !email || !password || !nivelAcceso) {
            return Swal.fire("Campos incompletos", "Por favor completa todos los campos.", "warning");
        }

        // 2. Validación de RUT chileno
        if (!validarRut(rut)) {
            return Swal.fire("RUT inválido", "El RUT ingresado no es válido.", "error");
        }

        // 3. Validación de correo
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            return Swal.fire("Email inválido", "Ingresa un correo electrónico válido.", "error");
        }

        // 4. Validación de contraseña segura
        const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regexPassword.test(password)) {
            return Swal.fire("Contraseña débil", "Debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.", "warning");
        }

        // 5. Validar que el RUT no esté duplicado en administradores
        const existe = await fetch(`/api/admin/buscarPorRut/${rut}`).then(res => res.json());
        if (existe) {
            return Swal.fire("RUT duplicado", "Ya existe un administrador con este RUT.", "error");
        }

        // 6 valida que el RUT no esté duplicado en funcionarios
        const existe_funcionario = await fetch(`/api/funcionario_aduna/buscarPorRut/${rut}`).then(res => res.json());
        if (existe_funcionario) {
            return Swal.fire("RUT duplicado", "Ya existe un Funcionario con este RUT.", "error");
        }
        

        // 7. Envío al backend
        const admin = { nombre, rut, email, password, nivelAcceso };

        fetch("/api/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(admin)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: "¡Registrado!",
                    text: "El administrador fue registrado exitosamente.",
                    icon: "success",
                    confirmButtonText: "Ir al panel"
                }).then(() => {
                    window.location.href = "../home/admin_home.html";
                });
            } else {
                Swal.fire("Error", "Error al registrar al administrador. Verifica los datos.", "error");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire("Error de red", "No se pudo conectar con el servidor.", "error");
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
});
