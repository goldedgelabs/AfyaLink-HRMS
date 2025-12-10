import LabTest from '../models/LabTest.js';
import { getIO } from '../utils/socket.js';

export const orderTest = async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload.patient || !payload.testType) return res.status(400).json({message:'patient and testType required'});
    const lt = await LabTest.create({...payload, orderedBy: req.user._id, status: 'Ordered'});
    try { getIO().to(String(lt.orderedBy)).emit('labOrdered', lt); } catch(e){}
    res.json(lt);
  } catch (err) { next(err); }
};

export const getLab = async (req, res, next) => {
  try {
    const lt = await LabTest.findById(req.params.id).populate('patient orderedBy hospital');
    if (!lt) return res.status(404).json({message:'Not found'});
    res.json(lt);
  } catch (err) { next(err); }
};

export const listLabs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.hospital) filter.hospital = req.query.hospital;
    const items = await LabTest.find(filter).populate('patient orderedBy hospital').limit(1000);
    res.json(items);
  } catch (err) { next(err); }
};

export const uploadResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { result, status } = req.body;
    const lt = await LabTest.findByIdAndUpdate(id, { result, status: status || 'Completed' }, { new: true });
    if (!lt) return res.status(404).json({message:'Not found'});
    try { getIO().to(String(lt.patient)).emit('labResult', lt); } catch(e){}
    res.json(lt);
  } catch (err) { next(err); }
};

export const updateLab = async (req, res, next) => {
  try {
    const lt = await LabTest.findByIdAndUpdate(req.params.id, req.body, {new:true});
    if (!lt) return res.status(404).json({message:'Not found'});
    res.json(lt);
  } catch (err) { next(err); }
};

export const deleteLab = async (req, res, next) => {
  try {
    const lt = await LabTest.findByIdAndDelete(req.params.id);
    if (!lt) return res.status(404).json({message:'Not found'});
    res.json({message:'deleted'});
  } catch (err) { next(err); }
};
