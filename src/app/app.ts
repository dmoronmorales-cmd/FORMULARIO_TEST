import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from './google-sheets';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  enviando = false;

  // Modelo de datos
  modelo: any = { 
    empresa: '', 
    puesto: '', // O 'nombre'/'dni' si decidiste mantener los campos anteriores
    sexo: 'Masculino', 
    edad: null 
  };

  // --- 1. OPCIONES DE RESPUESTA ---

  // Escala ESTÁNDAR (Siempre = 4 ... Nunca = 0)
  // Usada en la mayoría de preguntas (Exigencias, Trabajo Activo, etc.)
  opcionesEstandar = [
    { texto: 'Siempre', valor: 4 },
    { texto: 'Muchas veces', valor: 3 },
    { texto: 'Algunas veces', valor: 2 },
    { texto: 'Solo alguna vez', valor: 1 },
    { texto: 'Nunca', valor: 0 }
  ];

  // Escala INVERTIDA (Siempre = 0 ... Nunca = 4)
  // Específica para preguntas 3, 27 y 37 
  opcionesInvertidas = [
    { texto: 'Siempre', valor: 0 },
    { texto: 'Muchas veces', valor: 1 },
    { texto: 'Algunas veces', valor: 2 },
    { texto: 'Solo alguna vez', valor: 3 },
    { texto: 'Nunca', valor: 4 }
  ];

  // Escala PREOCUPACIÓN (Muy preocupado = 4 ... Nada = 0)
  // Específica para preguntas 17, 18, 19, 20 
  opcionesPreocupacion = [
    { texto: 'Muy preocupado', valor: 4 },
    { texto: 'Bastante preocupado', valor: 3 },
    { texto: 'Más o menos preocupado', valor: 2 },
    { texto: 'Poco preocupado', valor: 1 },
    { texto: 'Nada preocupado', valor: 0 }
  ];

  // Escala TAREAS DOMÉSTICAS (Pregunta 31) [cite: 14]
  opcionesDomesticas = [
    { texto: 'Soy la/el principal responsable y hago la mayor parte', valor: 4 },
    { texto: 'Hago aproximadamente la mitad de las tareas', valor: 3 },
    { texto: 'Hago más o menos una cuarta parte', valor: 2 },
    { texto: 'Sólo hago tareas muy puntuales', valor: 1 },
    { texto: 'No hago ninguna o casi ninguna', valor: 0 }
  ];

  // --- 2. LISTA DE PREGUNTAS CON SU CONFIGURACIÓN ---
  preguntas: any[] = [
    // APARTADO 1: Exigencias [cite: 7]
    { id: 1, texto: '¿Tienes que trabajar muy rápido?', opts: this.opcionesEstandar },
    { id: 2, texto: '¿La distribución de tareas es irregular y provoca que se te acumule el trabajo?', opts: this.opcionesEstandar },
    { id: 3, texto: '¿Tienes tiempo de llevar al día tu trabajo?', opts: this.opcionesInvertidas }, // INVERTIDA [cite: 7]
    { id: 4, texto: '¿Te cuesta olvidar los problemas del trabajo?', opts: this.opcionesEstandar },
    { id: 5, texto: '¿Tu trabajo, en general, es desgastador emocionalmente?', opts: this.opcionesEstandar },
    { id: 6, texto: '¿Tu trabajo requiere que escondas tus emociones?', opts: this.opcionesEstandar },

    // APARTADO 2: Trabajo Activo y Desarrollo [cite: 7]
    { id: 7, texto: '¿Tienes influencia sobre la cantidad de trabajo que se te asigna?', opts: this.opcionesEstandar },
    { id: 8, texto: '¿Se tiene en cuenta tu opinión cuando se te asignan tareas?', opts: this.opcionesEstandar },
    { id: 9, texto: '¿Tienes influencia sobre el orden en el que realizas las tareas?', opts: this.opcionesEstandar },
    { id: 10, texto: '¿Puedes decidir cuándo haces un descanso?', opts: this.opcionesEstandar },
    { id: 11, texto: 'Si tienes algún asunto personal ¿puedes dejar tu puesto de trabajo al menos una hora sin tener que pedir un permiso especial?', opts: this.opcionesEstandar },
    { id: 12, texto: '¿Tu trabajo requiere que tengas iniciativa?', opts: this.opcionesEstandar },
    { id: 13, texto: '¿Tu trabajo permite que aprendas cosas nuevas?', opts: this.opcionesEstandar },
    { id: 14, texto: '¿Te sientes comprometido con tu profesión?', opts: this.opcionesEstandar },
    { id: 15, texto: '¿Tienen sentido tus tareas?', opts: this.opcionesEstandar },
    { id: 16, texto: '¿Hablas con entusiasmo de tu empresa a otras personas?', opts: this.opcionesEstandar },

    // APARTADO 3: Inseguridad (Opciones de Preocupación) 
    { id: 17, texto: '¿Estás preocupado por lo difícil que sería encontrar otro trabajo en el caso de que te quedaras sin empleo?', opts: this.opcionesPreocupacion },
    { id: 18, texto: '¿Estás preocupado por si te cambian de tareas contra tu voluntad?', opts: this.opcionesPreocupacion },
    { id: 19, texto: '¿Estás preocupado por si te cambian el horario (turno, días de la semana, hora de entrada y salida) contra tu voluntad?', opts: this.opcionesPreocupacion },
    { id: 20, texto: '¿Estás preocupado por si te varían el salario (que no te lo actualicen, que te lo bajen, que introduzcan el salario variable, etc.)?', opts: this.opcionesPreocupacion },

    // APARTADO 4: Apoyo Social y Calidad de Liderazgo [cite: 13]
    { id: 21, texto: '¿Sabes exactamente qué margen de autonomía tienes en tu trabajo?', opts: this.opcionesEstandar },
    { id: 22, texto: '¿Sabes exactamente qué tareas son de tu responsabilidad?', opts: this.opcionesEstandar },
    { id: 23, texto: '¿En esta empresa se te informa con suficiente anticipación de los cambios que pueden afectar tu futuro?', opts: this.opcionesEstandar },
    { id: 24, texto: '¿Recibes toda la información que necesitas para realizar bien tu trabajo?', opts: this.opcionesEstandar },
    { id: 25, texto: '¿Recibes ayuda y apoyo de tus compañeras o compañeros?', opts: this.opcionesEstandar },
    { id: 26, texto: '¿Recibes ayuda y apoyo de tu inmediato o inmediata superior?', opts: this.opcionesEstandar },
    { id: 27, texto: '¿Tu puesto de trabajo se encuentra aislado del de tus compañeros/as?', opts: this.opcionesInvertidas }, // INVERTIDA [cite: 13]
    { id: 28, texto: 'En el trabajo, ¿sientes que formas parte de un grupo?', opts: this.opcionesEstandar },
    { id: 29, texto: '¿Tus actuales jefes inmediatos planifican bien el trabajo?', opts: this.opcionesEstandar },
    { id: 30, texto: '¿Tus actuales jefes inmediatos se comunican bien con los trabajadores y trabajadoras?', opts: this.opcionesEstandar },

    // APARTADO 5: Doble Presencia [cite: 14]
    { id: 31, texto: '¿Qué parte del trabajo familiar y doméstico haces tú?', opts: this.opcionesDomesticas },
    { id: 32, texto: 'Si faltas algún día de casa, ¿las tareas domésticas que realizas se quedan sin hacer?', opts: this.opcionesEstandar },
    { id: 33, texto: 'Cuando estás en la empresa ¿piensas en las tareas domésticas y familiares?', opts: this.opcionesEstandar },
    { id: 34, texto: '¿Hay momentos en los que necesitarías estar en la empresa y en casa a la vez?', opts: this.opcionesEstandar },

    // APARTADO 6: Estima [cite: 55]
    { id: 35, texto: 'Mis superiores me dan el reconocimiento que merezco', opts: this.opcionesEstandar },
    { id: 36, texto: 'En las situaciones difíciles en el trabajo recibo el apoyo necesario', opts: this.opcionesEstandar },
    { id: 37, texto: 'En mi trabajo me tratan injustamente', opts: this.opcionesInvertidas }, // INVERTIDA [cite: 70]
    { id: 38, texto: 'Si pienso en todo el trabajo y esfuerzo que he realizado, ¿el reconocimiento que recibo me parece adecuado?', opts: this.opcionesEstandar }
  ];

  constructor(private sheetService: GoogleSheetsService) {}

  enviar() {
    // 1. VALIDAR DATOS GENERALES
    if (!this.modelo.empresa || !this.modelo.edad || !this.modelo.sexo) {
      alert('⚠️ Faltan datos generales. Por favor completa todos los campos.');
      this.scrollToId('card-datos');
      return;
    }

    // 2. VALIDAR PREGUNTAS
    for (let preg of this.preguntas) {
      const key = 'p' + preg.id;
      const respuesta = this.modelo[key];
      
      // El 0 es una respuesta válida, por eso verificamos undefined o null
      if (respuesta === undefined || respuesta === null) {
        alert(`⚠️ Falta responder la pregunta número ${preg.id}`);
        this.scrollToId('preg-' + preg.id);
        return;
      }
    }

    // 3. ENVIAR DATOS
    this.enviando = true;
    this.sheetService.submitData(this.modelo).subscribe({
      next: (res: any) => {
        this.enviando = false;
        alert('✅ ¡Evaluación enviada con éxito! Gracias por tu participación.');
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