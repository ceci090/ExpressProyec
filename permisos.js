function aplicarPermisos(móduloId) {
    const permisos = JSON.parse(localStorage.getItem('permisos_usuario')) || {};
    const permiso = permisos[móduloId];
  
    if (!permiso) return;
  
    if (permiso.puede_agregar !== 1) {
      document.querySelectorAll('.btn-agregar').forEach(btn => btn.style.display = 'none');
    }
    if (permiso.puede_editar !== 1) {
      document.querySelectorAll('.btn-editar').forEach(btn => btn.style.display = 'none');
    }
    if (permiso.puede_eliminar !== 1) {
      document.querySelectorAll('.btn-eliminar').forEach(btn => btn.style.display = 'none');
    }
  }
  