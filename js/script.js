document.addEventListener('DOMContentLoaded', () => {


    /* ------------------- intro / hero ---------------- */

    const intro = document.getElementById('intro');
    const btnIngresar = document.getElementById('btn-ingresar');
    const video = document.getElementById('intro-video');
    const audio = document.getElementById('intro-audio');
    const hero = document.querySelector('.hero');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = musicBtn.querySelector('i');

    let isPlaying = false;

    // Helper: updates the floating music button icon
    function updateMusicUI(playing) {
        isPlaying = playing;
        musicIcon.classList.toggle('fa-pause', playing);
        musicIcon.classList.toggle('fa-play', !playing);
    }

    // Helper: attempt to play audio and update UI accordingly
    function tryPlayAudio() {
        audio.muted = false;
        const p = audio.play();
        if (p !== undefined) {
            p.then(() => {
                updateMusicUI(true);
            }).catch(err => {
                console.warn('Audio bloqueado por el navegador:', err);
                updateMusicUI(false);
            });
        }
    }

    let hasEntered = false;

    // IMPORTANT: Use ONLY 'click' — NOT 'touchstart'.
    // 'touchstart' fires before the browser formally registers it as a user gesture.
    // On Android Chrome and iOS Safari, only a real 'click' (pointerup) unlocks the
    // audio context. Using 'touchstart' on top of 'click' was causing a double-fire
    // where the touchstart failed silently and consumed the gesture lock.
    btnIngresar.addEventListener('click', () => {
        if (hasEntered) return;
        hasEntered = true;

        // Play audio immediately inside the click handler — this is the trusted user gesture
        tryPlayAudio();

        // Play video (muted — required by all mobile browsers for autoplay)
        video.muted = true;
        video.play().catch(err => console.warn('Video play failed:', err));

        intro.classList.add('playing');

        setTimeout(() => {
            intro.classList.add('fade-out');
            hero.classList.remove('hidden');
            musicBtn.classList.remove('hidden');

            setTimeout(() => {
                intro.style.display = 'none';
            }, 1000);
        }, 9000);
    });

    // Music Control Toggle
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            updateMusicUI(false);
        } else {
            tryPlayAudio();
        }
    });


    /* ------------------- fotos ---------------- */

    // Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
        Carousel: {
            infinite: true,
        },
    });

    // Carousel elements — declared INSIDE DOMContentLoaded so DOM is ready
    const track = document.querySelector('.carousel__track');
    const carouselContainer = document.querySelector('.fotos__carousel');
    const slides = Array.from(document.querySelectorAll('.carousel__slide'));
    let currentIndex = 0;

    function updateCarousel() {
        const slideWidth = 85;
        const offset = (100 - slideWidth) / 2;
        const transformValue = -(currentIndex * slideWidth) + offset;
        track.style.transform = `translateX(${transformValue}%)`;

        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    // Auto-play
    let carouselInterval = setInterval(nextSlide, 3500);

    // Initial state
    updateCarousel();

    // Drag & Touch Support
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let isSwiping = false;

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function setSliderPosition() {
        const slideWidth = 85;
        const offset = (100 - slideWidth) / 2;
        const baseTransform = -(currentIndex * slideWidth) + offset;
        track.style.transform = `translateX(calc(${baseTransform}% + ${currentTranslate}px))`;
    }

    function dragStart(event) {
        if (event.type === 'mousedown') {
            event.preventDefault();
        }
        isDragging = true;
        isSwiping = false;
        startPos = getPositionX(event);
        clearInterval(carouselInterval);
        track.style.transition = 'none';
    }

    function dragMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = currentPosition - startPos;
        if (Math.abs(currentTranslate) > 5) {
            isSwiping = true;
        }
        setSliderPosition();
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

        if (currentTranslate < -50) {
            nextSlide();
        } else if (currentTranslate > 50) {
            prevSlide();
        } else {
            updateCarousel(); // Snap back
        }

        currentTranslate = 0;
        carouselInterval = setInterval(nextSlide, 3500);
    }

    // Mouse events
    carouselContainer.addEventListener('mousedown', dragStart);
    carouselContainer.addEventListener('mousemove', dragMove);
    carouselContainer.addEventListener('mouseup', dragEnd);
    carouselContainer.addEventListener('mouseleave', () => {
        if (isDragging) dragEnd();
    });

    // Touch events
    carouselContainer.addEventListener('touchstart', dragStart, { passive: true });
    carouselContainer.addEventListener('touchmove', dragMove, { passive: true });
    carouselContainer.addEventListener('touchend', dragEnd, { passive: true });

    // Prevent Fancybox from opening if the user was swiping
    track.addEventListener('click', (e) => {
        if (isSwiping) {
            e.preventDefault();
            e.stopImmediatePropagation();
            isSwiping = false; // Reset
        }
    }, true);

    /* ------------------- Musica Lightbox ---------------- */
    const WHATSAPP_NUMBER = '543813359263';
    const btnSugerir = document.getElementById('btn-sugerir-cancion');
    const lightboxMusica = document.getElementById('lightbox-musica');
    const btnCloseLightbox = document.getElementById('btn-close-lightbox');
    const formMusica = document.getElementById('form-musica');

    if (btnSugerir && lightboxMusica && btnCloseLightbox && formMusica) {
        btnSugerir.addEventListener('click', () => {
            lightboxMusica.classList.remove('hidden');
        });

        btnCloseLightbox.addEventListener('click', () => {
            lightboxMusica.classList.add('hidden');
        });

        lightboxMusica.addEventListener('click', (e) => {
            if (e.target === lightboxMusica) {
                lightboxMusica.classList.add('hidden');
            }
        });

        formMusica.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre-invitado').value;
            const cancion = document.getElementById('nombre-cancion').value;
            const link = document.getElementById('link-youtube').value;

            let mensaje = `¡Hola! Soy ${nombre} y quiero sugerir una canción para la fiesta:%0A`;
            mensaje += `🎵 Canción: ${cancion}%0A`;
            if (link) {
                mensaje += `🔗 Link: ${link}`;
            }

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
            window.open(url, '_blank');
            lightboxMusica.classList.add('hidden');
            formMusica.reset();
        });
    }

    /* ------------------- Dress Code Lightbox ---------------- */
    const btnDresscode = document.getElementById('btn-ver-dresscode');
    const lightboxDresscode = document.getElementById('lightbox-dresscode');
    const btnCloseDresscode = document.getElementById('btn-close-dresscode');

    if (btnDresscode && lightboxDresscode && btnCloseDresscode) {
        btnDresscode.addEventListener('click', () => {
            lightboxDresscode.classList.remove('hidden');
        });

        btnCloseDresscode.addEventListener('click', () => {
            lightboxDresscode.classList.add('hidden');
        });

        lightboxDresscode.addEventListener('click', (e) => {
            if (e.target === lightboxDresscode) {
                lightboxDresscode.classList.add('hidden');
            }
        });
    }

    /* ------------------- Tips y Notas Lightbox ---------------- */
    const btnTips = document.getElementById('btn-ver-tips');
    const lightboxTips = document.getElementById('lightbox-tips');
    const btnCloseTips = document.getElementById('btn-close-tips');

    if (btnTips && lightboxTips && btnCloseTips) {
        btnTips.addEventListener('click', () => {
            lightboxTips.classList.remove('hidden');
        });

        btnCloseTips.addEventListener('click', () => {
            lightboxTips.classList.add('hidden');
        });

        lightboxTips.addEventListener('click', (e) => {
            if (e.target === lightboxTips) {
                lightboxTips.classList.add('hidden');
            }
        });
    }

    /* ------------------- Regalos Lightbox ---------------- */
    const btnRegalos = document.getElementById('btn-ver-regalos');
    const lightboxRegalos = document.getElementById('lightbox-regalos');
    const btnCloseRegalos = document.getElementById('btn-close-regalos');

    if (btnRegalos && lightboxRegalos && btnCloseRegalos) {
        btnRegalos.addEventListener('click', () => {
            lightboxRegalos.classList.remove('hidden');
        });

        btnCloseRegalos.addEventListener('click', () => {
            lightboxRegalos.classList.add('hidden');
        });

        lightboxRegalos.addEventListener('click', (e) => {
            if (e.target === lightboxRegalos) {
                lightboxRegalos.classList.add('hidden');
            }
        });
    }

    // Copiar al portapapeles (Global)
    window.copiarTexto = function (idElemento, boton) {
        const texto = document.getElementById(idElemento).innerText;
        navigator.clipboard.writeText(texto).then(() => {
            const textoOriginal = boton.innerText;
            boton.innerText = '¡Copiado!';
            boton.style.backgroundColor = 'var(--accent-gold)';
            boton.style.color = 'white';

            setTimeout(() => {
                boton.innerText = textoOriginal;
                boton.style.backgroundColor = 'transparent';
                boton.style.color = 'var(--accent-gold)';
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar: ', err);
        });
    };


    /* ------------------- Temporizador ---------------- */
    const targetDate = new Date("october 24, 2026 22:00:00").getTime();

    const diasEl = document.getElementById('dias');
    const horasEl = document.getElementById('horas');
    const minutosEl = document.getElementById('minutos');
    const segundosEl = document.getElementById('segundos');

    if (diasEl && horasEl && minutosEl && segundosEl) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                diasEl.innerText = "0";
                horasEl.innerText = "0";
                minutosEl.innerText = "0";
                segundosEl.innerText = "0";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            diasEl.innerText = days;
            horasEl.innerText = hours;
            minutosEl.innerText = minutes;
            segundosEl.innerText = seconds;
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

});
// ---------------------menu----------------------


