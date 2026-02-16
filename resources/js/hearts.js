humhub.module('effects.hearts', function(module, require, $) {
    var event = require('event');
    var baseHeartCount = 42;
    var hearts = [];
    var resizeTimeout;
    var initialized = false;
    var style;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getHeartCount() {
        var width = window.innerWidth || $(window).width();
        if (width < 576) {
            return 18;
        }
        if (width < 992) {
            return 28;
        }

        return baseHeartCount;
    }

    function createHeart() {
        return $('<div class="heart-effect" aria-hidden="true">\u2764</div>');
    }

    function updateHeartPositions() {
        var windowWidth = window.innerWidth || $(window).width();
        hearts.forEach(function(heart) {
            heart.css('left', (Math.random() * windowWidth) + 'px');
        });
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateHeartPositions, 250);
    }

    function cleanup() {
        hearts.forEach(function(heart) {
            heart.remove();
        });
        hearts = [];
        clearTimeout(resizeTimeout);
        $(window).off('resize.hearts');
    }

    function addStyles() {
        if (!style) {
            style = $('<style id="hearts-style">');
            style.text(`
                .heart-effect {
                    position: fixed;
                    top: -10px;
                    pointer-events: none;
                    user-select: none;
                    z-index: 9999;
                    animation: heartsFall linear infinite;
                    text-shadow: rgba(0, 0, 0, 0.2) 1px 1px 2px;
                    will-change: transform, opacity;
                }
                @keyframes heartsFall {
                    0% {
                        transform: translate3d(0, -10px, 0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    45% {
                        transform: translate3d(20px, 45vh, 0) rotate(160deg);
                    }
                    75% {
                        transform: translate3d(-24px, 75vh, 0) rotate(280deg);
                    }
                    100% {
                        transform: translate3d(12px, 100vh, 0) rotate(360deg);
                        opacity: 0;
                    }
                }
            `);
            $('head').append(style);
        }
    }

    function startHearts() {
        if (prefersReducedMotion()) {
            cleanup();
            return;
        }

        cleanup();
        addStyles();

        var colors = ['#e91e63', '#f06292', '#ef5350', '#ff80ab', '#ec407a'];
        var windowWidth = window.innerWidth || $(window).width();
        var heartCount = getHeartCount();

        for (var i = 0; i < heartCount; i++) {
            var heart = createHeart();
            var size = Math.floor(Math.random() * 10) + 14;
            heart.css({
                left: (Math.random() * windowWidth) + 'px',
                top: (Math.random() * -120) + 'px',
                color: colors[Math.floor(Math.random() * colors.length)],
                fontSize: size + 'px',
                animationDuration: (Math.random() * 4 + 4) + 's',
                animationDelay: '-' + (Math.random() * 8) + 's'
            });
            hearts.push(heart);
        }

        $('body').append(hearts);
        $(window).on('resize.hearts', handleResize);
        initialized = true;
    }

    function init() {
        if (!initialized) {
            startHearts();
            initialized = true;
        }
    }

    module.export({
        start: startHearts,
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
