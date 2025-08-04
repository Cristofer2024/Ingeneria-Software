document.getElementById('formularioSAG').addEventListener('submit', function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombreViajero').value.trim();
  const rutCompleto = document.getElementById('rutViajero').value.trim();
  const tipo = document.getElementById('tipoProductos').value.trim();
  const cantidad = document.getElementById('cantidadProductos').value.trim();
  const procedencia = document.getElementById('procedencia').value.trim();
  const declaracion = document.getElementById('declaracionFirmada').files[0];

  if (nombre === "") {
    alert("Debe ingresar el nombre del viajero.");
    return;
  }

  if (!/^[0-9]{7,8}-[0-9Kk]{1}$/.test(rutCompleto)) {
    alert("El RUT debe tener el formato 12345678-9 o 1234567-K.");
    return;
  }

  const [rutNumero, dvIngresado] = rutCompleto.split("-");
  let suma = 0;
  let multiplo = 2;
  for (let i = rutNumero.length - 1; i >= 0; i--) {
    suma += parseInt(rutNumero.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  let dvEsperado = "";
  if (resto === 11) {
    dvEsperado = "0";
  } else if (resto === 10) {
    dvEsperado = "K";
  } else {
    dvEsperado = resto.toString();
  }

  if (dvEsperado !== dvIngresado.toUpperCase()) {
    alert(`Dígito verificador incorrecto. Debe ser ${dvEsperado}.`);
    return;
  }

  if (tipo === "") {
    alert("Debe especificar el tipo de productos.");
    return;
  }

  if (cantidad === "" || cantidad <= 0) {
    alert("Debe ingresar una cantidad válida.");
    return;
  }

  if (procedencia === "") {
    alert("Debe ingresar la procedencia.");
    return;
  }

  if (!declaracion) {
    alert("Debe adjuntar la declaración firmada.");
    return;
  }

  const extension = declaracion.name.split(".").pop().toLowerCase();
  if (extension !== "pdf") {
    alert("El archivo debe ser un documento PDF.");
    return;
  }
    function registrar() {
    // Mostrar mensaje de éxito
    alert("Formulario SAG enviado correctamente");

    // Redirigir a otra página después del alert
    window.location.href = "../home/funcionario_home.html";
  }
  registrar();

});
