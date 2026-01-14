import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from './google-sheets'; // Ajusta si tu archivo se llama diferente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  enviando = false;
  // Iniciamos modelo vacío
  modelo: any = { empresa: '', nombre: '', dni: '', sexo: 'Masculino', edad: null};

  opciones = [
    { texto: 'Siempre', valor: 4 },
    { texto: 'Muchas veces', valor: 3 },
    { texto: 'Algunas veces', valor: 2 },
    { texto: 'Solo alguna vez', valor: 1 },
    { texto: 'Nunca', valor: 0 }
  ];

  // (Asegúrate de tener aquí tu lista de 38 preguntas completa)
  preguntas = [
    // ... TUS 38 PREGUNTAS QUE YA COPIASTE ANTES ...
    // Voy a poner las primeras 3 de ejemplo para que no se borren tus datos si copias esto, 
    // PERO MANTÉN TU LISTA COMPLETA.
    { id: 1, texto: '¿Tienes que trabajar muy rápido?' },
    { id: 2, texto: '¿La distribución de tareas es irregular y provoca que se te acumule el trabajo?' },
    { id: 3, texto: '¿Tienes tiempo de llevar al día tu trabajo?' },
    { id: 4, texto: '¿Te cuesta olvidar los problemas del trabajo?' },
    { id: 5, texto: '¿Tu trabajo, en general, es desgastador emocionalmente?' },
    { id: 6, texto: '¿Tu trabajo requiere que escondas tus emociones?' },

    // --- Trabajo Activo y Desarrollo ---
    { id: 7, texto: '¿Tienes influencia sobre la cantidad de trabajo que se te asigna?' },
    { id: 8, texto: '¿Se tiene en cuenta tu opinión cuando se te asignan tareas?' },
    { id: 9, texto: '¿Tienes influencia sobre el orden en el que realizas las tareas?' },
    { id: 10, texto: '¿Puedes decidir cuándo haces un descanso?' },
    { id: 11, texto: 'Si tienes algún asunto personal, ¿puedes dejar tu puesto al menos una hora sin permiso especial?' },
    { id: 12, texto: '¿Tu trabajo requiere que tengas iniciativa?' },
    { id: 13, texto: '¿Tu trabajo permite que aprendas cosas nuevas?' },
    { id: 14, texto: '¿Te sientes comprometido con tu profesión?' },
    { id: 15, texto: '¿Tienen sentido tus tareas?' },
    { id: 16, texto: '¿Hablas con entusiasmo de tu empresa a otras personas?' },

    // --- Inseguridad ---
    { id: 17, texto: '¿Estás preocupado por lo difícil que sería encontrar otro trabajo si te quedaras sin empleo?' },
    { id: 18, texto: '¿Estás preocupado por si te cambian de tareas contra tu voluntad?' },
    { id: 19, texto: '¿Estás preocupado por si te cambian el horario contra tu voluntad?' },
    { id: 20, texto: '¿Estás preocupado por si te varían el salario?' },

    // --- Apoyo Social y Liderazgo ---
    { id: 21, texto: '¿Sabes exactamente qué margen de autonomía tienes en tu trabajo?' },
    { id: 22, texto: '¿Sabes exactamente qué tareas son de tu responsabilidad?' },
    { id: 23, texto: '¿Se te informa con suficiente anticipación de los cambios que pueden afectar tu futuro?' },
    { id: 24, texto: '¿Recibes toda la información que necesitas para realizar bien tu trabajo?' },
    { id: 25, texto: '¿Recibes ayuda y apoyo de tus compañeras o compañeros?' },
    { id: 26, texto: '¿Recibes ayuda y apoyo de tu jefe inmediato superior?' },
    { id: 27, texto: '¿Tu puesto de trabajo se encuentra aislado del de tus compañeros/as?' },
    { id: 28, texto: 'En el trabajo, ¿sientes que formas parte de un grupo?' },
    { id: 29, texto: '¿Tus actuales jefes inmediatos planifican bien el trabajo?' },
    { id: 30, texto: '¿Tus actuales jefes inmediatos se comunican bien con los trabajadores?' },

    // --- Doble Presencia ---
    { id: 31, texto: '¿Qué parte del trabajo familiar y doméstico haces tú?' }, // Nota: Esta pregunta tiene opciones especiales en el original, pero usaremos la escala 0-4 para simplificar el cálculo automático estándar.
    { id: 32, texto: 'Si faltas algún día de casa, ¿las tareas domésticas que realizas se quedan sin hacer?' },
    { id: 33, texto: 'Cuando estás en la empresa, ¿piensas en las tareas domésticas y familiares?' },
    { id: 34, texto: '¿Hay momentos en los que necesitarías estar en la empresa y en casa a la vez?' },

    // --- Estima ---
    { id: 35, texto: 'Mis superiores me dan el reconocimiento que merezco' },
    { id: 36, texto: 'En las situaciones difíciles en el trabajo recibo el apoyo necesario' },
    { id: 37, texto: 'En mi trabajo me tratan injustamente' },
    { id: 38, texto: 'Si pienso en el esfuerzo realizado, ¿el reconocimiento que recibo me parece adecuado?' },
    // ... pega el resto aquí ...
  ];

  constructor(private sheetService: GoogleSheetsService) {}

  enviar() {
    // 1. VALIDAR DATOS PERSONALES
    if (!this.modelo.empresa || !this.modelo.nombre || !this.modelo.dni || !this.modelo.edad || !this.modelo.sexo) {
    alert('⚠️ Faltan datos generales. Por favor completa todos los campos obligatorios (*).');
    this.scrollToId('card-datos');
    return;
  }

    // 2. VALIDAR PREGUNTAS (Bucle de seguridad)
    for (let preg of this.preguntas) {
      const key = 'p' + preg.id;
      const respuesta = this.modelo[key];

      // Verificamos si es undefined o null. (El 0 cuenta como respuesta válida "Nunca")
      if (respuesta === undefined || respuesta === null) {
        alert(`⚠️ Falta responder la pregunta número ${preg.id}`);
        
        // Hacemos scroll automático hacia la tarjeta que falta
        this.scrollToId('preg-' + preg.id);
        return; // Detenemos el envío
      }
    }

    // 3. SI TODO ESTÁ BIEN, ENVIAMOS
    this.enviando = true;
    this.sheetService.submitData(this.modelo).subscribe({
      next: (res) => {
        this.enviando = false; // Liberamos botón
        alert('✅ ¡Evaluación guardada con éxito! Gracias por tu tiempo.');
        window.location.reload(); // Recargamos para limpiar
      },
      error: (err) => {
        console.error(err);
        this.enviando = false;
        alert('❌ Error de conexión. Intenta nuevamente.');
      }
    });
  }

  // Función auxiliar para mover la pantalla
  scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}