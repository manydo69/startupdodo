import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanlydanhmucbcComponent } from './quanlydanhmucbc.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route, RouterModule } from '@angular/router';
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
import { DanhsachdanhmucComponent } from './danhsachdanhmuc/danhsachdanhmuc.component';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';

const routes: Route[] = [
    {
        path     : '',
        component: QuanlydanhmucbcComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: DanhsachdanhmucComponent
            },
            // {
            //     path: 'update/:id',
            //     component: FormtaosachComponent
            // }
        ]
    }
];

@NgModule({
  declarations: [
    QuanlydanhmucbcComponent,
    DanhsachdanhmucComponent
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
export class QuanlydanhmucbcModule { }
