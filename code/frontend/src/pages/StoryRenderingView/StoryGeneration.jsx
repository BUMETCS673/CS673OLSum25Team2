import React, { useState } from "react";

export default function StoryGeneration(){
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
    <div>
        <button onClick={handleClick}>Generate Story</button>
        {isLoading && <p>Loading...</p>}
    </div>
    );
}