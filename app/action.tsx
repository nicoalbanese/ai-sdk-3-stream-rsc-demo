import { z } from "zod";

import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";

import Loading from "@/app/loading";
import { Card } from "@/components/ui/card";

import { Greet } from "@/components/streamed/Greet";
import { CurrentTime } from "@/components/streamed/CurrentTime";
import { AlbumSuggestion } from "@/components/streamed/AlbumSuggestion";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState();

  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);
  console.log(aiState.get());

  const ui = render({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Where applicable, please respond to the user step by step. Please take into account any system messages for data changes. Please do not repeat yourself. Please only respond in English.",
      },
      ...aiState.get(),
      { role: "user", content },
    ],
    provider: openai,
    text: ({ content, done }) => {
      if (done) {
        aiState.done([...aiState.get(), { role: "assistant", content }]);
      }
      if (content.startsWith("{")) {
        return <Loading />;
      }
      return (
        <Card className="bg-neutral-100 p-4">
          <div className="font-bold uppercase">AI</div>
          <p>{content}</p>
        </Card>
      );
    },
    functions: {
      greet: {
        description:
          "Greet (or say hello) the user. Use this function if the user asks you to greet or say hello to them (or someone else). If you you don't have all the parameters, please ask the user for the missing information",
        parameters: z
          .object({
            name: z
              .string()
              .describe("the users name. could be their first name"),
          })
          .required(),
        render: (props) => {
          console.log(props);
          const name = props.name;
          const n =
            name !== undefined
              ? name[0].toUpperCase() + name.slice(1).toLowerCase()
              : "User";

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "greet",
              content: JSON.stringify({ name: n }),
            },
          ]);

          return <Greet name={n} />;
        },
      },
      suggest_an_album: {
        description:
          "Suggest an album to listen to based on the decade and genre provided",
        parameters: z
          .object({
            genre: z.string().describe("the genre of music"),
            decade: z.number().describe("the decade of music"),
          })
          .required(),
        render: ({ genre, decade }) => {
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "greet",
              content: JSON.stringify({
                genre,
                decade,
                album: "Crosby, Stills and Nash",
                artist: "Crosby, Stills and Nash",
              }),
            },
          ]);

          return <AlbumSuggestion id="6vUWpE8qciYHOhf7mgaGny" />;
        },
      },

      current_time: {
        description: "Get the current time.",
        parameters: z.object({ nothing: z.string().optional() }),
        render: () => {
          const currentTime = new Date().toLocaleTimeString();
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "current_time",
              // Content can be any string to provide context to the LLM in the rest of the conversation
              content: JSON.stringify({
                currentTime,
              }),
            },
          ]);

          return <CurrentTime />;
        },
      },
    },
  });
  return { id: Date.now(), display: ui };
}

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer { id: number, messages: Message[] }
  initialUIState: [],
  initialAIState: [],
});
