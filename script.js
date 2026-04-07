document.addEventListener('DOMContentLoaded', function() {
    
    // --- MÓDULO // LOADER BOOT SEQUENCE ---
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loader-bar');
    const text = document.getElementById('loader-text');
    const perc = document.getElementById('loader-perc');
    
    const messages = [
        "BOOTING_OS...",
        "MOUNTING_DRIVES_RTX4060...",
        "LOADING_DATABASE_CRUZEIRO...",
        "ESTABLISHING_NEURAL_LINK...",
        "SYSTEM_READY."
    ];

    let progress = 0;
    let msgIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 18; // Loader um pouco mais rápido
        if (progress > 100) progress = 100;
        
        bar.style.width = `${progress}%`;
        perc.innerText = `${Math.floor(progress)}%`;
        
        if (progress > (100 / messages.length) * msgIndex) {
            text.innerText = messages[msgIndex];
            msgIndex++;
        }

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.classList.remove('overflow-hidden');
                }, 700);
            }, 500);
        }
    }, 120);


    // --- MÓDULO // MATRIX DATA STREAM (Hex/Bin) ---
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    // Configuração do tamanho (ocupa a tela toda)
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres técnicos (Hexadecimais e Binários)
    const chars = "0123456789ABCDEF01";
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    // Inicializa as gotas (uma por coluna)
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    // Função de desenho da chuva de dados
    function drawMatrix() {
        // Fundo preto semi-transparente para o efeito de rastro
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cor do texto (roxo neon com brilho)
        ctx.fillStyle = '#a855f7'; 
        ctx.font = fontSize + 'px "JetBrains Mono"';

        // Desenha os caracteres
        for (let i = 0; i < drops.length; i++) {
            // Pega um caractere aleatório
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Desenha o caractere na posição (x, y)
            // x = i * fontSize (coluna), y = drops[i] * fontSize (linha)
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reseta a gota se ela chegar no final da tela
            // Adiciona aleatoriedade para não resetarem todas juntas
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Move a gota para baixo
            drops[i]++;
        }
    }

    // Roda a animação (taxa de quadros controlada para não pesar)
    setInterval(drawMatrix, 50);


    // --- MÓDULO // INTERSECTION OBSERVER (Reveals) ---
    // Reaproveitando a lógica de reveal para os novos componentes
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona animação do Animate.css
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplica o observer nos cards e na seção de stack
    document.querySelectorAll('.hw-card, #stack').forEach(el => {
        observer.observe(el);
    });
});

// --- MÓDULO // CURSOR CUSTOMIZADO ---
const cursor = document.getElementById('custom-cursor');
const clickableElements = document.querySelectorAll('.custom-hover');

// Faz o cursor seguir o mouse
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Efeitos de 'hover' nos elementos clicáveis
clickableElements.forEach(el => {
    el.addEventListener('mouseover', () => {
        // Aumenta o tamanho e muda a cor no hover
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursor.style.borderColor = 'white';
        cursor.style.mixBlendMode = 'normal'; // Desativa o blend mode no hover
    });

    el.addEventListener('mouseleave', () => {
        // Reseta o tamanho e a cor
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderColor = 'var(--neon)';
        cursor.style.mixBlendMode = 'difference';
    });
});