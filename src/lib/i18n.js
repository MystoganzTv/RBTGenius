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
  "Welcome back,": "Bienvenido de nuevo,",
  "No streak yet": "Sin racha todavía",
  "Started": "Empezada",
  "Consecutive return days": "Días consecutivos regresando",
  "Come back tomorrow to start your streak": "Vuelve mañana para empezar tu racha",
  "Questions Completed": "Preguntas completadas",
  "Average Mock Score": "Puntaje promedio en simulados",
  "Mock Exams Passed": "Simulados aprobados",
  "Current Recommendation": "Recomendación actual",
  "Take a mock exam": "Haz un examen simulado",
  "Ready for the exam": "Listo para el examen",
  "Need more mock practice": "Necesitas más práctica en simulados",
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
  professional_conduct: "Conducta profesional",
};

const DIFFICULTY_TRANSLATIONS = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const LONGEST_FIRST_REPLACEMENTS = [
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
  ["Prompt fading", "Desvanecimiento de ayudas"],
  ["Prompting and Prompt Fading", "Ayudas y desvanecimiento de ayudas"],
  ["Least-to-most prompting", "Ayuda de menos a más"],
  ["Most-to-least prompting", "Ayuda de más a menos"],
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
  ["Cultural responsiveness", "Respuesta cultural"],
  ["Visual analysis", "Análisis visual"],
  ["Interresponse time", "Tiempo entre respuestas"],
  ["Percentage correct", "Porcentaje correcto"],
  ["Percentage of opportunities", "Porcentaje de oportunidades"],
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
  ["Correct", "Correcto"],
  ["Not quite", "No del todo"],
  ["Still on", "Seguimos con"],
  ["Hint", "Pista"],
  ["Why", "Por qué"],
  ["Answer", "Respuesta"],
  ["Continuing with", "Continuando con"],
  ["Let's do one question at a time on", "Hagamos una pregunta a la vez sobre"],
  ["Next question on", "Siguiente pregunta sobre"],
];

const WORD_REPLACEMENTS = [];

const QUESTION_SENTENCE_REPLACEMENTS = [
  ["An RBT", "Un RBT"],
  ["A BCBA", "Un BCBA"],
  ["A supervisor", "Un supervisor"],
  ["the RBT", "el RBT"],
  ["the BCBA", "el BCBA"],
  ["the team", "el equipo"],
  ["a learner", "un aprendiz"],
  ["the learner", "el aprendiz"],
  ["learner", "aprendiz"],
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
  ["data", "datos"],
  ["note", "nota"],
  ["notes", "notas"],
  ["session", "sesión"],
  ["sessions", "sesiones"],
  ["supervisor", "supervisor"],
];

const QUESTION_WORD_REPLACEMENTS = [
  ["the", "el"],
  ["a", "una"],
  ["an", "un"],
  ["of", "de"],
  ["to", "a"],
  ["and", "y"],
  ["or", "o"],
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
  ["correct", "correcta"],
  ["incorrect", "incorrecta"],
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

  QUESTION_SENTENCE_REPLACEMENTS.forEach(([english, spanish]) => {
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

  LONGEST_FIRST_REPLACEMENTS.forEach(([english, spanish]) => {
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

function translatePurposeText(text) {
  const trimmed = String(text || "").trim();
  const directMap = UI_TRANSLATIONS[trimmed];
  if (directMap) {
    return directMap;
  }

  const purposeMatch = trimmed.match(/^To\s+(.+?)[.]?$/i);
  if (!purposeMatch) {
    return applyQuestionSentenceReplacements(translateToSpanish(trimmed));
  }

  const remainder = purposeMatch[1].trim();
  const translatedRemainder = applyQuestionSentenceReplacements(translateToSpanish(remainder));
  return `Para ${translatedRemainder.charAt(0).toLowerCase()}${translatedRemainder.slice(1)}`;
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
    return `${translateQuestionSentence(purposeSplit[1])} El objetivo principal es ${stripTrailingPeriod(translatePurposeText(purposeSplit[2])).toLowerCase()}.`;
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

  return translateToSpanish(optionText);
}

export function localizeText(text, language) {
  const english = String(text || "");
  const spanish = translateToSpanish(english);

  if (language === "es") {
    return { primary: spanish || english, secondary: "" };
  }

  return { primary: english, secondary: "" };
}

export function translateUi(label, language) {
  if (language === "en") {
    return label;
  }

  return UI_TRANSLATIONS[label] || translateToSpanish(label);
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
      ? `${translateQuestionSentence(concept.explanation)} El objetivo principal es ${stripTrailingPeriod(translatePurposeText(concept.purpose)).toLowerCase()}.`
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
      ? { primary: translateToSpanish(question.exam_clue), secondary: "" }
      : localizeText(question.exam_clue, language);
  const localizedCommonTrap =
    language === "es"
      ? { primary: translateToSpanish(question.common_trap), secondary: "" }
      : localizeText(question.common_trap, language);

  return {
    ...question,
    localizedTopic: translateTopic(question.topic, language),
    localizedDifficulty: translateDifficulty(question.difficulty, language),
    localizedText,
    localizedExplanation,
    localizedExamPattern,
    localizedExamClue,
    localizedCommonTrap,
    options: (question.options || []).map((option) => ({
      ...option,
      localizedText:
        language === "es"
          ? { primary: translateOptionText(option.text, question), secondary: "" }
          : localizeText(option.text, language),
    })),
  };
}
