$(document).ready(function() {
    // 导航栏固定模式
    $('.follow-fixed').headroom({
        'tolerance': 10,
        'offset': 51,
        'classes': {
            'initial': 'animated',
            'pinned': 'pinned',
            'unpinned': 'unpinned'
        }
    });
    $('.keep-fixed').headroom({
        'tolerance': 10,
        'offset': 51,
        'classes': {
            'initial': 'animated',
            'pinned': 'pinned',
            'unpinned': 'pinned'
        }
    });

    // 主菜单
    $('.nav-menu .sub-menu').addClass('fadeinup');

    // 边栏导航
    $('.switch-side-nav').click(function() {
        $('.side-nav-layer').fadeToggle();
    });
    $('.side-menu .dropdown').click(function(e) {
        e.preventDefault();
        $(this).parent('a').siblings('.sub-menu').slideToggle();
    });

    // 移动端页脚菜单
    $('.footer-nav').headroom({
        'tolerance': 10,
        'offset': 51,
        'classes': {
            'initial': 'animated',
            'pinned': 'footer-nav-up',
            'unpinned': 'footer-nav-down'
        }
    });

    // 输入框提示
    $('input[type="text"], input[type="email"], textarea').each(function() {
        msInput(this);
    });

    // 关闭层
    $('.ms-layer').click(function(event) {
        if ( event.target == this ) $(this).fadeOut();
    });

    // 侧边栏跟随
    $('.content-wrap .sidebar-follow').theiaStickySidebar({
        additionalMarginTop: 12,
        additionalMarginBottom: 0
    });

    // 注释显隐
    $('.toggle-zhushi').click(function() {
        $('.book-post').find('.jiazhu, .jianzhu, .jieshi, .zhushu, .jianzhusup').toggleClass('hidden');
    });

    // 侧边栏显隐
    $('.toggle-sidebar').click(function() {
        $('.primary').toggleClass('primary-full');
        $('.sidebar').toggleClass('hidden');
    });

    // 快捷反馈
    $('.quick-feedback').click(function() {
        $('.feedback-layer').css('display', 'flex');
    });

    // 快捷搜索
    $('.quick-search').click(function() {
        $('.quickshot-layer .search-form').fadeToggle();
    });
    $('.quickshot-layer .button').click(function() {
        $('.quickshot-layer .search-form').fadeOut();
    });
    
    // 主题模式切换
    $('.quick-switch').click(function() {
        if ( $('body').hasClass('dark') ) {
            $('body').removeClass('dark');
            $.cookie('dark', '0', { path:'/' });
        } else {
            $('body').addClass('dark');
            $.cookie('dark', '1', { path:'/' });
        }
    });

    // 返回顶部
    $('.quick-top').click(function() {
        $('html, body').animate({
            scrollTop: '0px'
        }, 800);
    });

    // 转到底部
    $('.quick-bottom').click(function() {
        $('html, body').animate({
            scrollTop: $('.site-footer').offset().top
        }, 800);
    });

    // 显示目录
    $('.show-book-chapters').click(function(e) {
        e.preventDefault();
        $('.book-chapters-layer').fadeToggle();
    });
});

// tabs切换
function msTabs(header, content) {
    $(header + ':first, ' + content + ':first').addClass('current');
    $(header).click(function() {
        var headerThis = $(this), contentThis = headerThis.index();
        $(header).removeClass('current');
        headerThis.addClass('current');
        $(content).removeClass('current');
        $(content).eq(contentThis).addClass('current');
    });
}

// 复制
function msCopy(value) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', value);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
}

// 输入框提示
function msInput(id) {
    let placeHolder = $(id).attr('placeholder');
    $(id).focus(function() {
        $(id).attr('placeholder', '');
    });
    $(id).blur(function() {
        $(id).attr('placeholder', placeHolder);
    });
}

// 窗口抖动
function msShake(ele) {
    for ( var i = 1; 5 >= i; i++ ) {
        $(ele).animate({left:5}, 30);
        $(ele).animate({left:-5}, 30);
    }
    $(ele).animate({left:0}, 30);
}
