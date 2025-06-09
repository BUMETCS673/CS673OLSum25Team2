import React, { useEffect } from "react";
import "./StoryLoadingScreen.css";

// shows a loading screen for 2 seconds, then calls onFinishLoading
const StoryLoadingScreen = ({ onFinishLoading }) => {
    useEffect(() => {
        //start a time when component mounts
        const timer = setTimeout(() => {
            //after 2 seconds, tell parent that loading is finished
            onFinishLoading();
        }, 5000);
        return () => clearTimeout(timer);//clean up timer if component unmounts before time is up
    }, [onFinishLoading]);

    return (
        <div className="story-loading-screen">
            <div className="sparkle-container">
                {Array.from({ length: 25 }).map((_, i) => {
                    const top = Math.random() * 100;
                    const left = Math.random() * 100;
                    const delay = (Math.random() * 3).toFixed(1);
                    return (
                        <div
                            key={i}
                            className="sparkle"
                            style={{
                                top: `${top}%`,
                                left: `${left}%`,
                                animationDelay: `${delay}s`,
                            }}
                        />
                    );
                })}
            </div>

            <div className="loading-animation">
                <p>Loading your magical story...</p>
            </div>
        </div>
    );
};

export default StoryLoadingScreen;
