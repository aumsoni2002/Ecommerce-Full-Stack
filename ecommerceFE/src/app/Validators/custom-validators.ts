import { FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  // Below custom validator checks if the user has entered only whitespace in an input
  // If yes, it will return true and we will show an error message.
  // If no, it will return null and we will not show an error message.
  static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null {
    if (control.value != null && control.value.trim().length === 0) {
      return { notOnlyWhiteSpace: true };
    } else {
      return null;
    }
  }
}
