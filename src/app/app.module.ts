import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from "@angular/fire/compat/messaging";
import {ConfirmationService} from 'primeng/api';
import { QuillConfigModule } from 'ngx-quill';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { StoreModule } from '@ngrx/store'
import { appReducer, userReducer } from './ngxstore/reducer/app.reducer';
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from '@ngrx/effects';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NotificationService } from './shared/notification.service';
const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled',
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // Ngx store
        StoreModule.forRoot({ appUser: userReducer }),

        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
          }),

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireMessagingModule,
        ServiceWorkerModule.register('combined-sw.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),

        PickerModule,
        FuseConfirmationModule,
        QuillConfigModule.forRoot({
            modules: {
              syntax: false,
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                ['blockquote', 'code-block'],
                [{ header: 1 }, { header: 2 }], // custom button values
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                [{ direction: 'rtl' }], // text direction
                [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                // [{ font: [] }],
                [{ align: [] }],
                ['clean'], // remove formatting button
                ['link', 'image', 'video'], // link and image, video
            ]
            }
          }),
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        ConfirmationService,
        DeviceDetectorService,
        NotificationService
    ]
})
export class AppModule
{
}
