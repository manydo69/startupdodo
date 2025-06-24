import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrangtaichinhComponent } from './trangtaichinh.component';
import { MatInputModule } from '@angular/material/input';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { MatIconModule } from '@angular/material/icon';
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
import { TagModule } from 'primeng/tag';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NaptienComponent } from './naptien/naptien.component';
import { FuseCardModule } from '@fuse/components/card';
import { LichsuComponent } from './lichsu/lichsu.component';
import { KetquathanhtoanComponent } from './naptien/ketquathanhtoan/ketquathanhtoan.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { DataViewModule } from 'primeng/dataview';
import { XacthucthanhtoanComponent } from './naptien/xacthucthanhtoan/xacthucthanhtoan.component';
const routes: Route[] = [
    {
        path: '',
        component: TrangtaichinhComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: NaptienComponent
            },
            {
                path: 'success-transaction',
                component: KetquathanhtoanComponent,
            },
            {
                path: 'lichsu',
                component: LichsuComponent,
            },
            {
                path: 'payment-verification',
                component: XacthucthanhtoanComponent
            }
        ]
    }
];

@NgModule({
  declarations: [
    TrangtaichinhComponent,
    NaptienComponent,
    LichsuComponent,
    KetquathanhtoanComponent,
    XacthucthanhtoanComponent
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
        InputNumberModule,
        MessagesModule,
        DataViewModule
  ]
})
export class TrangtaichinhModule { }
