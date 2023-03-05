import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {FormGroup,Validators,FormControl,FormArray} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { JsonPipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';


@Component({
  selector: 'app-messagenotification',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  //encapsulation:ViewEncapsulation.None,
})
export class MessageComponent implements OnInit {
  
displayedColumns: string[] = [ 'Event Name', 'Type(Mobile/Email)', 'Subject', 'Content', 'Event Based','Prior/Post','Frequency','Days'];
  CreateMaster=[{
    'Event_Name':'User Creation',
    'Type':'',
    'Subject':'User Account Activation',
    'Content':'Dear xxxx. Your user account has been successfully created on AssetCues application. To activate account please click here.(Note: Link can be used only once.)',
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
 },
{
  'Event_Name':'FAR Upload',
  'Type':'',
  'Subject':'Pending',
  'Content':'Pending',
  'EventBased':'',
  'Prior':'',
  'Frequency':'',
  'Days':'',
},
{
'Event_Name':'NON FAR Upload',
    'Type':'',
    'Subject':'Pending',
    'Content':'Pending',
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
 },
 {
  'Event_Name':'GRN Upload',
       'Type':'',
       'Subject':'Pending',
       'Content':'Pending',
       'EventBased':'',
       'Prior':'',
       'Frequency':'',
       'Days':'',
    },
];

  AssetRelationship=[{
  'Event_Name':'Assets sent for tagging',
  'Type':'',
  'Subject':'New Assets for tagging',
  'Content':'Dear xxx, New Assets have been added in the application for zzzz location yyyy asset class. Please start the Tagging Process of all the Assets.',
  'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
},
{
  'Event_Name':'Available for tagging',
  'Type':'',
  'Subject':'Assets to be tagged',
  'Content':'Dear xxx Please find attached summary of Assets pending to be tagged.Summerize table',
  'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  }];
  AssetAudit=[{
    'Event_Name':'Pending for tagging approval',
    'Type':'',
    'Subject':'Pending',
    'Content':'Pending',
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  },
  {
    'Event_Name':'Project Creation',
    'Type':'',
    'Subject':'Creation of Physical Verification Project',
    'Content':'Dear xxxx, Physical Verification Project - Project Number kkkkk for zzzz location has been initiated. Please start Physical Verification of all Assets. Please note that the Physical Verification should be completed by mmddyyyy.',
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  },
  {
  'Event_Name':'Project Deletion',
  'Type':'',
  'Subject':'Physical Verification Delete',
  'Content':'Dear xxxx, The Physical Verification Project number kkkkk for zzzz location has been deleted. There is no Action required from your end.',
  'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
},
{
  'Event_Name':'Back to inventory',
  'Type':'',
  'Subject':'Physical Verification Revalidation',
  'Content':'Dear xxxx,  With Reference to the Physical Project No kkkkk for Location zzzz, there are some assets sent back for revalidation. Please login to AssetCues Mobile App and complete the verification.', 
  'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  },
  {
    'Event_Name':'Inventory Complete',
    'Type':'',
    'Subject':'Pending',
    'Content':'Pending',
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  },
  {
    'Event_Name':'Missing Asset',
    'Type':'',
    'Subject':'Missing Asset Reconciliation',
    'Content':'Dear xxxx, With reference to the above mentioned subject. We have noticed that some assets were missing during our physical verification of fixed assets. Please revalidate and update your remarks using below link.',
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  },
  {
  'Event_Name':'Missing asset Send mail to user',
  'Type':'',
  'Subject':'Missing Asset Confirmation',
  'Content':'Dear xxxx, With reference to the above mentioned subject. We have noticed that some assets were missing during our physical verification of fixed assets. Please click the appropriate link below to confirm or decline whether the asset is available with you.',
  'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
},
{
  'Event_Name':'Project due date notification',
  'Type':'',
  'Subject':'Pending',
  'Content':'Pending', 
  'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  },
  {
    'Event_Name':'Reprint Tags',
    'Type':'',
    'Subject':'Pending',
    'Content':'Pending', 
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
    }];
  Assignment=[{
    'Event_Name':'Asset Allocation',
    'Type':'',
    'Subject':'Asset Allocation',
    'Content':'Dear xxxx,Some assets are allocated to you in AssetCues. Please click the link below to see the details and confirm. Click Here',
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  },
  {
    'Event_Name':'Pending Allocation confirmation',
    'Type':'',
    'Subject':'Pending',
    'Content':'Pending',
    'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  },
  {
  'Event_Name':'Asset Unallocation',
  'Type':'',
  'Subject':'Pending',
  'Content':'Pending',
  'EventBased':'',
    'Prior':'',
    'Frequency':'',
    'Days':'',
  }]

  panelOpenState=new Array<boolean>(6);

  step = 0;

  setStep(index: number) {
    this.step = index;
      this.panelOpenState[index]=true;
      for(let i=0;i<6;i++){
      console.log(this.panelOpenState[i]);
      }
  }

  changeState(index: number){
   this.panelOpenState[index]=false;
  }
  

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  
  submitted=false;
  constructor(private http:HttpClient,private router:Router, private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) {
   }
  ngOnInit(): void {
      for(let i=0;i<6;i++){
        this.panelOpenState[i]=false;
      }
      
    }

    ngAfterViewInit(){
      this.scroll('panel-1');
    }

    scroll(id){
      let e1=document.getElementById(id);
      e1.scrollIntoView();
    }


    onselect(ob){
      for(let i=0;i<this.CreateMaster.length;i++){
        if(this.CreateMaster[i].EventBased==='Yes'){

        }
      }
    }

      

  updateForm=new FormGroup({
    
  });
  
   
 
 UpdateForm(UpdateForm){
  
 }
}


