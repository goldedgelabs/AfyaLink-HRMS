import fetch from 'node-fetch';

export async function testFHIRServer(baseUrl){
  // Try to fetch capability statement
  const r = await fetch(baseUrl + '/metadata', { timeout: 10000 });
  if(!r.ok) throw new Error('FHIR server responded ' + r.status);
  const js = await r.json();
  return js;
}

export async function createPatient(baseUrl, patientResource, token){
  const r = await fetch(baseUrl + '/Patient', {
    method:'POST',
    headers: { 'Content-Type':'application/fhir+json', ...(token?{ Authorization: 'Bearer ' + token }:{}) },
    body: JSON.stringify(patientResource)
  });
  if(!r.ok) throw new Error('Failed to create patient: ' + r.status);
  return r.json();
}

export default { testFHIRServer, createPatient };
