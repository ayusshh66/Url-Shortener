import db from '../src/index.js'
import { usersTable  } from '../models/index.js';
import { eq } from 'drizzle-orm';
import { id } from 'zod/locales';

export const getUserByEmail = async (email) => {
    const  [exisitingUser] = await db.select({
    id: usersTable.id,
    email : usersTable.email,
    firstname : usersTable.firstname,
    lastname : usersTable.lastname
    }). from(usersTable).where(eq(usersTable.email,email))

    return exisitingUser;
}

export const createUser = async ({firstname, lastname, email, hashedPassword, salt}) => {
    const [user] = await db.insert(usersTable).values({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        salt,
    }).returning({id: usersTable.id})

    return user;
}