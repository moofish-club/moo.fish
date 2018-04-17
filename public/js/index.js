var canvas;
(function($){
    var moofish = {
        fishInit: function(){
            canvas = document.getElementById("fish");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // onresize change the canvas size
            window.onresize = function() {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
            };

            var canvasHelper = new CanvasHelper(canvas);
            canvasHelper.init();

            window.setInterval(function() {
                canvasHelper.draw()
            }, 30);
        },
        dataInit: function(){
            $.getJSON('/public/data/data.json',function(member){
                $.each(member, function(index, value){
                   PopUp(value["id"],value['name'], value['blog'], value['avatar']);
                })
                $('.scalize').scalize({
                    animationSelector: 'pulse2',
                    animationPopoverIn: 'bounceIn',
                    animationPopoverOut: 'bounceOut'
                });
            });
        },
        titleInit: function(){
           const title = new Word(document.getElementById('title'),{
               shapesOnTop: false,
               shapeColors: ['#6435ea','#295ddc','#9fd7ff','#d65380','#0228f7','#242627']
           });
           title.show({
                lettersAnimationOpts: {
                    duration: 800,
                    delay: (t, i) => i * 40,
                    easing: 'easeOutElastic',
                    opacity: [0, 1], 
                    translateY: ['100%', '0%']
                },
                shapesAnimationOpts: {
                    duration: 300,
                    delay: (t, i) => i * 30 + 100,
                    easing: 'easeOutQuad',
                    translateY: () => [anime.random(-15, 15), anime.random(-200, 200)],
                    scale: () => [0.2, randomBetween(0.5, 1)],
                    opacity: [
                        {
                            value: 1,
                            duration: 1,
                            delay: (t, i) => i * 30 + 100
                        },
                        {
                            value: 0,
                            duration: 200,
                            delay: 200,
                            easing: 'linear'
                        }
                    ]
                }
            });
        },
        init: function(){
            var self = this;
            self.fishInit();
            self.dataInit();
            self.titleInit();
        }
    };
    window.moofish = moofish;
})(jQuery)

$(document).ready(function(){
    moofish.init();
});