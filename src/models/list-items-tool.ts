import { DocumentType as __DocumentType } from "@smithy/types";
import * as dynamoDb from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Tool } from "./tool";

export class ListItemDynamoDBConfig {
  tableName: string;
  partitionKey: string; // Partition key (PK) for querying
  sortKeyExpression?: string; // Sort key condition expression for querying
  defaultAttributes?: { [key: string]: any }; // Default attributes to use in the query, if applicable
}

export class ListItemToolInput {
  partitionKeyValue: string; // Value for the partition key (PK)
  sortKeyValue?: string; // Value for the sort key (if needed for comparison)
}

export class ListItemTool implements Tool {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  toolType: string = "listitemtool"; // Tool type for ListItem operation
  inputSchema: __DocumentType;
  outputSchema: __DocumentType;
  config: ListItemDynamoDBConfig;

  constructor(
    id: string,
    created: string,
    updated: string,
    name: string,
    description: string,
    inputSchema: __DocumentType,
    outputSchema: __DocumentType,
    config: ListItemDynamoDBConfig
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

  async execute(input: ListItemToolInput): Promise<__DocumentType> {
    // Step 1: Validate input against inputSchema
    const isValid = this.validateInput(input);
    if (!isValid) throw new Error("Invalid input");

    // Step 2: Prepare the QueryCommand input for DynamoDB
    const params: dynamoDb.QueryCommandInput = {
      TableName: this.config.tableName,
      KeyConditionExpression: `${this.config.partitionKey} = :pkValue`,
      ExpressionAttributeValues: {
        ":pkValue": { S: input.partitionKeyValue },
      },
    };

    // Step 3: Add sortKeyExpression if provided in config
    if (
      this.config.sortKeyExpression &&
      input.sortKeyValue &&
      params.ExpressionAttributeValues
    ) {
      params.KeyConditionExpression += ` AND ${this.config.sortKeyExpression}`;
      params.ExpressionAttributeValues[":skValue"] = { S: input.sortKeyValue };
    }

    // Step 4: Execute the Query operation using AWS SDK
    const client = new dynamoDb.DynamoDBClient();
    const documentClient = DynamoDBDocumentClient.from(client);
    const result = await documentClient.send(new QueryCommand(params));

    // Step 5: Return the result
    return { items: result.Items || [] };
  }

  private validateInput(input: ListItemToolInput): boolean {
    // Validate input against inputSchema (use a JSON schema validator here if needed)
    return true;
  }

  private validateOutput(output: any): boolean {
    // Simple validation for output schema (could be expanded if needed)
    return true;
  }
}
