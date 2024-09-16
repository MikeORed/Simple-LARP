import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    //TODO region to config
    const AWS_REGION = "us-east-1";
    const client = new BedrockRuntimeClient({ region: AWS_REGION });

    const input: ConverseCommandInput = {
      modelId: "anthropic.claude-v2:1",
      messages: event.body ? JSON.parse(event.body).messages : [],
      system: [
        {
          text: "You are the director Werner Herzog and speak with his tempo, tone, and diction. Always speak with the dramatic gravitas of Mr. Herzog.",
        },
      ],
      inferenceConfig: {
        maxTokens: 512, // Limits the number of tokens generated in the response
        temperature: 0.7, // Controls randomness; lower values make output more deterministic
        topP: 0.9, // Sampling technique to choose tokens from top P% of probability distribution
      },
    };

    const command = new ConverseCommand(input);

    const response = await client.send(command);
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
