import { questionConceptLookup } from "./question-bank.js";

const UI_TRANSLATIONS = {
  "Dashboard": "Panel",
  "Practice": "Práctica",
  "Flashcards": "Tarjetas",
  "Mock Exams": "Exámenes simulados",
  "AI Tutor": "Tutor IA",
  "Analytics": "Analíticas",
  "Pricing": "Precios",
  "Members": "Miembros",
  "Learning": "Aprendizaje",
  "Admin": "Admin",
  "Free Plan": "Plan Gratis",
  "Premium Monthly": "Premium Mensual",
  "Premium Yearly": "Premium Anual",
  "Profile": "Perfil",
  "Manage Plan": "Gestionar plan",
  "Upgrade to Premium": "Mejorar a Premium",
  "Sign Out": "Cerrar sesión",
  "Student": "Estudiante",
  "Question Navigator": "Navegador de preguntas",
  "Jump to any question and review your flagged or unanswered items.": "Salta a cualquier pregunta y revisa tus preguntas marcadas o sin responder.",
  "Total": "Total",
  "Answered": "Respondidas",
  "Flagged": "Marcadas",
  "All": "Todas",
  "Incorrect": "Incorrectas",
  "Unanswered": "Sin responder",
  "Submit Answer": "Enviar respuesta",
  "Explanation": "Explicación",
  "Pattern": "Patrón",
  "Clue": "Pista",
  "Common Trap": "Trampa común",
  "Ethics": "Ética",
  "Flag": "Marcar",
  "Flagged": "Marcada",
  "Question": "Pregunta",
  "Loading flashcards...": "Cargando tarjetas...",
  "Flashcards Game 🎴": "Tarjetas 🎴",
  "Shuffle": "Mezclar",
  "Reset": "Reiniciar",
  "Total Cards": "Tarjetas totales",
  "Mastered": "Dominadas",
  "Current Session": "Sesión actual",
  "Need Review": "Repasar",
  "Overall Progress": "Progreso general",
  "Go Premium": "Hazte Premium",
  "Filters:": "Filtros:",
  "Topic": "Tema",
  "All Topics": "Todos los temas",
  "Difficulty": "Dificultad",
  "Beginner": "Principiante",
  "Intermediate": "Intermedio",
  "Advanced": "Avanzado",
  "Click to view the answer": "Haz clic para ver la respuesta",
  "Correct Answer": "Respuesta correcta",
  "Need Review": "Repasar",
  "Mastered!": "Dominada",
  "Mock RBT Exam": "Examen simulado RBT",
  "Simulate the real BACB RBT certification exam.": "Simula la experiencia del examen de certificación RBT de BACB.",
  "Questions": "Preguntas",
  "Time Limit": "Límite de tiempo",
  "Pass Score": "Puntaje de aprobación",
  "Exam Instructions": "Instrucciones del examen",
  "Begin Mock Exam": "Empezar examen simulado",
  "New Chat": "Nuevo chat",
  "No conversations yet": "Aún no hay conversaciones",
  "Chat": "Chat",
  "Genius AI Tutor": "Tutor IA Genius",
  "Your personal ABA and RBT exam coach": "Tu coach personal para ABA y el examen RBT",
  "Hello! I'm your AI Tutor": "Hola, soy tu Tutor IA",
  "Ask about ABA concepts, exam strategy, wrong answers, or ask me to quiz you. You can also paste a question and I will help break it down.": "Pregunta sobre conceptos ABA, estrategia de examen, respuestas incorrectas o pídeme que te haga un quiz. También puedes pegar una pregunta y te ayudo a desglosarla.",
  "Ask about ABA concepts, exam tips...": "Pregunta sobre conceptos ABA, tips de examen...",
  "Tip: paste a full question with answer choices if you want a clearer explanation.": "Tip: pega la pregunta completa con opciones si quieres una explicación más clara.",
  "Unable to start a chat": "No se pudo iniciar el chat",
  "Please try again.": "Inténtalo de nuevo.",
  "Unable to send message": "No se pudo enviar el mensaje",
  "Daily AI tutor limit reached": "Límite diario del tutor IA alcanzado",
  "Free accounts include 5 AI tutor messages per day.": "Las cuentas gratis incluyen 5 mensajes diarios con el tutor IA.",
  "Practice Questions": "Preguntas de práctica",
  "Choose your topic and difficulty to start practicing.": "Elige tu tema y dificultad para empezar a practicar.",
  "Choose your topic and difficulty, then start a focused session from the shared question bank.": "Elige tema y dificultad y empieza una sesión enfocada desde el banco compartido.",
  "Start Practice Session": "Empezar sesión de práctica",
  "All Levels": "Todos los niveles",
  "Next Question": "Siguiente pregunta",
  "No questions available for this filter.": "No hay preguntas disponibles para este filtro.",
  "Change Filters": "Cambiar filtros",
  "Session Complete!": "¡Sesión completada!",
  "flagged": "marcadas",
  "incorrect": "incorrectas",
  "New Session": "Nueva sesión",
  "Retry Same Questions": "Reintentar las mismas preguntas",
  "No questions match the current review filter.": "Ninguna pregunta coincide con el filtro de revisión actual.",
  "Try switching back to all questions or another review state.": "Prueba volver a todas las preguntas o cambiar el estado de revisión.",
  "Show All": "Mostrar todas",
  "Open Navigator": "Abrir navegador",
  "This Session": "Esta sesión",
  "Session-only stats. Your dashboard tracks the bigger picture separately.": "Estas estadísticas son solo de esta sesión. Tu dashboard lleva el progreso general.",
  "session accuracy": "de precisión de la sesión",
  "answered this session": "respondidas en esta sesión",
  "flagged for review": "marcadas para revisar",
  "Navigator": "Navegador",
  "End Session": "Terminar sesión",
  "You reached today's free practice limit. You can keep reviewing these questions, or upgrade for unlimited answers.": "Llegaste al límite gratuito de práctica de hoy. Puedes seguir revisando estas preguntas o mejorar para respuestas ilimitadas.",
  "Free practice limit reached": "Límite gratuito de práctica alcanzado",
  "Premium gives you unlimited practice, full mock exams, and complete analytics.": "Premium te da práctica ilimitada, exámenes simulados completos y analíticas completas.",
  "Keep Reviewing": "Seguir repasando",
  "Topic and pattern": "Tema y patrón",
  "Difficulty mix": "Nivel de dificultad",
  "Shared official-style bank": "Banco compartido estilo oficial",
  "Free flashcards: 15 cards per session": "Tarjetas gratis: 15 por sesión",
  "Upgrade to Premium to unlock the full flashcard bank and keep reviewing without session limits.": "Mejora a Premium para desbloquear el banco completo de tarjetas y seguir repasando sin límites.",
  "Review the same shared RBT bank in memorization mode, with pattern clues and common traps.": "Repasa el mismo banco compartido de RBT en modo memorización, con pistas de patrón y trampas comunes.",
  "Card": "Tarjeta",
  "Built for RBT exam prep": "Hecho para preparar el examen RBT",
  "Study with structure, not guesswork.": "Estudia con estructura, no a ciegas.",
  "RBT Genius helps future technicians practice consistently, review with flashcards, use the AI tutor, take realistic mock exams, and track progress across exam prep.": "RBT Genius ayuda a futuros técnicos a practicar con constancia, repasar con tarjetas, usar el tutor IA, hacer exámenes simulados realistas y seguir su progreso durante la preparación del examen.",
  "Full 85-question timed mock exams": "Exámenes simulados cronometrados de 85 preguntas",
  "Saved exam history and score trends": "Historial guardado de exámenes y tendencias de puntaje",
  "Domain breakdown after each completed exam": "Desglose por dominio después de cada examen completado",
  "Answer all questions within the time limit": "Responde todas las preguntas dentro del tiempo límite",
  "You can navigate between questions freely": "Puedes navegar entre preguntas libremente",
  "Results are shown after submission": "Los resultados se muestran después de enviar",
  "Congratulations!": "¡Felicidades!",
  "Keep Practicing": "Sigue practicando",
  "You passed the mock exam!": "¡Aprobaste el examen simulado!",
  "You need more preparation.": "Necesitas más preparación.",
  "Domain Breakdown": "Desglose por dominio",
  "Back to Exams": "Volver a exámenes",
  "Retake Exam": "Repetir examen",
  "Finish Exam": "Finalizar examen",
  "Previous": "Anterior",
  "Next": "Siguiente",
  "Thinking...": "Pensando...",
  "Upgrade to Premium for more tutor messages today": "Mejora a Premium para más mensajes del tutor hoy",
  "Free accounts can send 5 AI tutor messages per day. Upgrade to continue today.": "Las cuentas gratis pueden enviar 5 mensajes al tutor IA por día. Mejora para continuar hoy.",
  "Premium unlocks unlimited answers across the curated 600-question official-style bank.": "Premium desbloquea respuestas ilimitadas en el banco curado de 600 preguntas con estilo oficial.",
  "Free accounts can answer 15 practice questions per day across the curated 600-question official-style bank.": "Las cuentas gratis pueden responder 15 preguntas de práctica por día dentro del banco curado de 600 preguntas con estilo oficial.",
  "Learn the type of exam move the question is testing, not just the answer.": "Aprende qué patrón del examen está evaluando la pregunta, no solo la respuesta.",
  "Train your eye to spot the single detail that points to the correct concept.": "Entrena tu ojo para detectar el detalle que apunta al concepto correcto.",
  "See the distractor the exam wants you to pick, and why it is wrong.": "Identifica el distractor que el examen quiere que elijas y entiende por qué está mal.",
  "Go to Dashboard": "Ir al panel",
  "Log In": "Iniciar sesión",
  "Support email": "Correo de soporte",
  "What to include": "Qué incluir",
  "Topics we can help with": "Temas con los que podemos ayudarte",
  "Contact": "Contacto",
  "Terms of Service": "Términos del servicio",
  "Privacy Policy": "Política de privacidad",
  "Refund Policy": "Política de reembolsos",
  "Practical exam prep for future Registered Behavior Technicians.": "Preparación práctica para el examen de futuros Registered Behavior Technicians.",
  "Plans and Access": "Planes y acceso",
  "Back to Dashboard": "Volver al panel",
  "Back to Home": "Volver al inicio",
  "Pick the level of support that fits your study pace.": "Elige el nivel de apoyo que se ajusta a tu ritmo de estudio.",
  "Current": "Actual",
  "Current Plan": "Plan actual",
  "Manage Billing": "Gestionar facturación",
  "Guest vs Free vs Premium": "Invitado vs Gratis vs Premium",
  "Feature": "Función",
  "Guest": "Invitado",
  "Premium": "Premium",
  "Stripe setup pending": "Configuración de Stripe pendiente",
  "Create Free Account": "Crear cuenta gratis",
  "Keep Free Plan": "Mantener plan gratis",
  "Log In to Upgrade": "Inicia sesión para mejorar",
  "Upgrade Monthly": "Mejorar mensual",
  "Upgrade Yearly": "Mejorar anual",
  "Your current billing plan.": "Tu plan de facturación actual.",
  "Switch plans anytime from billing.": "Cambia de plan cuando quieras desde facturación.",
  "Analytics": "Analíticas",
  "Review patterns across your attempts, domains, and mock exams.": "Revisa patrones en tus intentos, dominios y exámenes simulados.",
  "Study Hours": "Horas de estudio",
  "Total tracked": "Total registradas",
  "Readiness": "Preparación",
  "Coverage": "Cobertura",
  "Domain Coverage": "Cobertura por dominio",
  "Questions by Topic": "Preguntas por tema",
  "Mock Exam Score Trend": "Tendencia de puntaje en simulados",
  "Loading...": "Cargando...",
  "Questions Answered": "Preguntas respondidas",
  "Across the full question bank": "En todo el banco de preguntas",
  "Bank Accuracy": "Precisión del banco",
  "Study Streak": "Racha de estudio",
  "Domain Performance": "Rendimiento por dominio",
  "Exam Readiness": "Preparación para el examen",
  "Quick Actions": "Acciones rápidas",
  "Mock Exam Signal": "Señal de examen simulado",
  "Badges Earned": "Insignias obtenidas",
  "Your Progress": "Tu progreso",
  "Start Practicing": "Empezar a practicar",
  "Practice Questions": "Preguntas de práctica",
  "Mock Exam": "Examen simulado",
  "Get instant help": "Obtén ayuda al instante",
  "Test your knowledge": "Pon a prueba tus conocimientos",
  "Simulate the real test": "Simula el examen real",
  "RBT Genius": "RBT Genius",
  "Welcome back,": "Bienvenido de nuevo,",
  "Start your streak": "Empieza tu racha",
  "First day in progress": "Primer día en progreso",
  "No streak yet": "Sin racha todavía",
  "Started today": "Empezaste hoy",
  "Started": "Empezada",
  "Consecutive return days": "Días consecutivos regresando",
  "Come back tomorrow to start your streak": "Vuelve mañana para empezar tu racha",
  "No bank progress yet": "Todavía no hay progreso en el banco",
  "Questions Completed": "Preguntas completadas",
  "Mock Exams Taken": "Exámenes simulados realizados",
  "Average Mock Score": "Puntaje promedio en simulados",
  "Mock Exams Passed": "Simulados aprobados",
  "Current Recommendation": "Recomendación actual",
  "Take a mock exam": "Haz un examen simulado",
  "Ready for the exam": "Listo para el examen",
  "Need more mock practice": "Necesitas más práctica en simulados",
  "Use mock exam results as your strongest exam-readiness signal.": "Usa los resultados de los simulados como tu señal más fuerte de preparación para el examen.",
  "Take your first mock exam to unlock a stronger readiness signal.": "Haz tu primer simulacro para desbloquear una señal de preparación más sólida.",
  "You are performing in a ready-to-test range.": "Estás rindiendo en un rango listo para examinarte.",
  "Keep practicing before scheduling the real exam.": "Sigue practicando antes de programar el examen real.",
  "Your readiness recommendation will improve once you have at least one mock exam.": "Tu recomendación de preparación mejorará cuando tengas al menos un simulacro.",
  "Scores at or above 80% count as a passed mock exam.": "Los puntajes de 80% o más cuentan como simulacro aprobado.",
  "Mock exams matter more than small practice samples for final readiness.": "Los simulacros importan más que muestras pequeñas de práctica para la preparación final.",
  "from last week": "desde la semana pasada",
  "Ready for the Exam": "Listo para el examen",
  "Exam Ready": "Preparado para el examen",
  "Almost There": "Casi listo",
  "Keep Studying": "Sigue estudiando",
  "Early Estimate": "Estimación inicial",
  "Not enough data": "Datos insuficientes",
  "My Profile": "Mi perfil",
  "Manage your account, usage, and membership.": "Gestiona tu cuenta, uso y membresía.",
  "Membership": "Membresía",
  "Payments": "Pagos",
  "Full Name": "Nombre completo",
  "Email": "Correo electrónico",
  "Role": "Rol",
  "Administrator": "Administrador",
  "User": "Usuario",
  "Save Changes": "Guardar cambios",
  "Cancel": "Cancelar",
  "Edit Profile": "Editar perfil",
  "Reset Study Progress": "Restablecer progreso de estudio",
  "Reset Progress": "Restablecer progreso",
  "Current Plan": "Plan actual",
  "Free plan limits": "Límites del plan gratis",
  "Practice today": "Práctica hoy",
  "AI tutor today": "Tutor IA hoy",
  "Premium is active": "Premium está activo",
  "Active": "Activo",
  "Practice access": "Acceso a práctica",
  "Unlimited": "Ilimitado",
  "AI tutor": "Tutor IA",
  "Switch Plan": "Cambiar plan",
  "Payment History": "Historial de pagos",
  "Refresh": "Actualizar",
  "No payments recorded.": "No hay pagos registrados.",
  "Reset your study progress?": "¿Restablecer tu progreso de estudio?",
  "My Profile": "Mi perfil",
  "Profile updated": "Perfil actualizado",
  "Your account details were saved.": "Los datos de tu cuenta fueron guardados.",
  "Unable to update profile": "No se pudo actualizar el perfil",
  "Unable to start checkout": "No se pudo iniciar el checkout",
  "Unable to open billing portal": "No se pudo abrir el portal de facturación",
  "Premium activated": "Premium activado",
  "Unable to confirm checkout": "No se pudo confirmar el checkout",
  "Study progress reset": "Progreso de estudio restablecido",
  "Your study metrics and saved session data were cleared.": "Se borraron tus métricas de estudio y los datos guardados de sesión.",
  "Unable to reset progress": "No se pudo restablecer el progreso",
  "Member Management": "Gestión de miembros",
  "Manage premium access and admin roles for your members.": "Gestiona acceso premium y roles de admin para tus miembros.",
  "Total Members": "Miembros totales",
  "Premium Members": "Miembros premium",
  "Admins": "Admins",
  "Search by name or email": "Buscar por nombre o correo",
  "Filter by plan": "Filtrar por plan",
  "All Plans": "Todos los planes",
  "Loading members...": "Cargando miembros...",
  "No members match the current filters.": "Ningún miembro coincide con los filtros actuales.",
  "Joined": "Se unió",
  "questions completed": "preguntas completadas",
  "day streak": "días de racha",
  "exams": "exámenes",
  "payments": "pagos",
  "paid": "pagado",
  "Unsaved changes": "Cambios sin guardar",
  "Save": "Guardar",
  "Delete": "Eliminar",
  "Delete member account?": "¿Eliminar la cuenta del miembro?",
  "Keep member": "Conservar miembro",
  "Deleting...": "Eliminando...",
  "Delete member": "Eliminar miembro",
  "Payment history": "Historial de pagos",
  "Detailed billing records for the selected member.": "Registros detallados de facturación del miembro seleccionado.",
  "Admin access only": "Solo acceso de admin",
  "This panel is only available to administrator accounts.": "Este panel solo está disponible para cuentas administradoras.",
  "Member deleted": "Miembro eliminado",
  "The account and related study data were removed.": "La cuenta y los datos de estudio relacionados fueron eliminados.",
  "Unable to delete member": "No se pudo eliminar el miembro",
  "Please try again in a moment.": "Inténtalo de nuevo en un momento.",
  "Choose the easiest way to continue and keep your study progress synced.": "Elige la forma más fácil de continuar y mantener tu progreso sincronizado.",
  "Quick sign in": "Acceso rápido",
  "or use email": "o usa correo",
  "Loading sign-in options...": "Cargando opciones de acceso...",
  "Login": "Acceder",
  "Register": "Registrarse",
  "Manual login": "Acceso manual",
  "Manual registration": "Registro manual",
  "Password": "Contraseña",
  "Sign In": "Entrar",
  "Full name": "Nombre completo",
  "Password (min 8 chars)": "Contraseña (mínimo 8 caracteres)",
  "Create Account": "Crear cuenta",
  "Back to app": "Volver a la app",
  "Continue with Google": "Continuar con Google",
  "Continue with Apple": "Continuar con Apple",
  "Continue with GitHub": "Continuar con GitHub",
  "Continue with Microsoft": "Continuar con Microsoft",
  "Unable to complete sign in": "No se pudo completar el acceso",
  "Unable to sign in": "No se pudo iniciar sesión",
  "Unable to create account": "No se pudo crear la cuenta",
};

