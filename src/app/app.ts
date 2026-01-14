import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from './google-sheets.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  enviando = false;

  // MODELO DE DATOS (Anónimo + Puesto)
  modelo: any = { 
    empresa: '', 
    puesto: '', // Nuevo campo
    sexo: 'Masculino', 
    edad: null 
  };

  // OPCIONES ESTÁNDAR (Para preguntas 1-30 y 32-38)
  opcionesGenericas = [
    { texto: 'Siempre', valor: 4 },
    { texto: 'Muchas veces', valor: 3 },
    { texto: 'Algunas veces', valor: 2 },
    { texto: 'Solo alguna vez', valor: 1 },
    { texto: 'Nunca', valor: 0 }
  ];

  // OPCIONES ESPECIALES (Solo para pregunta 31)
  opcionesQ31 = [
    { texto: 'Soy la/el principal responsable y hago la mayor parte de las tareas', valor: 4 },
    { texto: 'Hago aproximadamente la mitad de las tareas familiares y domésticas', valor: 3 },
    { texto: 'Hago más o menos una cuarta parte de las tareas', valor: 2 },
    { texto: 'Sólo hago tareas muy puntuales', valor: 1 },
    { texto: 'No hago ninguna o casi ninguna de estas tareas', valor: 0 }
  ];

  // LISTA DE PREGUNTAS (Resumida para el ejemplo, asegúrate de tener las 38)
  preguntas: any[] = [
    { id: 1, texto: '¿Tienes que trabajar muy rápido?' },
    { id: 2, texto: '¿La distribución de tareas es irregular y provoca que se te acumule el trabajo?' },
    { id: 3, texto: '¿Tienes tiempo de llevar al día tu trabajo?' }, // (Invertida)
    { id: 4, texto: '¿Te cuesta olvidar los problemas del trabajo?' },
    { id: 5, texto: '¿El trabajo requiere que escondas tus emociones?' },
    // ... ASEGÚRATE DE COMPLETAR HASTA LA 30 AQUÍ ...
    { id: 30, texto: '¿Tu trabajo requiere atención constante?' }, // (Ejemplo, usa tu texto real)

    // --- PREGUNTA 31 ESPECIAL ---
    {
      id: 31,
      texto: '¿Qué parte del trabajo familiar y doméstico haces tú?',
      opcionesEspecificas: this.opcionesQ31 // <--- ESTO ACTIVA LAS OPCIONES NUEVAS
    },

    // ... RESTO DE PREGUNTAS ...
    { id: 32, texto: '¿Cuando estás en el trabajo, piensas en las tareas domésticas y familiares?' },
    // ... COMPLETAR HASTA LA 38 ...
    { id: 38, texto: '¿Tus superiores te dan el reconocimiento que mereces?' }
  ];

  constructor(private sheetService: GoogleSheetsService) {}

  enviar() {
    // 1. VALIDAR DATOS GENERALES (Validamos Puesto, ya no Nombre/DNI)
    if (!this.modelo.empresa || !this.modelo.puesto || !this.modelo.edad || !this.modelo.sexo) {
      alert('⚠️ Faltan datos generales. Por favor completa Empresa, Puesto, Edad y Sexo.');
      this.scrollToId('card-datos');
      return;
    }

    // 2. VALIDAR QUE TODAS LAS PREGUNTAS ESTÉN RESPONDIDAS
    for (let preg of this.preguntas) {
      const key = 'p' + preg.id;
      const respuesta = this.modelo[key];
      
      // Verificamos si es undefined o null (0 es válido)
      if (respuesta === undefined || respuesta === null) {
        alert(`⚠️ Falta responder la pregunta número ${preg.id}`);
        this.scrollToId('preg-' + preg.id);
        return;
      }
    }

    // 3. ENVIAR DATOS
    this.enviando = true;
    this.sheetService.submitData(this.modelo).subscribe({
      next: (res) => {
        this.enviando = false;
        alert('✅ ¡Evaluación anónima enviada con éxito! Gracias por tu participación.');
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
        this.enviando = false;
        alert('❌ Error de conexión. Intenta nuevamente.');
      }
    });
  }

  scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
}