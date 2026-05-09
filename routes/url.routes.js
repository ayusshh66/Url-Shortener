import express from 'express'
import {urlPostRequestSchema} from '../validation/request.validation.js'
import {urlsTable} from '../models/index.js'
import {ensureAuthentication} from '../middlewares/auth.middleware.js'
import {createShortenUrl} from '../services/url.service.js'
import db from '../src/index.js'
import {nanoid} from 'nanoid'
import { and, eq } from 'drizzle-orm'

const route = express.Router();

route.post('/shorten',ensureAuthentication, async(req,res) => {
    const userId = req.user?.id;
    const validResult = await urlPostRequestSchema.safeParseAsync(req.body);

    if(validResult.error) return res.status(400).json({error : validResult.error.format()})

    const {url, code} = validResult.data;

    const shortCode = code ?? nanoid(6);

    const result = await createShortenUrl({shortCode, targetUrl : url, userId});

    return res.status(201).json({ id : result.id, shortCode : result.shortCode, url : result.targetUrl})
})

route.get('/codes', ensureAuthentication,async (req,res) => {
    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId,req.user.id));

    return res.status(200).json({codes })
})

route.delete('/:id',ensureAuthentication, async (req,res) => {
    const id = req.params.id;

    const result = await db.select().from(urlsTable).where(and(eq(urlsTable.id,id), eq(urlsTable.user, req.user.id))) //ensures 2 verification

    return res.status(200).json({delete : "true"})
})

route.get('/:shortCode', async (req,res) =>{
    const code = req.params.shortCode;

    const [result] = await db.select({targetUrl : urlsTable.targetUrl}).from(urlsTable).where(eq(urlsTable.shortCode, code));

    if(!result) return res.status(400).json({message : `INVALID URL`});

    return res.redirect(result.targetUrl)
})

export default route;