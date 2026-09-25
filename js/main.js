/* =========================================================
   TaskLink sample LP - main.js（外部ライブラリなし）
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  var PC_QUERY = window.matchMedia('(min-width: 1024px)');

  /* ----- Hamburger menu ----- */
  var toggle = document.querySelector('.hamburger');
  var nav = document.getElementById('global-nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // メニュー内のリンクを押したら閉じる
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && !PC_QUERY.matches) {
        setMenu(false);
      }
    });

    // Escキーで閉じてボタンにフォーカスを戻す
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    // PC幅になったら開閉状態をリセット
    PC_QUERY.addEventListener('change', function () {
      setMenu(false);
    });
  }

  /* ----- Header shadow / page-top button ----- */
  var header = document.querySelector('.header');
  var pageTop = document.querySelector('.page-top');
  var hero = document.querySelector('.hero');

  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (entries) {
      var pastHero = !entries[0].isIntersecting;
      header.classList.toggle('is-scrolled', pastHero);
      pageTop.classList.toggle('is-visible', pastHero);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  }

  /* ----- Fade-in on scroll ----- */
  var fadeTargets = document.querySelectorAll('.js-fade');

  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    fadeTargets.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    fadeTargets.forEach(function (el) {
      el.classList.add('is-inview');
    });
  }

  /* ----- Contact form（サンプルのため送信しない） ----- */
  var form = document.getElementById('contact-form');
  var result = document.getElementById('form-result');

  function validateField(input) {
    var error = document.getElementById(input.id + '-error');
    var message = '';

    if (input.validity.valueMissing) {
      message = '入力してください。';
    } else if (input.validity.typeMismatch) {
      message = 'メールアドレスの形式で入力してください。';
    }

    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message;
    return !message;
  }

  if (form) {
    var requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;

      requiredFields.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        result.textContent = '';
        firstInvalid.focus();
        return;
      }

      result.textContent = 'このフォームはポートフォリオ用のサンプルです。入力内容はどこにも送信されていません。';
      form.reset();
      requiredFields.forEach(function (input) {
        input.removeAttribute('aria-invalid');
      });
    });
  }
})();
