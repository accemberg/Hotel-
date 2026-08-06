import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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
  const configRef = doc(db, "settings", "siteConfig");
  const snapshot = await getDoc(configRef);

  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() };
}