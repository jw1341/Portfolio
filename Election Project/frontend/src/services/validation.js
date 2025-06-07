export function isValidPassword(pw) {
    const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;
    return reg.test(pw);
  }
  
  export function isValidUserName(username) {
    const reg = /^[A-Za-z][A-Za-z0-9]{4,}$/;
    return reg.test(username);
  }