var msSocial = {};
!function() {
    for (var t = socialOption.split('|'), e = ['ver', 'dir', 'uid', 'pid', 'bid', 'href'], n = 0; n < e.length; n++) {
        msSocial[e[n]] = t[n];
    }
}();
$(document).ready(function() {
    var sHref = msSocial.href, sPid = msSocial.pid, sBid = msSocial.bid;
    social = {
        zan: function() {
            var zanItem = $('.zan'), zanTips = $('.zan-tips'), zanData = { action:'social', do:'zan', pid:sPid },
            tipsHtml = $('.entry-post').hasClass('entry-normal-post') ? '该文章累计获赞：' : '该书累计获赞：',
            zanKey = 'MS_ZAN_' + msSocial.uid, zanValue = localStorage.getItem(zanKey) ? JSON.parse(localStorage.getItem(zanKey)) : {};
            zanValue['zanItems'] = zanValue['zanItems'] ? zanValue['zanItems'] : []; zanObj = zanValue.zanItems;
            zanItem.on('click', function() {
                if ( zanObj.indexOf(sPid) > -1 ) {
                    social.tips(zanTips, '您已经赞过了');
                } else {
                    $.post(ajaxurl, zanData, function(zanNumber) {
                        zanItem.addClass('done');
                        zanTips.html('点赞成功');
                        zanObj.push(sPid);
                        localStorage.setItem(zanKey, JSON.stringify(zanValue));

                        setTimeout(function() { zanTips.html(tipsHtml + zanNumber); }, 2000);
                    });
                }
            });
        },
        shang: function() {
            $('.shang').on('click', function() {
                social.init(shangContent, '.shang-layer');
                msTabs('.shang-tabs-header li', '.shang-tabs-content li');
            });
        },
        copylink: function() {
            $('.copylink').click(function() {
                msCopy(sHref);
                social.tips('.copylink-tips', '复制成功');
            });
        },
        poster: function() {
            $('.poster, .quick-poster').on('click', function() {
                $.ajax({
                    url:ajaxurl, method:'POST', dataType:'json', timeout:6e4, data:{ action:'social', do:'poster', bid:sBid },
                    success: function(data) {
                        var posterQr = new QRious({ level:'H', size:100, value:sHref }), posterTips, downName = data.title;
                        data.qrcode = posterQr.toDataURL();
                        posterTips = data.image ? '' : '无法获取文章图片';
                        posterTips += data.logo ? '' : '无法获取LOGO';
                        posterTips += data.qrcode ? '' : '无法获取二维码';
                        data.image && data.logo && data.qrcode ? social.canvas(data) : social.tips('.poster-tips', posterTips);
                        data.callback = function(data) {
                            social.init(posterContent, '.poster-layer');
                            $('.poster-image').attr('src', data);
                            if ( $('.poster-down').length > 0 ) $('.poster-down').on('click', function() {
                                var posterDown = document.createElement('a');
                                posterDown.href = data; posterDown.download = downName+'.png'; posterDown.click();
                            });
                        };
                    },
                    error: function() {
                        social.tips('.poster-tips', '生成海报失败');
                    }
                });
            });
        },
        canvas: function(d) {
            var s = document.createElement('canvas'), u = s.getContext('2d'), w = 720, l = 1200;
            s.width = w; s.height = 1e4; u.fillStyle = '#fff'; u.fillRect(0, 0, s.width, s.height); args = { left: 40 };
            posterImage(0, function(t) {
                posterTitle(t, function(t) {});
                posterExcerpt(t, function(t) {});
                posterLine(t, function(t) {});
                posterLogo(t, function(t, e) { posterQrcode(t, e) });
                posterName(t);
                posterDescription(t);
                posterTips(t);
            });
            function posterImage(s, l) {
                var h = new Image;
                h.crossOrigin = 'anonymous';
                d.image.match(/^\/\//) && (d.image = window.location.protocol + d.image);
                h.src = d.image;
                h.onerror = function(t) { alert('无法获取文章图片'); };
                h.onload = function() {
                    var t = parseInt(2 * w / 3), e = parseInt(2 * h.width / 3), n = 0, i = h.width, o = h.height, a = w, r = t, c = 0, d = 0;
                    h.height === h.width ? (c = parseInt((w - t) / 2) + 20, r = a = t - 40, d = 40) : h.height > e ? o = e : h.height < e && (i = parseInt(3 * o / 2), n = parseInt((h.width - i) / 2));
                    s += t;
                    u.drawImage(this, n, 0, i, o, c, d, a, r);
                    l && l(s)
                }
            }
            function posterTitle(t, e) {
                u.stroke();  u.fillStyle = '#333'; u.font = '700 34px sans-serif'; t += 90;
                t = posterDraw($('<div>').html(d.title).text(), args.left, t, 48, u);
                e && e(t)
            }
            function posterExcerpt(t, e) {
                u.fillStyle = '#333'; u.font = '300 30px sans-serif'; t += 170;
                t = posterDraw($('<div>').html(d.excerpt).text(), args.left, t, 48, u);
                e && e(t)
            }
            function posterLine(t, e) {
                u.strokeStyle = '#bbb'; u.moveTo(args.left, t + 450); u.lineTo(w - 40, t + 450); u.stroke();
                e && e(t)
            }
            function posterLogo(n, i) {
                var o = new Image;
                o.crossOrigin = 'anonymous';
                d.logo.match(/^\/\//) && (d.logo = window.location.protocol + d.logo);
                o.src = d.logo;
                o.onerror = function(t) { alert('无法获取LOGO'); };
                o.onload = function() {
                    n += 460;
                    var t = 400 / o.width * o.height;
                    t = 110 < t ? 110 : t;
                    var e = o.width / (o.height / t);
                    u.drawImage(this, 0, 0, o.width, o.height, args.left, n + 30, e, t);
                    i && i(n, t)
                }
            }
            function posterQrcode(o, a, r) {
                var c = new Image;
                c.src = d.qrcode;
                c.onerror = function(t) { alert('无法获取二维码'); };
                c.onload = function() {
                    var t = w - args.left - 110;
                    var e = 110 / c.width * c.height;
                    u.drawImage(this, 0, 0, c.width, c.height, t, 970, 110, e);
                    o += a < e ? e : a;
                    o = l;
                    var n = u.getImageData(0, 0, w, o);
                    s.height = o;
                    u.putImageData(n, 0, 0);
                    var i = s.toDataURL('image/jpeg', 1);
                    d.callback(i);
                    r && r(o)
                }
            }
            function posterName(t, e) {
                u.fillStyle = '#333'; u.font = '600 32px sans-serif'; t += 530;
                t = posterDraw($('<div>').html(d.name).text(), args.left + 130, t, 20, u);
                e && e(t)
            }
            function posterDescription(t, e) {
                u.fillStyle = '#333'; u.font = '300 24px sans-serif'; t += 580;
                t = posterDraw($('<div>').html(d.description).text(), args.left + 130, t, 20, u);
                e && e(t)
            }
            function posterTips(t, e) {
                u.textAlign = 'center'; u.fillStyle = '#444'; u.font = '300 18px sans-serif'; t += 660;
                t = posterDraw($('<div>').html(d.tips).text(), w / 2, t, 42, u);
                e && e(t)
            }
            function posterDraw(t, e, n, i, o) {
                for (var a = 0, r = 0, c = 0; c < t.length; c++)(a += o.measureText(t[c]).width) > 620 && (o.fillText(t.substring(r, c), e, n), n += i, a = 0, r = c),
                c == t.length - 1 && (o.fillText(t.substring(r, c + 1), e, n), n += i);
                return n
            }
            function e(t) {
                var e = f.bgi;
                if (!e) return t && t();
                !1;
                var n = new Image;
                n.crossOrigin = 'anonymous';
                n.src = decodeURIComponent(msSocial.dir) + '' + e;
                n.onerror = function(t) { alert('无法获取背景图'); };
                n.onload = function() { u.drawImage(this, 0, 0, w, n.height, 0, 0, w, l), t && t() }
            }
        },
        init: function(content, layerID) {
            $('.site-layer').append(content);
            $(layerID).css('display', 'flex');
            $(layerID).click(function(event) {
                if ( event.target == this ) {
                    $(layerID).fadeOut();
                    setTimeout(function() { $(layerID).remove(); }, 1000);
                }
            });
        },
        tips: function(item, tips) {
            var tipsItem = $(item), tipsHtml = tipsItem.html();
            tipsItem.html(tips);
            setTimeout(function() { tipsItem.html(tipsHtml); }, 2000);
        }
    };
    social.zan();
    social.shang();
    social.copylink();
    social.poster();
});
