import express from 'express'
import {tokenVerificationAuthentication} from '../utils/token.js'

export const authenticationMiddleware = (req,res,next) =>{
    const header = req.headers['authorization'];

    if(!header){
        return next()
    }

    const [_,token] = header.split(' ');

    const payload = tokenVerificationAuthentication(token);

    req.user = payload;
    return next();
}

export const ensureAuthentication = (req,res,next) =>{
    if(!req.user || !req.user.id){
         return res.status(400).json({error : ` you must be logged in`});
    }
    next()
}