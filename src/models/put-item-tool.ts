import { DocumentType as __DocumentType } from "@smithy/types";
import * as dynamoDb from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Tool } from "./tool";

export class PutDynamoDBInput {
  item: { [key: string]: any };
}

export class PutDynamoDBConfig {
  tableName: string;
  keyTemplate: { PK: string; SK?: string }; // Key structure for DynamoDB
  defaultAttributes?: { [key: string]: any }; // Default attributes for PutItem
}

export class PutItemTool implements Tool {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  toolType: string = "putitemtool"; // Tool type for PutItem operation
  inputSchema: __DocumentType;
  outputSchema: __DocumentType;
  config: PutDynamoDBConfig;

  constructor(
    id: string,
    created: string,
    updated: string,
    name: string,
    description: string,
    inputSchema: __DocumentType,
    outputSchema: __DocumentType,
    config: PutDynamoDBConfig
  ) {
    this.id = id;
    this.created = created;
    this.updated = updated;
    this.name = name;
    this.description = description;
    this.inputSchema = inputSchema;
    this.outputSchema = outputSchema;
    this.config = config;
  }

  async execute(input: PutDynamoDBInput): Promise<__DocumentType> {
    // Step 1: Validate input against inputSchema
    const isValid = this.validateInput(input);
    if (!isValid) throw new Error("Invalid input");
    const { item } = input;

    // Step 2: Merge item attributes with default attributes from config
    const itemAttributes = { ...this.config.defaultAttributes, ...item };

    // Step 3: Generate the key (PK and SK) based on the template and item
    const key = this.generateKey(item);

    // Step 4: Build the PutItem request
    const params = {
      TableName: this.config.tableName,
      Item: { ...key, ...itemAttributes },
    };

    // Step 5: Execute the PutItem operation using AWS SDK
    const client = new dynamoDb.DynamoDBClient();
    const documentClient = DynamoDBDocumentClient.from(client);
    const result = await documentClient.send(new PutCommand(params));

    // Step 6: Return the result
    if (result) return { result: params.Item };

    throw new Error("Failed to put item");
  }

  private generateKey(input: any): { PK: string; SK?: string } {
    const { PK, SK } = this.config.keyTemplate;

    const key: { PK: string; SK?: string } = {
      PK: PK.replace(/{([^}]+)}/g, (_, key) => input[key]),
    };

    if (SK) {
      key["SK"] = SK.replace(/{([^}]+)}/g, (_, key) => input[key]);
    }

    return key;
  }

  private validateInput(input: any): boolean {
    // Validate input against inputSchema (use a JSON schema validator here if needed)
    return input && typeof input === "object";
  }

  private validateOutput(output: any): boolean {
    // Simple validation for output schema (could be expanded if needed)
    return true;
  }
}
