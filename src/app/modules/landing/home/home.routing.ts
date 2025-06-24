import { Route } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { HomepageComponent } from './homepage/homepage.component';

export const landingHomeRoutes: Route[] = [
    {
        path: '',
        component: LandingHomeComponent,
        children: [
            {
                path: '',
                component: HomepageComponent
            }
        ]
    }
];
