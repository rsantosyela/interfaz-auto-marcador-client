import { Component, OnInit } from '@angular/core';
import { Login } from '../../models/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public login: Login;
  public loginForm: FormGroup; 
  public submitted: boolean;

  private defaultValuesLoginForm = () => {
    return {
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    };
  }
  
  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _route: ActivatedRoute
  ){ 
    this.login = new Login("","");
  }

  ngOnInit(){
    this.resetControllers();
  }

  resetControllers(){
    this.submitted = false;
    this.loginForm = new FormBuilder().group(this.defaultValuesLoginForm());
  }

  userLogin(){
    this.submitted = true;
    if(!this.loginForm.valid){
      return;
    }else{
      this._authenticationService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        response => {
          this._router.navigate(['/menu-principal']);
          this.submitted = false;
        },
        error => {
          console.log(error);
          this.submitted = false;
      });    
    }
  }
}
