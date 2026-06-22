/* ============================================================
   FARMKO GLS — 한국어/영어 전환 (i18n)
   - data-en       : 요소의 영문 innerHTML (한국어는 기존 내용 유지)
   - data-en-ph    : input/textarea placeholder 영문
   - data-en-title : <body>에 두는 페이지 <title> 영문
   - data-lang-btn : "ko" | "en"  (전환 버튼)
   선택 언어는 localStorage에 저장되어 모든 페이지에 적용됩니다.
   ============================================================ */
(function () {
  var KEY = 'farmko_lang';
  function get() { try { return localStorage.getItem(KEY) || 'ko'; } catch (e) { return 'ko'; } }
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }

  function apply(lang) {
    var en = (lang === 'en');
    document.documentElement.setAttribute('lang', en ? 'en' : 'ko');

    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.__ko == null) el.__ko = el.innerHTML;          // 최초 1회 한국어 보관
      el.innerHTML = en ? el.getAttribute('data-en') : el.__ko;
    });

    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      if (el.__koph == null) el.__koph = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', en ? el.getAttribute('data-en-ph') : el.__koph);
    });

    var b = document.body;
    if (b && b.getAttribute('data-en-title')) {
      if (b.__kotitle == null) b.__kotitle = document.title;
      document.title = en ? b.getAttribute('data-en-title') : b.__kotitle;
    }

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
    });

    save(lang);
  }

  window.setLang = apply;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        apply(btn.getAttribute('data-lang-btn'));
      });
    });
    apply(get());
  });
})();
