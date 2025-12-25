export const getCookie = (name) => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

export const hasUserRefreshToken = () => {
  return getCookie("userRefreshToken") !== null;
};

export const hasAdminRefreshToken = () => {
  return getCookie("adminRefreshToken") !== null;
};
