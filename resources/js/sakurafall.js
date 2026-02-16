humhub.module('effects.sakurafall', function(module, require, $) {
    var event = require('event');
    var baseBlossomCount = 50;
    var blossoms = [];
    var resizeTimeout;
    var initialized = false;
    var style;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getBlossomCount() {
        var width = window.innerWidth || $(window).width();
        if (width < 576) {
            return 18;
        }
        if (width < 992) {
            return 30;
        }

        return baseBlossomCount;
    }

    function createBlossom() {
        var blossom = $(`<div class="blossom">
            <svg viewBox="0 0 30 30" width="20" height="20">
                <path d="M15 3 C20 3, 25 8, 25 15 C25 22, 20 27, 15 27 C10 27, 5 22, 5 15 C5 8, 10 3, 15 3 
                        Q15 8, 18 15 Q15 22, 15 27 Q15 22, 12 15 Q15 8, 15 3" 
                    fill="#ffd7e5"/>
            </svg>
        </div>`);

        return blossom;
    }

    function updateBlossomPositions() {
        var windowWidth = window.innerWidth || $(window).width();

        blossoms.forEach(function(blossom) {
            blossom.css('left', (Math.random() * windowWidth) + 'px');
        });
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateBlossomPositions, 250);
    }

    function cleanup() {
        blossoms.forEach(function(blossom) {
            blossom.remove();
        });
        blossoms = [];
        clearTimeout(resizeTimeout);
        $(window).off('resize.sakuraFall');
    }

    function addStyles() {
        if (!style) {
            style = $('<style id="sakuraFall-style">');
            style.text(`
                .blossom {
                    position: fixed;
                    top: -10px;
                    color: #ffb7c5; /* Light pink for sakura */
                    pointer-events: none;
                    user-select: none;
                    z-index: 9999;
                    animation: sakuraFall linear infinite;
                    font-size: 1.5em; /* Slightly larger for a natural look */
                    text-shadow: rgba(0, 0, 0, 0.15) 1px 1px 2px;
                    will-change: transform;
                }
                @keyframes sakuraFall {
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

    function startSakuraFall() {
        if (prefersReducedMotion()) {
            cleanup();
            return;
        }

        cleanup();
        addStyles();

        var windowWidth = window.innerWidth || $(window).width();
        var blossomCount = getBlossomCount();
        for (var i = 0; i < blossomCount; i++) {
            var blossom = createBlossom();
            if (blossom) {
                var randomTop = Math.random() * -100;
                blossom.css({
                    left: (Math.random() * windowWidth) + 'px',
                    top: randomTop + 'px',
                    animationDuration: (Math.random() * 3 + 2) + 's',
                    animationDelay: '-' + (Math.random() * 5) + 's'
                });

                blossoms.push(blossom);
            }
        }
        $('body').append(blossoms);

        $(window).on('resize.sakuraFall', handleResize);

        initialized = true;
    }

    function init() {
        if (!initialized) {
            startSakuraFall();
            initialized = true;
        }
    }

    module.export({
        start: startSakuraFall,
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
