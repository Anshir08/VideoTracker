import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./config";
import { signOut } from "firebase/auth";


export const saveVideoProgress = async (videoIndex, intervals, leavingPoint) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  const snapshot = await getDoc(ref);
  const existingData = snapshot.exists() ? snapshot.data() : {};
  const existingVideos = existingData.videos || {};

  const updatedVideos = {
    ...existingVideos,
    [videoIndex]: {
      intervals,
      leavingPoint,
    },
  };

  await setDoc(ref, {
    videos: updatedVideos,
  }, { merge: true });
};


export const restoreVideoState = async (videoIndex) => {
  const user = auth.currentUser;
  if (!user) return { leavingPoint: 0, intervals: [] };

  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return { leavingPoint: 0, intervals: [] };

  const data = snapshot.data();
  const videoData = data.videos?.[videoIndex] || {};

  return {
    leavingPoint: videoData.leavingPoint || 0,
    intervals: videoData.intervals || []
  };
};

export const handleLogout = async () => {

  // const navigate = useNavigate();
  await signOut(auth);

  // navigate("/auth");
};