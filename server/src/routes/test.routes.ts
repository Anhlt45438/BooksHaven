import { Router } from 'express';
import { convertStringToInt } from '~/controllers/test.controllers';

const testRouter = Router();

testRouter.post('/convert-string-to-int', convertStringToInt);

export default testRouter;