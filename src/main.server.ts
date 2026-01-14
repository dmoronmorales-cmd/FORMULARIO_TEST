import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { config } from './app/app.config.server'; // Aquí importamos el archivo del PASO 1

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;