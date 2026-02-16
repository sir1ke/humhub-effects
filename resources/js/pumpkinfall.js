humhub.module('effects.pumpkinfall', function(module, require, $) {
    var event = require('event');
    var basePumpkinCount = 36;
    var pumpkins = [];
    var resizeTimeout;
    var initialized = false;
    var style;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getPumpkinCount() {
        var width = window.innerWidth || $(window).width();
        if (width < 576) {
            return 14;
        }
        if (width < 992) {
            return 24;
        }

        return basePumpkinCount;
    }

    function createPumpkin() {
        return $(`<div class="pumpkin">
            <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true" focusable="false">
                <ellipse cx="32" cy="36" rx="21" ry="17" class="pumpkin-shell"></ellipse>
                <ellipse cx="20" cy="36" rx="8" ry="14" class="pumpkin-ridge"></ellipse>
                <ellipse cx="44" cy="36" rx="8" ry="14" class="pumpkin-ridge"></ellipse>
                <rect x="28" y="11" width="8" height="9" rx="2" class="pumpkin-stem"></rect>
            </svg>
        </div>`);
    }

    function updatePumpkinPositions() {
        var windowWidth = window.innerWidth || $(window).width();
        pumpkins.forEach(function(pumpkin) {
            pumpkin.css('left', (Math.random() * windowWidth) + 'px');
        });
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updatePumpkinPositions, 250);
    }

    function cleanup() {
        pumpkins.forEach(function(pumpkin) {
            pumpkin.remove();
        });
        pumpkins = [];
        clearTimeout(resizeTimeout);
        $(window).off('resize.pumpkinFall');
    }

    function addStyles() {
        if (!style) {
            style = $('<style id="pumpkinfall-style">');
            style.text(`
                .pumpkin {
                    position: fixed;
                    top: -10px;
                    pointer-events: none;
                    user-select: none;
                    z-index: 9999;
                    animation: pumpkinFallAnim linear infinite;
                    will-change: transform;
                }
                .pumpkin-shell {
                    fill: currentColor;
                }
                .pumpkin-ridge {
                    fill: rgba(0, 0, 0, 0.08);
                }
                .pumpkin-stem {
                    fill: #6d4c41;
                }
                @keyframes pumpkinFallAnim {
                    0% {
                        transform: translate3d(0, -10px, 0) rotate(0deg);
                    }
                    30% {
                        transform: translate3d(22px, 30vh, 0) rotate(95deg);
                    }
                    60% {
                        transform: translate3d(-20px, 60vh, 0) rotate(210deg);
                    }
                    100% {
                        transform: translate3d(10px, 100vh, 0) rotate(360deg);
                    }
                }
            `);
            $('head').append(style);
        }
    }

    function startPumpkinFall() {
        if (prefersReducedMotion()) {
            cleanup();
            return;
        }

        cleanup();
        addStyles();

        var colors = ['#ff8f00', '#fb8c00', '#f57c00', '#ef6c00', '#ff9800'];
        var windowWidth = window.innerWidth || $(window).width();
        var pumpkinCount = getPumpkinCount();

        for (var i = 0; i < pumpkinCount; i++) {
            var pumpkin = createPumpkin();
            var randomTop = Math.random() * -120;
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            pumpkin.css({
                left: (Math.random() * windowWidth) + 'px',
                top: randomTop + 'px',
                color: randomColor,
                animationDuration: (Math.random() * 5 + 7) + 's',
                animationDelay: '-' + (Math.random() * 12) + 's',
                transform: 'scale(' + (Math.random() * 0.4 + 0.7) + ')',
                filter: 'drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.2))'
            });

            pumpkins.push(pumpkin);
        }

        $('body').append(pumpkins);
        $(window).on('resize.pumpkinFall', handleResize);
        initialized = true;
    }

    function init() {
        if (!initialized) {
            startPumpkinFall();
            initialized = true;
        }
    }

    module.export({
        start: startPumpkinFall,
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
