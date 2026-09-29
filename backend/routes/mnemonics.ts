import { Router } from 'express';
import { MnemonicController } from '../controllers/mnemonicController.js';

const router = Router();

router.get('/', MnemonicController.getAllMnemonics);
router.post('/generate', MnemonicController.generateMnemonic);

export default router;
