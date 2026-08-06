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

const COLLECTION = "bookings";

export async function fetchBookings() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function checkRoomBookingOverlap({ roomId, checkIn, checkOut, excludeBookingId = null }) {
  if (!roomId || !checkIn || !checkOut) {
    return { hasOverlap: false };
  }
  const q = query(
    collection(db, COLLECTION),
    where("roomId", "==", roomId),
    where("status", "in", ["Reserved", "Confirmed", "Checked In"])
  );
  const snapshot = await getDocs(q);
  const activeBookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  const conflictingBooking = activeBookings.find((b) => {
    if (excludeBookingId && b.id === excludeBookingId) return false;
    const bCheckIn = b.checkIn || "";
    const bCheckOut = b.checkOut || "";
    if (!bCheckIn || !bCheckOut) return false;
    return checkIn < bCheckOut && checkOut > bCheckIn;
  });
  return {
    hasOverlap: !!conflictingBooking,
    conflictingBooking,
  };
}

export async function checkRoomAvailability(roomId, checkIn, checkOut, excludeBookingId = null) {
  if (!roomId || !checkIn || !checkOut) {
    return { isAvailable: true, conflicts: [] };
  }
  const q = query(
    collection(db, COLLECTION),
    where("roomId", "==", roomId),
    where("status", "in", ["Reserved", "Confirmed", "Checked In"])
  );
  const snapshot = await getDocs(q);
  const activeBookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  
  const conflicts = activeBookings.filter((b) => {
    if (excludeBookingId && b.id === excludeBookingId) return false;
    const bCheckIn = b.checkIn || "";
    const bCheckOut = b.checkOut || "";
    if (!bCheckIn || !bCheckOut) return false;
    return checkIn < bCheckOut && checkOut > bCheckIn;
  });
  
  return {
    isAvailable: conflicts.length === 0,
    conflicts,
  };
}

export async function createBooking(data) {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTION), {
    guestName: (data.guestName || "").trim(),
    phone: (data.phone || "").trim(),
    email: (data.email || "").trim(),
    adults: Number(data.adults || 1),
    children: Number(data.children || 0),
    checkIn: data.checkIn || "",
    checkOut: data.checkOut || "",
    roomId: data.roomId || "",
    roomNumber: data.roomNumber || "",
    roomName: data.roomName || "",
    floorId: data.floorId || "",
    floorName: data.floorName || "",
    status: data.status || "Reserved",
    bookingSource: data.bookingSource || "Direct",
    specialRequest: (data.specialRequest || "").trim(),
    notes: (data.notes || "").trim(),
    advanceAmount: Number(data.advanceAmount || 0),
    totalAmount: Number(data.totalAmount || 0),
    paymentStatus: data.paymentStatus || "Pending",
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateBooking(id, updates) {
  const ref = doc(db, COLLECTION, id);
  const data = { ...updates };
  if (data.guestName !== undefined) data.guestName = (data.guestName || "").trim();
  if (data.phone !== undefined) data.phone = (data.phone || "").trim();
  if (data.email !== undefined) data.email = (data.email || "").trim();
  if (data.specialRequest !== undefined) data.specialRequest = (data.specialRequest || "").trim();
  if (data.notes !== undefined) data.notes = (data.notes || "").trim();
  if (data.adults !== undefined) data.adults = Number(data.adults);
  if (data.children !== undefined) data.children = Number(data.children);
  if (data.advanceAmount !== undefined) data.advanceAmount = Number(data.advanceAmount);
  if (data.totalAmount !== undefined) data.totalAmount = Number(data.totalAmount);
  if (data.paymentStatus !== undefined) data.paymentStatus = String(data.paymentStatus);
  
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBooking(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
