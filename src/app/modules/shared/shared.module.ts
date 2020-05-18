import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { HeaderComponent } from '../../shared/header/header.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';



@NgModule({
  declarations: [HeaderComponent, LoadingSpinnerComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports : [
    HeaderComponent,
    LoadingSpinnerComponent,
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
