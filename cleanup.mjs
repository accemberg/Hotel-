import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3oB8v3UGoZkJFJHuVUOK1bOMBVpmuwIo",
  authDomain: "moksh-haveli-inn.firebaseapp.com",
  projectId: "moksh-haveli-inn",
  storageBucket: "moksh-haveli-inn.firebasestorage.app",
  messagingSenderId: "1031679484603",
  appId: "1:1031679484603:web:acbc60e8cf9a17f8817f9e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Cleaning up amenities...");
  const amSnap = await getDocs(collection(db, "amenities"));
  for (const d of amSnap.docs) {
    await deleteDoc(doc(db, "amenities", d.id));
  }
  
  const amenities = [
    "Free Wi-Fi in all areas",
    "24/7 Room Service",
    "Air Conditioning",
    "Daily Housekeeping",
    "Tea/Coffee Maker",
    "LED TV with Cable",
    "Ensuite Bathroom",
    "Work Desk & Chair",
    "High-Speed Internet"
  ];
  
  for (const a of amenities) {
    await addDoc(collection(db, "amenities"), { name: a, createdAt: new Date() });
  }
  console.log("Amenities seeded.");

  console.log("Cleaning up gallery...");
  const galSnap = await getDocs(collection(db, "gallery"));
  for (const d of galSnap.docs) {
    await deleteDoc(doc(db, "gallery", d.id));
  }

  const images = [
    "https://images.unsplash.com/photo-1542314831-c53cd4b85aca?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
  ];

  for (const url of images) {
    await addDoc(collection(db, "gallery"), { url, createdAt: new Date() });
  }
  console.log("Gallery seeded.");
  
  process.exit(0);
}

run();
