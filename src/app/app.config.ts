import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router'; // 1. Importamos 'Routes'
import { provideHttpClient } from '@angular/common/http';

// 2. Le decimos a TypeScript que esto es de tipo ': Routes'
const routes: Routes = [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient() 
  ]
};