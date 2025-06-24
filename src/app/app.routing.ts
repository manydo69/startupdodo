import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/home'
    { path: '', pathMatch: 'full', redirectTo: 'home' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'verification', loadChildren: () => import('app/modules/auth/confirmation-result/confirmation-result.module').then(m => m.ConfirmationResultModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },

        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) },
            { path: 'change-password', loadChildren: () => import('app/modules/auth/change-password/change-password.module').then(m => m.AuthChangePasswordModule) },
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'modern'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
            { path: 'sach', loadChildren: () => import('app/modules/reader/trangsach/trangsach.module').then(m => m.TrangsachModule) },
            { path: 'baiviet', loadChildren: () => import('app/modules/reader/trangbaiviet/trangbaiviet.module').then(m => m.TrangbaivietModule) },
        ]
    },

    // Admin routes
    {
        path: 'admin',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'classy'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'quanlysach', children: [
                    { path: 'sach', loadChildren: () => import('app/modules/admin/quanlysach/quanlysach.module').then(m => m.QuanlysachModule) },
                    { path: 'chude', loadChildren: () => import('app/modules/admin/quanlychude/quanlychude.module').then(m => m.QuanlychudeModule) }
                ]
            },
            {
                path: 'quanlybaiviet', loadChildren: () => import('app/modules/admin/quanlybaiviet/quanlybaiviet.module').then(m => m.QuanlybaivietModule)
            },
            {
                path: 'quanlybaocao', children: [
                    { path: 'danhmuc', loadChildren: () => import('app/modules/admin/quanlydanhmucbc/quanlydanhmucbc.module').then(m => m.QuanlydanhmucbcModule) },
                    { path: 'baocao', loadChildren: () => import('app/modules/admin/quanlybaocao/quanlybaocao.module').then(m => m.QuanlybaocaoModule) }
                ]
            },
            {
                path: 'quanlynguoidung', loadChildren: () => import('app/modules/admin/quanlynguoidung/quanlynguoidung.module').then(m => m.QuanlynguoidungModule)
            },
            {
                path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'quanlygiaodich', loadChildren: () => import('app/modules/admin/quanlytaichinh/quanlytaichinh.module').then(m => m.QuanlytaichinhModule)
            },
        ]
    },

    // Author routes
    {
        path: 'author',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'classy'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'quanlysach', children: [
                    { path: 'sach', loadChildren: () => import('app/modules/author/quanlysach/quanlysach.module').then(m => m.QuanlysachModule) },
                    // {path: 'chude'}
                ]
            },
        ]
    },

    //Guest and reader routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'modern'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
            { path: 'sach', loadChildren: () => import('app/modules/reader/trangsach/trangsach.module').then(m => m.TrangsachModule) },
            { path: 'canhan', loadChildren: () => import('app/modules/reader/trangcanhan/trangcanhan.module').then(m => m.TrangcanhanModule) },
            { path: 'taichinh', loadChildren: () => import('app/modules/reader/trangtaichinh/trangtaichinh.module').then(m => m.TrangtaichinhModule) },
        ]
    },



    // Landing routes
    // {
    //     path: '',
    //     component: LayoutComponent,
    //     data: {
    //         layout: 'modern'
    //     },
    //     resolve: {
    //         initialData: InitialDataResolver,
    //     },
    //     children: [

    //     ]
    // },

    // 404 & Catch all
    {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/error/error404/error404.module').then(m => m.Error404Module)},
    {path: '**', redirectTo: '404-not-found'}
];
