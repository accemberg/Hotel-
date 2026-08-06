import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "housekeeping";

/**
 * Fetch all housekeeping task records from Firestore.
 * @returns {Promise<Array>}
 */
export async function fetchHousekeeping() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Create or update a room's housekeeping status to 'Dirty' upon guest check-out.
 * Used by Bookings and Occupants modules on checkout workflow.
 * @param {Object} params
 * @param {string} params.roomId
 * @param {string} [params.roomNumber]
 * @param {string} [params.roomName]
 * @param {string} [params.floorId]
 * @param {string} [params.floorName]
 * @returns {Promise<string>}
 */
export async function markRoomDirtyAfterCheckOut({ roomId, roomNumber = "", roomName = "", floorId = "", floorName = "" }) {
  if (!roomId) return null;

  const now = serverTimestamp();
  const q = query(collection(db, COLLECTION), where("roomId", "==", roomId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0];
    await updateDoc(doc(db, COLLECTION, existingDoc.id), {
      status: "Dirty",
      priority: "High",
      roomNumber: roomNumber || existingDoc.data().roomNumber || "",
      roomName: roomName || existingDoc.data().roomName || "",
      floorId: floorId || existingDoc.data().floorId || "",
      floorName: floorName || existingDoc.data().floorName || "",
      updatedBy: "System (Auto Checkout)",
      updatedAt: now,
    });
    return existingDoc.id;
  } else {
    const newRef = await addDoc(collection(db, COLLECTION), {
      roomId,
      roomNumber: roomNumber || "",
      roomName: roomName || "",
      floorId: floorId || "",
      floorName: floorName || "",
      status: "Dirty",
      priority: "High",
      assignedTo: "",
      notes: "Automatic dirty status after guest check-out.",
      lastCleaned: null,
      updatedBy: "System (Auto Checkout)",
      createdAt: now,
      updatedAt: now,
    });
    return newRef.id;
  }
}

/**
 * Mark a specific room as Dirty.
 * @param {string} roomId
 * @param {string} [updatedBy]
 * @returns {Promise<string>} housekeeping doc ID
 */
export async function markRoomDirty(roomId, updatedBy = "Admin") {
  if (!roomId) return null;

  const now = serverTimestamp();
  const q = query(collection(db, COLLECTION), where("roomId", "==", roomId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0];
    await updateDoc(doc(db, COLLECTION, existingDoc.id), {
      status: "Dirty",
      updatedBy,
      updatedAt: now,
    });
    return existingDoc.id;
  }
  return null;
}

/**
 * Mark a specific room as Clean and record lastCleaned timestamp.
 * @param {string} roomId
 * @param {string} [updatedBy]
 * @returns {Promise<string>} housekeeping doc ID
 */
export async function markRoomClean(roomId, updatedBy = "Admin") {
  if (!roomId) return null;

  const now = serverTimestamp();
  const q = query(collection(db, COLLECTION), where("roomId", "==", roomId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0];
    await updateDoc(doc(db, COLLECTION, existingDoc.id), {
      status: "Clean",
      lastCleaned: now,
      updatedBy,
      updatedAt: now,
    });
    return existingDoc.id;
  }
  return null;
}

/**
 * Create a new housekeeping record for a room.
 * @param {Object} data  Housekeeping record details
 * @returns {Promise<string>} New document ID
 */
export async function createHousekeepingTask(data) {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTION), {
    roomId: data.roomId || "",
    roomNumber: data.roomNumber || "",
    roomName: data.roomName || "",
    floorId: data.floorId || "",
    floorName: data.floorName || "",
    status: data.status || "Dirty",
    priority: data.priority || "Medium",
    assignedTo: (data.assignedTo || "").trim(),
    notes: (data.notes || "").trim(),
    lastCleaned: data.status === "Clean" ? now : (data.lastCleaned || null),
    updatedBy: (data.updatedBy || "Admin").trim(),
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

/**
 * Update a housekeeping record.
 * @param {string} id  Document ID
 * @param {Object} updates  Partial updates
 * @returns {Promise<void>}
 */
export async function updateHousekeepingTask(id, updates) {
  const ref = doc(db, COLLECTION, id);
  const data = { ...updates };

  if (data.assignedTo !== undefined) data.assignedTo = (data.assignedTo || "").trim();
  if (data.notes !== undefined) data.notes = (data.notes || "").trim();
  if (data.updatedBy !== undefined) data.updatedBy = (data.updatedBy || "").trim();
  if (data.status === "Clean") {
    data.lastCleaned = serverTimestamp();
  }

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a housekeeping record.
 * @param {string} id  Document ID
 * @returns {Promise<void>}
 */
export async function deleteHousekeepingTask(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
