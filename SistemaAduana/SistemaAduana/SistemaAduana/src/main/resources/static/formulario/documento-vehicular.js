document.getElementById('documentoVehicular').addEventListener('submit', function(e) {
  e.preventDefault();

  const vigencia = document.getElementById('vigenciaDias').value.trim();
  const patente = document.getElementById('patenteVehiculo').value.trim();
  const archivo = document.getElementById('archivoAdjunto').files[0];

  if (vigencia === "" || vigencia <= 0) {
    alert("Debe ingresar una vigencia en días válida.");
    return;
  }

  if (patente === "") {
    alert("Debe ingresar la patente del vehículo.");
    return;
  }

  if (!archivo) {
    alert("Debe adjuntar el documento.");
    return;
  }

  const extension = archivo.name.split(".").pop().toLowerCase();
  if (extension !== "pdf") {
    alert("El archivo debe ser un documento PDF.");
    return;
  }
    function registrar() {
    // Mostrar mensaje de éxito
    alert("Documento Vehicular enviado correctamente.");

    // Redirigir a otra página después del alert
    window.location.href = "../home/viajero_home.html";
  }

  registrar();
});
