
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptors/Auth/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

bootstrapApplication(App, {
  providers: [
    provideAnimations(), 
    importProvidersFrom(BrowserAnimationsModule), 
    provideRouter(routes, withDebugTracing()), 
    provideHttpClient(withInterceptorsFromDi()), 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    MessageService, 
  ],
});
