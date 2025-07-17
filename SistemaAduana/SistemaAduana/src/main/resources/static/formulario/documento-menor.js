document.getElementById('documentoMenor').addEventListener('submit', function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombreMenor').value.trim();
  const edad = document.getElementById('edadMenor').value.trim();
  const documento = document.getElementById('documentoIdentidad').value.trim();
  const adjunto = document.getElementById('documentoAutorizacionAdjunto').files[0];

  if (nombre === "") {
    alert("Debe ingresar el nombre del menor.");
    return;
  }

  if (edad === "" || edad < 0) {
    alert("Debe ingresar una edad válida.");
    return;
  }

  if (documento === "") {
    alert("Debe ingresar el documento de identidad.");
    return;
  }

  if (!adjunto) {
    alert("Debe adjuntar la autorización.");
    return;
  }

  const extension = adjunto.name.split(".").pop().toLowerCase();
  if (extension !== "pdf") {
    alert("El archivo debe ser un documento PDF.");
    return;
  }
  function registrar() {
    // Mostrar mensaje de éxito
    alert("Formulario del menor enviado correctamente.");

    // Redirigir a otra página después del alert
    window.location.href = "../home/viajero_home.html";
  }

  registrar();
});
