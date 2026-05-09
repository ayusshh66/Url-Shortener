import express from 'express'
import db from '../src/index.js';
import { usersTable } from '../models/index.js';
import {signupPostRequestBodySchema, loginPostRequesrBodySchema} from '../validation/request.validation.js'
import { randomBytes, createHmac } from 'node:crypto';
import {hashPasswordWithSalt} from '../utils/hash.js'
import {getUserByEmail, createUser} from '../services/user.service.js'
import {userToken} from '../utils/token.js'
import  jwt  from 'jsonwebtoken';

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

route.post('/login', async (req,res) => {
    const validationResult = await loginPostRequesrBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({error : validationResult.error.format()})
    }

    const {email, password} = validationResult.data;

    const user = await getUserByEmail(email);

    if(!user){
        return res.status(400).json({error : `user with ${email} does not exist`})
    }

    const {password : hashedPassword} = hashPasswordWithSalt(password,user.salt)
    // console.log("input password hashed:", hashedPassword)
    // console.log("stored password in DB:", user.password)

    if(hashedPassword !== user.password){
        return res.status(400).json({error : `the password is wrong`})
    }

    // const token =  jwt.sign({id : user.id}, process.env.JWT_SECRET)
    const token = await userToken({id:user.id})

    return res.status(200).json({token})

})



export default route;