import { Component, OnInit,ViewChild ,ElementRef} from '@angular/core';
// import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {CommonService} from 'app/components/services/CommonService';


import { SnotifyToast, SnotifyService, SnotifyPosition } from 'ng-snotify';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Router, ActivatedRoute } from "@angular/router";
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-rules-engine-list',
  templateUrl: './rules-engine-list.component.html',
  styleUrls: ['./rules-engine-list.component.css']
})

export class RulesEngineListComponent implements OnInit {
  @ViewChild('MatPaginator', {static: true}) paginator: MatPaginator;
  @ViewChild('MatSort', {static: true}) sort: MatSort;
  @ViewChild('table', {static: true}) table: any;
  displayedColumns: string[] = ['Name','Rule','CreatedBy','CreatedOn','edit'];
  dataSource: any;
  value: any;
  updateData: any;
  updateDataInsert:any;
  deleteOptions: { option: any; id: any; };
  json: any[]=[];
  constructor(
   private cs:CommonService,  
   private service:SnotifyService,
   private router: Router,
   private storage:ManagerService

  ) { }

  ngOnInit() {
    this.rulesListGetData()  
  } 

  rulesListGetData()
  {
    debugger;
    console.log("came here?")
    this.cs.rulesListGetData().subscribe(response =>{
      debugger;
      console.log("response",response.data)
      this.json = response.data
       
      this.onChangeDataSource( JSON.parse(response))
    })

  }
  

  onChangeDataSource(value)
  {debugger;
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  addRules(){
    this.router.navigateByUrl('/superadmin/rules-engine-add');
  };
  deleteRecord(...vars)
  {
    debugger;
    const yesHandler = (toast: SnotifyToast) => {
      this.deleteOptions={
        option:vars[0],
        id: vars[1]
      }
      debugger;
      this.rulesDeleteData(this.deleteOptions)
      this.service.remove(toast.id)

    }
    console.log(this.service)
    this.service.confirm('Are you sure want to delete Rule', 'Delete', {
     buttons: [
        {text: 'Yes', action:yesHandler,bold: false},
        {text: 'No', action: (toast) => {console.log('Clicked: Later'); this.service.remove(toast.id); } },
        {text: 'Close', action: (toast) => {console.log('Clicked: No'); this.service.remove(toast.id); }, bold: true},
      ]
    });

  }
  editRecord(data)
  {
    debugger;
    this.router.navigate(['/transaction/rulesengineedit'], { 
      state: data 
    });
  }

  rulesDeleteData(data)
  {
    debugger;
    this.cs.deleteRulesdata(data).subscribe(response =>{
      debugger;
      console.log("response in sbu update",response)
      this.rulesListGetData()
    })
  }
}
