import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `<style>  
  .example-spacer {
    flex: 1 1 auto;
}
.md-dialog-container{
    margin: -24px;
    overflow: hidden;
}
.example-icon{
    background-color: none;
}
.md-dialog-content{
    margin-bottom: 20px;
}
.mat-tab-label-container{
    font-size: 0.9em;
    margin-top: -10px;
}
.mat-dialog-content{
    margin: -25px 0px 0px 0px;
    padding:12px 12px;
    overflow:hidden;
}
.egret-navy .mat-tab-group.mat-primary .mat-ink-bar{
    height:8px;
}
.mat-tab-label{
    font-size:0.9rem;
}
.egret-navy .mat-icon-button{
    background:none;
}
.mat-table {
  width:100%;
  max-width: 100%;
  min-width: 100%;
  overflow: auto auto;
}

.mat-header-cell{
  font-size: 14px;
  border-bottom: 1px solid;
  border-bottom-color: rgba(0, 0, 0, 0.12);
  padding: 5px 0px;
  font-weight: 700;
}

.mat-cell{
  border-bottom: 1px solid;
  border-bottom-color: rgba(0, 0, 0, 0.12);
  padding: 5px 0px;
  font-size: 13px !important;
}


.mat-header-row{
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  border-bottom-width: 0px;
}

.mat-row, .mat-header-row {
  min-width: 800px;
  white-space: nowrap;
}

mat-cell:first-of-type, mat-header-cell:first-of-type, mat-footer-cell:first-of-type{
  padding-left:10px ;
}

mat-cell:last-of-type, mat-header-cell:last-of-type, mat-footer-cell:last-of-type{
  padding-right: 10px;
}


.head{
    color: blue;
}

.w-100{
  width: 100px;
  flex:0 0 100px;
}

.w-80{
  width: 80px;
  flex:0 0 80px;
}

.w-150{
    width: 150px;
    flex: 0 0 150px;
}

.md-label{
  max-height:60vh;
  min-height:30vh;
  overflow: auto;
  padding-bottom: 20px;
}
.mat-form-field-appearance-outline .mat-form-field-infix{
  padding: 0.6em 1em 0.6em;
}
.full{
  margin-top: 10px;
}
.btn{
margin-left:15px;
margin-top: 20px;
background-color: rgb(12, 48, 87);
cursor: pointer;
}

tr.mat-header-row {
height: 5px !important;
}

tr.mat-row
{
height: 5px !important;
}

:host ::ng-deep .mat-paginator-page-size .mat-select-trigger {
color: rgba(0, 0, 0, 0.54);
font-size: 12px !important;
}

:host ::ng-deep .mat-paginator-container
{

  margin-top: -10px;
  margin-bottom: -10px;
  color: black !important;
  min-height: 66px !important;

}

:host ::ng-deep .mat-header-cell {
   color:black !important;
 }
 
:host ::ng-deep .mat-form-field-empty.mat-form-field-label, .mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{
transform:translateY(-1.59375em) scale(0.75);
width: 133.33333333%;
font-size: 18px !important;
}
:host ::ng-deep  .mat-form-field-appearance-outline .mat-form-field-outline-gap{
border-top-color: transparent;
}

.example-container {
display: flex;
flex-direction: column;
flex-basis: 300px;
box-shadow:0 0 black;
max-height: 300px !important;
background-color: rgba(255, 255, 255, 0.959);
overflow: auto !important;   
width:100%;
}

:host ::ng-deep .mat-form-field-appearance-legacy .mat-form-field-label {

color: black !important;

}

textarea.mat-input-element {
padding: 12px 0 !important;
}

 :host ::ng-deep .mat-select-value-text {  
  font-size: 13px !important;
  font-weight: 450;
}

:host ::ng-deep .mat-form-field-appearance-legacy .mat-form-field-label {
  
  color: gray!important;
  font-style: italic;
}
:host ::ng-deep .success {
  background-color: green;
  color: white;
}
</style>
<div class="md-dialog-container">
<div fxLayout="row wrap" class="example-container mat-elevation-z8">
  <mat-toolbar class="mat-toolbar" style="background-color:rgb(12, 48, 87);color:white">
    <span>{{data.title}} </span>
    <span class="example-spacer"></span>
    <button mat-icon-button class="example-icon" aria-label="Example icon-button with close icon"
    (click)="dialogRef.close(false)">
      <mat-icon>close</mat-icon>
    </button>
  </mat-toolbar>
</div>
<div style="padding: 20px !important;">
<div fxLayout="row wrap" fxLayout.lt-sm="column">
        <mat-label style="font-weight: 500 !important;font-size: 18px !important;">{{data.message}}
        </mat-label>
      </div>
      <div style="text-align: right;">     
      <button  mat-raised-button class="success" style="margin-left: 5px;" (click)="dialogRef.close(true)"><mat-icon>check</mat-icon> Ok </button> 
      </div>
</div>
</div>`,

    // ` <button 
    // type="button"
    // color="warn"
    // mat-raised-button 
    // (click)="dialogRef.close(false)">Cancel</button>`;
})
export class MessageAlertComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}