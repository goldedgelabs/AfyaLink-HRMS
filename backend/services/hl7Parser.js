import fs from 'fs';
import { parseHl7 } from '@medplum/hl7';

/**
 * parseHL7Patient kept for backward compat: simple mapping PID->Patient
 */
export function parseHL7Patient(rawHL7){
  const msg = parseHl7(rawHL7);
  const pid = msg.segments.find(s => s.name === 'PID');
  if(!pid) throw new Error('PID not found');
  const getComponent = (seg, fieldIndex, compIndex=0) => {
    const field = seg.getField(fieldIndex);
    if(!field) return null;
    const comp = field.components && field.components[compIndex] ? field.components[compIndex].value : field.value;
    return comp || null;
  };
  const patientId = getComponent(pid, 3, 0);
  const nameField = pid.getField(5);
  const lastName = nameField?.components?.[0]?.value || null;
  const firstName = nameField?.components?.[1]?.value || null;
  const gender = pid.getField(8)?.value || null;
  const dob = pid.getField(7)?.value || null;
  const phone = pid.getField(13)?.value || null;
  return { externalSource:'HL7', externalId: patientId, firstName, lastName, gender: gender==='M'?'Male':gender==='F'?'Female':'Other', dateOfBirth: dob?`${dob.slice(0,4)}-${dob.slice(4,6)}-${dob.slice(6,8)}`:null, phone };
}

/**
 * parseHL7ToSegments: returns parsed segments using medplum parseHl7
 */
export function parseHL7ToSegments(rawHL7){
  const msg = parseHl7(rawHL7);
  // return an array of { name, fields: [ { value, components: [...] } ] }
  return msg.segments.map(seg=>{
    return {
      name: seg.name,
      fields: seg.fields.map(f=>{
        return { value: f.value, components: (f.components||[]).map(c=>({ value: c.value })) };
      })
    };
  });
}

/**
 * getHL7Field(segments, 'PID-5.1') => returns component value
 */
export function getHL7Field(segments, path){
  // path like 'PID-5.1' or 'PID-3' (no component)
  const m = path.match(/^([A-Z0-9]+)-(\d+)(?:\.(\d+))?$/);
  if(!m) return null;
  const segName = m[1], fieldIdx = parseInt(m[2],10), compIdx = m[3]?parseInt(m[3],10):null;
  const seg = segments.find(s => s.name === segName);
  if(!seg) return null;
  const field = seg.fields[fieldIdx-1]; // HL7 fields are 1-based
  if(!field) return null;
  if(compIdx !== null){
    const comp = field.components[compIdx-1];
    return comp ? comp.value : null;
  }
  return field.value;
}

export default { parseHL7Patient, parseHL7ToSegments, getHL7Field };
