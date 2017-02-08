(function($) {

  window.JUKSY = {
    apiUri: 'https://www.juksy.com/api'
  };

  var init = function() {
    // android version under 4.4 FB APP can't use css fadeout
    function getAndroidVersion(ua) {
      ua = (ua || navigator.userAgent).toLowerCase();
      var match = ua.match(/android\s([0-9\.]*)/);
      return match ? match[1] : false;
    };
    var $android = parseFloat(getAndroidVersion());
    if ($android < 4.4) {
      alert('Android 4.3 以下手機，請使用Chrome瀏覽器閱讀');
    }

    // Configure webfont
    window.WebFontConfig = {
      google: {
        families: ['Roboto+Condensed:400,400italic,700,700italic:latin']
      }
    };

    // Init Facebook
    window.fbAsyncInit = function() {
      FB.init({
        appId: '608477045879026',
        cookie: true, // enable cookies to allow the server to access 
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v2.6' // use version 2.6
      });
    };
  };

  // nav_01
  var nav_01 = function() {
    var $window = $(window),
      $nav = $('.nav_01'),
      $body = $('body'),
      sourceLi = $('#template-n01').html(),
      sourceMstart = $('#template-n01-more-start').html(),
      sourceMend = $('#template-n01-more-end').html(),
      $ulmenu = $nav.find('.menuWrap ul.menu'),
      $menuData = $ulmenu.data('navli') ? $ulmenu.data('navli') : {},
      $menuLen = $menuData.length,
      template,
      menuInner = '',
      $openBtn = $nav.find('.mIcon .open'),
      $closeBtn = $nav.find('.mIcon .close'),
      $menuOpen = 'menuOpen',
      $noscroll = 'noscroll',
      lastScrollTop = 0,
      $scrollout = 'scrollout',
      $menuli,
      $menuTimer;
    /*
    -------------------------------------
    set menu items
    -------------------------------------
    */
    for (var i = 0; i < $menuLen; i++) {
      // the 4th item will in the 更多 list
      if (i == 3) {
        template = Handlebars.compile(sourceMstart);
        menuInner += template();
      }

      // insert the list in menu
      var context = { title: $menuData[i] };
      template = Handlebars.compile(sourceLi);
      menuInner += template(context);

      // the last item if more than 4 items will have the 更多 close tag
      if (i >= 3 && i == $menuLen - 1) {
        template = Handlebars.compile(sourceMend);
        menuInner += template();
      }
    }

    // add menu
    $ulmenu.html(menuInner);

    /*
    -------------------------------------
    open and close menu // didn't use toggleClass because FB APP can't work for android4.2
    -------------------------------------
    */
    $openBtn.click(function() {
      $nav.addClass($menuOpen);
      $body.addClass($noscroll);
    });
    $closeBtn.click(function() {
      $nav.removeClass($menuOpen);
      $body.removeClass($noscroll);
    });
    /*
    -------------------------------------
    FB share, Line share
    -------------------------------------
    */
    $nav.find("ul.share li.fb, ul.share .title").click(function(e) {
      e.preventDefault();
      FB.ui({
        method: 'share',
        href: document.URL
      }, function(response) {});
    });
    $nav.find("ul.share li.line a.btn").attr("href", "http://line.naver.jp/R/msg/text/?" + document.title + "%0A" + document.URL);
    /*
    -------------------------------------
    nav move out while scrolling
    -------------------------------------
    */
    function navmove() {
      var st = $(this).scrollTop();
      if (st > lastScrollTop) {
        // downscroll code
        $nav.stop(true, true).addClass($scrollout);
      } else if (st == 0) {
        // top
        scrollOut();
      } else if (st < lastScrollTop) {
        // upscroll code
        $window.scroll(_.debounce(scrollOut, 10000));
      }
      lastScrollTop = st;

      function scrollOut() {
        $nav.stop(true, true).removeClass($scrollout);
      }
    }
    $window.scroll(_.throttle(navmove, 500));
    /*
    -------------------------------------
    hover menu li animation
    -------------------------------------
    */
    $menuli = $nav.find('ul.menu >li');
    $menuli.hover(function() {
      clearTimeout($menuTimer);
      $menuli.not(this).stop(true, true).animate({ opacity: 0.5 }, 500);
      $(this).stop(true, true).animate({ opacity: 1 }, 500);
    }, function() {
      $menuTimer = setTimeout(menuHover, 300);
    });

    function menuHover() {
      $menuli.stop(true, true).animate({ opacity: 1 }, 500);
    }
    /*
    -------------------------------------
    page scroll
    -------------------------------------
    */
    $nav.find('ul.menu >li').not('notli').click(goPosition);
    $nav.find('ul.submenu >li').click(goPosition);

    function goPosition() {
      var nowIndex = $(this).index(),
        $submenu = $(this).parent('ul.submenu').length,
        scrollPosition;
      if ($submenu == 0 && nowIndex == 3) {
        return;
      } else if ($submenu > 0) { nowIndex += 3; }
      scrollPosition = $('[data-menu="true"]').eq(nowIndex).offset().top;
      $closeBtn.trigger('click');
      $('html,body').animate({ scrollTop: scrollPosition }, 1000);
    }
  };

  // header_03
  var header_03 = function() {
    /*---------------------
    文字三角形凹槽高度
    -----------------------*/
    var $headerWrap = $('.header_03 .headerWrap'),
      $txtBg = $headerWrap.find('.detail .detailWrap .txtBg'),
      $txtWrap = $headerWrap.find('.detail .detailWrap');
    $txtBg.height($txtWrap.height());
    $headerWrap.height($txtBg.height() + $headerWrap.find('.banner').height() - 31);
  };
  var header_03_slider = function() {
    var $header_03_banner = $("#header_03_banner");
    var slider = $header_03_banner.lightSlider({
      item: 1,
      slideMargin: 0,
      addClass: 'header_03_banner',
      speed: 1000,
      auto: true,
      loop: true,
      pause: 3000,
      controls: false,
      galleryMargin: 0,
      pager: $header_03_banner.data('pager'),
      onSliderLoad: function (e) {
        header_03();
        e.parents().find('ul.lSpg >li').click(function(){
          slider.pause();
        });
      }
    });
  };

  // layout_04
  var layout_04 = function() {
    // Slider
    var $layout04 = $('.layout_04');
    $layout04.each(function() {
      var $this = $(this),
        $slideW = $this.find('ul.slides').width(),
        $windowW = $(window).width();
      // Mobile and tablet move to second slide
      if ($windowW < 1024) {
        var $center = ($slideW - 20 - $windowW) / 2;
        $this.find('.slidesWrap').scrollLeft($center);
      }
    });
  };

  // gallery_01
  var gallery_01 = function() {
    var $gallery01 = $('.gallery_01');
    $gallery01.each(function(i) {
      var windowW = $(window).width(),
        galleryH = windowW * 3 / 4,
        moveW = (windowW - 800) / 2,
        $banner = $(this).find('.slider'),
        pcNum = Math.round(windowW / 800 * 10) / 10,
        pwspNum = windowW < 1024 ? 1 : Math.ceil(pcNum),
        slider;
      var mobile_options = {
        addClass: 'gallery_01_slider',
        speed: 1000,
        controls: false,
        gallery: true,
        item: 1,
        loop: true,
        thumbItem: 5,
        slideMargin: 0
      };
      var desktop_options = {
        addClass: 'gallery_01_slider',
        speed: 1000,
        controls: true,
        gallery: true,
        item: pcNum,
        loop: true,
        thumbItem: 10,
        slideMargin: 0,
        galleryMargin: 10,
        thumbMargin: 15,
        prevHtml: '<svg class="arrowL" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 60"><polyline points="18.91 0.51 1.17 30.17 18.91 59.38" /></svg>',
        nextHtml: '<svg class="arrowR" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 60"><polyline points="0.86 0.51 18.61 30.17 0.86 59.38" /></svg>',
        onSliderLoad: function(e) {
          // center gallery
          e.css({
            'margin-left': moveW
          });
          // add wrapper to thumb and resize
          e.parents().find('ul.lSGallery').wrap('<div class="galleryWrap"></div>');
          // set prev next btn width
          e.parent().find('.lSAction >a').width(moveW);
        }
      };
      //set id gallery_01_slider+i
      $banner.attr('id', 'gallery_01_slider' + i);

      //set image width and height
      function setImage(imgW, imgH) {
        var $imgWrap = $banner.find('.img');
        $imgWrap.each(function() {
          var $img = $(this).find('img'),
            w = $img.data('width'),
            h = $img.data('height'),
            r = w / h;
          if (r >= (4 / 3)) {
            $img.attr({
              width: imgW,
              height: "auto"
            });
          } else {
            $img.attr({
              width: "auto",
              height: imgH
            });
          }
        });
      }
      setImage(windowW, galleryH);

      if (windowW < 1024) {
        // mobile size set img
        setImage(windowW, galleryH);
        // init gallery
        slider = $('#gallery_01_slider' + i).lightSlider(mobile_options);
      } else {
        // desktop size set img
        setImage(800, 600);
        // init gallery
        slider = $('#gallery_01_slider' + i).lightSlider(desktop_options);
      }

      /*--------------------------
      PhotoSwipe lightbox gallery
      ----------------------------*/
      var pswpElement = document.querySelectorAll('.pswp')[0];

      // build items array
      var pswpItems = [],
        pswpSlide = $banner.find('>li')
        pswpLength = pswpSlide.length;
      for (var i = pwspNum; i < pswpLength - pwspNum; i++) {
        var $item = pswpSlide.eq(i).find('.img img'),
          iSrc = $item.attr('src'),
          iW = $item.data('width'),
          iH = $item.data('height'),
          mSrc = iSrc;
        pswpItems.push({
          src: iSrc,
          w: iW,
          h: iH,
          msrc: mSrc
        });
      }

      var pswpoptions, // define options
        gallery; // Initializes and opens PhotoSwipe

      // click to open current lightbox
      pswpSlide.find('.img img').on('click', function() {
        var istart = $(this).parents('li').index();
        // 解決倒著滑第一個 lightbox 問題
        if (istart < pwspNum) {
          istart = istart + (pswpLength-pwspNum*2);
        }
        // define options (if needed)
        pswpoptions = {
          shareEl: false,
          index: istart - pwspNum,
          getThumbBoundsFn: function(istart) {
            var $thumb = pswpSlide.eq(istart + pwspNum).find('.img img'),
              toff = $thumb.offset(),
              tw = $thumb.width();
            return { x: toff.left, y: toff.top, w: tw };
          }
        };
        // Initializes and opens PhotoSwip
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpItems, pswpoptions);
        gallery.init();
      });
    });
  };

  // gallery_02
  var gallery_02 = function() {
    var $gallery02 = $('.gallery_02'),
      $windowW = $(window).width();
    $gallery02.each(function() {
      var $iframe = $(this).find('.photo iframe'),
        mUrl = $iframe.data('msrc'),
        pcUrl = $iframe.data('pcsrc');
      if ($windowW < 1024) {
        $iframe.attr('src', mUrl);
      } else {
        $iframe.attr('src', pcUrl);
      }
      iFrameResize();
    });
  };

  // fixedBtn
  var fixedBtn_01 = function() {
    // Back to top
    $('ul.fixedBtn_01 li.top').click(function() {
      $('html,body').animate({ scrollTop: 0 }, 1000);
    });
    // Open share menu
    $('ul.fixedBtn_01 li.share').mousedown(function() {
      $('.fixedBtnCover_01').addClass('show');
    });
    // Close share menu
    $('.fixedBtnCover_01 .coverWrap .backCover, .fixedBtnCover_01 .item .arrow').bind('mousedown touchstart', function() {
      $('.fixedBtnCover_01').removeClass('show');
    });
    // Share with LINE
    $('.fixedBtnCover_01 ul.share li.line .material_btn').click(function(e) {
      e.preventDefault();
      window.location.href = 'http://line.naver.jp/R/msg/text/?' + document.title + '%0A' + document.URL;
    });
    // Share with FB
    $('.fixedBtnCover_01 ul.share li.fb .material_btn').click(function(e) {
      e.preventDefault();
      FB.ui({
        method: 'share',
        href: document.URL
      }, function(response) {});
    });
    // Copy link
    var clipboard = new Clipboard('.fixedBtnCover_01 ul.share li.copy .material_btn', {
      text: function(trigger) {
        return document.URL;
      }
    });
    // Copy tip
    clipboard.on('success', function(e) {
      var tipTime;
      clearTimeout(tipTime);
      $('.fixedBtnCover_01 .coverWrap .copytip').addClass('show');
      tipTime = setTimeout(hide, 2000);

      function hide() {
        $('.fixedBtnCover_01 .coverWrap .copytip').removeClass('show');
      }
    });
    /*
    -------------------------------------
    nav move out while scrolling
    -------------------------------------
    */
    var $window = $(window);

    function fixedBtnShow() {
      var st = $(this).scrollTop(),
        ft = $('#footer').offset().top - $window.height() - 300,
        $fixedBtn = $('.fixedBtn_01');
      if (st > ft) {
        $fixedBtn.addClass('show');
      } else if (st == 0) {
        $fixedBtn.removeClass('show');
      }
    }
    $window.scroll(_.throttle(fixedBtnShow, 500));
  };

  // render content first
  init();
  nav_01();
  header_03_slider();
  layout_04();
  gallery_01();
  gallery_02();
  fixedBtn_01();

  // plugin wow = scroll to animation
  new WOW().init();

  // plugin img_lazyLoad
  $(function() {
    $(document).on('img_lazyLoad', function() {
      var $window = $(window),
        target = $('.imgLoading'),
        complete = 'complete';

      function addComplete() {
        var length = target.length;
        for (var i = 0; i < length; i++) {
          if (target.eq(i).hasClass(complete)) continue;
          var in_position = target.eq(i).offset().top + 100;
          var window_bottom_position = $window.scrollTop() + $window.height() + 150;
          if (in_position < window_bottom_position) {
            var targeturl = target.eq(i).data('imgload');
            target.eq(i).css('background-image', 'url(' + targeturl + ')');
            target.eq(i).addClass(complete);
          }
        }
      }
      addComplete();
      $window.scroll(_.throttle(addComplete, 250));
    });
    $(document).trigger('img_lazyLoad');
  });

  // plugin dotdotdot
  $(function() {
    $(document).on('dotdotdot', function() {
      $('[data-dotdotdot="true"]').dotdotdot({
        wrap: 'letter'
      });
    });
    $(document).trigger('dotdotdot');
  });

  // plugin parallax
  $(function() {
    $(document).on('parallax', function() {
      var $parallax = $('.parallax');
      $parallax.each(function(index, element) {
        var i = index;
        // z-index set for each parallax
        $parallax.eq(i).css('z-index', -1 - i);

        $(window).on('load scroll', function() {
          var $el = $parallax.eq(i),
            heightP = $el.parent().height(),
            startP = $el.parent().offset().top,
            endP = startP + heightP,
            rateP = 0.25; // parallax (25% scroll rate)

          var scrolled = $(this).scrollTop();
          if (scrolled >= startP && scrolled <= endP) {
            $el.css('transform', 'translate3d(0, ' + (startP - scrolled) * rateP + 'px, 0)');
            $el.css('z-index', -1);
          } else if (scrolled > endP) {
            $el.css('transform', 'none');
            $el.css('z-index', -$parallax.length - i);
          } else {
            $el.css('transform', 'none');
            $el.css('z-index', -1 - i);
          }
        });
      });
    });
    $(document).trigger('parallax');
  });

  // plugin layout_03 infinite scroll
  $(function() {
    var $layout03infinit = $('.layout_03_infinit');
    $layout03infinit.each(function() {
      var $layout = $(this).find('.layoutWrap'),
        moreBtn = '.moreBtn',
        countFrom = 0,
        countSize = 6,
        source,
        template,
        article;

      // add btn click listener
      var btnClick = function() {
        $layout.find(moreBtn).one('click', function() {
          $(this).remove();
          // get new data
          countFrom += countSize;
          layout_03_ajax(countFrom, countSize);
          // append article
          addArticle();
        });
      };

      // add article
      var addArticle = function() {
        $layout.append('<div class="articleWrap">' + article + '</div>');
        $(document).trigger('img_lazyLoad');
        $(document).trigger('dotdotdot');
        btnClick();
      }

      // ajax
      var layout_03_ajax = function(ifrom, isize) {
        // clear article content
        article = '';
        var items = {
          from: ifrom,
          size: isize,
          tags: $layout.data('tags'),
          filter: $layout.data('filter')
        };
        $.ajax({
          url: JUKSY.apiUri + '/v1.0/search/articles',
          data: { tags: items.tags, filter: items.filter, from: items.from, size: items.size },
          type: 'GET',
          dataType: 'json',
          success: function(Jdata) {
            console.log('AJAX layout_03 SUCCESS!!!');

            // no data
            if (!Jdata.length) return;

            // has data
            source = $("#entry-template-start").html();
            template = Handlebars.compile(source);
            article += template();
            for (var n = 0; n < Jdata.length; n++) {
              source = $("#entry-template" + n % 2).html();
              template = Handlebars.compile(source);
              article += template(Jdata[n]);
            }
            if (Jdata.length < items.size) {
              article += "</ul>";
            } else {
              source = $("#entry-template-end").html();
              template = Handlebars.compile(source);
              article += template();
            }
            addArticle();
          },
          error: function() {
            console.log('AJAX layout_03 ERROR!!!');
          }
        });
      }

      //init loading ajax
      layout_03_ajax(countFrom, countSize);
    });
  });

  // plugin layout_05_tag auto loading
  $(function() {
    var $layout05_tag = $('.layout_05_tag');
    $layout05_tag.each(function() {
      var $layout = $(this).find('.layoutWrap'),
        engtitle = $layout.data('engtitle'),
        title = $layout.data('title'),
        description = $layout.data('description'),
        countFrom = 0,
        countSize = 8,
        source,
        template,
        article;

      // add article
      var addArticle = function() {
        $layout.append(article);
        $layout.find('.title').html(engtitle);
        $layout.find('.detail').html(title);
        $layout.find('p.subTitle').html(description);
        $(document).trigger('img_lazyLoad');
        $(document).trigger('dotdotdot');
      }

      // ajax
      var layout_05_ajax = function(ifrom, isize) {
        // clear article content
        article = '';
        var items = {
          from: ifrom,
          size: isize,
          tags: $layout.data('tags'),
          filter: $layout.data('filter')
        };
        $.ajax({
          url: JUKSY.apiUri + '/v1.0/search/articles',
          data: { tags: items.tags, filter: items.filter, from: items.from, size: items.size },
          type: 'GET',
          dataType: 'json',
          success: function(Jdata) {
            console.log('AJAX layout_05 SUCCESS!!!');

            // no data
            if (!Jdata.length) return;

            // has data
            source = $("#template-l05-start").html();
            template = Handlebars.compile(source);
            article += template();
            for (var n = 0; n < Jdata.length; n++) {
              source = $("#template-l05").html();
              template = Handlebars.compile(source);
              article += template(Jdata[n]);
            }
            source = $("#template-l05-end").html();
            template = Handlebars.compile(source);
            article += template();
            addArticle();
          },
          error: function() {
            console.log('AJAX layout_05 ERROR!!!');
          }
        });
      }

      //init loading ajax
      layout_05_ajax(countFrom, countSize);
    });
  });

  // plugin layout_06 auto loading
  $(function() {
    var $layout06 = $('.layout_06');
    $layout06.each(function() {
      var $layout = $(this).find('.layoutWrap'),
        engtitle = $layout.data('engtitle'),
        title = $layout.data('title'),
        description = $layout.data('description'),
        countFrom = 0,
        countSize = 8,
        source,
        template,
        article;

      // add article
      var addArticle = function() {
        $layout.append(article);
        $layout.find('.title').html(engtitle);
        $layout.find('.detail').html(title);
        $layout.find('p.subTitle').html(description);
        $(document).trigger('img_lazyLoad');
        $(document).trigger('dotdotdot');
      }

      // ajax
      var layout_06_ajax = function(ifrom, isize) {
        // clear article content
        article = '';
        var items = {
          from: ifrom,
          size: isize,
          tags: $layout.data('tags'),
          filter: $layout.data('filter')
        };
        $.ajax({
          url: JUKSY.apiUri + '/v1.0/search/articles',
          data: { tags: items.tags, filter: items.filter, from: items.from, size: items.size },
          type: 'GET',
          dataType: 'json',
          success: function(Jdata) {
            console.log('AJAX layout_06 SUCCESS!!!');

            // no data
            if (!Jdata.length) return;

            // has data
            source = $("#template-l06-start").html();
            template = Handlebars.compile(source);
            article += template();
            for (var n = 0; n < Jdata.length; n++) {
              source = $("#template-l06").html();
              template = Handlebars.compile(source);
              article += template(Jdata[n]);
            }
            source = $("#template-l06-end").html();
            template = Handlebars.compile(source);
            article += template();
            addArticle();
          },
          error: function() {
            console.log('AJAX layout_06 ERROR!!!');
          }
        });
      }

      //init loading ajax
      layout_06_ajax(countFrom, countSize);
    });
  });

  // Youtube api
  // create deferred object
  var YTdeferred = $.Deferred();
  window.onYouTubeIframeAPIReady = function() {
    // console.log('Youtube API ready');
    // resolve when youtube callback is called
    // passing YT as a parameter
    YTdeferred.resolve(window.YT);
  };

  // embedding youtube iframe api
  // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $(function() {
    var player,
      header_02_player = $('#header_02_player'),
      header_02_videoId = header_02_player.data('videoid'),
      header_02_start = header_02_player.data('start');
    // whenever youtube callback was called = deferred resolved
    // your custom function will be executed with YT as an argument
    YTdeferred.done(function(YT) {
      // creating a player
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      player = new YT.Player('header_02_player', {
        videoId: header_02_videoId, // YouTube 影片ID
        width: 560, // 播放器寬度 (px)
        height: 315, // 播放器高度 (px)
        playerVars: {
          rel: 0, // 播放結束後推薦其他影片
          controls: 0, // 在播放器顯示暫停／播放按鈕
          start: header_02_start, //指定起始播放秒數
          autoplay: 1, // 在讀取時自動播放影片
          loop: 1, // 讓影片循環播放
          playlist: header_02_videoId,
          showinfo: 0, // 隱藏影片標題
          modestbranding: 1, // 隱藏YouTube Logo
          fs: 0, // 隱藏全螢幕按鈕
          cc_load_policty: 0, // 隱藏字幕
          iv_load_policy: 3, // 隱藏影片註解
          autohide: 0 // 當播放影片時隱藏影片控制列
        },
        events: {
          onReady: function(e) {
            e.target.mute(); // 靜音
          }
        }
      });
    });
  });

})(jQuery);
