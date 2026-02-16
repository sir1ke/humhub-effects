humhub.module('effects.confetti', function(module, require, $) {
    var event = require('event');
    var baseConfettiCount = 120;
    var confettiPieces = [];
    var resizeTimeout;
    var initialized = false;
    var style;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function getConfettiCount() {
        var width = window.innerWidth || $(window).width();
        if (width < 576) {
            return 45;
        }
        if (width < 992) {
            return 80;
        }

        return baseConfettiCount;
    }

    function createConfettiPiece() {
        return $('<div class="confetti-piece"></div>');
    }

    function updateConfettiPositions() {
        var windowWidth = window.innerWidth || $(window).width();
        confettiPieces.forEach(function(piece) {
            piece.css('left', (Math.random() * windowWidth) + 'px');
        });
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateConfettiPositions, 250);
    }

    function cleanup() {
        confettiPieces.forEach(function(piece) {
            piece.remove();
        });
        confettiPieces = [];
        clearTimeout(resizeTimeout);
        $(window).off('resize.confetti');
    }

    function addStyles() {
        if (!style) {
            style = $('<style id="confetti-style">');
            style.text(`
                .confetti-piece {
                    position: fixed;
                    top: -10px;
                    pointer-events: none;
                    user-select: none;
                    z-index: 9999;
                    border-radius: 2px;
                    opacity: 0.95;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    will-change: transform, opacity;
                }
                @keyframes confettiFallLeft {
                    0% {
                        transform: translate3d(0, -10px, 0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate3d(-42px, 100vh, 0) rotate(720deg);
                        opacity: 0;
                    }
                }
                @keyframes confettiFallRight {
                    0% {
                        transform: translate3d(0, -10px, 0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate3d(42px, 100vh, 0) rotate(720deg);
                        opacity: 0;
                    }
                }
            `);
            $('head').append(style);
        }
    }

    function startConfetti() {
        if (prefersReducedMotion()) {
            cleanup();
            return;
        }

        cleanup();
        addStyles();

        var colors = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#e91e63'];
        var windowWidth = window.innerWidth || $(window).width();
        var confettiCount = getConfettiCount();
        for (var i = 0; i < confettiCount; i++) {
            var piece = createConfettiPiece();
            var width = Math.floor(Math.random() * 6) + 5;
            var height = Math.floor(Math.random() * 10) + 7;
            piece.css({
                left: (Math.random() * windowWidth) + 'px',
                top: (Math.random() * -120) + 'px',
                width: width + 'px',
                height: height + 'px',
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                animationName: Math.random() > 0.5 ? 'confettiFallLeft' : 'confettiFallRight',
                animationDuration: (Math.random() * 3 + 3) + 's',
                animationDelay: '-' + (Math.random() * 6) + 's',
                transform: 'rotate(' + Math.floor(Math.random() * 360) + 'deg)'
            });
            confettiPieces.push(piece);
        }

        $('body').append(confettiPieces);
        $(window).on('resize.confetti', handleResize);
        initialized = true;
    }

    function init() {
        if (!initialized) {
            startConfetti();
            initialized = true;
        }
    }

    module.export({
        start: startConfetti,
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
