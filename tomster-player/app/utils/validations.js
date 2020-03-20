import { isBlank } from '@ember/utils';
import { get, set } from '@ember/object';

export const presence = (value) => !isBlank(value);
export const nonZero = (value) => value !== 0;

export default class Validations {
  constructor(model, config) {
    this.model = model;
    this.config = config;
    this.errors = {};
  }

  validate(attrNames) {
    return (attrNames || Object.keys(this.config)).reduce((acc, attrName) => {
      let value = get(this.model, attrName);
      let attrConfig = this.config[attrName];
      let isValid = attrConfig.validate(value);
      let errorMessage = isValid ? undefined : attrConfig.errorMessage;

      set(this, `errors.${attrName}`, errorMessage);

      if (errorMessage) {
        return false;
      }

      return acc;
    }, true);
  }
}
