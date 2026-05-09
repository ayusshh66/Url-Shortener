import express from 'express'
import {urlPostRequestSchema} from '../validation/request.validation.js'
import {urlsTable} from '../models/index.js'
import {ensureAuthentication} from '../middlewares/auth.middleware.js'
import {createShortenUrl} from '../services/url.service.js'
import db from '../src/index.js'
import {nanoid} from 'nanoid'

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

export default route;