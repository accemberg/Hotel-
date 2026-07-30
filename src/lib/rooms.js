import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getRooms() {
  const roomsRef = collection(db, "rooms");
  const snapshot = await getDocs(roomsRef);

  const rooms = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return rooms;
}

export async function getAmenities() {
  const amenitiesRef = collection(db, "amenities");
  const snapshot = await getDocs(amenitiesRef);

  const amenities = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return amenities;
}

export async function getSiteConfig() {
  const configRef = collection(db, "siteConfig");
  const snapshot = await getDocs(configRef);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}