const TOPIC_TRANSLATIONS = {
  measurement: "Medición",
  assessment: "Evaluación",
  skill_acquisition: "Adquisición de habilidades",
  behavior_reduction: "Reducción de conducta",
  documentation: "Documentación",
  professional_conduct: "Ética",
};

const DIFFICULTY_TRANSLATIONS = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const LONGEST_FIRST_REPLACEMENTS = [
  ["A common trap is choosing an intervention term when the stem is still only gathering information.", "La trampa común es elegir un término de intervención cuando el enunciado todavía solo está recopilando información."],
  ["A frequent trap is choosing frequency when the exam really wants rate or percentage because time or opportunity count matters.", "Una trampa frecuente es elegir frecuencia cuando el examen en realidad quiere tasa o porcentaje, porque importa el conteo por tiempo u oportunidad."],
  ["Do not answer based on whether the consequence feels good or bad. Ask whether something was added or removed and whether behavior increased later.", "No respondas según si la consecuencia parece buena o mala. Pregúntate si se agregó o se retiró algo y si la conducta aumentó después."],
  ["Do not choose language that sounds helpful but adds opinions, guesses, or unnecessary detail not supported by observation.", "No elijas un lenguaje que suene útil pero agregue opiniones, suposiciones o detalles innecesarios que no están respaldados por la observación."],
  ["Do not confuse extinction with punishment. Extinction means the maintaining reinforcer is no longer delivered.", "No confundas extinción con castigo. Extinción significa que el reforzador que mantenía la conducta ya no se entrega."],
  ["Do not confuse graph vocabulary. Trend is direction, level is height, variability is scatter, and immediacy is change right after the phase shift.", "No confundas el vocabulario de las gráficas. La tendencia es la dirección, el nivel es la altura, la variabilidad es la dispersión y la inmediatez es el cambio justo después del cambio de fase."],
  ["Do not confuse the prompt type with the larger strategy for fading prompts and transferring control.", "No confundas el tipo de ayuda con la estrategia más amplia de desvanecer ayudas y transferir el control."],
  ["Do not treat preference and reinforcement as the same thing. Preferred does not always mean reinforcing.", "No trates preferencia y reforzamiento como si fueran lo mismo. Preferido no siempre significa reforzante."],
  ["The common trap is choosing a generic consequence strategy instead of the function-matched procedure in the stem.", "La trampa común es elegir una estrategia de consecuencia genérica en lugar del procedimiento ajustado a la función que aparece en el enunciado."],
  ["The common trap is choosing a related teaching tool instead of the exact procedure described.", "La trampa común es elegir una herramienta de enseñanza relacionada en lugar del procedimiento exacto descrito."],
  ["The common trap is choosing the answer that seems proactive but actually steps outside the RBT role or crosses a boundary.", "La trampa común es elegir la respuesta que parece proactiva pero en realidad se sale del rol del RBT o cruza un límite."],
  ["The common trap is picking a measurement system that sounds close but measures a different dimension of behavior.", "La trampa común es elegir un sistema de medición que suena parecido pero mide una dimensión distinta de la conducta."],
  ["Ask what keeps the RBT within scope, protects dignity or confidentiality, and routes clinical decisions back to supervision when needed.", "Pregúntate qué mantiene al RBT dentro de su alcance, protege la dignidad o la confidencialidad y devuelve las decisiones clínicas a supervisión cuando haga falta."],
  ["Ask what kind of help is being provided and how intrusive it is.", "Pregúntate qué tipo de ayuda se está proporcionando y qué tan intrusiva es."],
  ["Ask whether the question wants a raw count or a count standardized by time or opportunity.", "Pregúntate si la pregunta quiere un conteo bruto o un conteo estandarizado por tiempo u oportunidad."],
  ["Assessment questions usually ask what kind of information the team is trying to gather before changing treatment.", "Las preguntas de evaluación suelen preguntar qué tipo de información intenta reunir el equipo antes de cambiar el tratamiento."],
  ["Behavior reduction questions often hinge on function, replacement behavior, and what consequence is or is not being delivered.", "Las preguntas de reducción de conducta suelen depender de la función, la conducta de reemplazo y qué consecuencia se está o no se está entregando."],
  ["Distinguish between finding what is preferred and proving that it actually functions as reinforcement.", "Distingue entre identificar lo que se prefiere y demostrar que realmente funciona como reforzamiento."],
  ["Look at how reinforcement is delivered: every response, some responses, after time passes, or through tokens and backup reinforcers.", "Observa cómo se entrega el reforzamiento: en cada respuesta, en algunas respuestas, después de que pasa el tiempo o mediante fichas y reforzadores de respaldo."],
  ["Look for how long the behavior lasts. Time length points to duration, not count.", "Busca cuánto dura la conducta. La duración apunta a tiempo, no a conteo."],
  ["Look for interval rules. Any time in the interval, the whole interval, or only at the exact check moment changes the answer.", "Busca las reglas del intervalo. Que ocurra en cualquier momento del intervalo, durante todo el intervalo o solo en el momento exacto de comprobación cambia la respuesta."],
  ["Look for the reinforcer being withheld after the behavior. Extinction is about what consequence no longer follows the behavior.", "Busca que el reforzador se retire después de la conducta. La extinción trata de qué consecuencia ya no sigue a la conducta."],
  ["Look for what information is being gathered: antecedents, consequences, time-of-day patterns, or natural-setting observations.", "Busca qué información se está reuniendo: antecedentes, consecuencias, patrones según la hora del día u observaciones en contextos naturales."],
  ["Look for when the timer starts and stops. Delay to start is latency; time between responses is interresponse time.", "Fíjate en cuándo comienza y se detiene el cronómetro. La demora para iniciar es latencia; el tiempo entre respuestas es tiempo entre respuestas."],
  ["Look for whether the learner is being taught a safer response that serves the same function.", "Busca si al aprendiz se le está enseñando una respuesta más segura que cumpla la misma función."],
  ["Look for whether the learner is being taught a sequence of steps and how much of the chain is practiced.", "Busca si al aprendiz se le está enseñando una secuencia de pasos y qué parte de la cadena se practica."],
  ["Look for whether the note is objective, timely, and limited to relevant facts about behavior, treatment, communication, or safety.", "Busca si la nota es objetiva, oportuna y limitada a hechos relevantes sobre conducta, tratamiento, comunicación o seguridad."],
  ["Measurement questions usually hinge on exactly what is being observed: count, time, interval, product, or graph feature.", "Las preguntas de medición suelen depender exactamente de qué se está observando: conteo, tiempo, intervalo, producto o rasgo de la gráfica."],
  ["Skill acquisition questions usually turn on what teaching procedure is being used to build independent responding.", "Las preguntas de adquisición de habilidades suelen girar en torno a qué procedimiento de enseñanza se usa para construir respuestas independientes."],
  ["Which concept is being described as", "¿Qué concepto se describe como"],
  ["Which concept is the best match?", "¿Qué concepto encaja mejor?"],
  ["What is the main goal of", "¿Cuál es el objetivo principal de"],
  ["The main goal is", "El objetivo principal es"],
  ["Definition match", "Coincidencia de definición"],
  ["Goal discrimination", "Discriminación del objetivo"],
  ["Scenario clue", "Pista del escenario"],
  ["Measurement purpose", "Objetivo de medición"],
  ["Measurement discrimination", "Discriminación de medición"],
  ["Assessment goal", "Objetivo de evaluación"],
  ["Assessment evidence", "Evidencia de evaluación"],
  ["Teaching objective", "Objetivo de enseñanza"],
  ["Teaching procedure", "Procedimiento de enseñanza"],
  ["Behavior reduction goal", "Objetivo de reducción de conducta"],
  ["Function-based behavior support", "Apoyo conductual basado en la función"],
  ["Objective documentation", "Documentación objetiva"],
  ["Documentation purpose", "Objetivo de documentación"],
  ["Role boundary goal", "Objetivo de límites del rol"],
  ["Scope and ethics judgment", "Juicio sobre alcance y ética"],
  ["important treatment information is shared promptly with the right members of the team.", "la información importante del tratamiento se comparte oportunamente con los miembros correctos del equipo."],
  ["A medication change is reported by the caregiver, and the RBT documents it and alerts the supervisor before session goals continue.", "El cuidador informa un cambio de medicación, y el RBT lo documenta y alerta al supervisor antes de continuar con los objetivos de la sesión."],
  ["To share important treatment information promptly with the supervisor and team.", "Para compartir oportunamente información importante del tratamiento con el supervisor y el equipo."],
  ["Timely communication helps the team respond quickly to changes that may affect treatment or safety.", "La comunicación oportuna ayuda al equipo a responder rápidamente a cambios que pueden afectar el tratamiento o la seguridad."],
  ["To protect the client by staying within the responsibilities of the RBT role.", "Para proteger al cliente manteniéndose dentro de las responsabilidades del rol RBT."],
  ["To maintain professional boundaries around gifts and favors.", "Para mantener límites profesionales alrededor de regalos y favores."],
  ["To keep services accurate and safe by involving supervision when needed.", "Para mantener los servicios precisos y seguros involucrando supervisión cuando sea necesario."],
  ["Timely communication", "Comunicación oportuna"],
  ["Professional demeanor", "Comportamiento profesional"],
  ["Implementing feedback", "Implementación de retroalimentación"],
  ["Accurate record keeping", "Registro preciso"],
  ["The common trap is choosing the answer that seems proactive but actually steps outside the RBT role or crosses a boundary.", "La trampa común es elegir una respuesta que parece proactiva pero en realidad se sale del rol del RBT o cruza un límite profesional."],
  ["Ask what keeps the RBT within scope, protects dignity or confidentiality, and routes clinical decisions back to supervision when needed.", "Pregúntate qué mantiene al RBT dentro de su alcance, protege la dignidad o la confidencialidad y devuelve las decisiones clínicas a supervisión cuando haga falta."],
  ["Look for whether the note is objective, timely, and limited to relevant facts about behavior, treatment, communication, or safety.", "Busca si la nota es objetiva, oportuna y limitada a hechos relevantes sobre conducta, tratamiento, comunicación o seguridad."],
  ["Do not choose language that sounds helpful but adds opinions, guesses, or unnecessary detail not supported by observation.", "No elijas un lenguaje que suene útil pero añada opiniones, suposiciones o detalles innecesarios no respaldados por la observación."],
  ["Look for the one detail in the scenario that tells you what changed, what was measured, or what the RBT actually did.", "Busca el detalle del escenario que te dice qué cambió, qué se midió o qué hizo realmente el RBT."],
  ["Match the exact wording in the stem to the technical definition instead of choosing the term that only sounds familiar.", "Relaciona la redacción exacta del enunciado con la definición técnica en lugar de elegir el término que solo suena familiar."],
  ["Do not pick the broadest ABA term just because it sounds related. Match the defining feature exactly.", "No elijas el término ABA más amplio solo porque suena relacionado. Haz coincidir la característica definitoria exacta."],
  ["Look for how long the behavior lasts. Time length points to duration, not count.", "Busca cuánto dura la conducta. La duración apunta a tiempo, no a conteo."],
  ["Ask whether the question wants a raw count or a count standardized by time or opportunity.", "Pregunta si el ítem quiere un conteo bruto o un conteo estandarizado por tiempo u oportunidad."],
  ["Measurement questions usually hinge on exactly what is being observed: count, time, interval, product, or graph feature.", "Las preguntas de medición suelen depender de qué se está observando exactamente: conteo, tiempo, intervalo, producto o rasgo de la gráfica."],
  ["Assessment questions usually ask what kind of information the team is trying to gather before changing treatment.", "Las preguntas de evaluación suelen preguntar qué tipo de información intenta reunir el equipo antes de cambiar el tratamiento."],
  ["Skill acquisition questions usually turn on what teaching procedure is being used to build independent responding.", "Las preguntas de adquisición de habilidades suelen girar en torno a qué procedimiento de enseñanza se usa para construir respuestas independientes."],
  ["Behavior reduction questions often hinge on function, replacement behavior, and what consequence is or is not being delivered.", "Las preguntas de reducción de conducta suelen depender de la función, la conducta de reemplazo y qué consecuencia se está o no se está entregando."],
  ["When introducing a new receptive label, the RBT prompts right away so the learner contacts success from the start.", "Cuando se introduce una nueva etiqueta receptiva, el RBT da la ayuda de inmediato para que el aprendiz tenga éxito desde el principio."],
  ["the RBT provides enough support immediately to reduce the chance of mistakes during early learning.", "el RBT proporciona suficiente apoyo de inmediato para reducir la probabilidad de errores durante el aprendizaje inicial."],
  ["To minimize mistakes during initial instruction by providing immediate support.", "Para minimizar errores durante la instrucción inicial proporcionando apoyo inmediato."],
  ["Errorless teaching is often used early in instruction so the learner practices the correct response more often than errors.", "La enseñanza sin error se usa a menudo al inicio de la instrucción para que el aprendiz practique la respuesta correcta con más frecuencia que los errores."],
  ["To transfer stimulus control and build independent responding.", "Para transferir el control del estímulo y construir respuestas independientes."],
  ["To teach the learner to respond differently to relevant cues.", "Para enseñar al aprendiz a responder de manera diferente ante señales relevantes."],
  ["To show the learner what response to perform.", "Para mostrarle al aprendiz qué respuesta debe emitir."],
  ["The common trap is choosing a related teaching tool instead of the exact procedure described.", "La trampa común es elegir una herramienta de enseñanza relacionada en lugar del procedimiento exacto descrito."],
  ["the RBT accurately represents credentials, training, role, and authority without exaggeration or misleading others.", "el RBT representa con precisión sus credenciales, formación, rol y autoridad sin exagerar ni inducir a error."],
  ["A family asks whether the RBT can independently redesign treatment goals, and the RBT explains the limits of the RBT role instead of presenting as the clinician in charge.", "Una familia pregunta si el RBT puede rediseñar metas de tratamiento de manera independiente, y el RBT explica los límites de su rol en lugar de presentarse como el clínico a cargo."],
  ["To ensure statements about role, training, and authority stay accurate.", "Para garantizar que las declaraciones sobre el rol, la formación y la autoridad sean precisas."],
  ["Truthful representation protects clients from misleading claims and keeps the RBT within the ethical limits of the role.", "La representación veraz protege a los clientes de afirmaciones engañosas y mantiene al RBT dentro de los límites éticos de su rol."],
  ["the RBT does not independently change goals, procedures, prompting strategies, or reinforcement plans without supervisor direction.", "el RBT no cambia de manera independiente metas, procedimientos, estrategias de ayuda ni planes de reforzamiento sin dirección del supervisor."],
  ["A target seems too difficult during session, so the RBT collects data and reports the concern instead of rewriting the teaching steps alone.", "Un objetivo parece demasiado difícil durante la sesión, así que el RBT recoge datos e informa la preocupación en lugar de reescribir por su cuenta los pasos de enseñanza."],
  ["To keep treatment decisions with the supervising clinician.", "Para mantener las decisiones de tratamiento bajo el clínico supervisor."],
  ["Program changes are clinical decisions and must be directed by the supervisor rather than made independently by the RBT.", "Los cambios al programa son decisiones clínicas y deben ser dirigidos por el supervisor, no realizados de forma independiente por el RBT."],
  ["only the information needed for the approved purpose is shared, and unnecessary client details are left out.", "solo se comparte la información necesaria para el propósito aprobado y se omiten los detalles innecesarios del cliente."],
  ["A staff member asks why a learner missed session, and the RBT shares only the information required by policy instead of discussing private clinical details.", "Un miembro del personal pregunta por qué un aprendiz faltó a la sesión, y el RBT comparte solo la información requerida por la política en lugar de discutir detalles clínicos privados."],
  ["To protect confidentiality by limiting disclosure to what is necessary.", "Para proteger la confidencialidad limitando la divulgación a lo necesario."],
  ["Ethical confidentiality includes sharing only the minimum necessary information through appropriate channels.", "La confidencialidad ética incluye compartir solo la información mínima necesaria mediante canales apropiados."],
  ["the RBT participates in required supervision, responds to coaching, and brings relevant data or concerns for review.", "el RBT participa en la supervisión requerida, responde al coaching y lleva datos o preocupaciones relevantes para revisar."],
  ["The supervisor schedules a check-in, and the RBT arrives with current data, questions, and implementation concerns rather than treating supervision as optional.", "El supervisor programa una revisión y el RBT llega con datos actuales, preguntas y preocupaciones de implementación en lugar de tratar la supervisión como algo opcional."],
  ["To maintain service quality through active required supervision.", "Para mantener la calidad del servicio mediante una supervisión obligatoria y activa."],
  ["Supervision is a required part of safe RBT practice and supports accuracy, feedback, and ongoing competency.", "La supervisión es una parte obligatoria de la práctica segura del RBT y apoya la precisión, la retroalimentación y la competencia continua."],
  ["public, online, and verbal statements about services, outcomes, and credentials are accurate and not misleading.", "las declaraciones públicas, en línea y verbales sobre servicios, resultados y credenciales son precisas y no engañosas."],
  ["An RBT updates a professional profile and removes wording that implies independent BCBA authority or guaranteed treatment results.", "Un RBT actualiza un perfil profesional y elimina frases que implican autoridad independiente de BCBA o resultados garantizados del tratamiento."],
  ["To avoid misleading public statements about services, outcomes, or credentials.", "Para evitar declaraciones públicas engañosas sobre servicios, resultados o credenciales."],
  ["Ethical public statements must be accurate because misleading claims can confuse families and misrepresent the RBT role.", "Las declaraciones públicas éticas deben ser precisas porque las afirmaciones engañosas pueden confundir a las familias y tergiversar el rol del RBT."],
  ["the RBT acts in ways that protect privacy, dignity, choice, and humane treatment during services.", "el RBT actúa de maneras que protegen la privacidad, la dignidad, la elección y el trato humano durante los servicios."],
  ["During a personal-care routine, the RBT closes the door, explains each step respectfully, and honors reasonable client preferences when possible.", "Durante una rutina de cuidado personal, el RBT cierra la puerta, explica cada paso con respeto y honra las preferencias razonables del cliente cuando es posible."],
  ["To protect client rights throughout service delivery.", "Para proteger los derechos del cliente durante toda la prestación del servicio."],
  ["Client rights are protected when services preserve dignity, privacy, respectful treatment, and reasonable choice.", "Los derechos del cliente se protegen cuando los servicios preservan la dignidad, la privacidad, el trato respetuoso y la elección razonable."],
  ["client information is released only through approved authorization, policy, and need-to-know channels.", "la información del cliente se divulga solo mediante autorización aprobada, política aplicable y canales de necesidad de saber."],
  ["A teacher requests detailed behavior records, and the RBT first checks authorization and supervisor direction before sharing anything.", "Un maestro solicita registros detallados de conducta, y el RBT primero verifica la autorización y la dirección del supervisor antes de compartir cualquier cosa."],
  ["To ensure disclosures follow authorization and confidentiality requirements.", "Para asegurar que las divulgaciones cumplan con la autorización y los requisitos de confidencialidad."],
  ["Even helpful information should not be released unless authorization, policy, and role expectations support the disclosure.", "Incluso la información útil no debe divulgarse a menos que la autorización, la política y las expectativas del rol respalden esa divulgación."],
  ["professional boundaries are maintained even when services change, pause, or end and do not automatically become personal relationships.", "los límites profesionales se mantienen incluso cuando los servicios cambian, se pausan o terminan y no se convierten automáticamente en relaciones personales."],
  ["After discharge, a former caregiver asks the RBT to become the child's regular babysitter, and the RBT consults policy and supervision before responding.", "Después del alta, un antiguo cuidador le pide al RBT que se convierta en la niñera habitual del niño, y el RBT consulta la política y la supervisión antes de responder."],
  ["To prevent blurred roles after services change or end.", "Para prevenir la confusión de roles después de que los servicios cambien o terminen."],
  ["Boundary concerns can continue after services, so the RBT should not assume a former professional relationship is now risk free.", "Las preocupaciones de límites pueden continuar después de los servicios, así que el RBT no debe asumir que una relación profesional anterior ahora está libre de riesgo."],
  ["To ensure serious events are escalated through the required channels immediately.", "Para asegurar que los eventos graves se escalen de inmediato por los canales requeridos."],
  ["To prevent implementation errors when directions are unclear.", "Para prevenir errores de implementación cuando las instrucciones no están claras."],
  ["Frequency recording is used when the team needs an exact count of how many times behavior happened.", "El registro de frecuencia se usa cuando el equipo necesita un conteo exacto de cuántas veces ocurrió la conducta."],
  ["Duration recording tracks how long the response lasts, not how many times it happens.", "El registro de duración registra cuánto dura la respuesta, no cuántas veces ocurre."],
  ["Latency recording is used when the delay between a cue and the response matters clinically.", "El registro de latencia se usa cuando la demora entre una señal y la respuesta es clínicamente relevante."],
  ["Partial interval recording marks behavior as present if it occurs at any point in the interval.", "El registro de intervalo parcial marca la conducta como presente si ocurre en cualquier momento del intervalo."],
  ["Permanent product data rely on an observable result, such as completed work or cleaned materials.", "Los datos de producto permanente se basan en un resultado observable, como trabajo completado o materiales limpios."],
  ["ABC data help the team see relationships between triggers, the behavior, and the maintaining consequence.", "Los datos ABC ayudan al equipo a ver las relaciones entre los desencadenantes, la conducta y la consecuencia que la mantiene."],
  ["Operational definitions reduce guesswork and help different staff collect data on the same response consistently.", "Las definiciones operacionales reducen las suposiciones y ayudan a que distintas personas recojan datos de la misma respuesta de forma consistente."],
  ["Preference assessments help the team identify what the learner is likely to work for during teaching.", "Las evaluaciones de preferencias ayudan al equipo a identificar por qué es probable que el aprendiz trabaje durante la enseñanza."],
  ["Baseline data show the learner's starting point so later changes can be interpreted accurately.", "Los datos de línea base muestran el punto de partida del aprendiz para que los cambios posteriores puedan interpretarse con precisión."],
  ["A scatterplot is useful when the team suspects behavior is more likely at particular times of day.", "Un diagrama de dispersión es útil cuando el equipo sospecha que la conducta es más probable en momentos específicos del día."],
  ["Least-to-most prompting preserves the chance for independent responding before stronger prompts are added.", "La ayuda de menos a más preserva la posibilidad de responder de forma independiente antes de añadir ayudas más intensas."],
  ["Prompt fading helps the learner respond to the natural cue instead of depending on the prompt.", "El desvanecimiento de ayudas ayuda al aprendiz a responder a la señal natural en lugar de depender de la ayuda."],
  ["Shaping is useful when the final target behavior does not happen yet and smaller approximations must be reinforced first.", "El moldeamiento es útil cuando la conducta objetivo final todavía no ocurre y primero deben reforzarse aproximaciones más pequeñas."],
  ["Task analysis breaks a chain into clear steps so instruction can be delivered more systematically.", "El análisis de tareas divide una cadena en pasos claros para que la instrucción pueda impartirse de forma más sistemática."],
  ["Total task chaining involves completing the whole chain each time rather than just one link.", "El encadenamiento de tarea total implica completar toda la cadena cada vez, en lugar de solo un eslabón."],
  ["Extinction works by withholding the reinforcer that previously kept the behavior going.", "La extinción funciona retirando el reforzador que antes mantenía la conducta."],
  ["Functional communication training teaches a safer, more acceptable response that meets the same need.", "El entrenamiento en comunicación funcional enseña una respuesta más segura y más aceptable que satisface la misma necesidad."],
  ["Antecedent interventions reduce the chance that the response will happen in the first place.", "Las intervenciones antecedentes reducen la probabilidad de que la respuesta ocurra desde el principio."],
  ["Response blocking is an immediate intervention used only as described in the plan and often for safety.", "El bloqueo de respuesta es una intervención inmediata que se usa solo como se describe en el plan y a menudo por seguridad."],
  ["Objective notes focus on what happened and what data were collected, not on opinions or assumptions.", "Las notas objetivas se centran en lo que ocurrió y en qué datos se recogieron, no en opiniones o suposiciones."],
  ["A high-probability sequence can increase compliance by creating momentum with easy requests first.", "Una secuencia de alta probabilidad puede aumentar el cumplimiento creando impulso con instrucciones fáciles primero."],
  ["An ABC narrative note is helpful when the team needs contextual detail around an important incident.", "Una nota narrativa ABC es útil cuando el equipo necesita detalles de contexto alrededor de un incidente importante."],
  ["A functional behavior assessment integrates information from several sources to guide treatment planning.", "Una evaluación funcional de la conducta integra información de varias fuentes para guiar la planificación del tratamiento."],
  ["An extinction burst is a temporary increase in behavior that may occur before the response decreases over time.", "Una explosión de extinción es un aumento temporal de la conducta que puede ocurrir antes de que la respuesta disminuya con el tiempo."],
  ["Visual analysis uses patterns in graphed data to guide treatment decisions rather than relying on guesswork.", "El análisis visual usa patrones en los datos graficados para guiar decisiones de tratamiento en lugar de depender de suposiciones."],
  ["Objective descriptions of the environment help the team understand relevant session conditions.", "Las descripciones objetivas del ambiente ayudan al equipo a comprender condiciones relevantes de la sesión."],
  ["A function hypothesis is a working explanation based on assessment findings and guides intervention planning.", "Una hipótesis de función es una explicación de trabajo basada en hallazgos de evaluación y guía la planificación de la intervención."],
  ["A preference hierarchy helps the team choose stronger and weaker options more strategically.", "Una jerarquía de preferencias ayuda al equipo a elegir opciones más fuertes y más débiles de forma más estratégica."],
  ["A preferred item is not automatically a reinforcer until it is shown to increase behavior.", "Un elemento preferido no es automáticamente un reforzador hasta que se demuestra que aumenta la conducta."],
  ["A model prompt demonstrates the target behavior rather than only describing it.", "Una ayuda de modelado demuestra la conducta objetivo en lugar de solo describirla."],
  ["Physical prompts involve direct physical assistance and are typically among the most intrusive prompt types.", "Las ayudas físicas implican asistencia física directa y suelen estar entre los tipos de ayuda más intrusivos."],
  ["A written skill acquisition plan tells the RBT exactly how the target should be taught and measured.", "Un plan escrito de adquisición de habilidades le indica al RBT exactamente cómo debe enseñarse y medirse el objetivo."],
  ["A written behavior reduction plan tells the RBT exactly how to respond within the approved procedure.", "Un plan escrito de reducción de conducta le indica al RBT exactamente cómo responder dentro del procedimiento aprobado."],
  ["Extinction side effects are temporary reactions that may appear when a previously reinforced behavior no longer contacts reinforcement.", "Los efectos secundarios de la extinción son reacciones temporales que pueden aparecer cuando una conducta previamente reforzada deja de contactar reforzamiento."],
  ["An appropriate attention request can compete with problem behavior when attention is the maintaining variable.", "Una petición apropiada de atención puede competir con la conducta problema cuando la atención es la variable que la mantiene."],
  ["A good function match increases the chance that the replacement response will be effective and durable.", "Un buen ajuste con la función aumenta la probabilidad de que la respuesta de reemplazo sea efectiva y duradera."],
  ["Positive reinforcement", "Reforzamiento positivo"],
  ["Negative reinforcement", "Reforzamiento negativo"],
  ["Frequency recording", "Registro de frecuencia"],
  ["Duration recording", "Registro de duración"],
  ["Latency recording", "Registro de latencia"],
  ["Partial interval recording", "Registro de intervalo parcial"],
  ["Whole interval recording", "Registro de intervalo completo"],
  ["Momentary time sampling", "Muestreo momentáneo en el tiempo"],
  ["Permanent product recording", "Registro de producto permanente"],
  ["Rate recording", "Registro de tasa"],
  ["Trial-by-trial recording", "Registro ensayo por ensayo"],
  ["Operational definition", "Definición operacional"],
  ["Preference assessment", "Evaluación de preferencias"],
  ["Baseline data", "Datos de línea base"],
  ["Scatterplot assessment", "Evaluación con diagrama de dispersión"],
  ["ABC data", "Datos ABC"],
  ["Task analysis", "Análisis de tareas"],
  ["Discrimination training", "Entrenamiento en discriminación"],
  ["Errorless teaching", "Enseñanza sin error"],
  ["Prompt fading", "Desvanecimiento de ayudas"],
  ["Prompting and Prompt Fading", "Ayudas y desvanecimiento de ayudas"],
  ["Least-to-most prompting", "Ayuda de menos a más"],
  ["Most-to-least prompting", "Ayuda de más a menos"],
  ["Continuous reinforcement", "Reforzamiento continuo"],
  ["Fixed-interval schedule", "Programa de intervalo fijo"],
  ["Forward chaining", "Encadenamiento hacia adelante"],
  ["Differential reinforcement", "Reforzamiento diferencial"],
  ["Functional communication training", "Entrenamiento en comunicación funcional"],
  ["Noncontingent reinforcement", "Reforzamiento no contingente"],
  ["Planned ignoring", "Ignorar planificadamente"],
  ["Extinction burst", "Explosión de extinción"],
  ["Incident report", "Reporte de incidente"],
  ["Timely documentation", "Documentación oportuna"],
  ["Objective language", "Lenguaje objetivo"],
  ["Respectful language", "Lenguaje respetuoso"],
  ["Ethics consultation", "Consulta ética"],
  ["Professional boundaries", "Límites profesionales"],
  ["Scope of competence", "Alcance de competencia"],
  ["Confidentiality", "Confidencialidad"],
  ["Seeking supervision", "Búsqueda de supervisión"],
  ["Mandated reporting", "Reporte obligatorio"],
  ["Referral outside scope", "Derivación fuera del alcance"],
  ["Interdisciplinary collaboration", "Colaboración interdisciplinaria"],
  ["Guardian consent", "Consentimiento del tutor"],
  ["Feedback receptivity", "Receptividad a la retroalimentación"],
  ["Clarification request", "Solicitud de aclaración"],
  ["Secure record storage", "Almacenamiento seguro de registros"],
  ["Privacy protection in public", "Protección de la privacidad en público"],
  ["Gift boundary", "Límite con regalos"],
  ["Multiple relationship risk", "Riesgo de relación múltiple"],
  ["Social media confidentiality", "Confidencialidad en redes sociales"],
  ["Workplace policy compliance", "Cumplimiento de la política del lugar de trabajo"],
  ["Supervision preparation", "Preparación para la supervisión"],
  ["Error reporting", "Reporte de errores"],
  ["Respectful language", "Lenguaje respetuoso"],
  ["Least restrictive support", "Apoyo menos restrictivo"],
  ["Respect for client preferences", "Respeto por las preferencias del cliente"],
  ["Emergency reporting", "Reporte de emergencia"],
  ["Role-appropriate communication", "Comunicación acorde al rol"],
  ["Truthful representation", "Representación veraz"],
  ["No independent program changes", "Cambios del programa solo con supervisión"],
  ["Minimum necessary disclosure", "Divulgación mínima necesaria"],
  ["Required supervision participation", "Participación obligatoria en supervisión"],
  ["Public statement accuracy", "Exactitud de declaraciones públicas"],
  ["Protection of client rights", "Protección de los derechos del cliente"],
  ["Authorized information release", "Divulgación autorizada de información"],
  ["Post-service boundary maintenance", "Mantenimiento de límites tras el servicio"],
  ["Cultural responsiveness", "Respuesta cultural"],
  ["Visual analysis", "Análisis visual"],
  ["Interresponse time", "Tiempo entre respuestas"],
  ["Percentage correct", "Porcentaje correcto"],
  ["Percentage of opportunities", "Porcentaje de oportunidades"],
  ["Data summarization", "Resumen de datos"],
  ["Measurable terms", "Términos medibles"],
  ["Environmental description", "Descripción ambiental"],
  ["Graph updating", "Actualización de gráficas"],
  ["ABC narrative note", "Nota narrativa ABC"],
  ["Objective session notes", "Notas objetivas de la sesión"],
  ["Preference hierarchy", "Jerarquía de preferencias"],
  ["Setting event review", "Revisión de eventos de contexto"],
  ["Indirect assessment", "Evaluación indirecta"],
  ["Reinforcer assessment", "Evaluación de reforzadores"],
  ["Skill deficits assessment", "Evaluación de déficits de habilidades"],
  ["Skill strengths assessment", "Evaluación de fortalezas de habilidades"],
  ["Descriptive assessment", "Evaluación descriptiva"],
  ["Direct observation", "Observación directa"],
  ["Curriculum-based assessment", "Evaluación basada en el currículo"],
  ["Baseline stability", "Estabilidad de la línea base"],
  ["Structured interview", "Entrevista estructurada"],
  ["Social skills assessment", "Evaluación de habilidades sociales"],
  ["Function hypothesis", "Hipótesis de función"],
  ["Written skill acquisition plan", "Plan escrito de adquisición de habilidades"],
  ["Written behavior reduction plan", "Plan escrito de reducción de conducta"],
  ["Stimulus control transfer", "Transferencia de control del estímulo"],
  ["Session preparation", "Preparación de la sesión"],
  ["Variable-interval schedule", "Programa de intervalo variable"],
  ["Natural environment teaching", "Enseñanza en ambiente natural"],
  ["Physical prompt", "Ayuda física"],
  ["Response blocking", "Bloqueo de respuesta"],
  ["Attention extinction", "Extinción de atención"],
  ["Escape extinction", "Extinción de escape"],
  ["Tangible extinction", "Extinción tangible"],
  ["Model prompt", "Ayuda de modelado"],
  ["Response prompt", "Ayuda de respuesta"],
  ["Stimulus prompt", "Ayuda de estímulo"],
  ["Total task chaining", "Encadenamiento de tarea total"],
  ["Shaping", "Moldeamiento"],
  ["Data collection", "Toma de datos"],
  ["functional behavior assessment", "evaluación funcional de la conducta"],
  ["Why it matters", "Por qué importa"],
  ["Example", "Ejemplo"],
  ["Exam tip", "Tip de examen"],
  ["Quick check", "Chequeo rápido"],
  ["Correct answer", "Respuesta correcta"],
  ["Best answer", "Mejor respuesta"],
  ["No problem. Here is the answer", "No pasa nada. Aquí tienes la respuesta"],
  ["No problem.", "No hay problema."],
  ["Nice", "Bien"],
  ["Almost there on", "Casi lo tienes en"],
  ["Let's correct", "Corrijamos"],
  ["Not quite", "No del todo"],
  ["Still on", "Seguimos con"],
  ["Hint", "Pista"],
  ["Why", "Por qué"],
  ["Answer", "Respuesta"],
  ["Continuing with", "Continuando con"],
  ["Let's do one question at a time on", "Hagamos una pregunta a la vez sobre"],
  ["Next question on", "Siguiente pregunta sobre"],
];

