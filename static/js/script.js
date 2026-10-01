/* ==========================================================================
   HighPing 个人主页 —— 脚本
   只保留必要逻辑：主题、二维码弹窗、技能图懒加载、加载遮罩、统计脚本延迟加载
   原有逐卡片绑定 6 个事件监听的写法已移除（按压反馈改由 CSS :active 完成）
   ========================================================================== */
(function () {
    'use strict';

    var doc = document;
    var root = doc.documentElement;
    var THEME_KEY = 'hp-theme';

    /* ---------------------------- 主题切换 ---------------------------- */
    function readTheme() {
        try {
            var saved = localStorage.getItem(THEME_KEY);
            if (saved === 'Dark' || saved === 'Light') return saved;
        } catch (e) { /* 隐私模式下忽略 */ }
        return root.dataset.theme === 'Light' ? 'Light' : 'Dark';
    }

    function applyTheme(theme) {
        theme = theme === 'Light' ? 'Light' : 'Dark';
        root.dataset.theme = theme;

        var snake = doc.getElementById('tanChiShe');
        if (snake) snake.src = './static/svg/snake-' + theme + '.svg';

        var box = doc.getElementById('myonoffswitch');
        if (box) box.checked = (theme === 'Light'); /* 勾选 = 浅色档 */

        try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* 忽略 */ }
    }

    var themeBox = doc.getElementById('myonoffswitch');
    if (themeBox) {
        themeBox.addEventListener('change', function () {
            applyTheme(themeBox.checked ? 'Light' : 'Dark');
        });
    }
    applyTheme(readTheme());

    /* ---------------------------- 二维码弹窗 ---------------------------- */
    var tc = doc.querySelector('.tc');
    var tcImg = doc.querySelector('.tc-img');
    var qqBtn = doc.getElementById('qqBtn');

    function openQR() {
        if (!tc) return;
        /* 二维码改为打开时才下载 */
        if (tcImg && tcImg.dataset.src && tcImg.getAttribute('src') !== tcImg.dataset.src) {
            tcImg.src = tcImg.dataset.src;
        }
        tc.classList.add('active');
    }

    function closeQR() {
        if (tc) tc.classList.remove('active');
    }

    if (qqBtn) qqBtn.addEventListener('click', openQR);
    if (tc) {
        tc.addEventListener('click', function (event) {
            if (event.target === tc) closeQR();
        });
    }
    doc.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeQR();
    });

    /* ---------------------------- 技能图懒加载 ---------------------------- */
    function loadSkillImage() {
        var isNarrow = window.matchMedia('(max-width: 800px)').matches;
        var img = doc.getElementById(isNarrow ? 'skillWap' : 'skillPc');
        if (img && img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
        }
    }

    var skillBox = doc.querySelector('.skill');
    if (skillBox && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    loadSkillImage();
                    observer.disconnect();
                    break;
                }
            }
        }, { rootMargin: '600px 0px' });
        observer.observe(skillBox);
    } else if (skillBox) {
        loadSkillImage();
    }

    /* ---------------------------- 加载遮罩 ---------------------------- */
    var loader = doc.getElementById('zyyo-loading');
    function hideLoader() {
        if (!loader) return;
        loader.classList.add('is-hidden');
        setTimeout(function () {
            if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
            loader = null;
        }, 260);
    }

    if (doc.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader, { once: true });
    }

    /* ---------------------------- 右键菜单 ---------------------------- */
    doc.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });

    /* ---------------------------- 统计脚本延迟加载 ---------------------------- */
    function loadAnalyticsDeferred() {
        var placeholder = doc.getElementById('LA_COLLECT');
        if (!placeholder || window._laLoaded) return;
        var src = placeholder.getAttribute('data-src');
        if (!src) return;
        window._laLoaded = true;

        var script = doc.createElement('script');
        script.src = src;
        script.charset = 'UTF-8';
        script.onload = function () {
            try {
                if (window.LA && typeof window.LA.init === 'function') {
                    window.LA.init({ id: 'KFqltKSkJgQTGD9l', ck: 'KFqltKSkJgQTGD9l' });
                }
            } catch (e) { /* 忽略 */ }
        };
        doc.body.appendChild(script);
        if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
    }

    var idle = window.requestIdleCallback || function (fn) { setTimeout(fn, 3000); };
    idle(loadAnalyticsDeferred, { timeout: 5000 });

    ['scroll', 'mousemove', 'touchstart', 'keydown'].forEach(function (name) {
        window.addEventListener(name, function onFirst() {
            loadAnalyticsDeferred();
            ['scroll', 'mousemove', 'touchstart', 'keydown'].forEach(function (other) {
                window.removeEventListener(other, onFirst);
            });
        }, { passive: true, once: false });
    });
})();
