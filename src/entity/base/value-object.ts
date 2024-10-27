import { Schema } from "ajv";
import { validate } from "../../shared";
interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  protected props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  protected validate(schema: Schema): void {
    validate<T>(schema, this.props);
  }
}