const SORTED_LONGEST_FIRST_REPLACEMENTS = [...LONGEST_FIRST_REPLACEMENTS].sort(
  (a, b) => b[0].length - a[0].length,
);

const WORD_REPLACEMENTS = [];

const QUESTION_SENTENCE_REPLACEMENTS = [
  ["An RBT", "Un RBT"],
  ["A BCBA", "Un BCBA"],
  ["A supervisor", "Un supervisor"],
  ["A learner", "Un aprendiz"],
  ["A caregiver", "Un cuidador"],
  ["a target behavior", "una conducta objetivo"],
  ["a behavior", "una conducta"],
  ["an instruction", "una instrucción"],
  ["a cue", "una señal"],
  ["a session", "una sesión"],
  ["the RBT", "el RBT"],
  ["the BCBA", "el BCBA"],
  ["the team", "el equipo"],
  ["the caregiver", "el cuidador"],
  ["the table", "la mesa"],
  ["a learner", "un aprendiz"],
  ["the learner", "el aprendiz"],
  ["learner", "aprendiz"],
  ["20-minute session", "sesión de 20 minutos"],
  ["20 minute session", "sesión de 20 minutos"],
  ["during a 20-minute session", "durante una sesión de 20 minutos"],
  ["during a 20 minute session", "durante una sesión de 20 minutos"],
  ["a 20-minute session", "una sesión de 20 minutos"],
  ["a 20 minute session", "una sesión de 20 minutos"],
  ["30-second block", "bloque de 30 segundos"],
  ["30 second block", "bloque de 30 segundos"],
  ["during a 30-second block", "durante un bloque de 30 segundos"],
  ["during a 30 second block", "durante un bloque de 30 segundos"],
  ["a 30-second block", "un bloque de 30 segundos"],
  ["a 30 second block", "un bloque de 30 segundos"],
  ["several minutes at a time", "durante varios minutos a la vez"],
  ["how long each episode lasts", "cuánto dura cada episodio"],
  ["how long it takes", "cuánto tarda"],
  ["how long it takes a learner to begin cleaning up", "cuánto tarda un aprendiz en comenzar a recoger"],
  ["to begin cleaning up", "en comenzar a recoger"],
  ["at least once", "al menos una vez"],
  ["marks the interval as yes", "marca el intervalo como sí"],
  ["the interval is scored if", "el intervalo se marca si"],
  ["during recess", "durante el recreo"],
  ["before session goals continue", "antes de continuar con los objetivos de la sesión"],
  ["how many math problems were completed correctly", "cuántos problemas de matemáticas se completaron correctamente"],
  ["after the worksheet is finished", "después de terminar la hoja de trabajo"],
  ["what triggers and follows the behavior", "qué desencadena y sigue a la conducta"],
  ["only actions that can be seen and counted", "solo acciones que pueden observarse y contarse"],
  ["items the learner chooses most often", "los elementos que el aprendiz elige con más frecuencia"],
  ["for several sessions", "durante varias sesiones"],
  ["across times of day", "a lo largo de distintos momentos del día"],
  ["to see when patterns happen most often", "para ver cuándo los patrones ocurren con más frecuencia"],
  ["with immediate feedback after each response", "con retroalimentación inmediata después de cada respuesta"],
  ["rather than only table work", "en lugar de solo trabajo en mesa"],
  ["turn taking", "turnarse"],
  ["simple labels", "etiquetas simples"],
  ["with the family", "con la familia"],
  ["with a cue, response, consequence, and brief pause before the next trial", "con una señal, respuesta, consecuencia y una breve pausa antes del siguiente ensayo"],
  ["target behavior", "conducta objetivo"],
  ["problem behavior", "conducta problema"],
  ["behavior episode", "episodio de conducta"],
  ["behavior episodes", "episodios de conducta"],
  ["behaviors", "conductas"],
  ["behavior", "conducta"],
  ["during the observation period", "durante el periodo de observación"],
  ["during observation", "durante la observación"],
  ["during the session", "durante la sesión"],
  ["during session", "durante la sesión"],
  ["during each interval", "durante cada intervalo"],
  ["counts each instance of", "cuenta cada ocurrencia de"],
  ["measures how long", "mide cuánto dura"],
  ["measures the time between", "mide el tiempo entre"],
  ["wants to know", "quiere saber"],
  ["wants to measure", "quiere medir"],
  ["wants the exact number of times", "quiere el número exacto de veces que"],
  ["the team wants to", "el equipo quiere"],
  ["the team needs", "el equipo necesita"],
  ["is used when", "se usa cuando"],
  ["helps the team", "ayuda al equipo"],
  ["exact count", "conteo exacto"],
  ["how many times", "cuántas veces"],
  ["before a new intervention starts", "antes de que comience una nueva intervención"],
  ["before introducing", "antes de introducir"],
  ["after the instruction is given", "después de que se da la instrucción"],
  ["at any time during that interval", "en cualquier momento de ese intervalo"],
  ["from start to finish", "de inicio a fin"],
  ["the start of the response", "el inicio de la respuesta"],
  ["instead of watching it happen live", "en lugar de observarla en vivo"],
  ["if needed", "si es necesario"],
  ["over time", "con el tiempo"],
  ["current performance", "desempeño actual"],
  ["current behavior levels", "niveles actuales de conducta"],
  ["different staff", "distinto personal"],
  ["the same way", "de la misma manera"],
  ["live by the RBT", "en vivo por el RBT"],
  ["rather than relying only on reports from others", "en lugar de depender solo de reportes de otras personas"],
  ["the actual behavior", "la conducta real"],
  ["two items are presented at a time", "se presentan dos elementos a la vez"],
  ["the learner chooses between them repeatedly", "el aprendiz elige entre ellos repetidamente"],
  ["multiple items are presented together", "se presentan varios elementos juntos"],
  ["the selected item is removed before the next selection", "el elemento seleccionado se retira antes de la siguiente elección"],
  ["multiple assessment methods are combined", "se combinan varios métodos de evaluación"],
  ["why problem behavior is happening", "por qué está ocurriendo la conducta problema"],
  ["before designing a plan", "antes de diseñar un plan"],
  ["throughout the session", "a lo largo de la sesión"],
  ["what the learner is likely to work for", "por qué es probable que el aprendiz trabaje"],
  ["prompts right away", "da la ayuda de inmediato"],
  ["contacts success from the start", "tenga éxito desde el principio"],
  ["the chance of mistakes", "la probabilidad de errores"],
  ["during early learning", "durante el aprendizaje inicial"],
  ["used early in instruction", "usada al inicio de la instrucción"],
  ["the correct response", "la respuesta correcta"],
  ["more often than errors", "con más frecuencia que los errores"],
  ["relevant cues", "señales relevantes"],
  ["stimulus control", "control del estímulo"],
  ["independent responding", "respuestas independientes"],
  ["what response to perform", "qué respuesta debe emitir"],
  ["initial instruction", "la instrucción inicial"],
  ["immediate support", "apoyo inmediato"],
  ["lasting outcome", "resultado duradero"],
  ["lasting result", "resultado duradero"],
  ["cleaned materials", "materiales limpios"],
  ["completed work", "trabajo completado"],
  ["hits the table", "golpea la mesa"],
  ["the team needs an exact count of how many times behavior happened", "el equipo necesita un conteo exacto de cuántas veces ocurrió la conducta"],
  ["is used when the team needs", "se usa cuando el equipo necesita"],
  ["tracks how long the response lasts, not how many times it happens", "registra cuánto dura la respuesta, no cuántas veces ocurre"],
  ["the delay between a cue and the response matters clinically", "la demora entre una señal y la respuesta es clínicamente relevante"],
  ["marks behavior as present if it occurs at any point in the interval", "marca la conducta como presente si ocurre en cualquier momento del intervalo"],
  ["if yelling occurs", "si ocurren gritos"],
  ["delay between a cue and the response", "demora entre una señal y la respuesta"],
  ["matters clinically", "es clínicamente relevante"],
  ["at any point in the interval", "en cualquier momento del intervalo"],
  ["how many times behavior happened", "cuántas veces ocurrió la conducta"],
  ["how many times it happens", "cuántas veces ocurre"],
  ["if it occurs at any point in the interval", "si ocurre en cualquier momento del intervalo"],
  ["data", "datos"],
  ["note", "nota"],
  ["notes", "notas"],
  ["session", "sesión"],
  ["sessions", "sesiones"],
  ["supervisor", "supervisor"],
];

