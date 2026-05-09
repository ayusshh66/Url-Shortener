import db from '../src/index.js'
import {urlsTable} from '../models/index.js'


export const createShortenUrl = async ({shortCode, targetUrl, userId}) => {
    const [result] = await db.insert(urlsTable).values({
        shortCode,
        targetUrl ,
        userId ,
    }).returning({id : urlsTable.id, targetUrl : urlsTable.targetUrl, shortCode : urlsTable.shortCode })    // in returning we give reference to our variables to the drizzle table 
    return result;
}