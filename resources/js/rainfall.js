humhub.module('effects.rainfall', function(module, require, $) {
    var event = require('event');
    var baseRainDropCount = 100;
    var rainDrops = [];
    var resizeTimeout;
    var initialized = false;
    var style;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getRainDropCount() {
        var width = window.innerWidth || $(window).width();
        if (width < 576) {
            return 36;
        }
        if (width < 992) {
            return 70;
        }

        return baseRainDropCount;
    }

    function createRainDrop() {
        var raindrop = $('<div class="raindrop">|</div>');
        return raindrop;
    }

    function updateRainDropPositions() {
        var windowWidth = window.innerWidth || $(window).width();
        rainDrops.forEach(function(raindrop) {
            raindrop.css('left', (Math.random() * windowWidth) + 'px');
        });
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateRainDropPositions, 250);
    }

    function cleanup() {
        rainDrops.forEach(function(raindrop) {
            raindrop.remove();
        });
        rainDrops = [];
        clearTimeout(resizeTimeout);
        $(window).off('resize.rainfall');
    }

    function addStyles() {
        if (!style) {
            style = $('<style id="rainfall-style">');
            style.text(`
                .raindrop {
                    position: fixed;
                    top: -10px;
                    color: rgba(174, 194, 224, 0.6);
                    pointer-events: none;
                    user-select: none;
                    z-index: 9999;
                    animation: rainfall linear infinite;
                    text-shadow: rgba(0, 0, 0, 0.2) 1px 1px 1px;
                    font-size: 14px;
                    font-weight: 100;
                    transform: scaleY(2);
                    will-change: transform, opacity;
                }
                @keyframes rainfall {
                    0% {
                        transform: translateY(-10px) scaleY(2) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) scaleY(2) rotate(0deg);
                        opacity: 0;
                    }
                }
            `);
            $('head').append(style);
        }
    }

    function startRainfall() {
        if (prefersReducedMotion()) {
            cleanup();
            return;
        }

        cleanup();
        
        addStyles();
        var windowWidth = window.innerWidth || $(window).width();
        var rainDropCount = getRainDropCount();
        for (var i = 0; i < rainDropCount; i++) {
            var raindrop = createRainDrop();
            if (raindrop) {
                var randomTop = Math.random() * -100;
                raindrop.css({
                    left: (Math.random() * windowWidth) + 'px',
                    top: randomTop + 'px',
                    animationDuration: (Math.random() * 0.5 + 0.5) + 's',
                    animationDelay: '-' + (Math.random() * 2) + 's'
                });
                rainDrops.push(raindrop);
            }
        }
        $('body').append(rainDrops);
        $(window).on('resize.rainfall', handleResize);
        initialized = true;
    }

    function init() {
        if (!initialized) {
            startRainfall();
            initialized = true;
        }
    }

    module.export({
        start: startRainfall,
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
