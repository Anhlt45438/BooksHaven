import { Router } from 'express';
import { convertStringToInt, fixDiaChiField, testingApp } from '~/controllers/test.controllers';

const testRouter = Router();

testRouter.post('/fix-type-database-field', convertStringToInt);
testRouter.post('/bus-block-puzzle',testingApp);
testRouter.post('/fix-dia-chi-field', fixDiaChiField);


export default testRouter;