import React, { useRef, useState } from "react";

export default function MyPlayer() {
  const videoPlayer = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);

  const play = () => {
    videoPlayer.current.play();
  };

  const pause = () => {
    videoPlayer.current.pause();
  };

  const stop = () => {
    videoPlayer.current.pause();
    videoPlayer.current.currentTime = 0;
  };

  const setSpeed = (speed) => {
    videoPlayer.current.playbackRate = speed;
  };

  const onPlaying = () => {
    setCurrentTime(videoPlayer.current.currentTime);
    setSeekValue(
      (videoPlayer.current.currentTime / videoPlayer.current.duration) * 100
    );
  };

  let myVideo = `url(${process.env.PUBLIC_URL}/video/DEMO.MP4)`;
  return (
    <div className="App">
      <video
        width="320"
        height="240"
        ref={videoPlayer}
        onTimeUpdate={onPlaying}
      >
        <source
                
          src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <br />
      <p>{currentTime}</p>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={seekValue}
        onChange={(e) => {
          const seekto = videoPlayer.current.duration * (+e.target.value / 100);
          videoPlayer.current.currentTime = seekto;
          setSeekValue(e.target.value);
        }}
      />
      <div>
        <button onClick={play}>play</button>
        <button onClick={pause}>pause</button>
        <button onClick={stop}>stop</button>
        <button onClick={() => setSpeed(0.5)}>0.5x</button>
        <button onClick={() => setSpeed(1)}>1x</button>
        <button onClick={() => setSpeed(1.5)}>1.5x</button>
        <button onClick={() => setSpeed(2)}>2x</button>
      </div>
    </div>
  );
}