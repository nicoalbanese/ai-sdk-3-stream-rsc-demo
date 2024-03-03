"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";

import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";

import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const { formRef, onKeyDown } = useEnterSubmit();

  const [messages, setMessages] = useUIState();
  const { submitUserMessage } = useActions();

  return (
    <div className="max-w-xl space-y-4 mx-auto mt-4">
      <h1 className="text-2xl font-bold">Vercel AI 3.0 SDK Demo</h1>
      {messages.length === 0 ? (
        <div className="bg-muted p-4 mb-4 block text-neutral-500">
          Ask for the time, tell it your name, ask for music suggestions...
        </div>
      ) : null}
      <div className="my-4 space-y-4">
        {
          // View messages in UI state
          messages.map((message: any) => (
            <Card key={message.id}>{message.display}</Card>
          ))
        }
      </div>

      <ChatScrollAnchor trackVisibility={true} />

      <form
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault();
          // Add user message to UI state
          setMessages((currentMessages: any) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: (
                <Card className="p-4">
                  <div className="font-bold">User</div>
                  <p>{inputValue}</p>
                </Card>
              ),
            },
          ]);

          // Submit and get response message
          const responseMessage = await submitUserMessage(inputValue);
          setMessages((currentMessages: any) => [
            ...currentMessages,
            responseMessage,
          ]);
          setInputValue("");
        }}
      >
        <Textarea
          placeholder="Send a message..."
          autoFocus
          className="block"
          onKeyDown={onKeyDown}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
      </form>
    </div>
  );
}
