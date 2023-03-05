import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {CredentialService} from 'app/components/services/CredentialService';
import { ToastrService } from 'ngx-toastr';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { ActivatedRoute, Router } from '@angular/router';

export interface type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-Notification_Panel',
  templateUrl: './Notification_Panel.component.html',
  styleUrls: ['./Notification_Panel.component.scss']
})
export class NotificationPanelComponent implements OnInit {
  
  message: any = (resource as any).default;

  constructor(private _formBuilder: FormBuilder, 
     public credentialservice :  CredentialService,
     public toastr: ToastrService,
     public jwtAuth: JwtAuthService,
     private router: Router,
      ) { }

  ngOnInit() {
     //this.router.navigate("sessions/NotificationsPanel" , '_blank');
     //this.GoToNotificationPanel();
     window.open('/sessions/NotificationsPanel', '_blank')
  }

  GoToNotificationPanel(){
debugger;
   var data = this.jwtAuth.GotoNotification();
   if(data == "Your are not authorized")
   {
      this.toastr.warning(data, this.message.AssetrakSays);
   }
  }

 
}
 