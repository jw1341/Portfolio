/**
 * Validates password based on this exact requirement:
 * Password must be at least 8 characters long and include:
 * - At least one uppercase letter [A-Z]
 * - At least one lowercase letter [a-z]
 * - At least one number [0-9]
 * - At least one special character from [ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ ]
 */
function isValidPassword(pw) {
    const regExpression = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[ !"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]).{8,}$/;
    return regExpression.test(pw);
}
  
  /**
   * Validates username based on this exact requirement:
   * Username must be at least five characters long, start with a letter,
   * and contain only letters and numbers.
   * Special characters, spaces, and symbols are not allowed.
   */
  function isValidUserName(username) {
    const regEx = /^[A-Za-z][A-Za-z0-9]{4,}$/;
    return regEx.test(username);
  }

  function isHashed(password) {
    return typeof password === 'string' && /^\$2[aby]\$/.test(password) && password.length === 60;
  }
  
  
  export {
    isValidUserName,
    isValidPassword,
    isHashed
  }
  