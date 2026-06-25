import { AccessTokenUtil } from "../TokenUtil/AccessTokenUtil";

export const exceptionProcess = () => {
  const EXCEPTION_ERROR_MESSAGE = '予期せぬエラーが発生しました。\nしばらく時間を置いてからお試しください。';
  alert(EXCEPTION_ERROR_MESSAGE);
  window.location.href = '/';
}

export const exceptionAdminProcess = () => {
  const EXCEPTION_ADMIN_ERROR_MESSAGE = '予期せぬエラーが発生しました。\nもう一度ログインしてからお試しください。';
  alert(EXCEPTION_ADMIN_ERROR_MESSAGE);
  AccessTokenUtil.removeToken();
  window.location.href ='/login';
}