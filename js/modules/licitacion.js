/**
 * Módulo para la página de Licitación TURNLAB
 * Maneja las funcionalidades específicas de esta sección
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    initLicitacion();
});

/**
 * Inicializa las funcionalidades de la página de licitación
 */
function initLicitacion() {
    'use strict';
    
    // Destacados con animación al hacer scroll
    initDestacadosAnimations();
    
    // Contador de tiempo para la presentación
    initPresentationTimer();
    
    // Animación de progreso de capacitación
    initProgressAnimation();
    
    console.log('Licitación TURNLAB initialized');
}

/**
 * Inicializa las animaciones de las tarjetas de destacados
 */
function initDestacadosAnimations() {
    const destacadoCards = document.querySelectorAll('.destacado-card');
    
    if (!destacadoCards.length) return;
    
    const animateCards = function() {
        destacadoCards.forEach((card, index) => {
            // Verificar si la tarjeta está en el viewport
            const rect = card.getBoundingClientRect();
            const isInViewport = (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
            
            if (isInViewport && !card.classList.contains('animated')) {
                // Agregar clase para evitar repetir la animación
                card.classList.add('animated');
                
                // Aplicar animación con retraso según el índice
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                }, 100 * index);
            }
        });
    };
    
    // Configurar estado inicial
    destacadoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Ejecutar al cargar la página
    animateCards();
    
    // Ejecutar al hacer scroll
    window.addEventListener('scroll', throttle(animateCards, 200));
}

/**
 * Inicializa el contador de tiempo para la presentación
 * Útil para practicar el pitch de 7 minutos
 */
function initPresentationTimer() {
    const presentationSection = document.getElementById('presentacion');
    
    if (!presentationSection) return;
    
    // Crear elemento para el temporizador
    const timerContainer = document.createElement('div');
    timerContainer.className = 'presentation-timer';
    timerContainer.innerHTML = `
        <div class="timer-display">07:00</div>
        <div class="timer-controls">
            <button class="timer-button timer-start"><i class="fas fa-play"></i></button>
            <button class="timer-button timer-reset"><i class="fas fa-redo"></i></button>
        </div>
    `;
    
    // Estilos inline para el temporizador
    timerContainer.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: rgba(15, 111, 239, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    
    timerContainer.querySelector('.timer-display').style.cssText = `
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 8px;
    `;
    
    timerContainer.querySelector('.timer-controls').style.cssText = `
        display: flex;
        gap: 10px;
    `;
    
    timerContainer.querySelectorAll('.timer-button').forEach(button => {
        button.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background-color: white;
            color: #0f6fef;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;
    });
    
    // Agregar a la sección
    const canvaContainer = presentationSection.querySelector('.canva-container');
    if (canvaContainer) {
        canvaContainer.style.position = 'relative';
        canvaContainer.appendChild(timerContainer);
        
        // Lógica del temporizador
        const timerDisplay = timerContainer.querySelector('.timer-display');
        const startButton = timerContainer.querySelector('.timer-start');
        const resetButton = timerContainer.querySelector('.timer-reset');
        let timerInterval;
        let timeLeft = 7 * 60; // 7 minutos en segundos
        let isRunning = false;
        
        // Función para formatear el tiempo
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };
        
        // Botón de inicio/pausa
        startButton.addEventListener('click', function() {
            if (isRunning) {
                // Pausar
                clearInterval(timerInterval);
                this.innerHTML = '<i class="fas fa-play"></i>';
                isRunning = false;
            } else {
                // Iniciar
                if (timeLeft <= 0) timeLeft = 7 * 60;
                
                timerInterval = setInterval(() => {
                    timeLeft--;
                    timerDisplay.textContent = formatTime(timeLeft);
                    
                    // Cambiar color cuando queda poco tiempo
                    if (timeLeft <= 60) {
                        timerDisplay.style.color = '#ff4d4d';
                    }
                    
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        timerDisplay.textContent = '¡Tiempo!';
                        isRunning = false;
                        startButton.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }, 1000);
                
                this.innerHTML = '<i class="fas fa-pause"></i>';
                isRunning = true;
            }
        });
        
        // Botón de reinicio
        resetButton.addEventListener('click', function() {
            clearInterval(timerInterval);
            timeLeft = 7 * 60;
            timerDisplay.textContent = formatTime(timeLeft);
            timerDisplay.style.color = 'white';
            startButton.innerHTML = '<i class="fas fa-play"></i>';
            isRunning = false;
        });
    }
}

/**
 * Inicializa animaciones de progreso para la capacitación
 */
function initProgressAnimation() {
    // Para futura implementación de gráficas de progreso
}

/**
 * Añade destacados o estadísticas interactivas a la página
 */
function addInteractiveStats() {
    // Para futura implementación de estadísticas interactivas
}