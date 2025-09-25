// Phone number validation patterns
export const PHONE_PATTERNS = {
  EGYPT: {
    pattern: /^(\+20|0)?(1[0125])[0-9]{8}$/,
    format: "+20 XX XXXX XXXX",
    description: "Egyptian mobile number",
  },
  // Add more countries as needed
  // SAUDI: {
  //   pattern: /^(\+966|0)?(5[0-9])[0-9]{7}$/,
  //   format: "+966 XX XXX XXXX",
  //   description: "Saudi mobile number",
  // },
  // UAE: {
  //   pattern: /^(\+971|0)?(5[0-9])[0-9]{7}$/,
  //   format: "+971 XX XXX XXXX",
  //   description: "UAE mobile number",
  // },
} as const;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Phone number validation
export function validatePhoneNumber(
  phone: string,
  country: keyof typeof PHONE_PATTERNS = "EGYPT"
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!phone || phone.trim() === "") {
    errors.push({
      field: "phone",
      message: "رقم الهاتف مطلوب",
    });
    return { isValid: false, errors };
  }

  const cleanPhone = phone.replace(/\s+/g, "");
  const pattern = PHONE_PATTERNS[country];

  if (!pattern.pattern.test(cleanPhone)) {
    errors.push({
      field: "phone",
      message: `رقم الهاتف غير صحيح. يجب أن يكون بالتنسيق: ${pattern.format}`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Name validation
export function validateName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim() === "") {
    errors.push({
      field: "name",
      message: "الاسم مطلوب",
    });
  } else if (name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "الاسم يجب أن يكون على الأقل حرفين",
    });
  } else if (name.trim().length > 100) {
    errors.push({
      field: "name",
      message: "الاسم يجب أن يكون أقل من 100 حرف",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Program validation
export function validateProgram(program: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!program || program.trim() === "") {
    errors.push({
      field: "selectedProgram",
      message: "البرنامج المختار مطلوب",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Learning preference validation
export function validateLearningPreference(
  preference: string
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!preference || preference.trim() === "") {
    errors.push({
      field: "learningPreference",
      message: "تفضيل التعلم مطلوب",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Message validation
export function validateMessage(message: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!message || message.trim() === "") {
    errors.push({
      field: "message",
      message: "الرسالة مطلوبة",
    });
  } else if (message.trim().length < 10) {
    errors.push({
      field: "message",
      message: "الرسالة يجب أن تكون على الأقل 10 أحرف",
    });
  } else if (message.trim().length > 1000) {
    errors.push({
      field: "message",
      message: "الرسالة يجب أن تكون أقل من 1000 حرف",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Voice message validation (for create only)
export function validateVoiceMessage(voiceMessage: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!voiceMessage || voiceMessage.trim() === "") {
    errors.push({
      field: "voiceMessage",
      message: "الرسالة الصوتية مطلوبة",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Comprehensive lead validation for create
export function validateCreateLead(data: {
  name: string;
  phone: string;
  selectedProgram: string;
  learningPreference: string;
  message: string;
  voiceMessage: string;
}): ValidationResult {
  const allErrors: ValidationError[] = [];

  const nameValidation = validateName(data.name);
  const phoneValidation = validatePhoneNumber(data.phone);
  const programValidation = validateProgram(data.selectedProgram);
  const preferenceValidation = validateLearningPreference(
    data.learningPreference
  );
  const messageValidation = validateMessage(data.message);
  const voiceMessageValidation = validateVoiceMessage(data.voiceMessage);

  allErrors.push(
    ...nameValidation.errors,
    ...phoneValidation.errors,
    ...programValidation.errors,
    ...preferenceValidation.errors,
    ...messageValidation.errors,
    ...voiceMessageValidation.errors
  );

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

// Comprehensive lead validation for update (phone and voiceMessage are read-only)
export function validateUpdateLead(data: {
  name: string;
  selectedProgram: string;
  learningPreference: string;
  message: string;
}): ValidationResult {
  const allErrors: ValidationError[] = [];

  const nameValidation = validateName(data.name);
  const programValidation = validateProgram(data.selectedProgram);
  const preferenceValidation = validateLearningPreference(
    data.learningPreference
  );
  const messageValidation = validateMessage(data.message);

  allErrors.push(
    ...nameValidation.errors,
    ...programValidation.errors,
    ...preferenceValidation.errors,
    ...messageValidation.errors
  );

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

// Format phone number for display
export function formatPhoneNumber(
  phone: string,
  country: keyof typeof PHONE_PATTERNS = "EGYPT"
): string {
  if (!phone) return "";

  const cleanPhone = phone.replace(/\s+/g, "");

  if (country === "EGYPT") {
    // Format Egyptian numbers: +20 XX XXXX XXXX
    const match = cleanPhone.match(/^(\+20|0)?(1[0125])([0-9]{8})$/);
    if (match) {
      const [, , prefix, number] = match;
      return `+20 ${prefix} ${number.slice(0, 4)} ${number.slice(4)}`;
    }
  }

  return phone; // Return original if no match
}

// Get validation error message for a specific field
export function getFieldError(
  errors: ValidationError[],
  fieldName: string
): string | null {
  const error = errors.find((err) => err.field === fieldName);
  return error ? error.message : null;
}
