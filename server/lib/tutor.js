function hasAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

function conceptReply({ title, summary, whyItMatters, example, examTip }) {
  return [
    `**${title}**`,
    "",
    summary,
    "",
    `**Why it matters**: ${whyItMatters}`,
    "",
    `**Example**: ${example}`,
    "",
    `**Exam tip**: ${examTip}`,
  ].join("\n");
}

function quizReply(title, questions) {
  return [
    `**Quick quiz: ${title}**`,
    "",
    ...questions.map(
      (question, index) =>
        `${index + 1}. ${question.prompt}\n   Answer: ${question.answer}`,
    ),
    "",
    "If you want, I can also quiz you one question at a time without showing the answer first.",
  ].join("\n");
}

export function createTutorReply(text) {
  const normalized = String(text || "").trim().toLowerCase();
  const now = new Date();
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);

  if (
    hasAny(normalized, [
      "what day is today",
      "what day is it",
      "what date is today",
      "today's date",
      "que dia es hoy",
      "que día es hoy",
    ])
  ) {
    return `Today is **${todayLabel}**.`;
  }

  if (hasAny(normalized, ["quiz me", "test me", "practice me"])) {
    return quizReply("core RBT concepts", [
      {
        prompt: "What does positive reinforcement do to a future behavior?",
        answer: "It increases the future likelihood of that behavior.",
      },
      {
        prompt: "What is the purpose of collecting data as an RBT?",
        answer: "To measure progress accurately and support treatment decisions.",
      },
      {
        prompt: "What is the goal of prompt fading?",
        answer: "To transfer control to natural cues and build independence.",
      },
    ]);
  }

  if (hasAny(normalized, ["study plan", "how should i study", "study schedule"])) {
    return [
      "**Simple RBT study plan**",
      "",
      "1. Review one domain for 15 to 20 minutes.",
      "2. Do 10 to 15 practice questions from that domain.",
      "3. Read every explanation for missed answers.",
      "4. Ask the tutor to explain the two weakest concepts again in simpler words.",
      "5. Finish with one quick mock block or flashcard round.",
      "",
      "**Best rhythm**: short daily sessions usually work better than one very long session.",
    ].join("\n");
  }

  if (hasAny(normalized, ["why is this wrong", "why is that wrong", "why wrong"])) {
    return [
      "**How to review a wrong answer**",
      "",
      "When an answer is wrong, ask yourself three things:",
      "1. What concept is the question really testing?",
      "2. What word in the option makes it wrong?",
      "3. What would make the correct option safer, more ethical, or more functional?",
      "",
      "If you paste the full question with the answer choices, I can break down exactly why one option is correct and why the others are not.",
    ].join("\n");
  }

  if (hasAny(normalized, ["example", "give me an example"])) {
    return [
      "**ABA example**",
      "",
      "A learner says `water` after being prompted. The technician immediately gives water and praise. If that response happens more often in the future, that is positive reinforcement.",
      "",
      "If you want, I can give you another example for reinforcement, prompting, task analysis, behavior reduction, or data collection.",
    ].join("\n");
  }

  if (hasAny(normalized, ["discrete trial", "dtt"])) {
    return conceptReply({
      title: "Discrete Trial Training",
      summary:
        "Discrete trial training is a structured teaching format with a clear instruction, learner response, and consequence.",
      whyItMatters:
        "it helps teach skills in small, repeatable steps so performance is easier to measure and improve",
      example:
        "the instructor says `touch red`, the learner responds, and the technician gives reinforcement for the correct response",
      examTip:
        "remember the sequence: instruction, response, consequence, then brief pause before the next trial",
    });
  }

  if (normalized.includes("positive reinforcement")) {
    return conceptReply({
      title: "Positive Reinforcement",
      summary:
        "Positive reinforcement means adding something valuable right after a behavior so that the behavior is more likely to happen again.",
      whyItMatters:
        "it is one of the most tested ABA principles and shows up constantly in RBT-style questions",
      example:
        "a learner answers correctly, then receives praise or access to a preferred item",
      examTip:
        "if the question asks whether behavior increases in the future, positive reinforcement is often the target concept",
    });
  }

  if (hasAny(normalized, ["negative reinforcement", "punishment", "difference between reinforcement and punishment"])) {
    return [
      "**Reinforcement vs punishment**",
      "",
      "- **Reinforcement** increases a future behavior.",
      "- **Punishment** decreases a future behavior.",
      "- **Positive** means something is added.",
      "- **Negative** means something is removed.",
      "",
      "**Memory tip**: ignore whether the event feels good or bad. First ask, `Did the behavior go up or down afterward?`",
    ].join("\n");
  }

  if (hasAny(normalized, ["prompting", "prompt hierarchy", "least to most", "most to least"])) {
    return conceptReply({
      title: "Prompting and Prompt Fading",
      summary:
        "Prompts are extra cues that help the learner respond correctly, and prompt fading reduces that help over time.",
      whyItMatters:
        "the goal is not just a correct response today, but independent responding later",
      example:
        "you start with a gesture prompt, then fade it so the learner responds to the natural cue alone",
      examTip:
        "if the question asks about preventing prompt dependence, think prompt fading and transfer of stimulus control",
    });
  }

  if (hasAny(normalized, ["data collection", "taking data", "recording data"])) {
    return conceptReply({
      title: "Data Collection",
      summary:
        "Data collection means recording behavior or skill performance accurately and consistently according to the treatment plan.",
      whyItMatters:
        "supervisors rely on clean data to judge progress and make treatment decisions",
      example:
        "tracking frequency of aggression or percentage of independent correct responses",
      examTip:
        "when the safest answer talks about objectivity, consistency, or treatment decisions, data collection is usually central",
    });
  }

  if (hasAny(normalized, ["task analysis", "chaining", "forward chaining", "backward chaining"])) {
    return conceptReply({
      title: "Task Analysis and Chaining",
      summary:
        "A task analysis breaks a skill into smaller teachable steps, and chaining teaches the steps in an ordered sequence.",
      whyItMatters:
        "it makes complex skills easier to teach, monitor, and reinforce",
      example:
        "washing hands can be broken into turning on water, wetting hands, adding soap, scrubbing, rinsing, and drying",
      examTip:
        "if the question focuses on step-by-step teaching of a routine, think task analysis first",
    });
  }

  if (hasAny(normalized, ["functional behavior assessment", "fba", "function of behavior"])) {
    return conceptReply({
      title: "Functional Behavior Assessment",
      summary:
        "A functional behavior assessment identifies why a behavior happens by looking at antecedents, behavior, and consequences.",
      whyItMatters:
        "interventions are stronger when they match the real function of the behavior",
      example:
        "if aggression usually leads to escape from tasks, the behavior may be maintained by escape",
      examTip:
        "before choosing an intervention, exam questions often expect you to identify function or gather more ABC data first",
    });
  }

  if (hasAny(normalized, ["replacement behavior", "behavior reduction"])) {
    return [
      "**Replacement behavior**",
      "",
      "A good replacement behavior should:",
      "- serve the same function as the problem behavior",
      "- be easier or more efficient for the learner to use",
      "- be acceptable and teachable",
      "",
      "**Exam tip**: if an option is harder, slower, or less useful than the original behavior, it is usually not the best replacement behavior.",
    ].join("\n");
  }

  if (hasAny(normalized, ["ethics", "professional conduct", "supervisor"])) {
    return [
      "**Professional conduct reminder**",
      "",
      "RBTs should stay within their role, follow the treatment plan, protect confidentiality, collect data accurately, and ask the supervisor for guidance when a request falls outside their competence or authorization.",
      "",
      "If you want, I can turn this into a quick ethics quiz or give you common exam-style scenarios.",
    ].join("\n");
  }

  if (hasAny(normalized, ["rbt exam", "exam tips", "study tips"])) {
    return [
      "**RBT exam prep tips**",
      "",
      "1. Practice in short daily blocks instead of cramming.",
      "2. Review missed questions by concept, not only by answer.",
      "3. Focus heavily on reinforcement, prompting, data collection, ethics, and behavior reduction.",
      "4. Use mock exams to test pacing and weak domains.",
      "",
      "If you want, I can build you a 7-day mini study plan right now.",
    ].join("\n");
  }

  return [
    "I can help with:",
    "",
    "- explaining ABA or RBT concepts in simple words",
    "- giving examples",
    "- quizzing you",
    "- breaking down why an answer is wrong",
    "- building a study plan",
    "",
    "Try something like: `Quiz me on reinforcement`, `Explain prompting with an example`, or `Why is this answer wrong?`",
  ].join("\n");
}
