import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    CommentComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    PickerModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    MatButtonModule
  ],
  exports: [
    CommentComponent
  ]
})
export class CommentModule { }
