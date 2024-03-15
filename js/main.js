$(document).ready(function() {

  $(document).on('click', '.mobile-wrap', function() {
    $('.line-burger').toggleClass('line-active');
    $('.main-header__list').slideToggle(200);
  });

  $(document).on('click', '.main-header__link', function() {
    if ($(window).width() <= 1023) {
      $('.line-burger').removeClass('line-active');
      $('.main-header__list').slideUp(200);
    }
  })

  $(window).resize(function() {
    if (window.innerWidth > 1023) {
      $('.main-header__list').attr('style', '');
      $('.line-burger').removeClass('line-active');
    }
  })

  $(document).on('click', '.select__wrap', function(e) {
    if ($(e.target).is('.select__disabled') || $(e.target).closest('.select__list').length) {
      return false;
    }

    let $select__wrap = $(this);

    if (!$select__wrap.hasClass('select__wrap--active')) {
      if ($select__wrap.hasClass('select__wrap--end-active')) {
        return
      }
      showSelectList($select__wrap)
    } else {
      hideSelectList($select__wrap)
    }

  });

  $(document).on('click', '.select__item', function(e) {
    if ($(e.target).is('.select__item--disabled')) {
      return false;
    } else if ($(e.target).is(".select__item")) {
      let $select__wrap = $(this).parents('.select__wrap')
      let $select__item = $(this)

      $select__wrap.find('.select__item--active').removeClass('select__item--active')
      $select__item.addClass('select__item--active');
      setPlaceholder(this);

      hideSelectList($select__wrap)
      e.stopPropagation();
    }

  });

  $(document).on('input', '.select__input', function(e) {
    let isFound;
    $(e.target).parent().siblings('li').each((i, el) => {
      let is = $(el).html().toLowerCase().indexOf(e.target.value.toLowerCase()) != -1;
      $(el).css("display", is ? "block" : "none");
      if (is) isFound = true;
    });
    $('.select__item-search-not-found').css("display", isFound ? "none" : "block");
  })


  function clickOutside(e) {
    var $select__wrap = $(".select__wrap");
    if (!$select__wrap.is(e.target) && $select__wrap.has(e.target).length === 0) {
      hideSelectList($select__wrap)
    }
  }

  function showSelectList($select__wrap) {
    $(document).on('click', clickOutside);
    let $select__list = $select__wrap.find(".select__list");

    let {
      height,
      top,
      bottom
    } = $select__list.get(0).getBoundingClientRect();
    if ($(window).height() < bottom - 16 && top > height + 16 * 2) {
      $select__wrap.addClass('select__wrap--position-top');
    }

    $('.select__wrap').removeClass('select__wrap--active');
    $select__wrap.addClass('select__wrap--start-active');
    setTimeout(() => {
      $select__wrap.removeClass('select__wrap--start-active').addClass('select__wrap--active');
      let duration = getTransitionDuration($select__list);
      setTimeout(() => {
        $select__wrap.addClass('select__wrap--end-active')
      }, duration)
    }, 0)

  }

  function hideSelectList($select__wrap) {
    $(document).off('click', clickOutside);
    $select__wrap.removeClass('select__wrap--active');
    let duration = getTransitionDuration($select__wrap.find(".select__list"));
    setTimeout(() => {
      $select__wrap.removeClass('select__wrap--position-top select__wrap--end-active')
    }, duration)
  }

  function setPlaceholder(self) {
    var value_pl = $(self).html();
    $(self).parents('.select__wrap').find('.select__placeholder').html(value_pl);
  }

  function checkActive(self) {
    var text = $(self).find('.select__item--active').text();
    $(self).find('.select__placeholder').html(text);
  }

  function getTransitionDuration($self) {
    return Math.max(...$self.css('transition-duration').split('s,').map(parseFloat), 0) * 1000 + 50;
  }

  let elementCount = 1;

  function cloneElement() {
    const template = document.getElementById('clone-template');
    const clone = document.importNode(template.content, true);
    clone.id = 'item' + ++elementCount;
    clone.querySelector('.popup__subtitle .popup__number').textContent = elementCount;
    document.querySelector('.popup__wrap').appendChild(clone);
  }

  $(document).on('click', '.popup__add', function(e) {
    cloneElement();
  })

  $(document).on('click', '.popup__del', function(e) {
    const c = $(e.target).closest('.popup__item');
    c.remove();
    elementCount--;
    $('.popup .popup__item').each(function(index) {
      const popupItem = $(this);
      const popupSubtitleNumber = popupItem.find('.popup__subtitle .popup__number');
      popupSubtitleNumber.text(index + 1);
    });
  });

})

document.addEventListener('DOMContentLoaded', function() {
  var btn = document.querySelector('.popup--request .btn');

  var inputs = document.querySelectorAll('.popup--request input, .popup--request .select__placeholder');

  function collectFormData() {
    let formData = {
      "p_fio": document.getElementById('p_fio').value,
      "p_name": document.getElementById('p_name').value,
      "p_phone": document.getElementById('p_phone').value,
      "p_email": document.getElementById('p_email').value
    };

    let locationItems = document.querySelectorAll('.popup--request .popup__item');
    locationItems.forEach(function(location, index) {
      formData["location" + (index + 1)] = {
        "services": location.querySelector('.select__placeholder').textContent.trim(),
        "shop": location.querySelector('input[type="text"]').value,
        "city": location.querySelectorAll('.select__placeholder')[1].textContent.trim(),
        "amount": location.querySelectorAll('.select__placeholder')[2].textContent.trim()
      };
    });

    return formData;
  }

  btn.addEventListener('click', function() {
    let formData = collectFormData();
    console.log(formData);
  });

  $(document).on('click', '.services__btn--info, .main-header__btn, .info__btn--request, .price .btn', function(e) {
    e.preventDefault();
    $('.popup--request').addClass('popup--active');
  })

  $(document).on('click', '.popup__close', function(e) {
    $('.popup--request').removeClass('popup--active');
  })

   $(document).mousedown(function(e) {
    var popupBlock = $('.popup__block');
    if (!popupBlock.is(e.target) && popupBlock.has(e.target).length === 0 && $('.popup').hasClass('popup--active')) {
        $('.popup').removeClass('popup--active');
    }
});

});

$(document).on('click', '.main-header__link', function() {
  let target = $(this).attr('href');
  let pos = target.indexOf('#');
  let heightHeader = $('.main-header').outerHeight()
  if (pos !== -1) {
    target = target.substring(pos);
    let coordsScroll = 0;
    if ($(window).width() <= 767) {
      coordsScroll = $(target).offset().top - heightHeader;
    } else {
      coordsScroll = $(target).offset().top
    }
    $('html, body').animate({
      scrollTop: coordsScroll
    }, 800);
    return false;
  }
})

$(document).ready(function() {
    let header = $(".main-header");
    
    let headerHeight = header.outerHeight();
    var info = $('.info');
    $(window).scroll(function() {
        if (header.length > 0) {
            let detailsHeight = $('.details').outerHeight();
            let currentScroll = $(this).scrollTop();
            if (currentScroll > detailsHeight && $(window).width() <= 767) {
                header.addClass("fixed-header");
                info.css('padding-top', headerHeight + 'px');
            } else {
                header.removeClass("fixed-header");
                info.css('padding-top', '');
            }
        }
    });
});