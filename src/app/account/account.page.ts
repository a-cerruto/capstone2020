import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormGroup } from '@angular/forms';
import { LoadingService } from '../global/services/loading.service';
import { ToastService } from '../global/services/toast.service';
import { FormService } from '../global/services/form.service';
import { AccountService } from './account.service';
import { UserService } from '../membership/authentication/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  private emailForm: FormGroup;
  private usernameForm: FormGroup;
  private passwordForm: FormGroup;
  private canEdit: boolean;

  constructor(
    private storage: Storage,
    private loading: LoadingService,
    private toast: ToastService,
    private account: AccountService,
    private user: UserService
  ) {
    this.emailForm = FormService.emailForm();
    this.usernameForm = FormService.usernameForm();
    this.passwordForm = FormService.passwordForm();
    this.canEdit = false;
  }

  ngOnInit() {
  }

  toggleEdit() {
    this.canEdit = !this.canEdit;
  }

  async updateEmail(form) {
    await this.loading.getLoading('Updating Email...');
    const value = form.value;
    const id = this.user.getID();
    this.account.updateEmail({value, id}).subscribe( {
      next: async res => {
        console.log(res);
        this.user.getDetails();
        this.loading.dismiss().then(() => {
          this.toast.showSuccess('Email has been updated to ' + this.user.getEmail());
        });
      },
      error: async err => {
        console.log(err.status);
        this.loading.dismiss().then(() => {
          this.toast.showError(err.status);
        });
      }
    });
  }

}
