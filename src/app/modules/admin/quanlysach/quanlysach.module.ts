import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanlysachComponent } from './quanlysach.component';
import { Route, RouterModule } from '@angular/router';
import { DanhsachsachComponent } from './danhsachsach/danhsachsach.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageviewModule } from 'app/modules/component/imageview/imageview.module';
import { QuillModule } from 'ngx-quill';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { FormtaosachComponent } from './formtaosach/formtaosach.component';
import { FormchapterComponent } from './formtaosach/formchapter/formchapter.component';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
const routes: Route[] = [
    {
        path     : '',
        component: QuanlysachComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: DanhsachsachComponent
            },
            {
                path: 'update/:id',
                component: FormtaosachComponent
            }
        ]
    }
];

@NgModule({
  declarations: [
    QuanlysachComponent,
    DanhsachsachComponent,
    FormtaosachComponent,
    FormchapterComponent
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
export class QuanlysachModule { }
