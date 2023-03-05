import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { MatPaginator } from '@angular/material/paginator';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';


import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

export interface PeriodicElement {
  name: string;
  LocationData: any[];

}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Block Owner',
    LocationData: [
      {
        name: 'Kolhapur',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Mumbai',
        comp: ['ABC.ltd', 'JKL.ltd', 'STR.ltd']
      },
      {
        name: 'Pune',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      },
     
    ]

  },
  {
    name: 'Finance Approver',
    LocationData: [
      {
        name: 'Mumbai',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Kochi',
        comp: ['aa', 'bb', 'cc']
      },
      {
        name: 'Shimala',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      }
    ]
  },
  // {
  //   name: 'Normal User',
  //   LocationData: [
  //     {
  //       name: 'Pune',
  //       comp: ['a', 'b', 'c']
  //     },
  //     {
  //       name: 'Beed',
  //       comp: ['aa', 'bb', 'cc']
  //     },
  //     {
  //       name: 'Solapur',
  //       comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
  //     }]
  // },
  // {
  //   name: 'assetcues@Gmail.com',
  //   LocationData: [
  //     {
  //       name: 'Sangli',
  //       comp: ['a', 'b', 'c']
  //     },
  //     {
  //       name: 'Satara',
  //       comp: ['aa', 'bb', 'cc']
  //     },
  //     {
  //       name: 'Belgaon',
  //       comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
  //     }]
  // },
  // {
  //   name: 'surbhi2325@Gmail.com',
  //   LocationData: [
  //     {
  //       name: 'Thane',
  //       comp: ['a', 'b', 'c']
  //     },
  //     {
  //       name: 'Surat',
  //       comp: ['aa', 'bb', 'cc']
  //     },
  //     {
  //       name: 'Mumbai',
  //       comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
  //     }]
  // },
  // {
  //   name: 'sumit@Gmail.com',
  //   LocationData: [
  //     {
  //       name: 'Navi Mumbai',
  //       comp: ['a', 'b', 'c']
  //     },
  //     {
  //       name: 'Kagal',
  //       comp: ['aa', 'bb', 'cc']
  //     },
  //     {
  //       name: 'Sangaon',
  //       comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
  //     }]
  // },
  // {
  //   name: 'Assetrak@Gmail.com',
  //   LocationData: [
  //     {
  //       name: 'Borgaon',
  //       comp: ['a', 'b', 'c']
  //     },
  //     {
  //       name: 'Dharwad',
  //       comp: ['aa', 'bb', 'cc']
  //     },
  //     {
  //       name: 'Belgaon',
  //       comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
  //     }]
  // },
];


@Component({
  selector: 'app-viewrole',
  templateUrl: './viewrole.component.html',
  styleUrls: ['./viewrole.component.scss']
})
export class ViewRoleDialogComponent implements OnInit {


  public selectedIndex;
  public selectedrows1 = [];
  public selectedrows2 = [];
  public toselect = 0;
  public len = 0;

  public grpdata;
  public addgrpdata;
  public disableadd = true;
  public disableadd1 = true;
  private myDataArray: any;
  public LocationData: any;
  public dataLocation: any;
  public dataCategory: any;
  public highlightedRows = [];
  public currentLocationIndex: any;
  public currentCategory: any;

  header: any ;
  message: any ;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  @ViewChild('PaginatorForLocation', { static: true }) paginatorForLocation: MatPaginator;
  @ViewChild('SortForLocation', { static: true }) sortForLocation: MatSort;
  @ViewChild('TableForLocation', { static: true }) tableForLocation: any;

  @ViewChild('PaginatorForCategory', { static: true }) paginatorForCategory: MatPaginator;
  @ViewChild('SortForCategory', { static: true }) sortForCategory: MatSort;
  @ViewChild('TableForCategory', { static: true }) tableForCategory: any;

  displayedHeaders = []
  displayedColumns: string[] = ['name'];

  displayedHeadersLocation = []
  displayedColumnsLocation: string[] = ['LocationName'];

  displayedHeadersCategory = []
  displayedColumnsCategory: string[] = ['Category'];

  
  constructor(public dialogRef: MatDialogRef<ViewRoleDialogComponent> , private jwtAuth: JwtAuthService) { 
    this.header = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();

    this.displayedHeaders = [this.header.User];
    this.displayedHeadersLocation = [this.header.Location];
    this.displayedHeadersCategory = [this.header.Category]
  }

  public data = Object.assign(ELEMENT_DATA);
  public dataSource = new MatTableDataSource<Element>(this.data);
   selectedUserValue:any;
   selectedLocationValue:any;

    ngOnInit() {  
     /////////////////////for Selection Only/////////////////
     for (let i = 0; i < this.data.length; i++) {
      this.selectedrows1.push("");
      for (let i = 0; i < this.data[i].LocationData.length; i++) {
        this.selectedrows2.push("");
      }
    }

    }
    // ngAfterViewInit() {
    //  // this.datasource.sort = this.sort;
    // //  this.datasource.paginator = this.paginator;
  
    // }
  public onclosetab() {
    debugger;
    this.dialogRef.close();
  }


  public getRecord() { }
  getCard(i) {
    console.log(i);
    this.toselect = i;
    for (let k = 0; k < this.selectedrows2.length; k++) {
      if (this.selectedrows2[k] === 'true') {
        this.selectedrows2[k] = "";
      }
    }
    for (let j = 0; j < this.selectedrows1.length; j++) {
      this.selectedrows1[i] = "true";
      if (this.selectedrows1[j] === 'true') {
        if (i != j) {
          this.selectedrows1[j] = "";
        }
      }
    }
  }

  getcard1(i) {
    console.log(i);
    this.len = this.toselect * (this.data[this.toselect].LocationData.length);
    for (let j = 0; j < this.selectedrows2.length; j++) {
      this.selectedrows2[this.len + i] = "true";
      if (this.selectedrows2[j] === 'true') {
        if ((this.len + i) != j) {
          this.selectedrows2[j] = "";
        }
      }
    }

  }


  public showNextData(currentData, index) {
    debugger;
    this.dataLocation = [];
    this.disableadd1 = true;
    
    this.LocationData = currentData.LocationData;
    this.disableadd = false;
    this.currentLocationIndex = index;
    this.selectedUserValue=currentData.name;
  }

  public showNextcompData(currentData1, index1) {
    this.dataCategory = currentData1.comp;
    this.disableadd1 = false;
    this.currentCategory = index1;
    this.selectedLocationValue=currentData1.name;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterForLocation(filterValue: string) {
    this.LocationData.filter = filterValue.trim().toLowerCase();
  }

  applyFilterForCategory(filterValue: string) {
    this.dataCategory.filter = filterValue.trim().toLowerCase();
  }
  

}
