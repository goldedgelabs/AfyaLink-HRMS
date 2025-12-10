const neuro = require('./neuroedgeClient');

async function diagnose(symptoms){
  return await neuro.diagnoseSymptoms(symptoms);
}

async function treatment(condition){
  return await neuro.treatmentGuidelines(condition);
}

async function discharge(data){
  return await neuro.dischargeSummary(data);
}

async function transcribe(buffer){
  return await neuro.transcribeAudio(buffer);
}

async function triage(symptoms){
  return await neuro.triage(symptoms);
}

module.exports = { diagnose, treatment, discharge, transcribe, triage };