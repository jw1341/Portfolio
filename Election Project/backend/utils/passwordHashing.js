import bcrypt from 'bcrypt';

/**
 * @return hashed password String
 */
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword;
}

export default hashPassword;