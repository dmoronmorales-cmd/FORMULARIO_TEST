import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// CORRECCIÓN 1: Quitamos '.service' del nombre del archivo si tu archivo se llama google-sheets.ts
import { GoogleSheetsService } from './google-sheets'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // CORRECCIÓN 2: Apuntamos al archivo corto 'app.html'
  templateUrl: './app.html', 
  styleUrl: './app.css' // Asegúrate de que este archivo exista como app.css
})
export class AppComponent {
  enviando = false;

  // MODELO DE DATOS (Anónimo + Puesto)
  modelo: any = { 
    empresa: '', 
    puesto: '', 
    sexo: 'Masculino', 
    edad: null 
  };

  // OPCIONES ESTÁNDAR
  opcionesGenericas = [
    { texto: 'Siempre', valor: 4 },
    { texto: 'Muchas veces', valor: 3 },
    { texto: 'Algunas veces', valor: 2 },
    { texto: 'Solo alguna vez', valor: 1 },
    { texto: 'Nunca', valor: 0 }
  ];

  // OPCIONES ESPECIALES (Pregunta 31)
  opcionesQ31 = [
    { texto: 'Soy la/el principal responsable y hago la mayor parte de las tareas', valor: 4 },
    { texto: 'Hago aproximadamente la mitad de las tareas familiares y domésticas', valor: 3 },
    { texto: 'Hago más o menos una cuarta parte de las tareas', valor: 2 },
    { texto: 'Sólo hago tareas muy puntuales', valor: 1 },
    { texto: 'No hago ninguna o casi ninguna de estas tareas', valor: 0 }
  ];

  // LISTA DE PREGUNTAS
  preguntas: any[] = [
    { id: 1, texto: '¿Tienes que trabajar muy rápido?' },
    { id: 2, texto: '¿La distribución de tareas es irregular y provoca que se te acumule el trabajo?' },
    { id: 3, texto: '¿Tienes tiempo de llevar al día tu trabajo?' },
    { id: 4, texto: '¿Te cuesta olvidar los problemas del trabajo?' },
    { id: 5, texto: '¿El trabajo requiere que escondas tus emociones?' },
    { id: 6, texto: '¿Tu trabajo requiere que tomes decisiones difíciles?' },
    { id: 7, texto: '¿Tienes influencia sobre la cantidad de trabajo que se te asigna?' },
    { id: 8, texto: '¿Tienes influencia sobre el orden en que realizas las tareas?' },
    { id: 9, texto: '¿Puedes decidir cuándo haces un descanso?' },
    { id: 10, texto: '¿Tienes influencia en las decisiones que afectan a tu trabajo?' },
    { id: 11, texto: '¿Tu trabajo te permite aprender cosas nuevas?' },
    { id: 12, texto: '¿Tu trabajo requiere mucha creatividad?' },
    { id: 13, texto: '¿Tu trabajo requiere mucha concentración?' },
    { id: 14, texto: '¿Sientes que tu trabajo es importante?' },
    { id: 15, texto: '¿Sientes que tu trabajo tiene sentido?' },
    { id: 16, texto: '¿Te sientes comprometido con tu trabajo?' },
    { id: 17, texto: '¿Estás preocupado por si te despiden o no te renuevan el contrato?' },
    { id: 18, texto: '¿Estás preocupado por si te cambian de tareas contra tu voluntad?' },
    { id: 19, texto: '¿Estás preocupado por si te cambian el horario contra tu voluntad?' },
    { id: 20, texto: '¿Estás preocupado por si te bajan el sueldo?' },
    { id: 21, texto: '¿Recibes ayuda y apoyo de tus compañeros?' },
    { id: 22, texto: '¿Recibes ayuda y apoyo de tus superiores?' },
    { id: 23, texto: '¿Tus superiores planifican bien el trabajo?' },
    { id: 24, texto: '¿Tus superiores se comunican bien contigo?' },
    { id: 25, texto: '¿Tus compañeros te ayudan a realizar el trabajo?' },
    { id: 26, texto: '¿Hay buen ambiente entre compañeros?' },
    { id: 27, texto: '¿Sientes que formas parte de un grupo?' },
    { id: 28, texto: '¿Tus superiores resuelven bien los conflictos?' },
    { id: 29, texto: '¿Sientes que te tratan justamente?' },
    { id: 30, texto: '¿Tu trabajo requiere atención constante?' },

    // --- PREGUNTA 31 ESPECIAL ---
    {
      id: 31,
      texto: '¿Qué parte del trabajo familiar y doméstico haces tú?',
      opcionesEspecificas: this.opcionesQ31 
    },

    { id: 32, texto: '¿Cuando estás en el trabajo, piensas en las tareas domésticas y familiares?' },
    { id: 33, texto: '¿Hay momentos en los que necesitarías estar en casa y en el trabajo a la vez?' },
    { id: 34, texto: '¿Las tareas domésticas y familiares te dejan sin energía para el trabajo?' },
    { id: 35, texto: '¿El trabajo te deja sin energía para las tareas domésticas y familiares?' },
    { id: 36, texto: '¿Sientes que tu trabajo es reconocido y valorado?' },
    { id: 37, texto: '¿Recibes el apoyo que necesitas en situaciones difíciles?' },
    { id: 38, texto: '¿Tus superiores te dan el reconocimiento que mereces?' }
  ];

  constructor(private sheetService: GoogleSheetsService) {}

  enviar() {
    // 1. VALIDAR DATOS GENERALES
    if (!this.modelo.empresa || !this.modelo.puesto || !this.modelo.edad || !this.modelo.sexo) {
      alert('⚠️ Faltan datos generales. Por favor completa Empresa, Puesto, Edad y Sexo.');
      this.scrollToId('card-datos');
      return;
    }

    // 2. VALIDAR PREGUNTAS
    for (let preg of this.preguntas) {
      const key = 'p' + preg.id;
      const respuesta = this.modelo[key];
      
      if (respuesta === undefined || respuesta === null) {
        alert(`⚠️ Falta responder la pregunta número ${preg.id}`);
        this.scrollToId('preg-' + preg.id);
        return;
      }
    }

    // 3. ENVIAR DATOS
    this.enviando = true;
    this.sheetService.submitData(this.modelo).subscribe({
      // CORRECCIÓN 3: Añadimos ': any' para evitar el error TS7006
      next: (res: any) => {
        this.enviando = false;
        alert('✅ ¡Evaluación anónima enviada con éxito! Gracias por tu participación.');
        window.location.reload();
      },
      error: (err: any) => {
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