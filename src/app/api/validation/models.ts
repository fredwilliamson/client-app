export interface ValidationResult {
  messages: ValidationMessage[];
}

export interface ValidationMessage {
  isWarning: boolean;
  message: string;
}

export interface ValidationBehaviour {
  ignoreValidationWarnings?: boolean;
}
