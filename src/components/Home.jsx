import { useEffect, useRef, useState } from "react";
import { videos } from "../videoLectures";
import {
  saveVideoProgress,
  restoreVideoState,
  handleLogout,
} from "../firebase-database/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-database/config";

function Home() {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [intervals, setIntervals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        // safe to fetch video state
        restoreVideoState(currentIndex).then(({ leavingPoint, intervals }) => {
          videoRef.current.currentTime = leavingPoint;
          setIntervals(intervals);
          setStart(leavingPoint);
          setEnd(leavingPoint);
        });
      }
    });

    return () => unsubscribe();
  }, [currentIndex]);

  useEffect(() => {
    updateProgress();
    saveVideoProgress(currentIndex, intervals, end);
  }, [intervals]);

  // debounce mergeIntervals when end changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (end - start < 1) return;
      mergeIntervals();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [end]);

  const updateProgress = () => {
    const watchedDuration = intervals.reduce(
      (total, interval) => total + interval.end - interval.start,
      0
    );
    setWatchedTime(Math.ceil(watchedDuration));
    const totalDuration = parseInt(videoRef.current.duration).toFixed(2);
    setProgress(Math.ceil((watchedDuration / totalDuration) * 100));
  };

  const mergeIntervals = () => {
    setIntervals((prevIntervals) => {
      const sorted = [...prevIntervals, { start, end }].sort(
        (a, b) => a.start - b.start
      );
      const merged = [];
      let current = sorted[0];

      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].start <= current.end) {
          current.end = Math.max(current.end, sorted[i].end);
        } else {
          merged.push(current);
          current = sorted[i];
        }
      }
      console.log("merged", merged);
      merged.push(current);
      return merged;
    });
  };

  const handleIntervals = (par) => {
    if (par === "seeked" || par === "ended") {
      if (end - start >= 1) {
        mergeIntervals();
      }
      setStart(parseInt(videoRef.current?.currentTime).toFixed(2));
    } else if (par === "update") {
      if (videoRef.current.seeking) return;
      setEnd(parseInt(videoRef.current?.currentTime).toFixed(2));
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Playlist */}

      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "1rem",
          overflowY: "scroll",
        }}
      >
        <button
          style={{ marginBottom: "1rem", borderColor: "red" }}
          onClick={() => handleLogout()}
        >
          Logout
        </button>
        <h3>Video Lectures</h3>
        {videos.map((video, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              cursor: "pointer",
              padding: "0.5rem",
              background: index === currentIndex ? "#f0f0f0" : "transparent",
              borderRadius: "4px",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              src={video.thumb}
              alt={video.title}
              style={{ width: "100px" }}
            />
            {video.title}
          </div>
        ))}
      </div>

      {/* Main Video Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "2rem",
          gap: "1rem",
        }}
      >
        <h2>{videos[currentIndex].title}</h2>
        <h4>- {videos[currentIndex].subtitle} </h4>
        {/* Progress Bar and Time Tracker */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h4 style={{ color: "green" }}>
            Video Watched - {progress ? progress.toFixed(2) : 0}%
          </h4>
          <progress
            value={String(progress)}
            max={100}
            style={{ width: "60vw", height: "2rem" }}
          />
          {
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "60vw",
              }}
            >
              <span>
                {videoRef.current && videoRef.current.currentTime
                  ? new Date(videoRef.current.currentTime * 1000)
                      .toISOString()
                      .slice(14, 19)
                  : "00:00"}
              </span>

              <span>
                Total Watched Time:{" "}
                {watchedTime
                  ? new Date(watchedTime * 1000).toISOString().slice(14, 19)
                  : "00:00"}
              </span>
              <span>
                {videoRef.current && videoRef.current.duration
                  ? new Date(videoRef.current.duration * 1000)
                      .toISOString()
                      .slice(14, 19)
                  : "00:00"}
              </span>
            </div>
          }
        </div>

        <div
          className="video-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <video
            ref={videoRef}
            width="720"
            controls
            
            // autoPlay
            onTimeUpdate={() => handleIntervals("update")}
            onEnded={() => handleIntervals("ended")}
            onSeeked={() => handleIntervals("seeked")}
          >
            <source src={videos[currentIndex].sources[0]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p
            style={{
              padding: "1rem",
              fontSize: "1.2rem",
              maxHeight: "15rem",
              overflow: "auto",
            }}
          >
            {videos[currentIndex].description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
