import { Component, OnInit, Inject, ViewEncapsulation,  ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { UploadService } from '../../../../../app/components/services/UploadService';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';


interface SelectData {
  id: string;
  name: string;
}


@Component({
  selector: 'app-UpdateAssetRegister',
  templateUrl: './UpdateAssetRegister.component.html',
  styleUrls: ['./UpdateAssetRegister.component.scss'],
})
export class UpdateAssetRegisterComponent implements OnInit {
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  public uploader: FileUploader = new FileUploader({ isHTML5: true });

  file: File = null;
  fileData: any;
  fileList: any[] = [];
  columnData:any[]=[];

  UpdateByData: SelectData[] = [
    { name: 'Inventory No', id: 'A' },
  ];

  public AssetInfo: FormGroup;
  public filteredUpdateBy: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);

  constructor(@Inject(MAT_DIALOG_DATA,) public data: any,
  public dialogRef: MatDialogRef<UpdateAssetRegisterComponent>,
    private fb: FormBuilder, public dialog: MatDialog, private uploadService: UploadService) { }


  ngOnInit() {
    this.buildItemForm();
    this.filteredUpdateBy.next(this.UpdateByData.slice());
    this.AssetInfo.controls['UpdateByFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUpdateBy();
      });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  buildItemForm() {
    this.AssetInfo = this.fb.group({
      UpdateBy: [''],
      UpdateByFilter: [''],
      DepnRunDate: [''],
      FileName: [{ value: ' ' }],
    })
  }

  protected setInitialValue() {
    debugger;
    this.AssetInfo.controls['UpdateByFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });
  }

  protected filterUpdateBy() {
    debugger;
    if (!this.UpdateByData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['UpdateByFilter'].value;
    if (!search) {
      this.filteredUpdateBy.next(this.UpdateByData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredUpdateBy.next(
      this.UpdateByData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
    console.log(this.filteredUpdateBy);
  }

  onclosetab() {
    this.dialogRef.close();

  }

  fileChange(event) {
    debugger;
    this.fileList = event.target.files;

  }
  uploadData() {
    debugger;
    if (this.fileList.length > 0) {
     // this.file = this.fileList[0];
      let formData = new FormData();
      formData.append('uploadFile', this.fileList[0]);
      let headers = new Headers();

      // this.uploadService.UploadFile(formData).subscribe(r => {
      //   debugger;
      //   this.columnData= JSON.parse(r);

      //   this.dialogRef.close(this.columnData);
        
      // })

    }

  }
}
