import { BaseAppException } from "./base-app-exception";

export class MissingConfigException extends BaseAppException {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidArgumentsException extends BaseAppException {
  constructor(message: string) {
    super(message, 400);
    this.name = this.constructor.name;
  }
}