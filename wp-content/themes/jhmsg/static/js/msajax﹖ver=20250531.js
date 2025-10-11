$(document).ready(function() {
    // ajax搜索验证
    if ( $('.scaptcha-layer').length ) {
        $('#searchsubmit').click(function(e) {
            e.preventDefault();
            let skeywords = $('.search-form .input').val();
            $('.scaptcha-layer').css('display', 'flex');
            msCheckSearchCpatcha(skeywords);

            // ajax搜索验证
            function msCheckSearchCpatcha(skeywords) {
                $(document).on('submit', '.scaptcha-form', function(e) {
                    e.preventDefault();
                    let form = $(this), tips = $('.scaptcha-tips');
                    $.ajax({
                        type: 'post',
                        url: ajaxurl,
                        data: form.serialize()+'&action=scaptcha',
                        dataType: 'json',
                        beforeSend: function() {
                            tips.removeClass('success-tips error-tips').addClass('normal-tips').html('正在提交，請稍後...');
                        },
                        success: function(data) {
                            if ( data.result == true ) {
                                tips.removeClass('normal-tips error-tips').addClass('success-tips').html(data.message);
                                window.location.href = data.url + skeywords;
                            } else {
                                tips.removeClass('normal-tips success-tips').addClass('error-tips').html(data.message);
                                if ( data.image ) {
                                    form.find('.captcha-image').attr('src', data.image);
                                    form.find('.captcha-identifier').val(data.identifier);
                                }
                            }
                        },
                        error: function() {
                            tips.removeClass('normal-tips success-tips').addClass('error-tips').html('表单提交失败，请重试！');
                        }
                    });
                });
            }
        });
    }
    
    // ajax给我反馈
    $('.feedback-form').submit(function(e) {
        e.preventDefault();
        let form = $(this), box = form.parent('.feedback-box');
        let tips = box.find('.feedback-tips');
        $.ajax({
            type: 'post',
            url: ajaxurl,
            data: form.serialize()+'&action=feedback',
            dataType: 'json',
            beforeSend: function() {
                tips.removeClass('success-tips error-tips').addClass('normal-tips').html('正在提交，請稍後...');
            },
            success: function(data) {
                if ( data.result == true ) {
                    tips.removeClass('normal-tips error-tips').addClass('success-tips').html(data.message);
                    $('.reset-input').click();
                } else {
                    tips.removeClass('normal-tips success-tips').addClass('error-tips').html(data.message);
                    msShake('.feedback-box');
                    if ( data.image ) {
                        form.find('.captcha-image').attr('src', data.image);
                        form.find('.captcha-identifier').val(data.identifier);
                    }
                }
            },
            error: function() {
                tips.removeClass('normal-tips success-tips').addClass('error-tips').html('表单提交失败，请重试！');
            }
        });
    });
});


