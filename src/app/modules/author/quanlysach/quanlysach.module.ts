import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanlysachComponent } from './quanlysach.component';
import { Route, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DanhsachsachComponent } from './danhsachsach/danhsachsach.component';
import { FormtaosachComponent } from './formtaosach/formtaosach.component';
import {InputTextModule} from 'primeng/inputtext';
import {FileUploadModule} from 'primeng/fileupload';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DropdownModule} from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FormchapterComponent } from './formtaosach/formchapter/formchapter.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatButtonModule } from '@angular/material/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ImageviewModule } from 'app/modules/component/imageview/imageview.module';
import { TooltipModule } from 'primeng/tooltip';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';
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
                path: 'create',
                component: FormtaosachComponent
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
  ],
})
export class QuanlysachModule { }
