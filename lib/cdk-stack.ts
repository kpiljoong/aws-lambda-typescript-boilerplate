import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, "FunctionHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "handler",
      entry: path.join(__dirname, "../lambda/sample/index.ts"),
      bundling: {
        minify: true,
        externalModules: ["aws-sdk"],
      },
    });

    const fnUrl = fn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ["*"],
      },
    });

    new cdk.CfnOutput(this, "FunctionUrl", {
      value: fnUrl.url,
    });
  }
}
