// Placeholder NeuroEdge client
export default {
  diagnoseSymptoms: async (symptoms) => {
    return { placeholder: true, symptoms, diagnosis: ['Diagnosis A (placeholder)'] };
  },
  treatmentGuidelines: async (condition) => {
    return { placeholder: true, guidelines: 'No guidelines configured yet.' };
  },
  dischargeSummary: async (data) => {
    return { placeholder: true, summary: 'Discharge summary placeholder.' };
  },
  transcribeAudio: async (buffer) => {
    return { placeholder: true, text: 'Transcription placeholder.' };
  },
  triage: async (symptoms) => {
    return { placeholder: true, priority: 'medium' };
  }
};