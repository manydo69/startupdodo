import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrangbaivietComponent } from './trangbaiviet.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseCardModule } from '@fuse/components/card';
import { CommentModule } from 'app/modules/component/comment/comment.module';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DanhsachbaivietComponent } from './danhsachbaiviet/danhsachbaiviet.component';
import { ChitietbaivietComponent } from './chitietbaiviet/chitietbaiviet.component';
import { BaivietluuComponent } from './baivietluu/baivietluu.component';
import { DataViewModule } from 'primeng/dataview';

const routes: Route[] = [
    {
        path: '',
        component: TrangbaivietComponent,
        children: [
            {
                path: '',
                component: DanhsachbaivietComponent
            },
            {
                path: 'detail/:id',
                component: ChitietbaivietComponent,
            },
            {
                path: 'saving',
                component: BaivietluuComponent,
            },
        ]
    }
];

@NgModule({
  declarations: [
    TrangbaivietComponent,
    DanhsachbaivietComponent,
    ChitietbaivietComponent,
    BaivietluuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatButtonModule,
    FormsModule,
    TabViewModule,
    DividerModule,
    MultiSelectModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    PaginatorModule,
    ChipModule,
    RatingModule,
    MatIconModule,
    CommentModule,
    DialogModule,
    InputTextareaModule,
    FuseCardModule,
    ToggleButtonModule,
    DataViewModule
  ]
})
export class TrangbaivietModule { }