document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('precio__toggle-btn');
    const mostrarSection = document.getElementById('precio__mostrar');
    const copyCbuBtn = document.getElementById('precio__copy-cbu');
    const copyAliasBtn = document.getElementById('precio__copy-alias');

    // Toggle bank details
    toggleBtn.addEventListener('click', () => {
        mostrarSection.classList.toggle('active');
        toggleBtn.textContent = mostrarSection.classList.contains('active')
            ? 'Ocultar datos bancarios'
            : 'Ver datos bancarios para pagos';
    });

    // Función común para copiar texto (para CBU y Alias)
    const copiarTexto = (button, elementSelector) => {
        const element = document.querySelector(elementSelector);
        if (element) {
            const text = element.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                button.textContent = `¡${elementSelector === '.precio__CBU' ? 'CBU' : 'Alias'} Copiado!`;
                setTimeout(() => {
                    button.textContent = `Copiar ${elementSelector === '.precio__CBU' ? 'CBU' : 'Alias'}`;
                }, 2000);
            });
        } else {
            // Si el elemento no existe, cambia el texto del botón para informar al usuario
            button.textContent = `${elementSelector === '.precio__CBU' ? 'CBU' : 'Alias'} no disponible`;
            setTimeout(() => {
                button.textContent = `Copiar ${elementSelector === '.precio__CBU' ? 'CBU' : 'Alias'}`;
            }, 2000);
        }
    };

    // Copy CBU
    if (copyCbuBtn) {
        copyCbuBtn.addEventListener('click', () => {
            copiarTexto(copyCbuBtn, '.precio__CBU');
        });
    }

    // Copy Alias
    if (copyAliasBtn) {
        copyAliasBtn.addEventListener('click', () => {
            copiarTexto(copyAliasBtn, '.precio__alias');
        });
    }

    // Lightbox del menú
    const btnAbrir = document.querySelector('.foto__menu');
    const lightbox = document.getElementById('menuFotoLightbox');
    const btnCerrar = document.getElementById('menuFotoCerrar');
    const overlay = document.querySelector('.menuFoto-overlay');

    // Abrir lightbox
    btnAbrir.addEventListener('click', () => {
        lightbox.style.display = 'block';
        setTimeout(() => lightbox.classList.add('activo'), 10);
    });

    // Cerrar lightbox
    const cerrarLightbox = () => {
        lightbox.classList.remove('activo');
        setTimeout(() => (lightbox.style.display = 'none'), 0);
    };

    btnCerrar.addEventListener('click', cerrarLightbox);
    overlay.addEventListener('click', cerrarLightbox);

    // Prevenir cierre al hacer click en la imagen
    document.querySelector('.menuFoto-imagen').addEventListener('click', (e) => {
        e.stopPropagation();
    });
});


