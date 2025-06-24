import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {ChartModule} from 'primeng/chart';
import { FuseCardModule } from '@fuse/components/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
const routes: Route[] = [
    {
        path     : '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
    }
];
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ChartModule,
    FuseCardModule,
    ButtonModule,
    ConfirmDialogModule,
    DropdownModule,
    TooltipModule,
    MatTooltipModule,
    CalendarModule,
    FormsModule
  ]
})
export class DashboardModule { }
