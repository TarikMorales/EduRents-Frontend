import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(nuevaContrasena: string, nuevaContrasenaRepetida: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const contrasena = group.get(nuevaContrasena)?.value;
    const contrasenaRepetida = group.get(nuevaContrasenaRepetida)?.value;

    return contrasena === contrasenaRepetida ? null : { passwordMismatch: true };
  };
}