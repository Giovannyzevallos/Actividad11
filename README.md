Gestión de Tareas – Prototipo Frontend Accesible
Este proyecto es un prototipo de aplicación web de gestión de tareas, desarrollado con foco en accesibilidad web y diseño responsivo, cumpliendo con las Pautas WCAG 2.2 (Nivel AA).

🔗 **Demo en vivo:**  
👉 [https://giovannyzevallos.github.io/Actividad11/](https://giovannyzevallos.github.io/Actividad11/)

---

## 🚀 ¿Qué es?

Gestión de Tareas es una **aplicación frontend** que te ayuda a:
- Registrar tareas con materia, descripción y fecha de entrega.
- Recibir **alertas automáticas** días antes de que una tarea venza.
- Marcar tareas como completadas.
- Eliminar o editar tareas fácilmente.
- Usar el sistema en modo claro u oscuro, según tu preferencia.

Ideal para estudiantes, profesionales o cualquier persona que necesite **organizarse sin complicaciones**.

---

## 🔔 Funcionalidades clave

- ✅ **Alertas inteligentes**:  
  Aparecen en el ícono de notificaciones cuando una tarea:
  - Está por vencer (hasta 10 días antes).
  - Ya venció.
- ✅ **Notificaciones se limpian al verlas**:  
  El badge rojo desaparece al abrir el modal de notificaciones.
- ✅ **Tareas por usuario**:  
  Cada usuario ve solo sus tareas (almacenadas localmente por email).
- ✅ **Modo oscuro persistente**:  
  Se recuerda la preferencia del usuario.
- ✅ **Diseño responsivo**:  
  Funciona perfectamente en móvil, tablet y escritorio.
- ✅ **Navegación con teclado y accesibilidad**:  
  Cumple con buenas prácticas WCAG 2.2 (etiquetas semánticas, contraste, foco visible).

---

## 🛠 Tecnologías utilizadas

| Tecnología | Uso |
|----------|-----|
| **HTML5** | Estructura semántica y accesible |
| **CSS3** | Estilos personalizados y modo oscuro |
| **JavaScript (Vanilla)** | Lógica de tareas, alertas, validaciones y almacenamiento |
| **Bootstrap 5** | Diseño responsivo, componentes y maquetación |
| **LocalStorage** | Guardado de tareas y preferencias por usuario |

---

## 📂 Estructura del proyecto

├── index.html → Inicio de sesión
├── dashboard.html → Panel de tareas
├── add-task.html → Formulario para agregar tareas
├── style.css → Estilos personalizados
└── script.js → Lógica principal (opcional, si separas JS)

---

## 📱 Cómo usarlo

1. **Inicia sesión** con un correo (simulado, no requiere registro real).
2. En el **dashboard**, verás tus tareas y podrás:
   - Agregar nuevas tareas.
   - Editar, eliminar o marcar como completadas.
   - Ver alertas en el ícono 🔔.
3. Las **notificaciones** aparecen cuando:
   - Una tarea vence en 10 días o menos.
   - Una tarea ya venció.
4. Al **completar una tarea**, esta ya no generará alertas.

---

## 🌐 Despliegue

El proyecto está publicado en **GitHub Pages**:
- ✅ Acceso público y gratuito.
- ✅ Actualizaciones automáticas al subir cambios.
- ✅ Sin necesidad de servidor backend.

---

## 🎯 Próximos pasos (ideas)

- [ ] Añadir autenticación real.
- [ ] Sincronizar tareas con la nube.
- [ ] Soporte para recordatorios por correo.
- [ ] Calendario integrado.

---

Creado con ❤️ para ayudarte a mantener el control de tus tareas.
