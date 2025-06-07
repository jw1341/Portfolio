import { isValidPassword, isValidUserName } from "../business/login";

describe('isValidPassword', () => {
  test('Valid passwords (should return true)', () => {
    expect(isValidPassword('StrongP@ss1')).toBe(true);
    expect(isValidPassword('MyPass123!')).toBe(true);
    expect(isValidPassword('A1b2C3d4!')).toBe(true);
    expect(isValidPassword('StrongP@ss567')).toBe(true);
  });

  test('Invalid passwords (should return false)', () => {
    expect(isValidPassword('Sh0rt!')).toBe(false);                 // Too short
    expect(isValidPassword('NoSpecial123')).toBe(false);          // Missing special character
    expect(isValidPassword('NoNumber!')).toBe(false);             // Missing number
    expect(isValidPassword('nouppercase1!')).toBe(false);         // Missing uppercase
    expect(isValidPassword('NOLOWERCASE1!')).toBe(false);         // Missing lowercase
    expect(isValidPassword('weakpass')).toBe(false);              // Missing all but lowercase
    expect(isValidPassword('pass123')).toBe(false);
  });  
});

describe('isValidUserName', () => {
  test('Valid usernames (should return true)', () => {
    expect(isValidUserName('Jason99')).toBe(true);
    expect(isValidUserName('Alpha123')).toBe(true);
    expect(isValidUserName('Mike5')).toBe(true);
    expect(isValidUserName('BetaUser99')).toBe(true);
  });

  test('Invalid usernames (should return false)', () => {
    expect(isValidUserName('J')).toBe(false);              // Too short
    expect(isValidUserName('1Jason')).toBe(false);         // Starts with a number
    expect(isValidUserName('Mike_123')).toBe(false);       // Contains underscore
    expect(isValidUserName('John Doe')).toBe(false);       // Contains space
    expect(isValidUserName('Jason!')).toBe(false);         // Contains special character
    expect(isValidUserName('cat')).toBe(false);            // Reserved (optional, if enforced)
    expect(isValidUserName('3Bob ')).toBe(false);
  });
});
