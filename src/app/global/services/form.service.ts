import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '../../membership/authentication/password.validator';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  static registerForm() {
    return new FormGroup({
      email: this.getEmailFC(),
      username: this.getUsernameFC(),
      password: new FormGroup({
          set: this.getPasswordSetFC(),
          confirm: this.getPasswordConfirmFC()
      }, (formGroup: FormGroup) => {
          return PasswordValidator.isEqual(formGroup);
      })
    });
  }

  static loginForm() {
      return new FormGroup({
          email: this.getEmailFC(),
          password: new FormControl(
            '',
            Validators.required
          )
      });
  }

  static emailForm() {
    return new FormGroup({
      email: this.getEmailFC()
    });
  }

  static usernameForm() {
    return new FormGroup({
      username: this.getUsernameFC()
    });
  }

  static passwordForm() {
    return new FormGroup({
      old: this.getPasswordConfirmFC(),
      password: new FormGroup({
        set: this.getPasswordSetFC(),
        confirm: this.getPasswordConfirmFC()
      }, (formGroup: FormGroup) => {
        return PasswordValidator.isEqual(formGroup);
      })
    });
  }

  private static getEmailFC() {
    return new FormControl(
      '',
      Validators.compose([
        Validators.email,
        Validators.required
      ])
    );
  }

  private static getUsernameFC() {
    return new FormControl(
      '',
      Validators.compose([
        Validators.pattern('^[a-zA-Z0-9 ]*$'),
        Validators.required
      ])
    );
  }

  private static getPasswordSetFC() {
    return new FormControl('',
      Validators.compose([
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$'),
        Validators.required
      ])
    );
  }

  private static getPasswordConfirmFC() {
    return new FormControl('',
      Validators.required
    );
  }

  static validationMessages() {
    return {
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format'}
      ],
      username: [
        { type: 'required', message: 'Username is required' },
        { type: 'pattern', message: 'Can only contain alphanumeric characters [A-Z and 0-9]'}
      ],
      password: [
        { type: 'required', message: 'Password is required' },
        { type: 'pattern', message: 'Password must be between 8-20 characters, one lowercase, one uppercase & one number' }
      ],
      confirm: {
        message: 'Password fields don\'t match'
      }
    };
  }
}
