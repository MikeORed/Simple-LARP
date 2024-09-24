import { DocumentType as __DocumentType } from "@smithy/types";
import { Tool } from "./tool";

export class BasicAPIToolInput {
  body?: { [key: string]: string };
  pathParams?: { [key: string]: string };
  queryParams?: { [key: string]: string };
}

export class BasicApiToolConfig {
  url: string;
  method: string;
  headers?: { [key: string]: string };
  body?: { [key: string]: string };
  pathParams?: string[]; // Array of keys for path parameters in the URL
  queryParams?: string[]; // Array of keys for query parameters
}

export class BasicAPITool implements Tool {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  toolType: string = "basicapitool";
  inputSchema: __DocumentType;
  outputSchema: __DocumentType;
  config: BasicApiToolConfig;

  constructor(
    id: string,
    created: string,
    updated: string,
    name: string,
    description: string,
    inputSchema: __DocumentType,
    config: BasicApiToolConfig,
    outputSchema: __DocumentType
  ) {
    this.id = id;
    this.created = created;
    this.updated = updated;
    this.name = name;
    this.description = description;
    this.inputSchema = inputSchema;
    this.config = config;
    this.outputSchema = outputSchema;
  }

  async execute(input: any): Promise<any> {
    // Step 1: Validate input against inputSchema
    const isValid = this.validateInput(input);
    if (!isValid) throw new Error("Invalid input");

    const inputParams = input as BasicAPIToolInput;

    // Step 2: Process path parameters
    let url = this.config.url;
    if (inputParams.pathParams && this.config.pathParams) {
      url = this.replacePathParams(
        url,
        inputParams.pathParams,
        this.config.pathParams
      );
    }

    // Step 3: Process query parameters
    if (inputParams.queryParams && this.config.queryParams) {
      url = this.appendQueryParams(
        url,
        inputParams.queryParams,
        this.config.queryParams
      );
    }

    // Step 4: Merge body from input and config if method allows a body
    let requestOptions: RequestInit = {
      method: this.config.method,
      headers: this.config.headers || { "Content-Type": "application/json" },
    };

    const mergedBody = { ...this.config.body, ...inputParams.body };

    // Step 5: Conditionally add body if the method allows it
    const methodsAllowingBody = ["POST", "PUT", "PATCH"];
    if (methodsAllowingBody.includes(this.config.method.toUpperCase())) {
      requestOptions.body = JSON.stringify(mergedBody);
    }

    // Step 6: Make HTTP request
    const response = await fetch(url, requestOptions);

    // Step 7: Process the API response
    const result = await response.json();

    // Step 8: Validate output against outputSchema
    this.validateOutput(result);

    return { result: result };
  }

  private replacePathParams(
    url: string,
    inputParams: { [key: string]: string },
    configPathParams: string[]
  ): string {
    configPathParams.forEach((param) => {
      const value = inputParams[param];
      if (value) {
        url = url.replace(`{${param}}`, value);
      }
    });
    return url;
  }

  private appendQueryParams(
    url: string,
    inputQueryParams: { [key: string]: string },
    configQueryParams: string[]
  ): string {
    const queryParams: string[] = [];
    configQueryParams.forEach((param) => {
      const value = inputQueryParams[param];
      if (value) {
        queryParams.push(`${param}=${encodeURIComponent(value)}`);
      }
    });
    if (queryParams.length > 0) {
      url += (url.includes("?") ? "&" : "?") + queryParams.join("&");
    }
    return url;
  }

  private validateInput(input: any): boolean {
    // Validate input against inputSchema (use a JSON schema validator here if needed)
    return true; // Simplified for demonstration purposes
  }

  private validateOutput(output: any): boolean {
    // Validate output against outputSchema (use a JSON schema validator here if needed)
    return true; // Simplified for demonstration purposes
  }
}
