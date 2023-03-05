import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Sort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { GroupService } from 'app/components/services/GroupService';
import { NotificationDialogComponent } from '../dialog/notification-dialog/notification-dialog.component';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';

export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {
  Headers: any = (header as any).default;
  message: any = (resource as any).default;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Type', 'SubType', 'Subject', 'Content', 'action'];
  displayedColumns1: string[] = ['Select', 'Type', 'SubType', 'Subject', 'Content', 'Policy', 'Frequency', 'action'];
  disabled: boolean = true;
  constructor(public groupservice: GroupService, public toastr: ToastrService, public dialog: MatDialog,
    private storage: ManagerService,
    private loader: AppLoaderService,
    public alertService: MessageAlertService,) { }
  panelOpenState = false;
  public ModelwiseData: any[] = [];
  InitData: any;
  CreateMaster1 = new MatTableDataSource<any>();
  GroupId: any;
  RegionId: any;
  CompanyId: any;
  UserId: any;
  ClientName: any;

  ngOnInit(): void {
    debugger;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.ClientName = this.storage.get(Constants.SESSSION_STORAGE, Constants.CLIENT_NAME);
    this.GetAllNotificationData();
    this.Getnotificationcount();
  }
  assettransfername: any;
  GetAllNotificationData() {
    debugger;

    var clientname = this.ClientName;
    this.loader.open();
    this.groupservice.GetNotificationTemplateModuleWiseByClientName(clientname).subscribe(response => {
      debugger;
      this.loader.close();
      this.ModelwiseData = [];
      if(!!response){
        this.ModelwiseData = JSON.parse(response);
      }
      this.onChangeDataSource(this.ModelwiseData);
    })
  }

  onChangeDataSource(value) {
    debugger;
    this.CreateMaster1 = new MatTableDataSource(value);
    this.CreateMaster1.paginator = this.paginator;
    this.CreateMaster1.sort = this.sort;

  }

  edit(row) {
    debugger;
    row.disabled = !row.disabled;
  }

  save(element) {
    debugger;
    element.disabled = !element.disabled;
    var parameterDto = {
      EventName: element.EventName,
      NotificationID: element.TemplateId,
      EmailSubject: element.Subject,
      EmailTemplate: element.JsonBody,
      TemplateShortCode: element.TemplateShortCode,
      ClientName: this.ClientName,
    }
    this.loader.open();
    this.groupservice.UpdateNotificationTemplateforNotification(parameterDto).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success("Data Updated Successfully", this.message.AssetrakSays)
      }
      this.GetAllNotificationData();
    })
  }
  updateGroupValue: any;
  openDialog(data: any = {}) {
    let title = 'Add new member';
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '500px',
      disableClose: true,
      data: data
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!!res) {
          debugger;
          this.updateGroupValue = res;
          this.updateGroupValue['ClientName'] = this.ClientName;
          this.loader.open();
          this.groupservice.CreateDuplicateTemplate(this.updateGroupValue).subscribe(res2 => {
            debugger;
            this.loader.close();
            if(res2=="success")
            {
                this.toastr.success("Successfully Created. ",this.message.AssetrakSays)   
                this.GetAllNotificationData();
            }
            else{
              this.toastr.error("Something went wrong. ",this.message.AssetrakSays)   
            }   
          })
        }
      })
  }
  count1: any;
  count2: any;
  count3: any;
  r: any[];
  Getnotificationcount() {
    var ClientName = this.ClientName;
    this.groupservice.Getnotificationcount(ClientName).subscribe(r1 => {
      debugger;
      this.r = JSON.parse(r1);
      if (!!this.r) {
        this.count1 = this.r[0];
        this.count2 = this.r[1];
        this.count3 = this.r[3]
      }
    })
  }

  ClearQueue(){
    this.groupservice.Init().subscribe(r => {
      debugger;
      this.toastr.success("Data Clear Successfully", this.message.AssetrakSays);
    })
  }

}
