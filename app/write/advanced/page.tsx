"use client";
import React from "react";
import MDEditor from "@uiw/react-md-editor";

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="p-4 min-h-screen my-auto">
      <MDEditor
        value={value}
        onChange={(newValue) => setValue(newValue || "")}
      />
      <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
}
