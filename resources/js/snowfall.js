humhub.module('effects.snowfall', function(module, require, $) {
    var event = require('event');
    var baseSnowflakeCount = 50;
    var snowflakes = [];
    var resizeTimeout;
    var initialized = false;
    var style;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getSnowflakeCount() {
        var width = window.innerWidth || $(window).width();
        if (width < 576) {
            return 18;
        }
        if (width < 992) {
            return 30;
        }

        return baseSnowflakeCount;
    }

    function createSnowflake() {
        var snowflake = $('<div class="snowflake">❄</div>');
        return snowflake;
    }

    function updateSnowflakePositions() {
        var windowWidth = window.innerWidth || $(window).width();
        snowflakes.forEach(function(snowflake) {
            snowflake.css('left', (Math.random() * windowWidth) + 'px');
        });
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateSnowflakePositions, 250);
    }

    function cleanup() {
        snowflakes.forEach(function(snowflake) {
            snowflake.remove();
        });
        snowflakes = [];
        clearTimeout(resizeTimeout);
        $(window).off('resize.snowfall');
    }

    function addStyles() {
        if (!style) {
            style = $('<style id="snowfall-style">');
            style.text(`
                .snowflake {
                    position: fixed;
                    top: -10px;
                    color: #fff;
                    pointer-events: none;
                    user-select: none;
                    z-index: 9999;
                    animation: snowfall linear infinite;
                    text-shadow: rgba(0, 0, 0, 0.3) 1px 1px 2px;
                    will-change: transform;
                }
                @keyframes snowfall {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                    }
                }
            `);
            $('head').append(style);
        }
    }

    function startSnowfall() {
        if (prefersReducedMotion()) {
            cleanup();
            return;
        }

        cleanup();
        addStyles();

        var windowWidth = window.innerWidth || $(window).width();
        var snowflakeCount = getSnowflakeCount();
        for (var i = 0; i < snowflakeCount; i++) {
            var snowflake = createSnowflake();
            if (snowflake) {
                var randomTop = Math.random() * -100;
                snowflake.css({
                    left: (Math.random() * windowWidth) + 'px',
                    top: randomTop + 'px',
                    animationDuration: (Math.random() * 3 + 2) + 's',
                    animationDelay: '-' + (Math.random() * 5) + 's'
                });

                snowflakes.push(snowflake);
            }
        }
        $('body').append(snowflakes);

        // Add window resize handler
        $(window).on('resize.snowfall', handleResize);

        initialized = true;
    }

    function init() {
        if (!initialized) {
            startSnowfall();
            initialized = true;
        }
    }

    module.export({
        start: startSnowfall,
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