// --------------- confirmacion --------------------------------------


document.addEventListener('DOMContentLoaded', function () {
    // Definir los números de teléfono
    const recipientNumber1 = '543813359263'; // Número para el primer botón
    const recipientNumber2 = '543815897911'; // Número para el segundo botón

    // Función para enviar mensaje por WhatsApp
    function sendMessage(phoneNumber) {
        const userName = document.getElementById('userFullName').value.trim();
        const userMessage = document.getElementById('customMessage').value.trim();
        const attendanceStatus = document.querySelector('input[name="attendanceOption"]:checked');

        if (!attendanceStatus) {
            alert('Por favor, selecciona si asistirás o no.');
            return;
        }

        if (userName === '') {
            alert('Por favor, completa todos los campos antes de enviar.');
            return;
        }

        const alimenticioSeleccionado = document.querySelector('input[name="alimenticioOption"]:checked');
        let restriccionAlimenticia = 'N/A';
        if (alimenticioSeleccionado) {
            const selectedId = alimenticioSeleccionado.id;
            switch (selectedId) {
                case 'celiaca':
                    restriccionAlimenticia = 'Celíac@';
                    break;
                case 'vegetariana':
                    restriccionAlimenticia = 'Vegetarian@';
                    break;
                case 'hipertesion':
                    restriccionAlimenticia = 'Hipertensión';
                    break;
                case 'diabetica':
                    restriccionAlimenticia = 'Diabétic@';
                    break;
                case 'ninguna':
                    restriccionAlimenticia = 'Ninguna';
                    break;
            }
        }

        const finalMessage = `*Presencia:* ${attendanceStatus.value}\n*Nombre y Apellido:* ${userName}\n*Restricción alimenticia:* ${restriccionAlimenticia}\n*Mensaje:* ${userMessage ? userMessage : 'N/A'}`;
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;

        // iOS Safari bloquea window.open (popups/PWA). Navegar directo funciona en todos:
        window.location.href = whatsappLink;
    }

    // Asignar eventos a los botones
    document.getElementById('btnConfirmacion1').addEventListener('click', function () {
        sendMessage(recipientNumber1);
    });

    document.getElementById('btnConfirmacion2').addEventListener('click', function () {
        sendMessage(recipientNumber2);
    });
});