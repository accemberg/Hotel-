import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "floors";

/**
 * Fetch all floors ordered by displayOrder ascending.
 * @returns {Promise<Array>}
 */
export async function fetchFloors() {
  const q = query(collection(db, COLLECTION), orderBy("displayOrder", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Create a new floor document.
 * @param {{ name: string, displayOrder: number, active: boolean, notes: string }} floor
 * @returns {Promise<string>} The new document ID.
 */
export async function createFloor({ name, displayOrder, active, notes }) {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTION), {
    name: name.trim(),
    displayOrder: Number(displayOrder),
    active: active !== undefined ? active : true,
    notes: (notes || "").trim(),
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

/**
 * Partially update a floor document. Always refreshes updatedAt.
 * @param {string} id  Firestore document ID
 * @param {Object} updates  Partial floor fields to update
 * @returns {Promise<void>}
 */
export async function updateFloor(id, updates) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Permanently delete a floor document.
 * @param {string} id  Firestore document ID
 * @returns {Promise<void>}
 */
export async function deleteFloor(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
