import { Router } from 'express';
import { convertStringToInt, testingApp } from '~/controllers/test.controllers';

const testRouter = Router();

testRouter.post('/fix-type-database-field', convertStringToInt);
testRouter.post('/bus-block-puzzle',testingApp);
export default testRouter;