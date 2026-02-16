humhub.module('effects.fireworks', function(module, require, $) {
    var event = require('event');
    var particles = [];
    var canvas;
    var context;
    var animationFrame;
    var burstTimer;
    var resizeTimeout;
    var initialized = false;
    var style;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getViewportWidth() {
        return window.innerWidth || $(window).width();
    }

    function getViewportHeight() {
        return window.innerHeight || $(window).height();
    }

    function getBurstParticleCount() {
        var width = getViewportWidth();
        if (width < 576) {
            return 22;
        }
        if (width < 992) {
            return 34;
        }

        return 46;
    }

    function getBurstInterval() {
        var width = getViewportWidth();
        if (width < 576) {
            return 1300;
        }
        if (width < 992) {
            return 1050;
        }

        return 850;
    }

    function addStyles() {
        if (!style) {
            style = $('<style id="fireworks-style">');
            style.text(`
                .fireworks-canvas {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                }
            `);
            $('head').append(style);
        }
    }

    function ensureCanvas() {
        if (!canvas) {
            canvas = $('<canvas class="fireworks-canvas" aria-hidden="true"></canvas>')[0];
            $('body').append(canvas);
            context = canvas.getContext('2d');
        }
        resizeCanvas();
    }

    function resizeCanvas() {
        if (!canvas) {
            return;
        }

        canvas.width = getViewportWidth();
        canvas.height = getViewportHeight();
    }

    function getRandomColor() {
        var palette = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb', '#ffab40'];
        return palette[Math.floor(Math.random() * palette.length)];
    }

    function createParticle(x, y, color) {
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 3 + 1.5;

        return {
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.045,
            friction: 0.985,
            size: Math.random() * 1.8 + 1.2,
            life: 85,
            maxLife: 85,
            color: color
        };
    }

    function launchBurst(particleCount) {
        if (!canvas) {
            return;
        }

        var x = Math.random() * canvas.width;
        var y = Math.random() * (canvas.height * 0.55) + 40;
        var color = getRandomColor();
        for (var i = 0; i < particleCount; i++) {
            particles.push(createParticle(x, y, color));
        }
    }

    function drawParticles() {
        if (!context || !canvas) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'lighter';

        for (var i = particles.length - 1; i >= 0; i--) {
            var particle = particles[i];
            particle.vx *= particle.friction;
            particle.vy = (particle.vy * particle.friction) + particle.gravity;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;

            if (particle.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            context.globalAlpha = particle.life / particle.maxLife;
            context.fillStyle = particle.color;
            context.beginPath();
            context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            context.fill();
        }

        context.globalAlpha = 1;
        context.globalCompositeOperation = 'source-over';
    }

    function animate() {
        drawParticles();
        animationFrame = window.requestAnimationFrame(animate);
    }

    function startBurstTimer() {
        clearInterval(burstTimer);
        burstTimer = setInterval(function() {
            launchBurst(getBurstParticleCount());
        }, getBurstInterval());
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            resizeCanvas();
            startBurstTimer();
        }, 250);
    }

    function cleanup() {
        clearInterval(burstTimer);
        clearTimeout(resizeTimeout);
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
        particles = [];
        $(window).off('resize.fireworks');

        if (canvas) {
            $(canvas).remove();
            canvas = null;
            context = null;
        }
    }

    function startFireworks() {
        if (prefersReducedMotion()) {
            cleanup();
            return;
        }

        cleanup();
        addStyles();
        ensureCanvas();
        launchBurst(getBurstParticleCount());
        startBurstTimer();
        animate();
        $(window).on('resize.fireworks', handleResize);
        initialized = true;
    }

    function init() {
        if (!initialized) {
            startFireworks();
            initialized = true;
        }
    }

    module.export({
        start: startFireworks,
        init: init
    });

    $(document).ready(function() {
        init();
    });

    event.on('humhub:ready', function() {
        init();
    });

    event.on('humhub:modules:content:afterInsert', init);
    event.on('humhub:content:afterMove', init);
    event.on('humhub:content:afterDelete', init);
});