const SORTED_QUESTION_SENTENCE_REPLACEMENTS = [...QUESTION_SENTENCE_REPLACEMENTS].sort(
  (a, b) => b[0].length - a[0].length,
);

const QUESTION_WORD_REPLACEMENTS = [
  ["that", "que"],
  ["by", "mediante"],
  ["be", "ser"],
  ["how", "cómo"],
  ["may", "puede"],
  ["used", "usado"],
  ["using", "usando"],
  ["useful", "útiles"],
  ["make", "hacer"],
  ["show", "mostrar"],
  ["build", "construir"],
  ["compare", "comparar"],
  ["improve", "mejorar"],
  ["ensure", "asegurar"],
  ["provide", "proporcionar"],
  ["prevent", "prevenir"],
  ["recognize", "reconocer"],
  ["check", "comprobar"],
  ["teach", "enseñar"],
  ["turn", "convertir"],
  ["reduce", "reducir"],
  ["replace", "reemplazar"],
  ["reinforce", "reforzar"],
  ["strengthen", "fortalecer"],
  ["interrupt", "interrumpir"],
  ["increase", "aumentar"],
  ["guide", "guiar"],
  ["support", "apoyar"],
  ["communicate", "comunicar"],
  ["functions", "funciona"],
  ["role", "rol"],
  ["quality", "calidad"],
  ["later", "después"],
  ["same", "misma"],
  ["every", "cada"],
  ["several", "varios"],
  ["which", "qué"],
  ["where", "dónde"],
  ["who", "quien"],
  ["based", "basado"],
  ["according", "según"],
  ["does", "hace"],
  ["events", "eventos"],
  ["event", "evento"],
  ["item", "elemento"],
  ["request", "petición"],
  ["requests", "peticiones"],
  ["context", "contexto"],
  ["contexts", "contextos"],
  ["skills", "habilidades"],
  ["skill", "habilidad"],
  ["learned", "aprendida"],
  ["initial", "inicial"],
  ["mastery", "dominio"],
  ["independence", "independencia"],
  ["effective", "efectiva"],
  ["durable", "duradera"],
  ["repertoire", "repertorio"],
  ["procedure", "procedimiento"],
  ["procedures", "procedimientos"],
  ["feedback", "retroalimentación"],
  ["supervision", "supervisión"],
  ["required", "requerida"],
  ["details", "detalles"],
  ["accuracy", "precisión"],
  ["periods", "periodos"],
  ["control", "control"],
  ["stimulus", "estímulo"],
  ["unsafe", "insegura"],
  ["targeted", "objetivo"],
  ["expected", "esperados"],
  ["effects", "efectos"],
  ["first", "primero"],
  ["evaluate", "evaluar"],
  ["evaluates", "evalúa"],
  ["length", "duración"],
  ["specific", "específico"],
  ["instant", "instante"],
  ["describe", "describir"],
  ["descriptions", "descripciones"],
  ["described", "descrito"],
  ["contextual", "contextuales"],
  ["variables", "variables"],
  ["affect", "afectar"],
  ["summarize", "resumir"],
  ["summary", "resumen"],
  ["instance", "ocurrencia"],
  ["instances", "ocurrencias"],
  ["tends", "tiende"],
  ["reviewing", "revisando"],
  ["review", "revisión"],
  ["lasting", "duradero"],
  ["outcome", "resultado"],
  ["watching", "observando"],
  ["live", "en vivo"],
  ["gather", "recoger"],
  ["gathers", "recoge"],
  ["objective", "objetivo"],
  ["consistent", "consistente"],
  ["systematic", "sistemático"],
  ["items", "elementos"],
  ["activities", "actividades"],
  ["likely", "probable"],
  ["current", "actual"],
  ["understand", "comprender"],
  ["suspects", "sospecha"],
  ["particular", "particulares"],
  ["least", "menos"],
  ["intrusive", "intrusiva"],
  ["increases", "aumenta"],
  ["help", "ayuda"],
  ["needed", "necesario"],
  ["preserves", "preserva"],
  ["chance", "posibilidad"],
  ["independent", "independiente"],
  ["stronger", "más intensas"],
  ["added", "añadidas"],
  ["begins", "comienza"],
  ["guidance", "guía"],
  ["encourage", "fomentar"],
  ["adding", "añadir"],
  ["closer", "cada vez más cercanas"],
  ["approximations", "aproximaciones"],
  ["complex", "compleja"],
  ["broken", "dividida"],
  ["smaller", "más pequeños"],
  ["teachable", "enseñables"],
  ["steps", "pasos"],
  ["whole", "toda"],
  ["entire", "completa"],
  ["link", "eslabón"],
  ["previously", "previamente"],
  ["maintained", "mantenía"],
  ["longer", "más"],
  ["delivered", "entregada"],
  ["teaches", "enseña"],
  ["safer", "más segura"],
  ["acceptable", "aceptable"],
  ["need", "necesidad"],
  ["interrupts", "interrumpe"],
  ["outlined", "indicado"],
  ["focus", "se centran"],
  ["opinions", "opiniones"],
  ["assumptions", "suposiciones"],
  ["factual", "factuales"],
  ["decisions", "decisiones"],
  ["timer", "cronómetro"],
  ["stops", "se detiene"],
  ["between", "entre"],
  ["raw", "bruto"],
  ["standardized", "estandarizado"],
  ["opportunity", "oportunidad"],
  ["opportunities", "oportunidades"],
  ["count", "conteo"],
  ["patterns", "patrones"],
  ["consequences", "consecuencias"],
  ["antecedents", "antecedentes"],
  ["directly", "directamente"],
  ["detail", "detalle"],
  ["relevant", "relevante"],
  ["gathered", "reunida"],
  ["questions", "preguntas"],
  ["notes", "notas"],
  ["still", "todavía"],
  ["fresh", "frescos"],
  ["assessment", "evaluación"],
  ["teaching", "enseñanza"],
  ["performance", "desempeño"],
  ["measurable", "medible"],
  ["terms", "términos"],
  ["environmental", "ambiental"],
  ["description", "descripción"],
  ["summarization", "resumen"],
  ["level", "nivel"],
  ["delay", "demora"],
  ["clinically", "clínicamente"],
  ["point", "momento"],
  ["present", "presente"],
  ["reinforcer", "reforzador"],
  ["documentation", "documentación"],
  ["support", "apoyo"],
  ["replacement", "reemplazo"],
  ["consequence", "consecuencia"],
  ["intervention", "intervención"],
  ["observation", "observación"],
  ["observed", "observado"],
  ["observe", "observar"],
  ["observes", "observa"],
  ["behavioral", "conductual"],
  ["professional", "profesional"],
  ["natural", "natural"],
  ["services", "servicios"],
  ["service", "servicio"],
  ["session", "sesión"],
  ["sessions", "sesiones"],
  ["interval", "intervalo"],
  ["intervals", "intervalos"],
  ["trial", "ensayo"],
  ["trials", "ensayos"],
  ["minute", "minuto"],
  ["minutes", "minutos"],
  ["second", "segundo"],
  ["seconds", "segundos"],
  ["block", "bloque"],
  ["worksheet", "hoja de trabajo"],
  ["recess", "recreo"],
  ["yelling", "gritos"],
  ["cries", "llora"],
  ["crying", "llanto"],
  ["episode", "episodio"],
  ["episodes", "episodios"],
  ["begins", "comienza"],
  ["begin", "comenzar"],
  ["cleaning", "recoger"],
  ["reported", "informa"],
  ["completes", "completa"],
  ["completed", "completado"],
  ["correctly", "correctamente"],
  ["finished", "terminada"],
  ["choose", "elegir"],
  ["chooses", "elige"],
  ["choice", "elección"],
  ["choices", "elecciones"],
  ["often", "a menudo"],
  ["actual", "real"],
  ["reports", "reportes"],
  ["report", "reporte"],
  ["track", "registrar"],
  ["tracks", "registra"],
  ["matters", "importa"],
  ["occurred", "ocurrió"],
  ["occur", "ocurrir"],
  ["occurs", "ocurre"],
  ["safe", "seguros"],
  ["safety", "seguridad"],
  ["within", "dentro de"],
  ["more", "más"],
  ["written", "escrito"],
  ["correct", "correcto"],
  ["the", "el"],
  ["of", "de"],
  ["and", "y"],
  ["or", "o"],
  ["if", "si"],
  ["is", "es"],
  ["are", "son"],
  ["can", "puede"],
  ["because", "porque"],
  ["whether", "si"],
  ["not", "no"],
  ["at", "en"],
  ["on", "en"],
  ["when", "cuando"],
  ["while", "mientras"],
  ["before", "antes de"],
  ["after", "después de"],
  ["during", "durante"],
  ["with", "con"],
  ["without", "sin"],
  ["for", "para"],
  ["into", "en"],
  ["from", "desde"],
  ["through", "mediante"],
  ["each", "cada"],
  ["exact", "exacto"],
  ["count", "conteo"],
  ["times", "veces"],
  ["time", "tiempo"],
  ["needs", "necesita"],
  ["need", "necesita"],
  ["uses", "usa"],
  ["use", "usar"],
  ["happened", "ocurrió"],
  ["happens", "ocurre"],
  ["occurs", "ocurre"],
  ["starts", "comienza"],
  ["start", "comenzar"],
  ["lasts", "dura"],
  ["measure", "medir"],
  ["measures", "mide"],
  ["capture", "captar"],
  ["captures", "capta"],
  ["describe", "describir"],
  ["describes", "describe"],
  ["understand", "comprender"],
  ["identify", "identificar"],
  ["collect", "recoger"],
  ["record", "registrar"],
  ["records", "registros"],
  ["response", "respuesta"],
  ["responses", "respuestas"],
  ["instruction", "instrucción"],
  ["prompt", "ayuda"],
  ["prompts", "ayudas"],
  ["cue", "señal"],
  ["problem", "problema"],
  ["appropriate", "apropiada"],
  ["alternative", "alternativa"],
  ["communication", "comunicación"],
  ["function", "función"],
  ["reinforcement", "reforzamiento"],
  ["important", "importante"],
  ["treatment", "tratamiento"],
  ["information", "información"],
  ["shared", "comparte"],
  ["promptly", "oportunamente"],
  ["members", "miembros"],
  ["medication", "medicación"],
  ["change", "cambio"],
  ["reported", "informado"],
  ["caregiver", "cuidador"],
  ["documents", "documenta"],
  ["alerts", "alerta"],
  ["goals", "objetivos"],
  ["continue", "continúan"],
  ["helps", "ayuda"],
  ["respond", "responder"],
  ["quickly", "rápidamente"],
  ["changes", "cambios"],
  ["affect", "afectar"],
  ["safety", "seguridad"],
  ["protect", "proteger"],
  ["client", "cliente"],
  ["staying", "manteniéndose"],
  ["responsibilities", "responsabilidades"],
  ["maintain", "mantener"],
  ["around", "alrededor de"],
  ["gifts", "regalos"],
  ["favors", "favores"],
  ["keep", "mantener"],
  ["services", "servicios"],
  ["involving", "involucrando"],
  ["needed", "necesario"],
  ["accurate", "precisos"],
  ["safe", "seguros"],
  ["teachers", "profesores"],
  ["asks", "pregunta"],
  ["observing", "observando"],
  ["directly", "directamente"],
  ["duration", "duración"],
  ["frequency", "frecuencia"],
  ["rate", "tasa"],
  ["table", "mesa"],
  ["hits", "golpea"],
];

