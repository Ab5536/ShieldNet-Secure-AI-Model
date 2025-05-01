import React from 'react';
import "./Blog.css";

const Blog = () => {
  // Sample YouTube video data
  const videos = [
    {
      id: 1,
      title: "Video Tutorial 1",
      link: "https://www.youtube.com/embed/YfhaFfozTvQ",
    },
    {
      id: 2,
      title: "Video Tutorial 2",
      link: "https://www.youtube.com/embed/iLAnH4xw4MQ",
    },
    {
      id: 3,
      title: "Video Tutorial 3",
      link: "https://www.youtube.com/embed/VJRCj-4E2iU",
    },
    {
      id: 4,
      title: "Video Tutorial 4",
      link: "https://www.youtube.com/embed/Kbk1M-tV2y4",
    }
  ];

  return (
    <div className="videos-container">
      <h1 className="videos-h1">Tutorial Videos for Patients</h1>
      
      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <iframe
              className="video-player"
              src={video.link}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <h3 className="video-title">{video.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
