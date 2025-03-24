import { Router } from 'express';
import { convertStringToInt } from '~/controllers/test.controllers';

const testRouter = Router();

testRouter.post('/fix-type-database-field', convertStringToInt);

export default testRouter;