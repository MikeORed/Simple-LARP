import { DocumentType as __DocumentType } from "@smithy/types";
import { Entity } from "../entity";
import * as dynamoDb from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

interface BaseEntity {
  id: string;
  created: string;
  updated: string;
}

export interface Tool extends BaseEntity {
  name: string; // Tool name
  description: string; // Tool description
  toolType: string; // Tool type (e.g., 'apitool')
  inputSchema: __DocumentType; // JSON Schema defining the input
  outputSchema: __DocumentType; // JSON Schema defining the output
  execute(input: any): Promise<__DocumentType>; // Common method for executing the tool
}

class ContcatengationToolInput {
  entries: string[];
  separator: string;
}

export class ConcatenationTool implements Tool {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  toolType: string = "concatenationtool"; // Tool type for this tool
  inputSchema: __DocumentType;
  outputSchema: __DocumentType;

  constructor(
    id: string,
    created: string,
    updated: string,
    name: string,
    description: string,
    inputSchema: __DocumentType,
    outputSchema: __DocumentType
  ) {
    this.id = id;
    this.created = created;
    this.updated = updated;
    this.name = name;
    this.description = description;
    this.inputSchema = inputSchema;
    this.outputSchema = outputSchema;
  }

  async execute(input: any): Promise<__DocumentType> {
    // Step 1: Validate input
    const isValid = this.validateInput(input);
    if (!isValid) throw new Error("Invalid input");
    const { entries, separator } = input as ContcatengationToolInput;

    // Step 2: Concatenate all input into a single string
    const concatenatedResult = Object.values(entries).join(separator);

    // Step 3: Return the concatenated result
    return { result: concatenatedResult };
  }

  private validateInput(input: any): boolean {
    // Simple validation to ensure input is an object
    return input && typeof input === "object";
  }

  private validateOutput(output: any): boolean {
    // Simple validation for output schema (could be expanded if needed)
    return true;
  }
}
