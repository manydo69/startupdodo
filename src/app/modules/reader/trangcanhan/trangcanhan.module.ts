import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrangcanhanComponent } from './trangcanhan.component';
import { ProfileComponent } from './profile/profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { Route, RouterModule } from '@angular/router';
import { FormthongtinComponent } from './formthongtin/formthongtin.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { FormbaivietComponent } from './formbaiviet/formbaiviet.component';
import { QuillModule } from 'ngx-quill';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChudetheodoiComponent } from './chudetheodoi/chudetheodoi.component';
import {PickListModule} from 'primeng/picklist';
import {SelectButtonModule} from 'primeng/selectbutton';
const routes: Route[] = [
    {
        path: '',
        component: TrangcanhanComponent,
        children: [
            {
                path: 'detail/:id',
                component: ProfileComponent,
            },
            {
                path: '',
                component: FormthongtinComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'chude',
                component: ChudetheodoiComponent,
            },
        ]
    }
];

@NgModule({
  declarations: [
    TrangcanhanComponent,
    ProfileComponent,
    FormthongtinComponent,
    FormbaivietComponent,
    ChudetheodoiComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    FuseCardModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule,
    QuillModule,
    InputTextareaModule,
    PickListModule,
    SelectButtonModule
  ]
})
export class TrangcanhanModule { }
