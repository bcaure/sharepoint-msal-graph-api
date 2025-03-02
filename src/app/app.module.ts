import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
} from '@azure/msal-browser';

import {
  MSAL_INSTANCE,
  MsalGuardConfiguration,
  MSAL_GUARD_CONFIG,
  MsalService,
  MsalBroadcastService,
  MsalGuard,
  MsalRedirectComponent,
  MsalInterceptor,
  MsalModule,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';

import { msalConfig, loginRequest } from './auth-config';
import { environment } from 'src/environments/environment';



/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MsalGuardConfigurationFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest
  };
}

export function MsalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    // MSAL Interceptor Configurations
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([ 
        [`${environment.graphApiBaseUrl}`, ['user.read']]
      ])
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatIconModule,
    MsalModule.forRoot(MSALInstanceFactory(), MsalGuardConfigurationFactory(), MsalInterceptorConfigFactory()),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MsalGuardConfigurationFactory,
    },
    MsalService,
    MsalBroadcastService,
    MsalGuard,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }
