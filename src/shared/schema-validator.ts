import AJV, { ErrorObject, Schema } from "ajv";
import addFormats from "ajv-formats";
const ajv = new AJV();
addFormats(ajv);
export type ValidationResult = {
  isValid: boolean;
  validationErrors: null | ErrorObject[];
};
export async function validate<DetailType>(
  validationSchema: Schema,
  detail: DetailType
): Promise<ValidationResult> {
  const schemaFn = ajv.compile(validationSchema);
  const isDocumentValid = schemaFn(detail);
  if (isDocumentValid) {
    return <ValidationResult>{ isValid: true };
  }
  return <ValidationResult>{
    isValid: false,
    validationErrors: schemaFn.errors,
  };
}
