import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as nodeLambda from "aws-cdk-lib/aws-lambda-nodejs";
import { config } from "../../src/config";
import * as lambda from "aws-cdk-lib/aws-lambda";
import path = require("path");
import { Tracing } from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class StatefulStackProps {}

export class StatefulStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'LarpQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}

export class StatelessStackProps {}

export class StatelessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const suffix = getCdkSuffix(config.get("environment"), config.get("stage"));

    const bedrockPolicy = {
      actions: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
      resources: ["*"],
    };

    const converseApiExampleLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, `ConverseApiExampleLambda${suffix}`, {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(
          __dirname,
          "../../src/adapters/primary/api-data-population-chat-adapter/api-data-population-chat-adapter.ts"
        ),
        memorySize: 1024,
        tracing: Tracing.ACTIVE,
        handler: "handler",
        bundling: {
          minify: true,
        },
        environment: {},
        timeout: cdk.Duration.seconds(30),
      });
    converseApiExampleLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
        ],
        resources: [
          "arn:aws:bedrock:*::foundation-model/anthropic.claude-v2",
          "arn:aws:bedrock:*::foundation-model/anthropic.claude-v2:1",
          "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
        ],
      })
    );
  }
}

export function getCdkSuffix(environment: string, stage: string): string {
  return "-" + environment + (stage && stage.length > 0) ? "-" + stage : "";
}
