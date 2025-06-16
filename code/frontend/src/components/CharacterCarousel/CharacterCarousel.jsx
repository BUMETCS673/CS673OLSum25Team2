import React, { useState } from "react";
import "./CharacterCarousel.css";

const characters = [
  { name: "Bunny", image: "/characters/bunny.png" },
  { name: "Puppy", image: "/characters/puppy.png" },
  { name: "Kitten", image: "/characters/kitten.png" },
  { name: "Bear", image: "/characters/bear.png" },
  { name: "Fox", image: "/characters/fox.png" },
  { name: "Owl", image: "/characters/owl.png" },
  { name: "Elephant", image: "/characters/elephant.png" },
  { name: "Giraffe", image: "/characters/giraffe.png" },
  { name: "Lion", image: "/characters/lion.png" },
  { name: "Monkey", image: "/characters/monkey.png" },
  { name: "Turtle", image: "/characters/turtle.png" },
  { name: "Penguin", image: "/characters/penguin.png" },
  { name: "Dolphin", image: "/characters/dolphin.png" },
  { name: "Kangaroo", image: "/characters/kangaroo.png" },
  { name: "Duck", image: "/characters/duck.png" },

  { name: "Unicorn", image: "/characters/unicorn.png" },
  { name: "Dragon", image: "/characters/dragon.png" },
  { name: "Mermaid", image: "/characters/mermaid.png" },
  { name: "Fairy", image: "/characters/fairy.png" },
  { name: "Wizard", image: "/characters/wizard.png" },
  { name: "Friendly Witch", image: "/characters/witch.png" },
  { name: "Good Giant", image: "/characters/giant.png" },
  { name: "Talking Tree", image: "/characters/tree.png" },
  { name: "Cloud Creature", image: "/characters/cloud.png" },
  { name: "Magic Star", image: "/characters/star.png" },

  { name: "Girl", image: "/characters/girl.png" },
  { name: "Boy", image: "/characters/boy.png" },
  { name: "Big Sister", image: "/characters/bigsister.png" },
  { name: "Little Brother", image: "/characters/littlebrother.png" },
  { name: "Explorer Kid", image: "/characters/explorerkid.png" },
  { name: "Superhero Kid", image: "/characters/superherokid.png" },
  { name: "Chef Kid", image: "/characters/chefkid.png" },
  { name: "Artist Kid", image: "/characters/artistkid.png" },
  { name: "Scientist Kid", image: "/characters/scientistkid.png" },

  { name: "Robot", image: "/characters/robot.png" },
  { name: "Teddy Bear", image: "/characters/teddybear.png" },
  { name: "Talking Crayon", image: "/characters/crayon.png" },
  { name: "Jumping Ball", image: "/characters/ball.png" },
  { name: "Flying Kite", image: "/characters/kite.png" },
  { name: "Rolling Train", image: "/characters/train.png" },
  { name: "Toy Dinosaur", image: "/characters/dinosaur.png" },

  { name: "Pirate", image: "/characters/pirate.png" },
  { name: "Princess", image: "/characters/princess.png" },
  { name: "Knight", image: "/characters/knight.png" },
  { name: "Astronaut", image: "/characters/astronaut.png" },
  { name: "Farmer", image: "/characters/farmer.png" },
  { name: "Doctor", image: "/characters/doctor.png" },
];

let persistentIndex = 0;
const CharacterCarousel = ({ onSelect, selected }) => {
  const [index, setIndex] = useState(persistentIndex);
  const handlePrev = () => {
    const newIndex = index === 0 ? characters.length - 1 : index - 1;
    setIndex(newIndex);
    if (selected === null) persistentIndex = newIndex;
    console.log(selected);
  };

  const handleNext = () => {
    const newIndex = index === characters.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
    if (selected === null) persistentIndex = newIndex;
  };

  const handleSelect = () => {
    onSelect(characters[index].name);
    persistentIndex = index;
  };

  return (
    <div className="carousel-container">
      <div className="carousel-image-box">
        <img
          src={characters[index].image}
          alt={characters[index].name}
          className="carousel-image"
        />
        <h3>{characters[index].name}</h3>
      </div>
      <div className="carousel-controls">
        <button onClick={handlePrev}>&lt; Prev</button>
        <button
          onClick={handleSelect}
          className={selected === characters[index].name ? "selected" : ""}
        >
          {selected === characters[index].name ? "Selected" : "Select"}
        </button>
        <button onClick={handleNext}>Next &gt;</button>
      </div>
    </div>
  );
};

export default CharacterCarousel;

/** @ai-generated 
The collection of characters was AI generated
Tool: ChatGPT
Link: https://chatgpt.com/share/6839e719-f0ec-8002-ad34-41fa3fa31cd5
Prompt, short version: “Add more characters to this collection in addition to the existing ones (attached a list of characters)" 
Generated on: 2025-05-30
Modified by:  Tetiana Korchynska
Modifications: minor changes in namings
Verified:  Yes, the code met my expectations */
