import {
  BedrockRuntimeClient,
  ContentBlock,
  ConversationRole,
  ConverseCommand,
  ConverseCommandInput,
  Message,
  Tool,
  ToolConfiguration,
} from "@aws-sdk/client-bedrock-runtime";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    //TODO region to config
    const AWS_REGION = "us-east-1";
    const client = new BedrockRuntimeClient({ region: AWS_REGION });

    const tool: Tool.ToolSpecMember = {
      toolSpec: {
        name: "CosineCalculation",
        description: "Calculate the cosine of x.",
        inputSchema: {
          json: {
            type: "object", // Specify the type of the input data
            properties: {
              x: {
                type: "number",
                description: "the number to pass to the function",
              },
            },
            required: ["x"],
          },
        },
      },
    };

    const tools: ToolConfiguration = {
      tools: [tool],
    };

    const messages: Message[] = [
      {
        role: ConversationRole.USER,
        content: [{ text: "What is the cosine of 39" }],
      },
    ];

    const input: ConverseCommandInput = {
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      messages: messages,
      system: [
        {
          text: "when asked to do math, always use tools where available",
        },
        {
          text: "You are the director Werner Herzog and speak with his tempo, tone, and diction. Always speak with the dramatic gravitas of Mr. Herzog, unless you should use tools",
        },
      ],
      inferenceConfig: {
        maxTokens: 512, // Limits the number of tokens generated in the response
        temperature: 0.7, // Controls randomness; lower values make output more deterministic
        topP: 0.9, // Sampling technique to choose tokens from top P% of probability distribution
      },
      toolConfig: tools,
    };

    console.log(input);

    const command = new ConverseCommand(input);

    const response = await client.send(command);
    if (response.output?.message) {
      messages.push(response.output.message);

      const followUp: ContentBlock[] = [];

      response.output?.message?.content?.forEach((element) => {
        if (element.toolUse) {
          const toolUse = element.toolUse;

          if (toolUse.name == "CosineCalculation") {
            const x = (toolUse.input as any).x;
            const result = Math.cos(x);
            const block: ContentBlock = {
              toolResult: {
                toolUseId: toolUse.toolUseId,
                content: [
                  {
                    json: {
                      result: result,
                    },
                  },
                ],
              },
            };

            followUp.push(block);
          } else {
            console.log("No known tool used");
          }
        }
      });

      if (followUp.length > 0) {
        messages.push({ role: ConversationRole.USER, content: followUp });

        input.messages = messages;

        const finalResponse = await client.send(new ConverseCommand(input));
        if (finalResponse.output?.message) {
          messages.push(finalResponse.output?.message);
        }
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: messages,
          }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: response,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "some error happened",
      }),
    };
  }
};
