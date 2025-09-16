import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TextInput from "./TextInput";

describe("TextInput component", () => {
  it("renders with placeholder", () => {
    render(<TextInput id="test-input" placeholder="Type here..." />);
    const input = screen.getByPlaceholderText("Type here...");
    expect(input).toBeInTheDocument();
  });

  it("renders with given value", () => {
    render(<TextInput id="test-input" value="Hello" />);
    const input = screen.getByDisplayValue("Hello");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const handleChange = vi.fn();
    render(<TextInput id="test-input" placeholder="Your name" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Your name");

    await userEvent.type(input, "Ferhat");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(6); // "Ferhat" = 6 Zeichen
  });

  it("is exposed as a textbox with an accessible name via label", async () => {
    render(
      <div>
        <label htmlFor="username">Username</label>
        <TextInput id="username" placeholder="Type your username" />
      </div>
    );

    const textbox = screen.getByRole("textbox", { name: /username/i });
    expect(textbox).toBeInTheDocument();

    await userEvent.tab();
    expect(textbox).toHaveFocus();

    expect(screen.getByPlaceholderText(/type your username/i)).toBeInTheDocument();
  });
});

