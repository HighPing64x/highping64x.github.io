document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  const menuItems = document.querySelectorAll('#sidebar ul li');
  const main = document.getElementById('main');

  const pages = {
    'to-sdk4399': `
      <h2>4399转SDK4399</h2>
      <form id="sdk4399-form" autocomplete="off" style="max-width:340px;margin-top:24px;">
        <div style="margin-bottom:16px;">
          <label for="sdk4399-username">用户名：</label><br>
          <input type="text" id="sdk4399-username" name="username" required style="width:100%;padding:8px;">
        </div>
        <div style="margin-bottom:16px;">
          <label for="sdk4399-password">密码：</label><br>
          <input type="password" id="sdk4399-password" name="password" required style="width:100%;padding:8px;">
        </div>
        <button type="submit" style="padding:8px 24px;">生成SDK4399字符串</button>
      </form>
      <div id="sdk4399-result" style="margin-top:24px;word-break:break-all;"></div>
    `,
    'random-deviceid': `
      <h2>随机deviceid生成</h2>
      <button id="gen-deviceid-btn" style="padding:8px 24px;margin-top:24px;">生成16位deviceid</button>
      <div id="deviceid-result" style="margin-top:24px;font-size:1.2em;font-family:monospace;word-break:break-all;"></div>
    `
  };

  function setActive(id) {
    if (main.classList.contains('fade-in')) {
      main.classList.remove('fade-in');
      // 触发重绘以重置动画
      void main.offsetWidth;
    }
    menuItems.forEach(item => item.classList.remove('active'));
    const active = document.getElementById(id);
    if (active) active.classList.add('active');
    main.innerHTML = pages[id] || '';
    main.classList.add('fade-in');

    // 绑定4399转SDK4399表单事件
    if (id === 'to-sdk4399') {
      const form = document.getElementById('sdk4399-form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const username = document.getElementById('sdk4399-username').value.trim();
          const password = document.getElementById('sdk4399-password').value;
          const resultDiv = document.getElementById('sdk4399-result');
          if (!username || !password) {
            resultDiv.innerHTML = '<span style="color:red;">用户名和密码不能为空！</span>';
            return;
          }
          // 构造json字符串
          const json = JSON.stringify({ username, password });
          // base64加密
          const base64 = btoa(unescape(encodeURIComponent(json)));
          // 拼接前缀
          const sdk4399 = 'SDK4399' + base64;
          resultDiv.innerHTML = `
            <div style='color:#2b8a3e;font-weight:bold;'>转换结果：</div>
            <div style='margin-top:8px;word-break:break-all;' id='sdk4399-string'>${sdk4399}</div>
            <button id='copy-sdk4399-btn' style='margin-top:12px;padding:6px 18px;'>复制结果</button>
          `;
          // 绑定复制按钮
          const copyBtn = document.getElementById('copy-sdk4399-btn');
          copyBtn.addEventListener('click', function() {
            const str = document.getElementById('sdk4399-string').innerText;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(str).then(() => {
                copyBtn.innerText = '已复制!';
                setTimeout(() => copyBtn.innerText = '复制结果', 1200);
              });
            } else {
              // 兼容性处理
              const textarea = document.createElement('textarea');
              textarea.value = str;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
              copyBtn.innerText = '已复制!';
              setTimeout(() => copyBtn.innerText = '复制结果', 1200);
            }
          });
        });
      }
    }
    // 绑定SDK4399转4399表单事件
    else if (id === 'to-4399') {
      const form = document.getElementById('to4399-form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const sdkstr = document.getElementById('to4399-sdkstr').value.trim();
          const resultDiv = document.getElementById('to4399-result');
          if (!sdkstr.startsWith('SDK4399')) {
            resultDiv.innerHTML = '<span style="color:red;">输入的字符串必须以SDK4399开头！</span>';
            return;
          }
          const base64 = sdkstr.slice(8);
          let json = '';
          try {
            // 尝试直接atob
            json = atob(base64);
          } catch (err) {
            // 兼容部分浏览器的base64异常
            try {
              json = decodeURIComponent(escape(window.atob(base64)));
            } catch (e2) {
              resultDiv.innerHTML = '<span style="color:red;">Base64解码失败，请检查输入！</span>';
              return;
            }
          }
          let obj;
          try {
            obj = JSON.parse(json);
          } catch (err) {
            resultDiv.innerHTML = '<span style="color:red;">JSON解析失败，字符串格式不正确！</span>';
            return;
          }
          if (!obj.username || !obj.password) {
            resultDiv.innerHTML = '<span style="color:red;">解析结果缺少用户名或密码！</span>';
            return;
          }
          resultDiv.innerHTML = `
            <div style='color:#2b8a3e;font-weight:bold;'>解析结果：</div>
            <div style='margin-top:8px;'>用户名：<span style='font-weight:bold;'>${obj.username}</span></div>
            <div style='margin-top:4px;'>密码：<span style='font-weight:bold;'>${obj.password}</span></div>
            <button id='copy-username-btn' style='margin-top:12px;margin-right:8px;padding:6px 18px;'>复制用户名</button>
            <button id='copy-password-btn' style='margin-top:12px;padding:6px 18px;'>复制密码</button>
          `;
          // 绑定复制按钮
          const copyUserBtn = document.getElementById('copy-username-btn');
          const copyPwdBtn = document.getElementById('copy-password-btn');
          copyUserBtn.addEventListener('click', function() {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(obj.username).then(() => {
                copyUserBtn.innerText = '已复制!';
                setTimeout(() => copyUserBtn.innerText = '复制用户名', 1200);
              });
            }
          });
          copyPwdBtn.addEventListener('click', function() {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(obj.password).then(() => {
                copyPwdBtn.innerText = '已复制!';
                setTimeout(() => copyPwdBtn.innerText = '复制密码', 1200);
              });
            }
          });
        });
      }
    }
    // 绑定随机deviceid生成事件
    else if (id === 'random-deviceid') {
      const btn = document.getElementById('gen-deviceid-btn');
      const resultDiv = document.getElementById('deviceid-result');
      if (btn) {
        btn.addEventListener('click', function() {
          const chars = '1234567890abcdef';
          let str = '';
          for (let i = 0; i < 16; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
          }
          resultDiv.innerHTML = str;
        });
      }
    }
  }

  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      setActive(this.id);
    });
  });

  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
  });

  // 亮暗主题切换
  const themeBtn = document.getElementById('toggleTheme');
  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // 统一按钮风格
    themeBtn.style.background = theme === 'dark' ? '#23272a' : '#f5f5f7';
    themeBtn.style.color = theme === 'dark' ? '#ffe066' : '#222';
    themeBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    themeBtn.style.border = 'none';
    themeBtn.style.transition = 'background 0.4s, color 0.4s';
    // 不再设置innerText和title，图片切换由CSS控制
  }
  themeBtn.addEventListener('click', function() {
    const current = document.body.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
  // 初始化主题
  setTheme(localStorage.getItem('theme') || 'light');

  // 默认显示第一个功能
  setActive('to-sdk4399');
});
