import { apiInitializer } from "discourse/lib/api";
import loadScript from "discourse/lib/load-script";

export default apiInitializer("1.8.0", (/* api */) => {
  loadCookiePolicy();
});

async function loadCookiePolicy() {
  await loadScript(settings.theme_uploads_local.cookie_policy_js);
  cpNs.cookiePolicy();

  try {
    tryLogin();    
  } catch (e) {
    console.log('try login', e);
  }
}


// 如果发现已登录（有_U_T_）主动登录一次
function tryLogin () {
  const cookies = {};
  document.cookie.split(';').map((item) => {
    const one = item.trim().split('=');
    cookies[one[0]] = one[1];
    return item;
  });
  // flag 是添加论坛主动登录的标记，如果已主动登录过就不继续尝试主动登录
  const flag = '_T_L_';
  console.log('cookies', cookies);
  if (cookies['_U_T_'] && cookies[flag] != 1) {
    const dom = document.querySelector('.login-button');
    if (dom) {
      document.cookie = `${flag}=1`;
      dom?.click();
      console.log('do tryLogin');
    }    
  } else {
    document.cookie = `${flag}=0`;
    console.log('reset tryLoign')
  }
}