import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { landingHomeRoutes } from 'app/modules/landing/home/home.routing';
import { HomepageComponent } from './homepage/homepage.component';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import {DataViewModule} from 'primeng/dataview';
import {PaginatorModule} from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
@NgModule({
    declarations: [
        LandingHomeComponent,
        HomepageComponent
    ],
    imports     : [
        RouterModule.forChild(landingHomeRoutes),
        MatButtonModule,
        MatIconModule,
        SharedModule,
        CarouselModule,
        CardModule,
        DataViewModule,
        PaginatorModule,
        DividerModule
    ]
})
export class LandingHomeModule
{
}
