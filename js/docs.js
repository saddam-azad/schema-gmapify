$(function() {

    $('.scroll-top').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    $('#toc').tocify({
        context: '#content',
        selectors: 'h2, h3',
        hashGenerator: 'pretty'
    });

    $(".toc-container").stick_in_parent({
        offset_top: 50
    });
    

});