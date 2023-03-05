import { AbstractControl, ValidationErrors } from "@angular/forms"

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';

  if (!value) {
    return null
  }

  let upperCaseCharacters = /[A-Z]+/g
  if (upperCaseCharacters.test(value) === false) {
    return { passwordStrength: `Must contain at least one number and one uppercase and lowercase letter and one special character, and at least 8 or more characters ` };
  }

  let lowerCaseCharacters = /[a-z]+/g
  if (lowerCaseCharacters.test(value) === false) {
    return { passwordStrength: `Must contain at least one number and one uppercase and lowercase letter and one special character, and at least 8 or more characters ` };
  }


  let numberCharacters = /[0-9]+/g
  if (numberCharacters.test(value) === false) {
    return { passwordStrength: `Must contain at least one number and one uppercase and lowercase letter and one special character, and at least 8 or more characters ` };
  }

  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  if (specialCharacters.test(value) === false) {
    return { passwordStrength: `Must contain at least one number and one uppercase and lowercase letter and one special character, and at least 8 or more characters ` };
  }
  return null;
}