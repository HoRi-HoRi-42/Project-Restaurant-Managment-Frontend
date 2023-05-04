import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { webSocket } from 'rxjs/webSocket'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  message = 'Send a message :)';
  subject = webSocket('ws://localhost:8889/');

  constructor(private dialog:MatDialog, 
    private userService:UserService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.userService.checkToken().subscribe((response:any)=>{
      this.router.navigate(['/restaurant/dashboard']);
    }, (error:any)=>{
      console.log(error);
    })
  }

  handleSingupAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(SignupComponent, dialogConfig);
    }
  
  handleForgotPasswordAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
    }
  handleLoginAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(LoginComponent, dialogConfig);
    }    

  sendToServer($event: any){
    this.subject.subscribe();
    this.subject.next(this.message);
    this.subject.complete();
  }
}
