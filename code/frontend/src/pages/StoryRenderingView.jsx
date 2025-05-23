import React from "react";

const StoryRenderingView = () => {
  const story = {
    title: "The Curious Fox",
    author: "Jane Doe",
    content: [
      {
        text: "Once upon a time, in a quiet forest, there lived a curious fox.",
        illustration: "https://example.com/fox1.png"
      },
      {
        text: "He loved to explore and learn new things every day.",
        illustration: "https://example.com/fox2.png"
      }
    ]
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>{story.title}</h1>
      <h3>by {story.author}</h3>
      {story.content.map((section, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <p>{section.text}</p>
          <img src={section.illustration} alt={`illustration-${index}`} style={{ maxWidth: "100%" }} />
        </div>
      ))}
    </div>
  );
};

export default StoryRenderingView;