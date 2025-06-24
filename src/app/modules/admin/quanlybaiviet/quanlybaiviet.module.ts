import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanlybaivietComponent } from './quanlybaiviet.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { ImageviewModule } from 'app/modules/component/imageview/imageview.module';
import { QuillModule } from 'ngx-quill';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { DanhsachsachComponent } from '../quanlysach/danhsachsach/danhsachsach.component';
import { FormtaosachComponent } from '../quanlysach/formtaosach/formtaosach.component';
import { QuanlysachComponent } from '../quanlysach/quanlysach.component';
import { DanhsachbaivietComponent } from './danhsachbaiviet/danhsachbaiviet.component';

const routes: Route[] = [
    {
        path     : '',
        component: QuanlysachComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: DanhsachbaivietComponent
            }
        ]
    }
];

@NgModule({
  declarations: [
    QuanlybaivietComponent,
    DanhsachbaivietComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    ConfirmDialogModule,
    DropdownModule,
    TagModule,
    RadioButtonModule,
    FormsModule,
    QuillModule,
    MultiSelectModule,
    MatButtonModule,
    InputTextareaModule,
    InputNumberModule,
    ImageviewModule,
    TooltipModule,
    MatTooltipModule,
    ToggleButtonModule
  ]
})
export class QuanlybaivietModule { }