function replaceCaseInsensitive(text, search, replacement) {
  return text.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), (match) => {
    if (match === match.toUpperCase()) {
      return replacement.toUpperCase();
    }

    if (match[0] === match[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }

    return replacement;
  });
}

function applyQuestionSentenceReplacements(text) {
  let translated = String(text || "");

  SORTED_QUESTION_SENTENCE_REPLACEMENTS.forEach(([english, spanish]) => {
    translated = replaceCaseInsensitive(translated, english, spanish);
  });

  QUESTION_WORD_REPLACEMENTS.forEach(([english, spanish]) => {
    translated = translated.replace(
      new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
      (match) => {
        if (match === match.toUpperCase()) {
          return spanish.toUpperCase();
        }

        if (match[0] === match[0].toUpperCase()) {
          return spanish.charAt(0).toUpperCase() + spanish.slice(1);
        }

        return spanish;
      },
    );
  });

  return translated
    .replace(/\s+([?.!,;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function translateToSpanish(text) {
  if (!text) {
    return "";
  }

  let translated = String(text);

  SORTED_LONGEST_FIRST_REPLACEMENTS.forEach(([english, spanish]) => {
    translated = replaceCaseInsensitive(translated, english, spanish);
  });

  WORD_REPLACEMENTS.forEach(([english, spanish]) => {
    translated = translated.replace(
      new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
      (match) => {
        if (match === match.toUpperCase()) {
          return spanish.toUpperCase();
        }

        if (match[0] === match[0].toUpperCase()) {
          return spanish.charAt(0).toUpperCase() + spanish.slice(1);
        }

        return spanish;
      },
    );
  });

  return translated
    .replace(/\s+([?.!,;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function stripTrailingPeriod(text) {
  return String(text || "").trim().replace(/[.]\s*$/, "");
}

function stripLeadingPara(text) {
  return String(text || "").trim().replace(/^Para\s+/i, "");
}

const PURPOSE_TEXT_TRANSLATIONS = {
  "To address errors transparently so they can be corrected.": "Para abordar los errores de manera transparente para que puedan corregirse.",
  "To assist the learner directly through the response.": "Para asistir directamente al aprendiz durante la respuesta.",
  "To avoid acting beyond the limits of the RBT role.": "Para evitar actuar más allá de los límites del rol del RBT.",
  "To avoid conflicts of interest and preserve a professional relationship.": "Para evitar conflictos de interés y preservar una relación profesional.",
  "To avoid misleading public statements about services, outcomes, or credentials.": "Para evitar declaraciones públicas engañosas sobre servicios, resultados o credenciales.",
  "To avoid personal arrangements that could impair professional judgment.": "Para evitar acuerdos personales que puedan perjudicar el juicio profesional.",
  "To build a new skill by reinforcing closer and closer approximations.": "Para construir una nueva habilidad reforzando aproximaciones cada vez más cercanas.",
  "To build behavioral momentum before presenting a low-probability demand.": "Para construir impulso conductual antes de presentar una demanda de baja probabilidad.",
  "To build tolerance for demands gradually.": "Para construir tolerancia a las demandas de manera gradual.",
  "To capture every instance or full dimension of behavior as accurately as possible.": "Para captar cada ocurrencia o dimensión completa de la conducta con la mayor precisión posible.",
  "To capture how often a behavior occurs.": "Para captar con qué frecuencia ocurre una conducta.",
  "To capture learner performance on each teaching opportunity separately.": "Para captar el desempeño del aprendiz en cada oportunidad de enseñanza por separado.",
  "To check whether behavior is happening at a specific instant.": "Para comprobar si la conducta está ocurriendo en un instante específico.",
  "To check whether prompt control can shift to a less intrusive cue.": "Para comprobar si el control de la ayuda puede pasar a una señal menos intrusiva.",
  "To check whether two observers recorded behavior consistently.": "Para comprobar si dos observadores registraron la conducta de forma consistente.",
  "To collect background information from someone who knows the learner well.": "Para recoger información de contexto de alguien que conoce bien al aprendiz.",
  "To collect valid time-based measures such as latency and duration.": "Para recoger medidas válidas basadas en el tiempo, como latencia y duración.",
  "To communicate clinically relevant concerns to the supervisor promptly.": "Para comunicar oportunamente al supervisor preocupaciones clínicamente relevantes.",
  "To communicate professionally without stepping outside scope.": "Para comunicarse de forma profesional sin salirse del alcance del rol.",
  "To compare behavior across relevant contexts.": "Para comparar la conducta en contextos relevantes.",
  "To compare behavior frequency across unequal observation periods.": "Para comparar la frecuencia de la conducta entre periodos de observación desiguales.",
  "To compare choices between two options at a time to rank preferences.": "Para comparar elecciones entre dos opciones a la vez y ordenar preferencias.",
  "To compare performance with broader developmental expectations.": "Para comparar el desempeño con expectativas del desarrollo más amplias.",
  "To compare several possible preferred items within the same trial.": "Para comparar varios elementos potencialmente preferidos dentro del mismo ensayo.",
  "To confirm when and where authorized services were delivered.": "Para confirmar cuándo y dónde se prestaron servicios autorizados.",
  "To confirm whether a preferred item actually increases responding.": "Para confirmar si un elemento preferido realmente aumenta la respuesta.",
  "To confirm whether a preferred item functions as a reinforcer.": "Para confirmar si un elemento preferido funciona como reforzador.",
  "To connect token earning with access to backup reinforcers.": "Para conectar la obtención de fichas con el acceso a reforzadores de respaldo.",
  "To describe behavior in directly seen or heard terms.": "Para describir la conducta en términos directamente observables o audibles.",
  "To describe contextual variables that may affect behavior.": "Para describir variables contextuales que pueden afectar la conducta.",
  "To describe events that alter reinforcer value and related behavior.": "Para describir eventos que alteran el valor del reforzador y la conducta relacionada.",
  "To describe how much the data fluctuate.": "Para describir cuánto fluctúan los datos.",
  "To describe the overall direction of performance over time.": "Para describir la dirección general del desempeño a lo largo del tiempo.",
  "To describe the relative magnitude of data within a phase.": "Para describir la magnitud relativa de los datos dentro de una fase.",
  "To describe what the response physically looks like.": "Para describir cómo se ve físicamente la respuesta.",
  "To detect time-based patterns in behavior.": "Para detectar patrones temporales en la conducta.",
  "To determine whether a target meets the program's mastery requirement.": "Para determinar si un objetivo cumple con el criterio de dominio del programa.",
  "To determine whether pre-intervention data provide a usable comparison.": "Para determinar si los datos previos a la intervención ofrecen una comparación útil.",
  "To document added information transparently after the original entry.": "Para documentar información añadida de forma transparente después del registro original.",
  "To document behavior and treatment facts without subjective judgment.": "Para documentar hechos sobre conducta y tratamiento sin juicio subjetivo.",
  "To document contextual variables that may have influenced session outcomes.": "Para documentar variables contextuales que pueden haber influido en los resultados de la sesión.",
  "To document injuries according to required reporting procedures.": "Para documentar lesiones de acuerdo con los procedimientos de reporte requeridos.",
  "To document meaningful changes in reinforcement used during the session.": "Para documentar cambios significativos en el reforzamiento usado durante la sesión.",
  "To document medication-related variables that may be relevant to treatment.": "Para documentar variables relacionadas con la medicación que pueden ser relevantes para el tratamiento.",
  "To document performance before intervention starts.": "Para documentar el desempeño antes de que comience la intervención.",
  "To document serious events clearly and communicate them through the correct process.": "Para documentar eventos graves con claridad y comunicarlos mediante el proceso correcto.",
  "To document setting changes that may help explain session performance.": "Para documentar cambios del entorno que pueden ayudar a explicar el desempeño de la sesión.",
  "To document shortened sessions accurately.": "Para documentar con precisión las sesiones acortadas.",
  "To document updates to prompting procedures used during the session.": "Para documentar actualizaciones de los procedimientos de ayuda usados durante la sesión.",
  "To document when a scheduled service did not occur.": "Para documentar cuándo un servicio programado no ocurrió.",
  "To document when important events or services occurred during session.": "Para documentar cuándo ocurrieron eventos o servicios importantes durante la sesión.",
  "To document when the written plan could not be followed exactly.": "Para documentar cuándo no pudo seguirse exactamente el plan escrito.",
  "To encourage independence before adding more intrusive help.": "Para fomentar la independencia antes de añadir ayudas más intrusivas.",
  "To ensure data can be collected accurately from the start of session.": "Para asegurar que los datos puedan recogerse con precisión desde el inicio de la sesión.",
  "To ensure disclosures follow authorization and confidentiality requirements.": "Para asegurar que las divulgaciones cumplan con la autorización y los requisitos de confidencialidad.",
  "To ensure early correct responding while systematically reducing prompt support.": "Para asegurar respuestas correctas tempranas mientras se reduce de manera sistemática el apoyo de ayudas.",
  "To ensure recorded data match the final documented record.": "Para asegurar que los datos registrados coincidan con el registro final documentado.",
  "To ensure records and reports are completed while details are still accurate.": "Para asegurar que los registros y reportes se completen mientras los detalles aún son precisos.",
  "To ensure serious events are escalated through the required channels immediately.": "Para asegurar que los eventos graves se escalen de inmediato por los canales requeridos.",
  "To ensure statements about role, training, and authority stay accurate.": "Para asegurar que las declaraciones sobre rol, formación y autoridad sigan siendo precisas.",
  "To ensure the intervention addresses the actual reason the behavior persists.": "Para asegurar que la intervención aborde la verdadera razón por la que la conducta persiste.",
  "To estimate behavior by sampling instead of recording every instance fully.": "Para estimar la conducta mediante muestreo en lugar de registrar por completo cada ocurrencia.",
  "To evaluate how quickly behavior changed after an intervention started.": "Para evaluar qué tan rápido cambió la conducta después de iniciar una intervención.",
  "To evoke the correct response directly.": "Para evocar directamente la respuesta correcta.",
  "To express correct responding relative to total opportunities.": "Para expresar las respuestas correctas en relación con el total de oportunidades.",
  "To fulfill legal and ethical duties when abuse or neglect is suspected.": "Para cumplir con las obligaciones legales y éticas cuando se sospecha abuso o negligencia.",
  "To gather assessment information in a systematic interview format.": "Para recoger información de evaluación en un formato sistemático de entrevista.",
  "To gather information about behavior from interviews, forms, or rating scales.": "Para recoger información sobre la conducta a partir de entrevistas, formularios o escalas de valoración.",
  "To gather information by directly observing behavior.": "Para recoger información observando directamente la conducta.",
  "To gather information by directly observing the learner's behavior.": "Para recoger información observando directamente la conducta del aprendiz.",
  "To give the team a concise factual overview of session performance.": "Para dar al equipo una visión general breve y factual del desempeño de la sesión.",
  "To guide consistent implementation of behavior reduction procedures.": "Para guiar una implementación consistente de los procedimientos de reducción de conducta.",
  "To guide consistent implementation of skill teaching.": "Para guiar una implementación consistente de la enseñanza de habilidades.",
  "To guide responding using a gesture rather than physical contact.": "Para guiar la respuesta usando un gesto en lugar de contacto físico.",
  "To guide responding using spoken cues.": "Para guiar la respuesta usando señales verbales.",
  "To help a skill transfer across people, settings, and materials.": "Para ayudar a que una habilidad se transfiera entre personas, contextos y materiales.",
  "To identify common triggers that precede behavior.": "Para identificar desencadenantes comunes que preceden a la conducta.",
  "To identify contextual variables that may influence later behavior.": "Para identificar variables contextuales que pueden influir en la conducta posterior.",
  "To identify current skill levels within an instructional curriculum.": "Para identificar niveles actuales de habilidades dentro de un currículo instructivo.",
  "To identify environmental variables relevant to assessment findings.": "Para identificar variables ambientales relevantes para los hallazgos de evaluación.",
  "To identify events that temporarily decrease the value of a consequence.": "Para identificar eventos que disminuyen temporalmente el valor de una consecuencia.",
  "To identify events that temporarily increase the value of a consequence.": "Para identificar eventos que aumentan temporalmente el valor de una consecuencia.",
  "To identify inconsistent implementation of a written procedure.": "Para identificar una implementación inconsistente de un procedimiento escrito.",
  "To identify items or activities that may function as reinforcers.": "Para identificar elementos o actividades que pueden funcionar como reforzadores.",
  "To identify likely preferred items one at a time.": "Para identificar elementos probablemente preferidos uno a la vez.",
  "To identify naturally occurring behavior patterns in context.": "Para identificar patrones de conducta que ocurren naturalmente en contexto.",
  "To identify relative preference among several items.": "Para identificar la preferencia relativa entre varios elementos.",
  "To identify situations that could blur professional roles.": "Para identificar situaciones que podrían difuminar los roles profesionales.",
  "To identify skills that are already in the learner's repertoire.": "Para identificar habilidades que ya están en el repertorio del aprendiz.",
  "To identify skills that need intervention.": "Para identificar habilidades que necesitan intervención.",
  "To identify social skill strengths and needs.": "Para identificar fortalezas y necesidades en habilidades sociales.",
  "To identify the likely function of problem behavior using multiple assessment methods.": "Para identificar la función probable de la conducta problema usando múltiples métodos de evaluación.",
  "To identify what usually follows and may maintain behavior.": "Para identificar qué suele seguir a la conducta y puede mantenerla.",
  "To identify whether behavior lasted through an entire interval.": "Para identificar si la conducta duró durante todo un intervalo.",
  "To identify wording that should be avoided in professional documentation.": "Para identificar expresiones que deben evitarse en la documentación profesional.",
  "To improve accuracy by recording information while it is still fresh.": "Para mejorar la precisión registrando la información mientras todavía está fresca.",
  "To improve cooperation and reduce problem behavior by offering meaningful choices.": "Para mejorar la cooperación y reducir la conducta problema ofreciendo elecciones significativas.",
  "To improve performance by responding appropriately to supervision feedback.": "Para mejorar el desempeño respondiendo adecuadamente a la retroalimentación de supervisión.",
  "To improve service quality by putting supervision feedback into action.": "Para mejorar la calidad del servicio poniendo en práctica la retroalimentación de supervisión.",
  "To increase a behavior by adding a consequence after it occurs.": "Para aumentar una conducta añadiendo una consecuencia después de que ocurre.",
  "To increase a behavior by removing an aversive event after the response.": "Para aumentar una conducta retirando un evento aversivo después de la respuesta.",
  "To interpret graphed data for decision making.": "Para interpretar datos graficados para la toma de decisiones.",
  "To interrupt problem behavior and guide the learner to a more appropriate response.": "Para interrumpir la conducta problema y guiar al aprendiz hacia una respuesta más apropiada.",
  "To interrupt repetitive behavior and redirect toward a more appropriate response.": "Para interrumpir conducta repetitiva y redirigir hacia una respuesta más apropiada.",
  "To interrupt unsafe or targeted behavior in the moment as outlined in the plan.": "Para interrumpir en el momento una conducta insegura o objetivo según lo indicado en el plan.",
  "To keep a learned skill strong after initial mastery.": "Para mantener fuerte una habilidad aprendida después del dominio inicial.",
  "To keep graphed performance current for review.": "Para mantener actualizado el desempeño graficado para su revisión.",
  "To keep records factual, professional, and useful for clinical decisions.": "Para mantener registros factuales, profesionales y útiles para decisiones clínicas.",
  "To keep records truthful and accurate.": "Para mantener registros veraces y precisos.",
  "To keep services accurate and safe by involving supervision when needed.": "Para mantener los servicios precisos y seguros involucrando supervisión cuando sea necesario.",
  "To keep treatment decisions with the supervising clinician.": "Para mantener las decisiones de tratamiento en manos del clínico supervisor.",
  "To look for patterns between antecedents, behavior, and consequences.": "Para buscar patrones entre antecedentes, conducta y consecuencias.",
  "To maintain client dignity in communication.": "Para mantener la dignidad del cliente en la comunicación.",
  "To maintain consistent and compliant professional performance.": "Para mantener un desempeño profesional consistente y conforme a las normas.",
  "To maintain professional boundaries around gifts and favors.": "Para mantener límites profesionales alrededor de regalos y favores.",
  "To maintain professionalism during challenging situations.": "Para mantener el profesionalismo durante situaciones desafiantes.",
  "To maintain responding without reinforcing every occurrence.": "Para mantener la respuesta sin reforzar cada ocurrencia.",
  "To maintain service quality through active required supervision.": "Para mantener la calidad del servicio mediante una supervisión activa y requerida.",
  "To make behavior and context quantifiable.": "Para hacer cuantificables la conducta y el contexto.",
  "To make behavior descriptions objective and consistent.": "Para hacer que las descripciones de la conducta sean objetivas y consistentes.",
  "To make supervision more accurate and productive.": "Para hacer la supervisión más precisa y productiva.",
  "To make sure the intervention is carried out as designed.": "Para asegurarse de que la intervención se lleve a cabo como fue diseñada.",
  "To make the relevant stimulus more noticeable during teaching.": "Para hacer más notorio el estímulo relevante durante la enseñanza.",
  "To measure behavior by looking at its lasting result.": "Para medir la conducta observando su resultado duradero.",
  "To measure how quickly a behavior starts after a cue.": "Para medir qué tan rápido comienza una conducta después de una señal.",
  "To measure the length of time a behavior continues.": "Para medir cuánto tiempo continúa una conducta.",
  "To measure the spacing between consecutive responses.": "Para medir el intervalo entre respuestas consecutivas.",
  "To minimize mistakes during initial instruction by providing immediate support.": "Para minimizar errores durante la instrucción inicial proporcionando apoyo inmediato.",
  "To monitor and reduce immediate risk during behavior support.": "Para monitorear y reducir el riesgo inmediato durante el apoyo conductual.",
  "To move responding from prompts to natural cues.": "Para mover la respuesta de las ayudas a las señales naturales.",
  "To note whether behavior occurred at any point during each interval.": "Para anotar si la conducta ocurrió en algún momento durante cada intervalo.",
  "To prepare the environment and materials required by the teaching plan.": "Para preparar el ambiente y los materiales requeridos por el plan de enseñanza.",
  "To present performance in a more interpretable format.": "Para presentar el desempeño en un formato más interpretable.",
  "To preserve an accurate record of clinically relevant communication after the session.": "Para preservar un registro preciso de la comunicación clínicamente relevante después de la sesión.",
  "To prevent blurred roles after services change or end.": "Para prevenir la confusión de roles después de que los servicios cambien o terminen.",
  "To prevent implementation errors when directions are unclear.": "Para prevenir errores de implementación cuando las instrucciones no están claras.",
  "To prevent problem behavior by changing triggers before it starts.": "Para prevenir la conducta problema cambiando los desencadenantes antes de que comience.",
  "To protect client confidentiality in record keeping.": "Para proteger la confidencialidad del cliente en el mantenimiento de registros.",
  "To protect client confidentiality on personal or public online platforms.": "Para proteger la confidencialidad del cliente en plataformas personales o públicas en línea.",
  "To protect client rights throughout service delivery.": "Para proteger los derechos del cliente durante toda la prestación del servicio.",
  "To protect confidentiality by limiting disclosure to what is necessary.": "Para proteger la confidencialidad limitando la divulgación a lo necesario.",
  "To protect confidentiality when others are present.": "Para proteger la confidencialidad cuando hay otras personas presentes.",
  "To protect private client information.": "Para proteger la información privada del cliente.",
  "To protect the client by reporting serious safety concerns without delay.": "Para proteger al cliente reportando preocupaciones serias de seguridad sin demora.",
  "To protect the client by staying within the responsibilities of the RBT role.": "Para proteger al cliente manteniéndose dentro de las responsabilidades del rol RBT.",
  "To protect the learner's privacy, respect, and humane treatment.": "Para proteger la privacidad, el respeto y el trato humano del aprendiz.",
  "To provide a more appropriate way to meet the same need.": "Para ofrecer una manera más apropiada de satisfacer la misma necesidad.",
  "To provide services in a way that respects the family's values and context.": "Para brindar servicios de una manera que respete los valores y el contexto de la familia.",
  "To rank preferences efficiently by removing each selected item after it is chosen.": "Para ordenar preferencias de manera eficiente retirando cada elemento seleccionado después de que se elige.",
  "To recognize expected short-term effects that can occur during extinction.": "Para reconocer efectos esperados a corto plazo que pueden ocurrir durante la extinción.",
  "To recognize how unrecorded observations weaken data interpretation.": "Para reconocer cómo las observaciones no registradas debilitan la interpretación de datos.",
  "To recognize the danger of basing decisions on poor-quality data.": "Para reconocer el peligro de basar decisiones en datos de mala calidad.",
  "To recognize the temporary worsening that can happen when extinction first starts.": "Para reconocer el empeoramiento temporal que puede ocurrir cuando la extinción comienza por primera vez.",
  "To record health-related factors that may affect treatment or performance.": "Para registrar factores relacionados con la salud que pueden afectar el tratamiento o el desempeño.",
  "To record important communication with caregivers in a professional way.": "Para registrar comunicación importante con cuidadores de manera profesional.",
  "To record performance on each teaching opportunity separately.": "Para registrar el desempeño en cada oportunidad de enseñanza por separado.",
  "To record what was communicated to the caregiver about the session.": "Para registrar lo que se comunicó al cuidador sobre la sesión.",
  "To reduce a behavior by no longer delivering the maintaining consequence.": "Para reducir una conducta dejando de entregar la consecuencia que la mantiene.",
  "To reduce a behavior to a lower rate while allowing some occurrence.": "Para reducir una conducta a una tasa más baja permitiendo cierta ocurrencia.",
  "To reduce attention-maintained behavior by withholding attention according to the plan.": "Para reducir conducta mantenida por atención retirando la atención según el plan.",
  "To reduce behavior maintained by attention by no longer delivering attention after it.": "Para reducir conducta mantenida por atención dejando de entregar atención después de ella.",
  "To reduce behavior maintained by tangible items by no longer providing the item after the problem behavior.": "Para reducir conducta mantenida por elementos tangibles dejando de proporcionar el elemento después de la conducta problema.",
  "To reduce behavior using interventions aligned with its function.": "Para reducir la conducta usando intervenciones alineadas con su función.",
  "To reduce escape-maintained behavior by no longer allowing the task to be removed because of the problem behavior.": "Para reducir conducta mantenida por escape dejando de permitir que se retire la tarea a causa de la conducta problema.",
  "To reduce motivation for problem behavior by delivering reinforcement on a schedule.": "Para reducir la motivación para la conducta problema entregando reforzamiento según un programa.",
  "To reduce problem behavior by prompting the expected behavior in advance.": "Para reducir la conducta problema dando la ayuda de la conducta esperada con anticipación.",
  "To reduce the likelihood of problem behavior by changing conditions in advance.": "Para reducir la probabilidad de conducta problema cambiando las condiciones con anticipación.",
  "To reinforce a behavior that cannot happen at the same time as the problem behavior.": "Para reforzar una conducta que no puede ocurrir al mismo tiempo que la conducta problema.",
  "To reinforce behavior after a specific number of responses.": "Para reforzar la conducta después de un número específico de respuestas.",
  "To reinforce behavior after a varying number of responses.": "Para reforzar la conducta después de un número variable de respuestas.",
  "To reinforce periods in which the problem behavior does not occur.": "Para reforzar periodos en los que la conducta problema no ocurre.",
  "To reinforce responding after a fixed time interval.": "Para reforzar la respuesta después de un intervalo fijo de tiempo.",
  "To reinforce responding after changing time intervals.": "Para reforzar la respuesta después de intervalos de tiempo cambiantes.",
  "To replace attention-maintained problem behavior with an appropriate request.": "Para reemplazar conducta problema mantenida por atención con una petición apropiada.",
  "To replace escape-maintained problem behavior with an appropriate request.": "Para reemplazar conducta problema mantenida por escape con una petición apropiada.",
  "To replace item-seeking problem behavior with an appropriate request.": "Para reemplazar conducta problema de búsqueda de objetos con una petición apropiada.",
  "To replace problem behavior with an effective communication response.": "Para reemplazar la conducta problema con una respuesta de comunicación efectiva.",
  "To respond safely and consistently during behavioral emergencies.": "Para responder de forma segura y consistente durante emergencias conductuales.",
  "To sample current performance efficiently.": "Para muestrear el desempeño actual de manera eficiente.",
  "To share important treatment information promptly with the supervisor and team.": "Para compartir oportunamente información importante del tratamiento con el supervisor y el equipo.",
  "To show how much assistance the learner needed on each response.": "Para mostrar cuánta ayuda necesitó el aprendiz en cada respuesta.",
  "To show relevant events alongside graphed performance.": "Para mostrar eventos relevantes junto al desempeño graficado.",
  "To show the learner what response to perform.": "Para mostrarle al aprendiz qué respuesta debe emitir.",
  "To strengthen a new response with reinforcement after every occurrence.": "Para fortalecer una nueva respuesta con reforzamiento después de cada ocurrencia.",
  "To strengthen an appropriate alternative response that can replace problem behavior.": "Para fortalecer una respuesta alternativa apropiada que pueda reemplazar la conducta problema.",
  "To strengthen responding using a learned reinforcer.": "Para fortalecer la respuesta usando un reforzador aprendido.",
  "To summarize how long each instance of a behavior tends to last.": "Para resumir cuánto suele durar cada ocurrencia de una conducta.",
  "To summarize how often a response occurred when it could have occurred.": "Para resumir con qué frecuencia ocurrió una respuesta cuando podía haber ocurrido.",
  "To summarize meaningful changes in behavior patterns over time.": "Para resumir cambios significativos en los patrones de conducta a lo largo del tiempo.",
  "To summarize the average length of response episodes.": "Para resumir la duración promedio de los episodios de respuesta.",
  "To summarize the context of a significant behavior episode in sequence.": "Para resumir en secuencia el contexto de un episodio significativo de conducta.",
  "To summarize the most likely maintaining variable for a behavior.": "Para resumir la variable más probable que mantiene una conducta.",
  "To support assessment procedures within the RBT role.": "Para apoyar procedimientos de evaluación dentro del rol del RBT.",
  "To support behavior safely while minimizing unnecessary restriction.": "Para apoyar la conducta de manera segura minimizando restricciones innecesarias.",
  "To support coordinated care while staying within role and confidentiality expectations.": "Para apoyar una atención coordinada manteniéndose dentro del rol y de las expectativas de confidencialidad.",
  "To support dignity and collaboration by honoring reasonable client preferences.": "Para apoyar la dignidad y la colaboración respetando preferencias razonables del cliente.",
  "To support service delivery within the bounds of authorized consent.": "Para apoyar la prestación de servicios dentro de los límites del consentimiento autorizado.",
  "To teach a chained skill by starting with the earliest step.": "Para enseñar una habilidad encadenada comenzando con el primer paso.",
  "To teach a chained skill by starting with the final step.": "Para enseñar una habilidad encadenada comenzando con el último paso.",
  "To teach an entire chained skill within each trial.": "Para enseñar una habilidad encadenada completa dentro de cada ensayo.",
  "To teach skills through structured repeated teaching trials.": "Para enseñar habilidades mediante ensayos de enseñanza estructurados y repetidos.",
  "To teach skills within natural routines and learner motivation.": "Para enseñar habilidades dentro de rutinas naturales y aprovechando la motivación del aprendiz.",
  "To teach the learner to respond differently to relevant cues.": "Para enseñar al aprendiz a responder de manera diferente ante señales relevantes.",
  "To transfer responding to the natural cue by delaying prompts over time.": "Para transferir la respuesta a la señal natural retrasando las ayudas con el tiempo.",
  "To transfer stimulus control and build independent responding.": "Para transferir el control del estímulo y construir respuestas independientes.",
  "To turn a complex routine into smaller teachable steps.": "Para convertir una rutina compleja en pasos más pequeños y enseñables.",
  "To understand current behavior levels before changing treatment.": "Para comprender los niveles actuales de conducta antes de cambiar el tratamiento.",
  "To watch for signs the learner is willing or unwilling to participate.": "Para observar señales de que el aprendiz está dispuesto o no a participar."
};

function translatePurposeText(text) {
  const trimmed = String(text || "").trim();
  const directMap = PURPOSE_TEXT_TRANSLATIONS[trimmed] || UI_TRANSLATIONS[trimmed];
  if (directMap) {
    return directMap;
  }

  const purposeMatch = trimmed.match(/^To\s+(.+?)[.]?$/i);
  if (purposeMatch) {
    const remainder = purposeMatch[1].trim();
    const translatedRemainder = applyQuestionSentenceReplacements(translateToSpanish(remainder));
    return `Para ${translatedRemainder.charAt(0).toLowerCase()}${translatedRemainder.slice(1)}`;
  }

  const fullTranslation = applyQuestionSentenceReplacements(translateToSpanish(trimmed));
  return fullTranslation;
}

function translateQuestionSentence(text) {
  return applyQuestionSentenceReplacements(translateToSpanish(text));
}

function translateQuestionText(text) {
  const value = String(text || "").trim();
  if (!value) {
    return "";
  }

  const definitionMatch = value.match(/^Which concept is being described as (.+)$/i);
  if (definitionMatch) {
    return `¿Qué concepto se describe como ${stripTrailingPeriod(translateQuestionSentence(definitionMatch[1]))}?`;
  }

  const scenarioMatch = value.match(/^(.+)\s+Which concept is the best match\?$/i);
  if (scenarioMatch) {
    return `${translateQuestionSentence(scenarioMatch[1].trim())} ¿Qué concepto encaja mejor?`;
  }

  const purposeMatch = value.match(/^What is the main goal of (.+)\?$/i);
  if (purposeMatch) {
    return `¿Cuál es el objetivo principal de ${stripTrailingPeriod(translateQuestionSentence(purposeMatch[1]))}?`;
  }

  return translateQuestionSentence(value);
}

function translateExplanationText(text) {
  const value = String(text || "").trim();
  if (!value) {
    return "";
  }

  const purposeSplit = value.match(/^(.+?)\s+The main goal is\s+(.+)$/i);
  if (purposeSplit) {
    return `${translateQuestionSentence(purposeSplit[1])} El objetivo principal es ${stripTrailingPeriod(stripLeadingPara(translatePurposeText(purposeSplit[2]))).toLowerCase()}.`;
  }

  return translateQuestionSentence(value);
}

function translateOptionText(optionText, question) {
  if (!optionText) {
    return "";
  }

  if (question?.id?.endsWith("_purpose")) {
    return translatePurposeText(optionText);
  }

  return applyQuestionSentenceReplacements(translateToSpanish(optionText));
}

export function localizeText(text, language) {
  const english = String(text || "");
  const spanish = translateToSpanish(english);

  if (language === "es") {
    return { primary: spanish || english, secondary: "" };
  }

  return { primary: english, secondary: "" };
}

function translateDynamicUi(label) {
  const text = String(label || "").trim();
  let match = text.match(/^You have covered (\d+)% of the full bank so far\. Readiness will become more meaningful as coverage grows\.$/);
  if (match) {
    return `Has cubierto ${match[1]}% del banco completo hasta ahora. La preparación será más útil a medida que aumente tu cobertura.`;
  }

  match = text.match(/^Exam readiness at (\d+)% based on your overall progress, mock exam history, and bank coverage\.$/);
  if (match) {
    return `Preparación para el examen en ${match[1]}% según tu progreso general, tu historial de simulados y la cobertura del banco.`;
  }

  match = text.match(/^Study streak (\d+) days$/);
  if (match) {
    return `Racha de estudio de ${match[1]} días`;
  }

  match = text.match(/^(\d+)\/(\d+) answered$/);
  if (match) {
    return `${match[1]}/${match[2]} respondidas`;
  }

  match = text.match(/^(\d+) answered so far$/);
  if (match) {
    return `${match[1]} respondidas hasta ahora`;
  }

  match = text.match(/^(\d+) of (\d+) answered$/);
  if (match) {
    return `${match[1]} de ${match[2]} respondidas`;
  }

  match = text.match(/^(\d+) answered$/);
  if (match) {
    return `${match[1]} respondidas`;
  }

  match = text.match(/^(\d+) days$/);
  if (match) {
    return `${match[1]} días`;
  }

  match = text.match(/^(\d+) free answers left today$/);
  if (match) {
    return `Te quedan ${match[1]} respuestas gratis hoy`;
  }

  match = text.match(/^(\d+) answered per day$/);
  if (match) {
    return `${match[1]} respondidas por día`;
  }

  match = text.match(/^(\d+) answered practice questions each day$/);
  if (match) {
    return `${match[1]} preguntas de práctica respondidas por día`;
  }

  match = text.match(/^Premium unlocks unlimited answers across the curated (\d+)-question official-style bank\.$/);
  if (match) {
    return `Premium desbloquea respuestas ilimitadas en el banco curado de ${match[1]} preguntas con estilo oficial.`;
  }

  match = text.match(/^Free accounts can answer (\d+) practice questions per day across the curated (\d+)-question official-style bank\.$/);
  if (match) {
    return `Las cuentas gratis pueden responder ${match[1]} preguntas de práctica por día dentro del banco curado de ${match[2]} preguntas con estilo oficial.`;
  }

  match = text.match(/^Unlimited practice from the curated (\d+)-question bank$/);
  if (match) {
    return `Práctica ilimitada del banco curado de ${match[1]} preguntas`;
  }

  match = text.match(/^Guided by (\d+) mock exams? and your (\d+)-question bank coverage$/);
  if (match) {
    return `Guiado por ${match[1]} simulacro${match[1] === "1" ? "" : "s"} y tu cobertura del banco de ${match[2]} preguntas`;
  }

  match = text.match(/^Coverage-adjusted from your (\d+)-question bank$/);
  if (match) {
    return `Ajustado según tu cobertura del banco de ${match[1]} preguntas`;
  }

  match = text.match(/^Scores become reliable after at least (\d+) attempts per domain\.$/);
  if (match) {
    return `Los puntajes se vuelven confiables después de al menos ${match[1]} intentos por dominio.`;
  }

  match = text.match(/^(\d+) mock exams tracked$/);
  if (match) {
    return `${match[1]} simulacros registrados`;
  }

  match = text.match(/^(\d+) mock exam(?:s)? below the target score so far\.$/);
  if (match) {
    return `${match[1]} simulacro${match[1] === "1" ? "" : "s"} por debajo del puntaje objetivo hasta ahora.`;
  }

  match = text.match(/^Joined (.+)$/);
  if (match) {
    return `Se unió ${match[1]}`;
  }

  match = text.match(/^(\d+) questions completed$/);
  if (match) {
    return `${match[1]} preguntas completadas`;
  }

  match = text.match(/^(\d+)% readiness$/);
  if (match) {
    return `${match[1]}% de preparación`;
  }

  match = text.match(/^(\d+) day streak$/);
  if (match) {
    return `${match[1]} días de racha`;
  }

  match = text.match(/^(\d+) exams$/);
  if (match) {
    return `${match[1]} exámenes`;
  }

  match = text.match(/^(\d+) payments$/);
  if (match) {
    return `${match[1]} pagos`;
  }

  match = text.match(/^\$([0-9]+(?:\.[0-9]{2})?) paid$/);
  if (match) {
    return `$${match[1]} pagados`;
  }

  match = text.match(/^Current plan: (.+)$/);
  if (match) {
    return `Plan actual: ${translateUi(match[1], "es")}`;
  }

  return null;
}

export function translateUi(label, language) {
  if (language === "en") {
    return label;
  }

  return UI_TRANSLATIONS[label] || translateDynamicUi(label) || translateToSpanish(label);
}

export function translateTopic(topic, language) {
  const translated = TOPIC_TRANSLATIONS[topic] || topic;
  if (language === "en") {
    return topic;
  }
  return translated;
}

export function translateDifficulty(difficulty, language) {
  const translated = DIFFICULTY_TRANSLATIONS[difficulty] || difficulty;
  if (language === "en") {
    return difficulty;
  }
  return translated;
}

const ENGLISH_LEAK_TOKENS = new Set([
  "which", "what", "when", "where", "while", "before", "after", "during", "instead",
  "look", "ask", "teach", "teaching", "skill", "skills", "prompt", "prompting",
  "model", "physical", "written", "session", "sessions", "recording", "data",
  "behavior", "response", "responses", "consequence", "reinforcement", "function",
  "intervention", "schedule", "report", "reporting", "team", "learner", "client",
  "caregiver", "supervisor", "current", "baseline", "assessment", "preference",
  "prevention", "support", "strategy", "natural", "control", "analysis", "task",
  "shaping", "extinction", "duration", "latency", "frequency", "interval", "rate",
  "trial", "trials", "performance", "recorded", "collecting", "collected", "write",
  "writing", "guide", "helpful", "objective", "factual", "schedule", "tokens",
  "backup", "reinforcers", "occurrence", "occurrences", "capture", "compare",
  "build", "strong", "initial", "mastery", "independence", "evaluate", "observing",
  "observed", "happening", "happened", "using", "preferred", "rank", "functions",
  "through", "around", "maintaining", "change", "changes", "quality", "accurate",
  "details", "event", "events", "steps", "routine", "chain", "whole", "entire",
  "context", "contexts", "patterns", "variables", "rights", "services", "safety",
  "medication", "communication", "record", "records", "notes", "incident", "injury",
  "reinforcer", "restrictive", "graph", "graphed", "trend", "level", "variability",
  "immediacy", "temporary", "gesture", "discrete", "natural", "environment",
  "drops", "floor", "collecting", "aggression", "rotates", "toys", "snacks",
  "classwork", "lunch", "hour", "maps", "aggressive", "modeling", "guidance",
  "handwashing", "pictures", "lazy", "left", "tasks", "criterion", "tracking",
  "entry", "transcription", "writing", "label", "labels", "plan", "verbal",
  "only", "adds", "begins", "twice", "know", "long", "continues", "happening",
  "looks", "toward", "full", "spoken", "ball", "saying", "teeth", "brushing",
  "routine", "lists", "part", "order", "completed",
]);

function hasEnglishLeak(text) {
  const words = String(text || "")
    .toLowerCase()
    .match(/[a-z']+/g);

  if (!words) {
    return false;
  }

  return words.some((word) => ENGLISH_LEAK_TOKENS.has(word));
}

export function localizeQuestion(question, language) {
  if (!question) {
    return null;
  }

  const concept = questionConceptLookup[question.concept_id];
  const questionKind = question.id?.split("_").pop();
  const spanishQuestionText = concept
    ? questionKind === "definition"
      ? `¿Qué concepto se describe como ${stripTrailingPeriod(translateQuestionSentence(concept.definition))}?`
      : questionKind === "scenario"
        ? `${translateQuestionSentence(concept.scenario)} ¿Qué concepto encaja mejor?`
        : questionKind === "purpose"
          ? `¿Cuál es el objetivo principal de ${stripTrailingPeriod(translateQuestionSentence(concept.answer))}?`
          : translateQuestionText(question.text)
    : translateQuestionText(question.text);
  const spanishExplanation = concept
    ? questionKind === "purpose"
      ? `${translateQuestionSentence(concept.explanation)} El objetivo principal es ${stripTrailingPeriod(stripLeadingPara(translatePurposeText(concept.purpose))).toLowerCase()}.`
      : translateQuestionSentence(concept.explanation)
    : translateExplanationText(question.explanation);

  const localizedText =
    language === "es"
      ? { primary: spanishQuestionText, secondary: "" }
      : localizeText(question.text, language);
  const localizedExplanation =
    language === "es"
      ? { primary: spanishExplanation, secondary: "" }
      : localizeText(question.explanation, language);
  const localizedExamPattern =
    language === "es"
      ? { primary: translateUi(question.exam_pattern, "es"), secondary: "" }
      : localizeText(question.exam_pattern, language);
  const localizedExamClue =
    language === "es"
      ? { primary: translateQuestionSentence(question.exam_clue), secondary: "" }
      : localizeText(question.exam_clue, language);
  const localizedCommonTrap =
    language === "es"
      ? { primary: translateQuestionSentence(question.common_trap), secondary: "" }
      : localizeText(question.common_trap, language);
  const localizedOptions = (question.options || []).map((option) => ({
    ...option,
    localizedText:
      language === "es"
        ? { primary: translateOptionText(option.text, question), secondary: "" }
        : localizeText(option.text, language),
  }));

  const shouldFallbackToEnglish =
    language === "es" &&
    [
      spanishQuestionText,
      spanishExplanation,
      localizedExamClue.primary,
      localizedCommonTrap.primary,
      ...localizedOptions.map((option) => option.localizedText.primary),
    ].some(hasEnglishLeak);

  if (shouldFallbackToEnglish) {
    return {
      ...question,
      localizedTopic: translateTopic(question.topic, language),
      localizedDifficulty: translateDifficulty(question.difficulty, language),
      localizedText: localizeText(question.text, "en"),
      localizedExplanation: localizeText(question.explanation, "en"),
      localizedExamPattern: localizeText(question.exam_pattern, "en"),
      localizedExamClue: localizeText(question.exam_clue, "en"),
      localizedCommonTrap: localizeText(question.common_trap, "en"),
      options: (question.options || []).map((option) => ({
        ...option,
        localizedText: localizeText(option.text, "en"),
      })),
    };
  }

  return {
    ...question,
    localizedTopic: translateTopic(question.topic, language),
    localizedDifficulty: translateDifficulty(question.difficulty, language),
    localizedText,
    localizedExplanation,
    localizedExamPattern,
    localizedExamClue,
    localizedCommonTrap,
    options: localizedOptions,
  };
}
