import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ScanPage } from '../pages/scan/scan';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';

import { HTTP } from '@ionic-native/http';

@NgModule({
  declarations: [
    MyApp,
    ScanPage,
    ProfilePage,
    HomePage,
    LoginPage,
    RegisterPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ScanPage,
    ProfilePage,
    HomePage,
    LoginPage,
    RegisterPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FileTransfer,
    FileTransferObject,
    Camera,
    HttpClient,
    HTTP
  ]
})
export class AppModule {}
