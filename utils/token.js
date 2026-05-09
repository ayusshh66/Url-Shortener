import jwt from "jsonwebtoken";
import {tokenValidator} from '../validation/token.validation.js'
// import { error } from "node:console";

const JWT_SECRET = process.env.JWT_SECRET;

export const userToken = async (payload) => {
// this tokenvalidator is a schema not a function,
 const validationResult = await tokenValidator.safeParseAsync(payload);

 if(validationResult.error) throw new Error(validationResult.error.message);

//  validationResult has the shape { success, data, error } — you can't pass that whole object to jwt.sign().
//  You need just the clean, validated payload inside .data.
 const payloadValidationData = validationResult.data;

 const token = jwt.sign(payloadValidationData,JWT_SECRET);
 return token;
} 