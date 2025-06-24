import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanlychudeComponent } from './quanlychude.component';
import { Route, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DanhsachchudeComponent } from './danhsachchude/danhsachchude.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageviewModule } from 'app/modules/component/imageview/imageview.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';


const routes: Route[] = [
    {
        path     : '',
        component: QuanlychudeComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: DanhsachchudeComponent
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
    QuanlychudeComponent,
    DanhsachchudeComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    MatButtonModule,
    InputTextareaModule,
    InputNumberModule,
    ImageviewModule,
    TooltipModule,
    MatTooltipModule,
    ToggleButtonModule,
    TagModule,
    DropdownModule
  ]
})
export class QuanlychudeModule { }
