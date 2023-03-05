
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
//import { CommonService } from '../../services/common.service';
import { SbuDialogComponent } from '../sbu-dialog/sbu-dialog.component';
// import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import * as headers from '../../../../assets/Headers.json';
//import { ConfirmationDialogComponent } from 'app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-sbu',
  templateUrl: './sbu.component.html',
  styleUrls: ['./sbu.component.scss']
})
export class SbuComponent implements OnInit {
  products: any = (headers as any).default;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedHeaders = [this.products.sbu, this.products.createdBy, this.products.createdAt, this.products.updatedAt, 'Actions', 'delete']
  displayedColumns: string[] = ['name', 'user_name', 'creation_dt', 'last_update_dt', 'edit', 'deleteFlag'];
  dataSource: any;
  value: any;
  updateData: any;
  updateDataInsert: any;
  deleteOptions: { option: any; id: any; };
  json: any;
  show: boolean = false;
  public data=[{
    "name":"adreana gomez",
    "username":"ady_14",
    "creationdate":"28-Oct-2018",
    "lastupdatedate":"28-Oct-2020",
  },
  {
    "name":"adreana gomez",
    "username":"ady_14",
    "creationdate":"28-Oct-2018",
    "lastupdatedate":"28-Oct-2020",
  },
  {
    "name":"adreana gomez",
    "username":"ady_14",
    "creationdate":"28-Oct-2018",
    "lastupdatedate":"28-Oct-2020",
  },
  {
    "name":"adreana gomez",
    "username":"ady_14",
    "creationdate":"28-Oct-2018",
    "lastupdatedate":"28-Oct-2020",
  },
  {
    "name":"adreana gomez",
    "username":"ady_14",
    "creationdate":"28-Oct-2018",
    "lastupdatedate":"28-Oct-2020",
  },
  {
    "name":"adreana gomez",
    "username":"ady_14",
    "creationdate":"28-Oct-2018",
    "lastupdatedate":"28-Oct-2020",
  }
]
  constructor(
   // private cs: CommonService,
    public dialog: MatDialog,
    private storage: ManagerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService

  ) { }

  ngOnInit() {
   // this.sbuGetData();
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /*sbuGetData() {
    console.log("came here?")
    this.cs.sbuGetData().subscribe(response => {
      console.log("response", response.data)
      this.json = response.data
      this.onChangeDataSource(response.data)
    })
  }
  sbuUpdateData(data) {
    this.cs.sbuUpdateData(data).subscribe(response => {
      console.log("response in sbu update", response)
      this.sbuGetData()
    })
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }*/

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  exportAsXLSX() {
    console.log("this native elemnt", this.table)
    this.show = true;
    this.exportToExcelFromTable(this.table._elementRef, "sbu");
    this.show = false
  }

  exportToExcelFromTable(exltable, filename) {
    debugger;
    /*const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(exltable.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + '_' + moment(Date.now()).format('YYYY_MM_DD') + '.csv');*/

  }
  openDialog(...value): void {
    var component: any
    if (value[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = SbuDialogComponent
    }
    const dialogRef = this.dialog.open(component, {
      data: {
        value: value[0],
        name: value[1],
      },
    });

    /*dialogRef.afterClosed().subscribe(result => {
      if (result && value[0] === 'insert') {
        debugger;
        console.log("this dialog closed with true value", result)
        this.updateDataInsert = result;
        this.updateDataInsert['created_by'] = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_UUID)

        this.createSbu(this.updateDataInsert);
      }
      else if (result && value[0] === 'edit') {
        debugger;
        this.updateData = result;
        this.updateData['id'] = value[2]
        this.sbuUpdateData(result)
      }
      else if (result && value[0] === 'upload') {
        this.cs.sbuUploadData(result).subscribe(r => {
          console.log("result from node", r)
          this.sbuGetData()
        })
      }
    });*/
  }
  deleteRecord(...vars) {
   /* this.deleteOptions = {
      option: vars[0],
      id: vars[1]*/
    }
   /* this.confirmService.confirm({message: `Are you sure want to delete ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.sbuUpdateData(this.deleteOptions);
          this.loader.close();
        }
      })
  }
  createSbu(result: any) {
    this.cs.sbuInsertData(result).subscribe(r => {
      console.log("created sbu", r)
      this.sbuGetData()
    })
  }*/

}
