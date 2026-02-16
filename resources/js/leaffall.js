humhub.module('effects.leaffall', function(module, require, $) {
    var event = require('event');
    var baseLeafCount = 50;
    var leaves = [];
    var resizeTimeout;
    var initialized = false;
    var style;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getLeafCount() {
        var width = window.innerWidth || $(window).width();
        if (width < 576) {
            return 16;
        }
        if (width < 992) {
            return 28;
        }

        return baseLeafCount;
    }

    function createLeaf() {
        var leaf = $(`<div class="leaf">
            <svg viewBox="0 0 100 100" width="30" height="30">
                <path d="
                    M50 10 
                    C60 10, 80 25, 80 45
                    C80 65, 60 80, 50 90
                    C40 80, 20 65, 20 45
                    C20 25, 40 10, 50 10
                    M50 10 L50 90
                    M50 10 C60 30, 70 45, 80 45
                    M50 10 C40 30, 30 45, 20 45
                    M35 35 L65 35
                    M30 55 L70 55
                    M40 70 L60 70"
                    class="leaf-body"/>
                
                <path d="
                    M50 10 L50 90
                    M50 30 L65 35
                    M50 30 L35 35
                    M50 50 L70 55
                    M50 50 L30 55
                    M50 65 L60 70
                    M50 65 L40 70"
                    class="leaf-veins"
                    fill="none"
                    stroke-width="1"/>
            </svg>
        </div>`);
        return leaf;
    }

    function updateLeafPositions() {
        var windowWidth = window.innerWidth || $(window).width();
        leaves.forEach(function(leaf) {
            leaf.css('left', (Math.random() * windowWidth) + 'px');
        });
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateLeafPositions, 250);
    }

    function cleanup() {
        leaves.forEach(function(leaf) {
            leaf.remove();
        });
        leaves = [];
        clearTimeout(resizeTimeout);
        $(window).off('resize.leafFall');
    }

    function addStyles() {
        if (!style) {
            style = $('<style id="leafFall-style">');
            style.text(`
                .leaf {
                    position: fixed;
                    top: -10px;
                    pointer-events: none;
                    user-select: none;
                    z-index: 9999;
                    animation: leafFall linear infinite;
                    will-change: transform;
                }
                .leaf-body {
                    fill: currentColor;
                }
                .leaf-veins {
                    stroke: currentColor;
                    stroke-opacity: 0.7;
                }
                @keyframes leafFall {
                    0% {
                        transform: translateY(-10px) rotate(0deg) rotateX(0deg) rotateY(0deg);
                    }
                    25% {
                        transform: translateY(25vh) rotate(90deg) rotateX(180deg) rotateY(45deg);
                    }
                    50% {
                        transform: translateY(50vh) rotate(180deg) rotateX(360deg) rotateY(90deg);
                    }
                    75% {
                        transform: translateY(75vh) rotate(270deg) rotateX(180deg) rotateY(45deg);
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg) rotateX(0deg) rotateY(0deg);
                    }
                }
            `);
            $('head').append(style);
        }
    }

    function startLeafFall() {
        if (prefersReducedMotion()) {
            cleanup();
            return;
        }

        cleanup();
        
        addStyles();
        var windowWidth = window.innerWidth || $(window).width();
        var leafCount = getLeafCount();
        for (var i = 0; i < leafCount; i++) {
            var leaf = createLeaf();
            if (leaf) {
                var randomTop = Math.random() * -100;
                var colors = [
                    '#c14d33',
                    '#d46a2c',
                    '#d4742c',
                    '#8b4513',
                    '#a86032',
                    '#bb552f',
                    '#cf6024',
                    '#aa4a24'
                ];
                var randomColor = colors[Math.floor(Math.random() * colors.length)];
                leaf.css({
                    left: (Math.random() * windowWidth) + 'px',
                    top: randomTop + 'px',
                    color: randomColor,
                    animationDuration: (Math.random() * 5 + 3) + 's',
                    animationDelay: '-' + (Math.random() * 8) + 's',
                    transform: `scale(${Math.random() * 0.4 + 0.3})`,
                    filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.15))'
                });
                leaves.push(leaf);
            }
        }
        $('body').append(leaves);
        $(window).on('resize.leafFall', handleResize);
        initialized = true;
    }

    function init() {
        if (!initialized) {
            startLeafFall();
            initialized = true;
        }
    }

    module.export({
        start: startLeafFall,
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
