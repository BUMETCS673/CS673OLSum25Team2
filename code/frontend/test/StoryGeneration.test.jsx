import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import StoryGeneration from "../src/pages/StoryRenderingView/StoryGeneration";

test("shows loading animation after clicking 'Generate Story'", async () => {
    render(<StoryGeneration />);

    const button = screen.getByRole("button", { name: /generate story/i });
    await userEvent.click(button);

    const loading = await screen.findByText(/loading.../i);
    expect(loading).toBeInTheDocument();
});