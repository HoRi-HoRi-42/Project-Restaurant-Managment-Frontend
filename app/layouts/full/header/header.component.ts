import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';
import jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  role: any;
  responseMessage: any;
  loginForm: any=FormGroup;


  constructor(private router: Router, private dialog: MatDialog,
    private userService: UserService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null]
    })
  }

  logout() {
    var formData = this.loginForm.value;
   
    
    const doalogConfig = new MatDialogConfig();
    doalogConfig.data = {
      message: 'Are you sure you want to logout?',
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, doalogConfig);
    
    const token: any = localStorage.getItem('token');

    var tokenPayLoad: any;
    try {
      tokenPayLoad = jwt_decode(token);
    } catch (err) {
      localStorage.clear();
      this.router.navigate(['/']);
    }

       var data = {
      email: tokenPayLoad.sub
    }
    console.log(data);
    console.log();

    console.log(tokenPayLoad.sub);

    

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {

    dialogRef.close();
     localStorage.clear();
     this.router.navigate(['/']);
    });

    
    this.userService.logout(data).subscribe((response: any) => {
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    }, (error) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericErrorMessage;
      }
      //this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });

  }

    changePassword() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "550px";
      this.dialog.open(ChangePasswordComponent, dialogConfig);
    }
}
