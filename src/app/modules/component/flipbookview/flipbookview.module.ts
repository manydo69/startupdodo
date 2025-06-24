import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlipbookviewComponent } from './flipbookview.component';
import { FlipBookModule } from '@labsforge/flipbook';



@NgModule({
  declarations: [
    FlipbookviewComponent
  ],
  imports: [
    CommonModule,
    FlipBookModule
  ],
  exports: [
    FlipbookviewComponent,

  ]
})
export class FlipbookviewModule { }
