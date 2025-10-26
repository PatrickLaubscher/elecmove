import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password === control.value.password_confirmation
    ? null
    : { PasswordNoMatch: true };
};


export const futureDateValidator: ValidatorFn  = (
  control: AbstractControl
): ValidationErrors | null => {
  const today = new Date().toISOString().split('T')[0];
  return control.value < today ? { pastDate: true } : null;
}


export const endAfterStartValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const group = control as FormGroup;
  const start = group.get('startTime')?.value;
  const end = group.get('endTime')?.value;

  if (!start || !end) return null;
  return end > start ? null : { endBeforeStart: true };
}


export const startTimeInPastValidator = (getTodayFn: () => string, getMinTimeFn: () => string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const date = group.get('date')?.value;
    const startTime = group.get('startTime')?.value;
    
    if (!date || !startTime) {
      return null;
    }

    const today = getTodayFn();
    
    // Vérifier seulement pour aujourd'hui
    if (date === today) {
      const minTime = getMinTimeFn();
      
      if (startTime < minTime) {
        return { startTimeInPast: true };
      }
    }
    
    return null;
  };
}

