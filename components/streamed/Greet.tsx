"use client";

import { useAIState } from "ai/rsc";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

export function Greet({ name: n }: { name: string }) {
  const [name, setName] = useState(n);
  const [newName, setNewName] = useState("");
  const [history, setHistory] = useAIState();
  const [edit, setEdit] = useState(false);
  return (
    <Card
      className={cn("bg-green-200 text-2xl p-4 flex space-x-2 items-center")}
    >
      <div className="font-bold">👋 Hello, </div>
      {edit ? (
        <>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            content=""
            className="flex-1"
            autoFocus
          />
          <Button
            onClick={() => {
              setName(newName);

              // Insert a hidden history info to the list.
              const info = {
                role: "system" as const,
                content: `[User has changed name to ${newName}]`,
              };

              setHistory([...history, info]);
              setEdit(false);
            }}
          >
            Change name
          </Button>
        </>
      ) : (
        <>
          <div className="flex-1 font-bold">{name}</div>
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => setEdit(true)}
          >
            Edit
          </Button>{" "}
        </>
      )}
    </Card>
  );
}
