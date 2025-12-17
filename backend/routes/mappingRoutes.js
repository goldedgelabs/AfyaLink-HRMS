import express from 'express';
import { createMapping, listMappings, getMapping, updateMapping, deleteMapping } from '../controllers/mappingController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createMapping);
router.get('/', auth, listMappings);
router.get('/:id', auth, getMapping);
router.put('/:id', auth, updateMapping);
router.delete('/:id', auth, deleteMapping);

export default router;
