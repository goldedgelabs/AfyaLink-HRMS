import Mapping from '../models/Mapping.js';

export async function createMapping(req,res){
  const payload = req.body;
  payload.createdBy = req.user?._id;
  const m = await Mapping.create(payload);
  res.json(m);
}

export async function listMappings(req,res){
  const list = await Mapping.find({}).lean();
  res.json(list);
}

export async function getMapping(req,res){
  const m = await Mapping.findById(req.params.id).lean();
  res.json(m);
}

export async function updateMapping(req,res){
  const upd = req.body;
  upd.updatedAt = new Date();
  const m = await Mapping.findByIdAndUpdate(req.params.id, upd, { new:true }).lean();
  res.json(m);
}

export async function deleteMapping(req,res){
  await Mapping.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
}
