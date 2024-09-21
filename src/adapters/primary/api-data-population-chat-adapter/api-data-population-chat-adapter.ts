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

    const message = event.body;

    const deityRetrieveByIdTool: Tool.ToolSpecMember = {
      toolSpec: {
        name: "DeityDataByIdRetriever",
        description:
          "Retrieve deity data based off of a provided UUID for the deity.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              toolSchema: {
                type: "object",
                description: "default tool schema structure for the system",
                properties: {
                  exception: {
                    type: "string",
                    description:
                      "Exception message if there is no valid data for the other possible required values.",
                  },
                  deityId: {
                    type: "string",
                    description: "The UUID of the deity to retrieve.",
                    format: "uuid",
                  },
                },
                oneOf: [{ required: ["exception"] }, { required: ["deityId"] }],
              },
            },
            required: ["toolSchema"],
            additionalProperties: false,
          },
        },
      },
    };

    const deityStoreTool: Tool.ToolSpecMember = {
      toolSpec: {
        name: "DeityDataSaver",
        description:
          "Store information about deities into the underlying data store, when generating data for this tool be sure to not duplicate information held in the input, but instead create appropriate data.",
        inputSchema: {
          json: {
            type: "object", // Specify the type of the input data
            properties: {
              name: {
                type: "string",
                description: "The name of the deity or faith.",
                minLength: 1,
              },
              overview: {
                type: "string",
                description:
                  "A two-paragraph description of the deity or faith.",
                minLength: 10,
                maxLength: 600,
              },
              appearance: {
                type: "string",
                description: "Descriptive text of the deity's appearance.",
                maxLength: 1000,
              },
              symbol: {
                type: "object",
                description:
                  "Symbol description and optional file URL for the symbol image.",
                properties: {
                  description: {
                    type: "string",
                    description: "Description of the symbol.",
                    maxLength: 300,
                  },
                  fileUrl: {
                    type: "string",
                    format: "uri",
                    description: "URL for the image of the symbol.",
                  },
                },
                required: ["description"],
                additionalProperties: false,
              },
              domainAndInfluence: {
                type: ["string", "array"],
                items: {
                  type: "string",
                },
                description:
                  "Domain(s) of life, nature, or society the deity oversees or influences.",
                maxItems: 5,
              },
              personalityAndTraits: {
                type: "string",
                description:
                  "Personality, typical behaviors, and notable traits of the deity.",
                maxLength: 1000,
              },
              coreBeliefs: {
                type: "string",
                description:
                  "Summary of the fundamental beliefs and teachings of the faith.",
                maxLength: 1000,
              },
              ritualsAndCeremonies: {
                type: "string",
                description:
                  "Descriptions of main rituals, ceremonies, and religious practices followed by the faithful.",
                maxLength: 1000,
              },
              clergyAndReligiousHierarchy: {
                type: "string",
                description:
                  "Structure of the clergy and hierarchy within the religious organization.",
                maxLength: 1000,
              },
              majorSectsAndDivisions: {
                type: "array",
                description:
                  "List of major sects, denominations, or divisions within the faith.",
                items: {
                  type: "string",
                  maxLength: 100,
                },
              },
              placesOfWorship: {
                type: "string",
                description:
                  "Descriptions of places of worship such as temples, shrines, or sacred sites.",
                maxLength: 1000,
              },
              mythsAndLegends: {
                type: "string",
                description:
                  "Important myths, legends, and stories associated with the deity or faith.",
                maxLength: 1500,
              },
              holyTextsAndScriptures: {
                type: "array",
                description:
                  "List of important holy texts or scriptures related to the faith.",
                items: {
                  type: "string",
                  maxLength: 200,
                },
              },
              roleInSociety: {
                type: "string",
                description:
                  "The current role and influence of the deity or faith in society.",
                maxLength: 1000,
              },
              currentEvents: {
                type: "array",
                description:
                  "Ongoing or recent events related to the deity or faith.",
                items: {
                  type: "string",
                  maxLength: 300,
                },
              },
            },
            required: ["name", "overview"],
            additionalProperties: false,
          },
        },
      },
    };

    const cosineTool: Tool.ToolSpecMember = {
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

    const sineTool: Tool.ToolSpecMember = {
      toolSpec: {
        name: "SineCalculation",
        description: "Calculate the sine of x.",
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

    const summaryTool: Tool.ToolSpecMember = {
      toolSpec: {
        name: "ChatTitleSummarySaver",
        description:
          "Provide a summarized title of the current chat to the underlying data store",
        inputSchema: {
          json: {
            type: "object", // Specify the type of the input data
            properties: {
              summary: {
                type: "string",
                description: "the summarized title for the current chat",
              },
            },
            required: ["summary"],
          },
        },
      },
    };

    const standardToolConfiguration = {
      tools: [deityStoreTool, deityRetrieveByIdTool],
    };

    const messages: Message[] = [
      {
        role: ConversationRole.USER,
        content: [
          {
            text: message as string,
          },
        ],
      },
    ];

    const input: ConverseCommandInput = {
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      messages: messages,
      system: [
        // {
        //   text: "If no other tool is in use, you must use the ChatTitleSummarySaver tool, do not reduce the length of the response text while committing to this tool's use",
        // },
        {
          text: "when asked to do math, always use appropriate tools where available",
        },
        {
          text: "You are the director Werner Herzog and speak with his tempo, tone, and diction. Always speak with the dramatic gravitas of Mr. Herzog.",
        },
      ],
      inferenceConfig: {
        maxTokens: 512, // Limits the number of tokens generated in the response
        temperature: 0.7, // Controls randomness; lower values make output more deterministic
        topP: 0.9, // Sampling technique to choose tokens from top P% of probability distribution
      },
      toolConfig: standardToolConfiguration,
    };

    console.log(input);

    const command = new ConverseCommand(input);

    const response = await client.send(command);
    if (response.output?.message) {
      const outputMessages = await toolLoop(
        client,
        input,
        messages,
        response.output?.message
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: outputMessages,
        }),
      };
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

async function toolLoop(
  client: BedrockRuntimeClient,
  input: ConverseCommandInput,
  currentMessages: Message[],
  incomingMessage: Message
): Promise<Message[]> {
  let loopContinues = false;
  let hasSummarized = false;

  currentMessages.push(incomingMessage);
  do {
    const followUp: ContentBlock[] = [];

    incomingMessage.content?.forEach((element) => {
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
        } else if (toolUse.name == "SineCalculation") {
          const x = (toolUse.input as any).x;
          const result = Math.sin(x);
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
        } else if (toolUse.name == "ChatTitleSummarySaver") {
          const summary = (toolUse.input as any).summary;
          const block: ContentBlock = {
            toolResult: {
              toolUseId: toolUse.toolUseId,
              content: [
                {
                  json: {
                    result: summary,
                  },
                },
              ],
            },
          };

          followUp.push(block);
          hasSummarized = true;
        } else if (toolUse.name == "DeityDataSaver") {
          const summary = toolUse.input as any;
          const block: ContentBlock = {
            toolResult: {
              toolUseId: toolUse.toolUseId,
              content: [
                {
                  json: {
                    result: `Saved data for ${summary.name}`,
                  },
                },
              ],
            },
          };

          followUp.push(block);
          console.log(
            `Deity Saver Result tool used:${JSON.stringify(element)}`
          );
        } else if (toolUse.name == "DeityDataByIdRetriever") {
          const summary = toolUse.input as any;
          const block: ContentBlock = {
            toolResult: {
              toolUseId: toolUse.toolUseId,
              content: [
                {
                  json: {
                    result: `Retrieve data data for ${summary}`,
                  },
                },
              ],
            },
          };

          followUp.push(block);
          console.log(
            `Deity Saver Result tool used:${JSON.stringify(element)}`
          );
        } else {
          console.log(`No known tool used:${JSON.stringify(element)}`);
        }
      }
    });

    if (followUp.length > 0 && !(followUp.length === 1 && hasSummarized)) {
      currentMessages.push({ role: ConversationRole.USER, content: followUp });

      input.messages = currentMessages;

      console.log(input.messages);
      const finalResponse = await client.send(new ConverseCommand(input));
      console.log(JSON.stringify(finalResponse.output));
      if (
        finalResponse.output?.message?.content?.find(
          (entry) => entry.toolUse
        ) &&
        !hasSummarized
      ) {
        incomingMessage = finalResponse.output?.message;
        loopContinues = true;

        console.log("we continue since we found tools");
      } else if (finalResponse.output?.message) {
        console.log(
          "final message since we have no remaining tools to process"
        );
        loopContinues = false;
      }

      currentMessages.push(finalResponse.output?.message as Message);
    } else {
      loopContinues = false;
    }
  } while (loopContinues);

  if (!hasSummarized) {
    const summaryTool: Tool.ToolSpecMember = {
      toolSpec: {
        name: "ChatTitleSummarySaver",
        description:
          "Provide a summarized title of the current chat to the underlying data store",
        inputSchema: {
          json: {
            type: "object", // Specify the type of the input data
            properties: {
              summary: {
                type: "string",
                description: "the summarized title for the current chat",
              },
            },
            required: ["summary"],
          },
        },
      },
    };

    console.log("forcing summary outside of tool loop");
    currentMessages.push({
      role: ConversationRole.USER,
      content: [
        {
          text: "Summarize this chat succinctly so the returned text can be used as a title, should be less than 10 words",
        },
      ],
    });
    input.system = [];
    input.messages = currentMessages;
    input.toolConfig = {
      tools: [summaryTool],
      toolChoice: { tool: { name: "ChatTitleSummarySaver" } },
    };
    const summaryResponse = await client.send(new ConverseCommand(input));
    incomingMessage = summaryResponse.output?.message as Message;
    currentMessages.push(incomingMessage);
    loopContinues = false;
  }

  return currentMessages;
}
