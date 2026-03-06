/**
 * Main JavaScript
 */

// Navegación móvil
const Navigation = (() => {
    const init = () => {
        const botonMenu = document.querySelector('.nav__toggle');
        const menuNavegacion = document.querySelector('.nav__menu');

        if (!botonMenu || !menuNavegacion) return;
        
        botonMenu.addEventListener('click', () => {
            menuNavegacion.classList.toggle('active');
        });

        document.querySelectorAll('.nav__link').forEach(enlace => {
            enlace.addEventListener('click', () => {
                menuNavegacion.classList.remove('active');
            });
        });
    };

    return { init };
})();

// Formulario de contacto con Web3Forms
const ContactForm = (() => {
    const init = () => {
        const formulario = document.getElementById('contactForm');
        if (!formulario) return;
        formulario.addEventListener('submit', enviarFormulario);
    };

    const enviarFormulario = async (evento) => {
        evento.preventDefault();
        
        const formulario = evento.target;
        const botonEnviar = formulario.querySelector('button[type="submit"]');
        const contenedorResultado = document.getElementById('formularioResultado');
        const textoOriginalBoton = botonEnviar.textContent;
        
        // Deshabilitar botón mientras se envía
        botonEnviar.disabled = true;
        botonEnviar.textContent = 'Enviando...';
        
        // Limpiar mensaje anterior
        if (contenedorResultado) {
            contenedorResultado.textContent = '';
            contenedorResultado.className = 'form__resultado';
        }

        try {
            const datosFormulario = new FormData(formulario);
            
            const respuesta = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: datosFormulario
            });

            const resultado = await respuesta.json();

            if (resultado.success) {
                mostrarMensaje(contenedorResultado, '✅ ¡Gracias por tu mensaje! Te contactaremos pronto.', 'exito');
                formulario.reset();
            } else {
                throw new Error(resultado.message || 'Error al enviar el formulario');
            }
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            mostrarMensaje(contenedorResultado, '❌ Hubo un error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
        } finally {
            // Restaurar botón
            botonEnviar.disabled = false;
            botonEnviar.textContent = textoOriginalBoton;
        }
    };

    const mostrarMensaje = (contenedor, mensaje, tipo) => {
        if (contenedor) {
            contenedor.textContent = mensaje;
            contenedor.className = `form__resultado form__resultado--${tipo}`;
        } else {
            alert(mensaje);
        }
    };

    return { init };
})();

// Carrusel de noticias
const Carousel = (() => {
    const init = () => {
        const contenedorNoticias = document.getElementById('noticias-container');
        const botonIzquierdo = document.querySelector('.carousel__btn--left');
        const botonDerecho = document.querySelector('.carousel__btn--right');

        if (!contenedorNoticias || !botonIzquierdo || !botonDerecho) return;

        const calcularDesplazamiento = () => {
            const tarjetaNoticia = contenedorNoticias.querySelector('.news-card');
            if (!tarjetaNoticia) return 300;
            return tarjetaNoticia.offsetWidth + 24;
        };

        botonDerecho.addEventListener('click', () => {
            const desplazamientoMaximo = contenedorNoticias.scrollWidth - contenedorNoticias.clientWidth;

            if (contenedorNoticias.scrollLeft >= desplazamientoMaximo - 10) {
                contenedorNoticias.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                contenedorNoticias.scrollBy({ left: calcularDesplazamiento(), behavior: 'smooth' });
            }
        });

        botonIzquierdo.addEventListener('click', () => {
            if (contenedorNoticias.scrollLeft <= 10) {
                contenedorNoticias.scrollTo({ left: contenedorNoticias.scrollWidth, behavior: 'smooth' });
            } else {
                contenedorNoticias.scrollBy({ left: -calcularDesplazamiento(), behavior: 'smooth' });
            }
        });
    };

    return { init };
})();

// Verificar si las secciones ya se cargaron O esperar el evento
const inicializarCuandoSeccionesEstenListas = () => {
    const navegacionExiste = document.querySelector('.nav__toggle');
    
    if (navegacionExiste) {
        Navigation.init();
        ContactForm.init();
    } else {
        document.addEventListener('sectionsLoaded', () => {
            Navigation.init();
            ContactForm.init();
        });
    }
};

inicializarCuandoSeccionesEstenListas();

// Inicializar carrusel cuando las noticias estén listas
document.addEventListener('noticiasLoaded', () => {
    Carousel.init();
});