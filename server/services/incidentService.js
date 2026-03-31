import db from '../firebase.js';
import aiClient from '../config/gemini.js';

/**
 * Creates a new incident in Firestore
 */
export const createIncident = async (incidentData) => {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  const incRef = await db.collection('incidents').add({
    ...incidentData,
    status: 'ACTIVE',
    timestamp: new Date()
  });
  return { id: incRef.id, ...incidentData, status: 'ACTIVE' };
};

/**
 * Uses Gemini API to draft an attendee alert block and staff task block
 */
export const generateIncidentInstructions = async (type, zone) => {
  if (!aiClient) {
    return {
      attendeeAlert: `Emergency in Zone ${zone}. Please remain calm and proceed to the nearest exit.`,
      staffTask: `Respond to ${type} emergency in Zone ${zone} immediately.`
    };
  }

  const prompt = `An active ${type} report occurred in Zone ${zone}. Provide a strict JSON response with two keys string: "attendeeAlert" (a 1-sentence calm exit guide for nearby attendees) and "staffTask" (a concise 1-sentence actionable task for a security guard responding to the area). Do not use markdown syntax for the JSON.`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text || '';
    // Strip possible markdown wrapping:
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini failed to generate text:", error.message);
    return {
      attendeeAlert: `Emergency in Zone ${zone}. Please remain calm and leave the area safely.`,
      staffTask: `Respond to ${type} incident in Zone ${zone}.`
    };
  }
};

/**
 * Creates a task for staff
 */
export const createStaffTask = async (incidentId, type, zone, instructions) => {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  const taskRef = await db.collection('tasks').add({
    incidentId,
    type,
    zone,
    instructions,
    status: 'ASSIGNED',
    assignedTo: 'staff_pool', // or individual staff IDs
    timestamp: new Date()
  });
  return { id: taskRef.id, incidentId, type, zone, instructions, status: 'ASSIGNED', assignedTo: 'staff_pool' };
};
