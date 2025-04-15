// menu.js - Gestión dinámica del menú basado en permisos

// URLs de la API (ajusta según tu configuración)
const API_URL_PERMISOS = "https://palegreen-starling-110684.hostingersite.com/permisos.php";

// Objeto para almacenar los permisos actuales
let permisosActuales = {};

/**
 * Función principal que carga los permisos del usuario actual
 */
function cargarPermisosMenu() {
    const perfilId = obtenerIdPerfil();
    
    if (perfilId) {
        cargarPermisosGuardados(perfilId)
            .then(() => actualizarMenuSegunPermisos())
            .catch(error => {
                console.error("Error al cargar permisos:", error);
                mostrarMenuDefault();
            });
    } else {
        mostrarMenuDefault();
    }
}

/**
 * Obtiene el ID del perfil desde localStorage o de donde lo tengas almacenado
 */
function obtenerIdPerfil() {
    // Puedes ajustar esto según cómo manejes la autenticación
    return localStorage.getItem('perfilId') || sessionStorage.getItem('perfilId');
}

/**
 * Carga los permisos guardados desde la API
 */
async function cargarPermisosGuardados(perfilId) {
    try {
        const respuesta = await fetch(`${API_URL_PERMISOS}?perfil_id=${perfilId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!respuesta.ok) throw new Error("Error en la respuesta de la API");

        const data = await respuesta.json();
        
        if (!Array.isArray(data.permisos)) {
            throw new Error("Formato de permisos inválido");
        }

        // Convertir el array de permisos a un objeto más manejable
        permisosActuales = {};
        data.permisos.forEach(permiso => {
            permisosActuales[permiso.modulo_id] = permiso;
        });

        return true;
    } catch (error) {
        console.error("Error al cargar permisos:", error);
        throw error;
    }
}

/**
 * Actualiza la visibilidad del menú según los permisos
 */
function actualizarMenuSegunPermisos() {
    if (!Object.keys(permisosActuales).length) {
        mostrarMenuDefault();
        return;
    }

    // 1. Ocultar todos los submódulos primero
    document.querySelectorAll('.submodulo').forEach(el => {
        el.classList.add('oculto');
    });

    // 2. Mostrar solo los submódulos con permiso de consulta
    Object.entries(permisosActuales).forEach(([moduloId, permiso]) => {
        if (permiso.puede_consultar === 1) {
            const moduloElement = document.getElementById(`submod_${moduloId}`);
            if (moduloElement) {
                moduloElement.classList.remove('oculto');
                marcarPadresComoVisibles(moduloElement);
            }
        }
    });

    // 3. Ocultar módulos padres sin hijos visibles
    ocultarModulosSinHijos();

    // 4. Asegurar que Inicio y Cerrar sesión siempre estén visibles
    document.querySelector('#mainMenu li:first-child').classList.remove('oculto');
    document.querySelector('#mainMenu li:last-child').classList.remove('oculto');
}

/**
 * Marca todos los padres de un elemento como visibles
 */
function marcarPadresComoVisibles(elemento) {
    let parent = elemento.parentNode;
    while (parent && parent !== document) {
        if (parent.tagName === 'UL') {
            const liParent = parent.parentNode;
            if (liParent && liParent.tagName === 'LI') {
                liParent.classList.remove('oculto');
            }
        }
        parent = parent.parentNode;
    }
}

/**
 * Oculta los módulos que no tienen hijos visibles
 */
function ocultarModulosSinHijos() {
    document.querySelectorAll('#mainMenu li').forEach(li => {
        if (li.querySelector('ul')) { // Solo elementos con submenú
            const tieneHijosVisibles = li.querySelector('li:not(.oculto)') !== null;
            if (!tieneHijosVisibles && !li.id.includes('inicio') && !li.id.includes('cerrar')) {
                li.classList.add('oculto');
            }
        }
    });
}

/**
 * Muestra el menú por defecto (sin restricciones)
 */
function mostrarMenuDefault() {
    // Mostrar todos los elementos
    document.querySelectorAll('#mainMenu li, .submodulo').forEach(el => {
        el.classList.remove('oculto');
    });
    
    // Ocultar submenús por defecto (se mostrarán al hover)
    document.querySelectorAll('#mainMenu ul ul').forEach(ul => {
        ul.style.display = 'none';
    });
}

/**
 * Función para cerrar sesión
 */
function handleLogout() {
    // Limpiar almacenamiento
    localStorage.removeItem('perfilId');
    sessionStorage.removeItem('perfilId');
    
    // Redirigir
    window.location.href = 'index.html';
}

// Asignar evento de logout al botón (si existe)
if (document.querySelector('[onclick="handleLogout()"]')) {
    document.querySelector('[onclick="handleLogout()"]').onclick = handleLogout;
}

// Cargar los permisos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarPermisosMenu);

// Hacer las funciones disponibles globalmente si se necesitan desde otras partes
window.menuManager = {
    cargarPermisosMenu,
    actualizarMenuSegunPermisos,
    handleLogout
};