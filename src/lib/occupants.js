import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "occupants";

/**
 * Fetch all occupants from Firestore.
 * Sorting is applied client-side for robust order: Checked In first, then Check-in Date descending.
 * @returns {Promise<Array>}
 */
export async function fetchOccupants() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Create a new occupant document.
 * @param {Object} data  Occupant details
 * @returns {Promise<string>} New document ID
 */
export async function createOccupant(data) {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTION), {
    name: (data.name || "").trim(),
    phone: (data.phone || "").trim(),
    email: (data.email || "").trim(),
    idType: data.idType || "",
    idNumber: (data.idNumber || "").trim(),
    address: (data.address || "").trim(),
    nationality: (data.nationality || "").trim(),
    gender: data.gender || "",
    adults: Number(data.adults || 1),
    children: Number(data.children || 0),
    checkIn: data.checkIn || "",
    checkOut: data.checkOut || "",
    notes: (data.notes || "").trim(),
    roomId: data.roomId,
    roomNumber: data.roomNumber,
    roomName: data.roomName,
    floorId: data.floorId,
    floorName: data.floorName,
    bookingId: data.bookingId || null,
    status: data.status || "Checked In",
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

/**
 * Update an occupant document.
 * @param {string} id  Occupant document ID
 * @param {Object} updates  Partial updates
 * @returns {Promise<void>}
 */
export async function updateOccupant(id, updates) {
  const ref = doc(db, COLLECTION, id);
  const data = { ...updates };
  
  if (data.name !== undefined) data.name = (data.name || "").trim();
  if (data.phone !== undefined) data.phone = (data.phone || "").trim();
  if (data.email !== undefined) data.email = (data.email || "").trim();
  if (data.idNumber !== undefined) data.idNumber = (data.idNumber || "").trim();
  if (data.address !== undefined) data.address = (data.address || "").trim();
  if (data.nationality !== undefined) data.nationality = (data.nationality || "").trim();
  if (data.notes !== undefined) data.notes = (data.notes || "").trim();
  if (data.adults !== undefined) data.adults = Number(data.adults);
  if (data.children !== undefined) data.children = Number(data.children);
  
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an occupant document.
 * @param {string} id  Occupant document ID
 * @returns {Promise<void>}
 */
export async function deleteOccupant(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
