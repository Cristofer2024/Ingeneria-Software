/// Función para validar RUT (es la misma que en formulario.js)
function validarRut(rut) {
    rut = rut.replace(/\./g, '').replace('-', '');

    if (rut.length < 2) return false;

    const cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();

    if (!/^\d+$/.test(cuerpo)) return false;

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

        const rutInput = document.getElementById("rut").value; // Obtener el valor del input
        const password = document.getElementById("password").value;

        // Validar RUT en el login (solo estructura y DV)
        if (!validarRut(rutInput)) {
            Swal.fire({
                icon: 'error',
                title: 'Rut Inválido',
                text: 'El RUT ingresado no tiene un formato válido.'
            }).then(() => {
                document.getElementById("rut").value = "";
            });
            return;
        }

        // Normalizar el RUT antes de enviarlo al backend
        // Esto asegura que el formato enviado coincida con lo que el backend espera
        const rutNormalizado = rutInput.replace(/\./g, '').replace('-', '');

        try {
            // Se envía el RUT normalizado en la URL
            const response = await fetch(`http://localhost:8080/viajero/buscarPorRut/${rutNormalizado}/${password}`);

            if (response.ok) {
                // Si el backend devuelve el objeto Viajero completo, es crucial limpiarlo aquí.
                // Idealmente, el backend ya debería devolver un DTO sin la contraseña.
                const viajeroData = await response.json();

                // Eliminar la contraseña del objeto antes de almacenarlo en localStorage
                // Esto es una medida de seguridad si el backend aún devuelve la contraseña.
                const viajeroParaLocalStorage = { ...viajeroData }; // Crea una copia para no modificar el original
                if (viajeroParaLocalStorage.password) {
                    delete viajeroParaLocalStorage.password;
                }

                localStorage.setItem("viajero", JSON.stringify(viajeroParaLocalStorage));

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Hola ${viajeroData.nombre}, has iniciado sesión correctamente.`, // Usamos viajeroData para el nombre
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = "/home/viajero_home.html";
                });
            } else {
                // Si la respuesta no es OK, lee el mensaje de error del backend como texto
                const errorMessage = await response.text();
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Credenciales',
                    text: errorMessage || "Usuario o contraseña incorrectos."
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.'
            });
            console.error('Error al conectar con el servidor:', error);
        }
    });
});
