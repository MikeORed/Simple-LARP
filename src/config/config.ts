var convict = require("convict");

export const config = convict({
  agentTableName: {
    doc: "The database table for agents their memories and perosnalities",
    format: String,
    default: "agentTableName",
    env: "AGENT_TABLE_NAME",
  },
  environment: {
    doc: "The environmnt being deployed to {dev, sit, pre, or prod}",
    format: String,
    default: "dev",
    env: "ENVIRONMENT",
  },
  stage: {
    doc: "A modifier for the enviornment being deployed, should affect entity name prefixes",
    format: String,
    default: "",
    env: "STAGE",
  },
  tableName: {
    doc: "The database table for things",
    format: String,
    default: "",
    env: "TABLE_NAME",
  },
}).validate({ allowed: "strict" });
