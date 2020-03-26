import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '../membership/authentication/password.validator';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  static registerForm() {
    return new FormGroup({
      email: new FormControl(
          '',
          Validators.compose([
              Validators.email,
              Validators.required
          ])
      ),
      password: new FormGroup({
          set: new FormControl('',
            Validators.compose([
                Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$'),
                Validators.required
            ])
          ),
          confirm: new FormControl('',
            Validators.required
          )
      }, (formGroup: FormGroup) => {
          return PasswordValidator.isEqual(formGroup);
      })
    });
  }

  static loginForm() {
      return new FormGroup({
          email: new FormControl(
            '',
            Validators.compose([
              Validators.email,
              Validators.required
            ])
          ),
          password: new FormControl(
            '',
            Validators.required
          )
      });
  }

  static validationMessages() {
      return {
          email: [
              { type: 'required', message: 'Email is required' },
              { type: 'email', message: 'Invalid email format'}
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
