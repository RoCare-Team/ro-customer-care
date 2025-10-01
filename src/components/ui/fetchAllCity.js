import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

async function getAllCities() {
  try {
    const querySnapshot = await getDocs(collection(db, "cities"));
    const cities = [];
    querySnapshot.forEach((doc) => {
      cities.push({ id: doc.id, ...doc.data() });
    });

    console.log("All cities:", cities);
    return cities;
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
}

// Example usage
getAllCities();
