import express from 'express'
import {urlPostRequestSchema} from '../validation/request.validation.js'
import {urlsTable} from '../models/index.js'
import db from '../src/index.js'
import {nanoid} from 'nanoid'

const route = express.Router();

route.post('/shorten', async(req,res) => {
    const userId = req.user?.id;

    if(!userId) return res.status(400).json({error : ` you must be logged in`});

    const validResult = await urlPostRequestSchema.safeParseAsync(req.body);

    if(validResult.error) return res.status(400).json({error : validResult.error.format()})

    const {url, code} = validResult.data;

    const shortCode = code ?? nanoid(6);

    const [result] = await db.insert(urlsTable).values({
        shortCode,
        targetUrl : url,
        userId : req.user.id,
    }).returning({ id : urlsTable.id, shortCode: urlsTable.shortCode, targetUrl : urlsTable.targetUrl})// in returning we give reference to our variables to the drizzle table 

    return res.status(201).json({ id : result.id, shortCode : result.shortCode, url : result.targetUrl})
})

export default route;