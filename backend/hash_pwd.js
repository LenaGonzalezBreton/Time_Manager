import bcrypt from 'bcryptjs';

async function hashPassword() {
    const hash = await bcrypt.hash('pwd', 10);
    console.log(hash);
}

hashPassword();
