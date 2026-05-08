import express from 'express'
import db from '../src/index.js';
import { usersTable } from '../models/user.model.js';
import { eq } from 'drizzle-orm';
import { randomBytes, createHmac } from 'node:crypto';

const route = express.Router();

route.get('/signin', async (req,res) => {
    // req= user's want (request), body = what users enter in below field
    const {firstname, lastname, email, password} =  req.body;

    // checks the email entered with userstable email
    const [exisitingUser] = await db.select({id: usersTable.id}).from(usersTable).where(eq(usersTable.email,email));

    //checks if email matches then will throw error
    if(exisitingUser) return res.status(400).json({error : `the user already exists with ${email}, please login instead`});

    // this sections generates random alphabets with our password for security purpose
    const salt = randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    //fills the value given by the user in userstable data
    const [user] = await db.insert(usersTable).values({
        id,
        firstname,
        lastname,
        email,
        password : hashedPassword,
        salt,
    }).returning({id : usersTable.id}) // gives if as returning

    //ending :)
    return res.status(200).json({ data : {
        userId : user.id,
    }})
})

export default route;