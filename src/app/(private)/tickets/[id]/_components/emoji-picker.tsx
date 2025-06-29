"use client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return <Picker data={data} onEmojiSelect={onEmojiSelect} />;
}
