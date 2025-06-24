import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanlytaichinhComponent } from './quanlytaichinh.component';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { MessagesModule } from 'app/layout/common/messages/messages.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseCardModule } from '@fuse/components/card';
import { CommentModule } from 'app/modules/component/comment/comment.module';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';

const routes: Route[] = [
    {
        path     : '',
        component: QuanlytaichinhComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
    }
];

@NgModule({
  declarations: [
    QuanlytaichinhComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatButtonModule,
    FormsModule,
    TabViewModule,
    DividerModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    PaginatorModule,
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
export class QuanlytaichinhModule { }
