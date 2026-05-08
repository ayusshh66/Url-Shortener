import express from 'express'
import db from '../src/index.js';
import { usersTable } from '../models/index.js';
import {signupPostRequestBodySchema} from '../validation/request.validation.js'
import { randomBytes, createHmac } from 'node:crypto';
import {hashPasswordWithSalt} from '../utils/hash.js'
import {getUserByEmail, createUser} from '../services/user.service.js'

const route = express.Router();

route.post('/signup', async (req,res) => {
    // req= user's want (request), body = what users enter in below field
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({error : validationResult.error.format()})
    }

    const {firstname, lastname, email, password} = validationResult.data;

    // checks the email entered with userstable email
    const exisitingUser = await getUserByEmail(email)
    //checks if email matches then will throw error
    if(exisitingUser) return res.status(400).json({error : `the user already exists with ${email}, please login instead`});

    // this sections generates random alphabets with our password for security purpose
    const {salt, password : hashedPassword} = hashPasswordWithSalt(password) 

    //fills the value given by the user in userstable data
    const user = await createUser({firstname, lastname, email, hashedPassword, salt});

    //ending :)
    return res.status(200).json({ data : {
        userId : user.id,
    }})
})

export default route;