import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrangsachComponent } from './trangsach.component';
import { Route, RouterModule } from '@angular/router';
import { DanhsachsachComponent } from './danhsachsach/danhsachsach.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MatInputModule } from '@angular/material/input';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ChitietsachComponent } from './chitietsach/chitietsach.component';
import { ChipModule } from 'primeng/chip';
import { RatingModule } from 'primeng/rating';
import { MatIconModule } from '@angular/material/icon';
import { CommentModule } from 'app/modules/component/comment/comment.module';
import { ChitietchuongComponent } from './chitietsach/chitietchuong/chitietchuong.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SachluuComponent } from './sachluu/sachluu.component';
import { FuseCardModule } from '@fuse/components/card';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FlipbookviewModule } from 'app/modules/component/flipbookview/flipbookview.module';
const routes: Route[] = [
    {
        path: '',
        component: TrangsachComponent,
        children: [
            {
                path: '',
                component: DanhsachsachComponent
            },
            {
                path: 'detail/:id',
                component: ChitietsachComponent,
            },
            {
                path: 'chapter/:idchapter',
                component: ChitietchuongComponent,
            },
            {
                path: 'saving',
                component: SachluuComponent,
            },
        ]
    }
];
@NgModule({
    declarations: [
        TrangsachComponent,
        DanhsachsachComponent,
        ChitietsachComponent,
        ChitietchuongComponent,
        SachluuComponent,
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
        FlipbookviewModule
    ]
})
export class TrangsachModule { }
