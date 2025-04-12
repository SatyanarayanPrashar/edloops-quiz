import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export async function POST(req: NextRequest) {
  const { topic, difficulty } = await req.json();

  try {
    const prompt =
      `generate a quiz, with only 2 questions based on "${topic}" of "${difficulty}" difficulty level.
    
      Rule:
      Return json following the Output Schema only, where correctOption will be the index of option which is correct.

      Output Schema:
      {
        quiz: {
          title: string,
          topic: string,
          questions: [
            {
              question: string,
              options: [
                "string",
                "string",
                "string",
                "string",
              ]
              correctOption: number
            }
          ]
        }
      }`;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not provided" },
        { status: 500 }
      );
    }

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini-2024-07-18",
    });

    const parser = new JsonOutputFunctionsParser();
    const extractionFunctionSchema = {
      name: "extractor",
      parameters: {
        type: "object",
        properties: {
          quiz: {
            type: "object",
            properties: {
              title: { type: "string" },
              topic: { type: "string" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 4,
                      maxItems: 4,
                    },
                    correctOption: { type: "number" },
                  },
                  required: ["question", "options", "correctOption"],
                },
              },
            },
            required: ["title", "topic", "questions"],
          },
        },
        required: ["quiz"],
      },
    };

    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);

    const message = new HumanMessage({
      content: prompt,
    });

    const result = await runnable.invoke([message]);

    // Print the response from the OpenAI model
    console.log("OpenAI Model Response:", JSON.stringify(result, null, 2));

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    // Log the error message for debugging
    const error = e as Error;
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}