import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { MessageAlertComponent } from './app-msg.component';

interface alertData {
  title?: string,
  message?: string
}

@Injectable()
export class MessageAlertService {

  constructor(private dialog: MatDialog) { }

  public alert(data:alertData = {}): Observable<boolean> {
    data.title = data.title || 'Confirm';
    data.message = data.message || 'Are you sure?';
    let dialogRef: MatDialogRef<MessageAlertComponent>;
    dialogRef = this.dialog.open(MessageAlertComponent, {
      width: '380px',
      disableClose: true,
      data: {title: data.title, message: data.message}
    });
    return dialogRef.afterClosed();
  }
}