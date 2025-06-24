import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationResultComponent } from './confirmation-result.component';
import { SharedModule } from 'app/shared/shared.module';
import { FuseCardModule } from '@fuse/components/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { authConfirmationResultRoutes } from './confirmation-result.routing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    ConfirmationResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(authConfirmationResultRoutes),
    MatButtonModule,
    FuseCardModule,
    SharedModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ]
})
export class ConfirmationResultModule { }
