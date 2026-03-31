export const topicLabels = {
  measurement: "Measurement",
  assessment: "Assessment",
  skill_acquisition: "Skill Acquisition",
  behavior_reduction: "Behavior Reduction",
  documentation: "Documentation",
  professional_conduct: "Professional Conduct",
};

export const TOTAL_PRACTICE_QUESTIONS = 3000;
const PRACTICE_BANK_COUNT = 10;

export const practiceBankOptions = Array.from(
  { length: PRACTICE_BANK_COUNT },
  (_, index) => {
    const bankNumber = index + 1;
    const padded = String(bankNumber).padStart(2, "0");

    return {
      id: `bank-${padded}`,
      label: `Bank ${padded}`,
    };
  },
);

export const PRACTICE_TOPIC_TOTALS = Object.keys(topicLabels).reduce((result, key) => {
  result[key] = 0;
  return result;
}, {});

const questionConcepts = [
  {
    id: "measurement_frequency",
    topic: "measurement",
    difficulty: "beginner",
    answer: "Frequency recording",
    definition: "the RBT counts each instance of a target behavior during the observation period.",
    scenario:
      "An RBT wants the exact number of times a learner hits the table during a 20-minute session.",
    purpose: "To capture how often a behavior occurs.",
    explanation:
      "Frequency recording is used when the team needs an exact count of how many times behavior happened.",
  },
  {
    id: "measurement_duration",
    topic: "measurement",
    difficulty: "beginner",
    answer: "Duration recording",
    definition: "the RBT measures how long a behavior lasts from start to finish.",
    scenario:
      "A learner cries for several minutes at a time, and the team wants to measure how long each episode lasts.",
    purpose: "To measure the length of time a behavior continues.",
    explanation:
      "Duration recording tracks how long the response lasts, not how many times it happens.",
  },
  {
    id: "measurement_latency",
    topic: "measurement",
    difficulty: "intermediate",
    answer: "Latency recording",
    definition: "the RBT measures the time between an instruction and the start of the response.",
    scenario:
      "The team wants to know how long it takes a learner to begin cleaning up after the instruction is given.",
    purpose: "To measure how quickly a behavior starts after a cue.",
    explanation:
      "Latency recording is used when the delay between a cue and the response matters clinically.",
  },
  {
    id: "measurement_partial_interval",
    topic: "measurement",
    difficulty: "intermediate",
    answer: "Partial interval recording",
    definition: "the interval is scored if behavior happened at any time during that interval.",
    scenario:
      "During recess, an RBT marks the interval as yes if yelling occurs at least once during each 30-second block.",
    purpose: "To note whether behavior occurred at any point during each interval.",
    explanation:
      "Partial interval recording marks behavior as present if it occurs at any point in the interval.",
  },
  {
    id: "measurement_permanent_product",
    topic: "measurement",
    difficulty: "intermediate",
    answer: "Permanent product recording",
    definition:
      "the team evaluates behavior by reviewing a lasting outcome instead of watching it happen live.",
    scenario:
      "A supervisor counts how many math problems were completed correctly after the worksheet is finished.",
    purpose: "To measure behavior by looking at its lasting result.",
    explanation:
      "Permanent product data rely on an observable result, such as completed work or cleaned materials.",
  },
  {
    id: "assessment_abc",
    topic: "assessment",
    difficulty: "beginner",
    answer: "ABC data",
    definition:
      "the RBT records what happened before the behavior, the behavior itself, and what happened after.",
    scenario:
      "A learner drops to the floor, and the team wants to identify patterns around what triggers and follows the behavior.",
    purpose: "To look for patterns between antecedents, behavior, and consequences.",
    explanation:
      "ABC data help the team see relationships between triggers, the behavior, and the maintaining consequence.",
  },
  {
    id: "assessment_operational_definition",
    topic: "assessment",
    difficulty: "beginner",
    answer: "Operational definition",
    definition:
      "a behavior is described in observable, measurable terms so different staff can identify it the same way.",
    scenario:
      "Before collecting data on aggression, the team writes a description that includes only actions that can be seen and counted.",
    purpose: "To make behavior descriptions objective and consistent.",
    explanation:
      "Operational definitions reduce guesswork and help different staff collect data on the same response consistently.",
  },
  {
    id: "assessment_preference",
    topic: "assessment",
    difficulty: "beginner",
    answer: "Preference assessment",
    definition: "items or activities are systematically tested to identify likely reinforcers.",
    scenario:
      "An RBT rotates toys and snacks to see which items the learner chooses most often.",
    purpose: "To identify items or activities that may function as reinforcers.",
    explanation:
      "Preference assessments help the team identify what the learner is likely to work for during teaching.",
  },
  {
    id: "assessment_baseline",
    topic: "assessment",
    difficulty: "intermediate",
    answer: "Baseline data",
    definition: "data are collected before a new intervention starts.",
    scenario:
      "Before introducing a new prompting plan, the BCBA asks the RBT to measure current performance for several sessions.",
    purpose: "To understand current behavior levels before changing treatment.",
    explanation:
      "Baseline data show the learner's starting point so later changes can be interpreted accurately.",
  },
  {
    id: "assessment_scatterplot",
    topic: "assessment",
    difficulty: "advanced",
    answer: "Scatterplot assessment",
    definition:
      "behavior data are plotted across times of day to see when patterns happen most often.",
    scenario:
      "A school team maps aggressive behavior by hour to see whether it happens more during lunch, recess, or classwork.",
    purpose: "To detect time-based patterns in behavior.",
    explanation:
      "A scatterplot is useful when the team suspects behavior is more likely at particular times of day.",
  },
  {
    id: "skill_least_to_most",
    topic: "skill_acquisition",
    difficulty: "beginner",
    answer: "Least-to-most prompting",
    definition:
      "the RBT starts with the least intrusive prompt and increases help only as needed.",
    scenario:
      "During handwashing training, the RBT begins with a verbal cue and only adds modeling or physical guidance if needed.",
    purpose: "To encourage independence before adding more intrusive help.",
    explanation:
      "Least-to-most prompting preserves the chance for independent responding before stronger prompts are added.",
  },
  {
    id: "skill_prompt_fading",
    topic: "skill_acquisition",
    difficulty: "intermediate",
    answer: "Prompt fading",
    definition:
      "prompts are gradually reduced so control transfers to the natural cue.",
    scenario:
      "A learner first needs a model to label pictures, but the RBT systematically removes that help over time.",
    purpose: "To transfer stimulus control and build independent responding.",
    explanation:
      "Prompt fading helps the learner respond to the natural cue instead of depending on the prompt.",
  },
  {
    id: "skill_shaping",
    topic: "skill_acquisition",
    difficulty: "intermediate",
    answer: "Shaping",
    definition: "successive approximations of the target behavior are reinforced.",
    scenario:
      "A learner is reinforced first for saying 'ba,' then 'ball,' as the team works toward a full spoken request.",
    purpose: "To build a new skill by reinforcing closer and closer approximations.",
    explanation:
      "Shaping is useful when the final target behavior does not happen yet and smaller approximations must be reinforced first.",
  },
  {
    id: "skill_task_analysis",
    topic: "skill_acquisition",
    difficulty: "beginner",
    answer: "Task analysis",
    definition: "a complex skill is broken into smaller teachable steps.",
    scenario:
      "To teach brushing teeth, the team lists each part of the routine in the order it should be completed.",
    purpose: "To turn a complex routine into smaller teachable steps.",
    explanation:
      "Task analysis breaks a chain into clear steps so instruction can be delivered more systematically.",
  },
  {
    id: "skill_total_task",
    topic: "skill_acquisition",
    difficulty: "advanced",
    answer: "Total task chaining",
    definition:
      "the learner practices every step of the chain during each teaching opportunity.",
    scenario:
      "During snack preparation, the learner completes every step in order with support where needed.",
    purpose: "To teach an entire chained skill within each trial.",
    explanation:
      "Total task chaining involves completing the whole chain each time rather than just one link.",
  },
  {
    id: "behavior_dra",
    topic: "behavior_reduction",
    difficulty: "beginner",
    answer: "Differential reinforcement",
    definition:
      "reinforcement is delivered for a desired alternative or incompatible response while problem behavior is not reinforced.",
    scenario:
      "An RBT gives attention for raising a hand but withholds attention for yelling out.",
    purpose: "To increase appropriate behavior while reducing problem behavior.",
    explanation:
      "Differential reinforcement builds a better response while reducing reinforcement for the problem behavior.",
  },
  {
    id: "behavior_extinction",
    topic: "behavior_reduction",
    difficulty: "intermediate",
    answer: "Extinction",
    definition:
      "the consequence that previously maintained the behavior is no longer delivered.",
    scenario:
      "A learner screams for tablet access, and staff stop providing the tablet after screaming while teaching an alternative request.",
    purpose: "To reduce a behavior by no longer delivering the maintaining consequence.",
    explanation:
      "Extinction works by withholding the reinforcer that previously kept the behavior going.",
  },
  {
    id: "behavior_fct",
    topic: "behavior_reduction",
    difficulty: "intermediate",
    answer: "Functional communication training",
    definition:
      "the learner is taught a communication response that serves the same function as the problem behavior.",
    scenario:
      "Instead of hitting to escape work, a learner is taught to request a break appropriately.",
    purpose: "To replace problem behavior with an effective communication response.",
    explanation:
      "Functional communication training teaches a safer, more acceptable response that meets the same need.",
  },
  {
    id: "behavior_antecedent",
    topic: "behavior_reduction",
    difficulty: "beginner",
    answer: "Antecedent intervention",
    definition:
      "the environment is changed before behavior occurs to reduce the likelihood of the problem behavior.",
    scenario:
      "An RBT uses a visual schedule and warnings before transitions because transitions usually trigger tantrums.",
    purpose: "To prevent problem behavior by changing triggers before it starts.",
    explanation:
      "Antecedent interventions reduce the chance that the response will happen in the first place.",
  },
  {
    id: "behavior_blocking",
    topic: "behavior_reduction",
    difficulty: "advanced",
    answer: "Response blocking",
    definition:
      "the RBT physically interrupts behavior in the moment to prevent contact with reinforcement or harm, following the plan.",
    scenario:
      "During mouthing behavior, the RBT gently blocks the response as directed by the behavior plan.",
    purpose: "To interrupt unsafe or targeted behavior in the moment as outlined in the plan.",
    explanation:
      "Response blocking is an immediate intervention used only as described in the plan and often for safety.",
  },
  {
    id: "documentation_notes",
    topic: "documentation",
    difficulty: "beginner",
    answer: "Objective session notes",
    definition: "notes describe observable events and data without opinions or labels.",
    scenario:
      "Instead of writing that a client was lazy, the RBT documents that the client completed 3 of 10 tasks and left the table twice.",
    purpose: "To keep records factual, professional, and useful for clinical decisions.",
    explanation:
      "Objective notes focus on what happened and what data were collected, not on opinions or assumptions.",
  },
  {
    id: "documentation_graphing",
    topic: "documentation",
    difficulty: "intermediate",
    answer: "Graphing data",
    definition: "data are displayed visually so trends and changes can be reviewed over time.",
    scenario:
      "A BCBA asks the RBT to update the graph so the team can see whether independent manding has increased this month.",
    purpose: "To make behavior trends easier to review and interpret.",
    explanation:
      "Graphs make patterns and changes over time easier for the clinical team to spot quickly.",
  },
  {
    id: "documentation_immediate_entry",
    topic: "documentation",
    difficulty: "beginner",
    answer: "Immediate data entry",
    definition:
      "data are recorded as soon as possible after the behavior or teaching trial.",
    scenario:
      "After each discrete trial, the RBT enters the response immediately instead of waiting until the end of session.",
    purpose: "To improve accuracy by recording information while it is still fresh.",
    explanation:
      "Recording data right away reduces memory errors and makes the record more reliable.",
  },
  {
    id: "documentation_incident_report",
    topic: "documentation",
    difficulty: "advanced",
    answer: "Incident reporting",
    definition:
      "a significant event is documented according to policy and communicated promptly.",
    scenario:
      "A client falls during session and needs first aid, so the RBT completes the required report and notifies the supervisor.",
    purpose: "To document serious events clearly and communicate them through the correct process.",
    explanation:
      "Incident reports are required when important events affect safety, health, or the integrity of services.",
  },
  {
    id: "documentation_integrity",
    topic: "documentation",
    difficulty: "intermediate",
    answer: "Treatment integrity",
    definition: "procedures are implemented the way the plan was written.",
    scenario:
      "The BCBA checks whether the RBT is delivering prompts and reinforcement exactly as the program specifies.",
    purpose: "To make sure the intervention is carried out as designed.",
    explanation:
      "Treatment integrity matters because even good plans do not work as intended if they are implemented inconsistently.",
  },
  {
    id: "professional_scope",
    topic: "professional_conduct",
    difficulty: "beginner",
    answer: "Scope of competence",
    definition:
      "the RBT works only within the tasks, training, and authorization allowed for the role.",
    scenario:
      "A parent asks the RBT to change the behavior plan, but the RBT knows treatment changes must go through the BCBA.",
    purpose: "To protect the client by staying within the responsibilities of the RBT role.",
    explanation:
      "RBTs should not make independent treatment changes outside their role or training.",
  },
  {
    id: "professional_supervision",
    topic: "professional_conduct",
    difficulty: "beginner",
    answer: "Seeking supervision",
    definition: "the RBT seeks feedback or guidance when unsure how to proceed.",
    scenario:
      "An intervention is not going as expected, so the RBT brings data and questions to the supervisor instead of improvising.",
    purpose: "To keep services accurate and safe by involving supervision when needed.",
    explanation:
      "Seeking supervision protects the client and keeps services aligned with the treatment plan.",
  },
  {
    id: "professional_confidentiality",
    topic: "professional_conduct",
    difficulty: "beginner",
    answer: "Confidentiality",
    definition:
      "client information is shared only with authorized people and through appropriate channels.",
    scenario:
      "An RBT avoids discussing a client's treatment details with friends and keeps session documents secure.",
    purpose: "To protect private client information.",
    explanation:
      "Confidentiality requires protecting private information in conversation, storage, and communication.",
  },
  {
    id: "professional_boundaries",
    topic: "professional_conduct",
    difficulty: "intermediate",
    answer: "Professional boundaries",
    definition:
      "relationships with clients and families stay therapeutic and professional rather than social or personal.",
    scenario:
      "A family invites the RBT to babysit on weekends, and the RBT declines and keeps the relationship professional.",
    purpose: "To avoid conflicts of interest and preserve a professional relationship.",
    explanation:
      "Clear professional boundaries protect the therapeutic relationship and reduce conflicts of interest.",
  },
  {
    id: "professional_safety",
    topic: "professional_conduct",
    difficulty: "advanced",
    answer: "Safety escalation",
    definition:
      "urgent safety or abuse concerns are reported right away through the proper channels.",
    scenario:
      "An RBT notices injuries and hears statements that raise possible abuse concerns, so the RBT follows reporting policy immediately.",
    purpose: "To protect the client by reporting serious safety concerns without delay.",
    explanation:
      "Potential abuse or urgent safety concerns must be escalated immediately according to policy and law.",
  },
  {
    id: "measurement_rate",
    topic: "measurement",
    difficulty: "intermediate",
    answer: "Rate recording",
    definition: "the count of behavior is compared against the amount of observation time.",
    scenario:
      "One session lasts 15 minutes and another lasts 30, so the team wants a measure that allows fair comparison of how often calling out occurred.",
    purpose: "To compare behavior frequency across unequal observation periods.",
    explanation:
      "Rate recording standardizes counts by time, which is useful when observation periods differ in length.",
  },
  {
    id: "measurement_whole_interval",
    topic: "measurement",
    difficulty: "intermediate",
    answer: "Whole interval recording",
    definition: "the interval is scored only if the behavior lasted for the entire interval.",
    scenario:
      "An RBT marks on-task behavior only when the learner stayed engaged during the full 20-second interval.",
    purpose: "To identify whether behavior lasted through an entire interval.",
    explanation:
      "Whole interval recording requires the behavior to occur for the entire interval before it is scored.",
  },
  {
    id: "measurement_momentary_time_sampling",
    topic: "measurement",
    difficulty: "intermediate",
    answer: "Momentary time sampling",
    definition: "the observer checks for behavior only at specific moments in time.",
    scenario:
      "Every minute, the RBT glances up to see whether the learner is seated at that exact moment.",
    purpose: "To check whether behavior is happening at a specific instant.",
    explanation:
      "Momentary time sampling reduces continuous observation demands by checking behavior at preset moments.",
  },
  {
    id: "measurement_trial_by_trial",
    topic: "measurement",
    difficulty: "beginner",
    answer: "Trial-by-trial data",
    definition: "the RBT records the outcome of each teaching opportunity separately.",
    scenario:
      "During a table session, the RBT marks correct, incorrect, or prompted for every individual trial.",
    purpose: "To record performance on each teaching opportunity separately.",
    explanation:
      "Trial-by-trial data are useful during structured teaching because each opportunity is scored individually.",
  },
  {
    id: "measurement_ioa",
    topic: "measurement",
    difficulty: "advanced",
    answer: "Interobserver agreement",
    definition: "two observers collect data on the same behavior and compare how closely their records match.",
    scenario:
      "A BCBA observes alongside the RBT to confirm they are both recording aggression in the same way.",
    purpose: "To check whether two observers recorded behavior consistently.",
    explanation:
      "Interobserver agreement helps verify that behavior definitions and data collection are reliable.",
  },
  {
    id: "assessment_indirect",
    topic: "assessment",
    difficulty: "beginner",
    answer: "Indirect assessment",
    definition: "information about behavior is gathered through interviews, checklists, or rating forms.",
    scenario:
      "Before observing directly, the team asks caregivers and teachers structured questions about when problem behavior usually happens.",
    purpose: "To gather information about behavior from interviews, forms, or rating scales.",
    explanation:
      "Indirect assessment provides useful background information but does not replace direct observation.",
  },
  {
    id: "assessment_interview",
    topic: "assessment",
    difficulty: "beginner",
    answer: "Caregiver interview",
    definition: "the team speaks with someone familiar with the learner to gather history and context.",
    scenario:
      "A parent describes common triggers, routines, and preferences before a new case begins.",
    purpose: "To collect background information from someone who knows the learner well.",
    explanation:
      "Interviews can clarify routines, concerns, and context that may not be visible during one observation alone.",
  },
  {
    id: "assessment_reinforcer",
    topic: "assessment",
    difficulty: "intermediate",
    answer: "Reinforcer assessment",
    definition: "the team tests whether an item actually increases responding rather than only being preferred.",
    scenario:
      "A learner likes stickers, but the RBT checks whether stickers really increase correct responding during teaching.",
    purpose: "To confirm whether a preferred item actually increases responding.",
    explanation:
      "Something can be preferred without functioning as a reinforcer, so direct testing may be needed.",
  },
  {
    id: "assessment_skill",
    topic: "assessment",
    difficulty: "intermediate",
    answer: "Skill assessment",
    definition: "the learner's current strengths and deficits are tested across target areas.",
    scenario:
      "Before writing new goals, the BCBA reviews which receptive and expressive skills the learner already performs independently.",
    purpose: "To identify which component skills are already mastered and which still need teaching.",
    explanation:
      "Skill assessments help the team choose targets that fit the learner's current repertoire.",
  },
  {
    id: "assessment_functional_analysis",
    topic: "assessment",
    difficulty: "advanced",
    answer: "Functional analysis",
    definition: "conditions are systematically arranged to test which consequences may maintain the behavior.",
    scenario:
      "Under BCBA oversight, different test conditions are run to see whether escape, attention, or tangibles are driving the behavior.",
    purpose: "To test which consequence is maintaining the behavior under controlled conditions.",
    explanation:
      "A functional analysis experimentally tests behavior function rather than inferring it only from descriptive data.",
  },
  {
    id: "skill_discrimination_training",
    topic: "skill_acquisition",
    difficulty: "intermediate",
    answer: "Discrimination training",
    definition: "the learner is taught to respond one way to a relevant cue and differently when that cue is absent.",
    scenario:
      "A learner is reinforced for touching the red card when asked for red, but not for touching other colors.",
    purpose: "To teach the learner to respond differently to relevant cues.",
    explanation:
      "Discrimination training builds accurate responding under the correct stimulus conditions.",
  },
  {
    id: "skill_errorless_teaching",
    topic: "skill_acquisition",
    difficulty: "intermediate",
    answer: "Errorless teaching",
    definition: "the RBT provides enough support immediately to reduce the chance of mistakes during early learning.",
    scenario:
      "When introducing a new receptive label, the RBT prompts right away so the learner contacts success from the start.",
    purpose: "To minimize mistakes during initial instruction by providing immediate support.",
    explanation:
      "Errorless teaching is often used early in instruction so the learner practices the correct response more often than errors.",
  },
  {
    id: "skill_token_economy",
    topic: "skill_acquisition",
    difficulty: "beginner",
    answer: "Token economy",
    definition: "the learner earns conditioned reinforcers that can later be exchanged for a backup item or activity.",
    scenario:
      "A learner earns stars for completed tasks and trades five stars for extra drawing time.",
    purpose: "To build motivation by pairing target behavior with tokens that can be exchanged later.",
    explanation:
      "A token economy uses tokens as conditioned reinforcers linked to a later backup reinforcer.",
  },
  {
    id: "skill_generalization",
    topic: "skill_acquisition",
    difficulty: "advanced",
    answer: "Generalization programming",
    definition: "instruction is planned so a skill transfers across people, materials, and settings.",
    scenario:
      "After a learner mands in the clinic, the team practices the same skill at home and with different staff members.",
    purpose: "To help a skill transfer across people, settings, and materials.",
    explanation:
      "Generalization programming is intentional and helps a learned skill show up outside the original teaching setup.",
  },
  {
    id: "skill_maintenance",
    topic: "skill_acquisition",
    difficulty: "intermediate",
    answer: "Maintenance programming",
    definition: "previously learned skills are scheduled for periodic review after mastery.",
    scenario:
      "A target is already mastered, but the learner still practices it once a week so the skill stays strong.",
    purpose: "To keep a learned skill strong after initial mastery.",
    explanation:
      "Maintenance ensures mastered skills continue over time instead of dropping once formal teaching stops.",
  },
  {
    id: "behavior_noncontingent_reinforcement",
    topic: "behavior_reduction",
    difficulty: "advanced",
    answer: "Noncontingent reinforcement",
    definition: "reinforcement is delivered on a time-based schedule rather than after the target behavior.",
    scenario:
      "To reduce attention-seeking interruptions, the learner receives scheduled attention every few minutes regardless of behavior.",
    purpose: "To reduce motivation for problem behavior by delivering reinforcement on a schedule.",
    explanation:
      "Noncontingent reinforcement can reduce the value of the reinforcer that was previously maintaining the problem behavior.",
  },
  {
    id: "behavior_dro",
    topic: "behavior_reduction",
    difficulty: "intermediate",
    answer: "Differential reinforcement of other behavior",
    definition: "reinforcement is delivered when the problem behavior has not happened for a set period.",
    scenario:
      "A learner earns praise and a token each time a two-minute interval passes without yelling.",
    purpose: "To reinforce periods in which the problem behavior does not occur.",
    explanation:
      "DRO focuses on reinforcing the absence of the target behavior for a defined interval.",
  },
  {
    id: "behavior_dri",
    topic: "behavior_reduction",
    difficulty: "intermediate",
    answer: "Differential reinforcement of incompatible behavior",
    definition: "reinforcement is delivered for a response that cannot occur at the same time as the problem behavior.",
    scenario:
      "A learner is reinforced for keeping hands in pockets while walking, which cannot happen at the same time as hitting.",
    purpose: "To reinforce a behavior that cannot happen at the same time as the problem behavior.",
    explanation:
      "DRI works by strengthening a response that is physically incompatible with the problem behavior.",
  },
  {
    id: "behavior_rird",
    topic: "behavior_reduction",
    difficulty: "advanced",
    answer: "Response interruption and redirection",
    definition: "the problem response is interrupted and the learner is redirected to an appropriate alternative.",
    scenario:
      "A learner begins scripting repetitively, and the RBT interrupts briefly and redirects to answering simple social questions.",
    purpose: "To interrupt repetitive behavior and redirect toward a more appropriate response.",
    explanation:
      "Response interruption and redirection is commonly used for repetitive responses when specified in the plan.",
  },
  {
    id: "behavior_high_p",
    topic: "behavior_reduction",
    difficulty: "intermediate",
    answer: "High-probability request sequence",
    definition: "several easy requests are presented before a difficult one to build momentum.",
    scenario:
      "Before asking a learner to start handwriting, the RBT presents three easy motor responses the learner almost always follows.",
    purpose: "To build behavioral momentum before presenting a low-probability demand.",
    explanation:
      "A high-probability sequence can increase compliance by creating momentum with easy requests first.",
  },
  {
    id: "documentation_prompt_levels",
    topic: "documentation",
    difficulty: "beginner",
    answer: "Prompt level documentation",
    definition: "records show how much assistance was needed on each response.",
    scenario:
      "A data sheet includes whether each answer was independent, verbally prompted, modeled, or physically prompted.",
    purpose: "To show how much assistance the learner needed on each response.",
    explanation:
      "Prompt level documentation helps the team evaluate independence and when prompts can be faded.",
  },
  {
    id: "documentation_trial_by_trial",
    topic: "documentation",
    difficulty: "beginner",
    answer: "Trial-by-trial documentation",
    definition: "performance is scored separately for each teaching opportunity rather than only at the end of session.",
    scenario:
      "The RBT records correct, incorrect, and prompted for every card sort trial during DTT.",
    purpose: "To capture learner performance on each teaching opportunity separately.",
    explanation:
      "Trial-by-trial documentation gives a more detailed record of performance during structured instruction.",
  },
  {
    id: "documentation_abc_note",
    topic: "documentation",
    difficulty: "intermediate",
    answer: "ABC narrative note",
    definition: "a significant behavior episode is summarized by describing antecedent, behavior, and consequence in sequence.",
    scenario:
      "After an elopement episode, the RBT writes what happened before, exactly what the learner did, and what followed.",
    purpose: "To summarize the context of a significant behavior episode in sequence.",
    explanation:
      "An ABC narrative note is helpful when the team needs contextual detail around an important incident.",
  },
  {
    id: "documentation_mastery_tracking",
    topic: "documentation",
    difficulty: "intermediate",
    answer: "Mastery criterion tracking",
    definition: "ongoing records are compared against the program's stated mastery requirement.",
    scenario:
      "The BCBA checks whether a target has met 90 percent independent correct responding across three sessions.",
    purpose: "To determine whether a target meets the program's mastery requirement.",
    explanation:
      "Mastery tracking prevents staff from moving on too early or keeping a target too long without criteria.",
  },
  {
    id: "documentation_service_verification",
    topic: "documentation",
    difficulty: "advanced",
    answer: "Service verification documentation",
    definition: "records confirm the date, time, location, and delivery of authorized services.",
    scenario:
      "At the end of session, the RBT confirms attendance, service time, and required signatures according to agency policy.",
    purpose: "To confirm when and where authorized services were delivered.",
    explanation:
      "Service verification documentation supports compliance, scheduling accuracy, and billing integrity.",
  },
  {
    id: "professional_assent",
    topic: "professional_conduct",
    difficulty: "intermediate",
    answer: "Assent monitoring",
    definition: "the RBT watches for signs the learner is willing or unwilling to participate and responds appropriately.",
    scenario:
      "A learner pushes materials away and withdraws, so the RBT pauses and communicates this to the supervisor.",
    purpose: "To watch for signs the learner is willing or unwilling to participate.",
    explanation:
      "Monitoring assent supports ethical treatment and can guide when to pause, adjust, or seek support.",
  },
  {
    id: "professional_dignity",
    topic: "professional_conduct",
    difficulty: "beginner",
    answer: "Client dignity",
    definition: "services are delivered in a way that protects privacy, respect, and humane treatment.",
    scenario:
      "An RBT avoids discussing toileting goals in front of other families and uses respectful language during all care routines.",
    purpose: "To protect the learner's privacy, respect, and humane treatment.",
    explanation:
      "Client dignity means treating the learner respectfully and avoiding unnecessarily intrusive or embarrassing practices.",
  },
  {
    id: "professional_communication",
    topic: "professional_conduct",
    difficulty: "beginner",
    answer: "Timely communication",
    definition: "important treatment information is shared promptly with the right members of the team.",
    scenario:
      "A medication change is reported by the caregiver, and the RBT documents it and alerts the supervisor before session goals continue.",
    purpose: "To share important treatment information promptly with the supervisor and team.",
    explanation:
      "Timely communication helps the team respond quickly to changes that may affect treatment or safety.",
  },
  {
    id: "professional_cultural_responsiveness",
    topic: "professional_conduct",
    difficulty: "intermediate",
    answer: "Cultural responsiveness",
    definition: "services are delivered with awareness of the family's values, language, and context.",
    scenario:
      "The team adapts examples and routines so teaching fits the family's language preferences and daily practices.",
    purpose: "To provide services in a way that respects the family's values and context.",
    explanation:
      "Cultural responsiveness helps treatment stay respectful, relevant, and collaborative for the family.",
  },
  {
    id: "professional_conflict_of_interest",
    topic: "professional_conduct",
    difficulty: "advanced",
    answer: "Conflict-of-interest prevention",
    definition: "the RBT avoids personal arrangements that could impair professional judgment or objectivity.",
    scenario:
      "A caregiver offers extra cash for off-the-clock childcare, and the RBT declines because it would blur the professional relationship.",
    purpose: "To avoid personal arrangements that could impair professional judgment.",
    explanation:
      "Preventing conflicts of interest protects objectivity and reduces the risk of boundary problems.",
  },
];

function shuffleStable(items, seedValue) {
  return shuffleWithRandom(items, createRandom(seedValue));
}

function buildOptionsFromTexts(texts, correctText, variantKey) {
  const answerLabels = ["A", "B", "C", "D"];
  const shuffled = shuffleStable(texts, `answer-order:${variantKey}`);

  return {
    options: shuffled.map((text, index) => ({
      label: answerLabels[index],
      text,
    })),
    correct_answer: answerLabels[shuffled.indexOf(correctText)],
  };
}

function getTopicAlternatives(concept, field) {
  return shuffleStable(
    questionConcepts
      .filter((candidate) => candidate.topic === concept.topic && candidate.id !== concept.id)
      .map((candidate) => candidate[field]),
    `${concept.id}:${field}`,
  ).slice(0, 3);
}

function buildQuestionSeedSet(concept) {
  const answerChoices = [concept.answer, ...getTopicAlternatives(concept, "answer")];
  const purposeChoices = [concept.purpose, ...getTopicAlternatives(concept, "purpose")];

  const conceptMatch = buildOptionsFromTexts(
    answerChoices,
    concept.answer,
    `${concept.id}:concept`,
  );
  const purposeMatch = buildOptionsFromTexts(
    purposeChoices,
    concept.purpose,
    `${concept.id}:purpose`,
  );

  return [
    {
      id: `${concept.id}_definition`,
      concept_id: concept.id,
      text: `Which concept is being described as ${concept.definition}`,
      topic: concept.topic,
      difficulty: concept.difficulty,
      explanation: concept.explanation,
      options: conceptMatch.options,
      correct_answer: conceptMatch.correct_answer,
    },
    {
      id: `${concept.id}_scenario`,
      concept_id: concept.id,
      text: `${concept.scenario} Which concept is the best match?`,
      topic: concept.topic,
      difficulty: concept.difficulty,
      explanation: concept.explanation,
      options: conceptMatch.options,
      correct_answer: conceptMatch.correct_answer,
    },
    {
      id: `${concept.id}_purpose`,
      concept_id: concept.id,
      text: `What is the main goal of ${concept.answer}?`,
      topic: concept.topic,
      difficulty: concept.difficulty,
      explanation: `${concept.explanation} The main goal is ${concept.purpose.toLowerCase()}`,
      options: purposeMatch.options,
      correct_answer: purposeMatch.correct_answer,
    },
  ];
}

export const baseQuestions = questionConcepts.flatMap(buildQuestionSeedSet);

function groupSeedQuestionsByConcept(seedValue) {
  const grouped = new Map();

  baseQuestions.forEach((question) => {
    const conceptId = question.concept_id || question.id;
    const conceptQuestions = grouped.get(conceptId) || [];
    conceptQuestions.push(question);
    grouped.set(conceptId, conceptQuestions);
  });

  return new Map(
    [...grouped.entries()].map(([conceptId, conceptQuestions]) => [
      conceptId,
      shuffleStable(conceptQuestions, `${seedValue}:${conceptId}`),
    ]),
  );
}

function buildSeedSequence(size, seedValue) {
  const groupedSeeds = groupSeedQuestionsByConcept(seedValue);
  const conceptIds = shuffleStable([...groupedSeeds.keys()], `${seedValue}:concept-order`);
  const selectedSeeds = [];
  let round = 0;

  while (selectedSeeds.length < size && conceptIds.length > 0) {
    conceptIds.forEach((conceptId) => {
      if (selectedSeeds.length >= size) {
        return;
      }

      const conceptQuestions = groupedSeeds.get(conceptId) || [];
      if (conceptQuestions.length === 0) {
        return;
      }

      selectedSeeds.push(conceptQuestions[round % conceptQuestions.length]);
    });

    round += 1;
  }

  return selectedSeeds;
}

for (let index = 0; index < TOTAL_PRACTICE_QUESTIONS; index += 1) {
  const topic = baseQuestions[index % baseQuestions.length]?.topic;
  if (topic) {
    PRACTICE_TOPIC_TOTALS[topic] += 1;
  }
}

const practiceScenarioPrefixes = [
  "During a clinic session,",
  "During home-based therapy,",
  "While collecting data,",
  "When supporting a skill acquisition program,",
  "During supervision review,",
  "In a community outing,",
  "While implementing the treatment plan,",
  "At the start of session,",
  "During a transition between activities,",
  "While preparing session notes,",
];

const practiceScenarioSuffixes = [
  "Choose the best response.",
  "Identify the most appropriate action.",
  "Select the option most aligned with RBT practice.",
  "Pick the answer that best matches ABA principles.",
  "Choose the response that protects treatment integrity.",
];

const flashcardScenarioPrefixes = [
  "During a clinic session,",
  "At the start of therapy,",
  "While collecting data,",
  "During a home visit,",
  "When reviewing behavior plans,",
  "In a school-based session,",
  "During skills training,",
  "While supporting a transition,",
  "During supervision follow-up,",
  "When documenting session notes,",
];

const flashcardScenarioSuffixes = [
  "Choose the best response.",
  "Pick the most appropriate action.",
  "Select the answer that best follows ABA principles.",
  "Choose the option most consistent with RBT practice.",
  "Pick the response that best supports treatment integrity.",
];

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seedValue) {
  let seed = hashString(String(seedValue)) || 1;

  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let result = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRandom(items, random) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }

  return nextItems;
}

function randomItem(items, random) {
  return items[Math.floor(random() * items.length)];
}

function getPracticeBankMeta(index) {
  const option = practiceBankOptions[index % practiceBankOptions.length];

  return {
    bank_id: option.id,
    bank_label: option.label,
    group_id: option.id,
    group_label: option.label,
  };
}

function remixOptions(options, correctAnswer, variantKey) {
  const random = createRandom(`options:${variantKey}`);
  const shuffled = shuffleWithRandom(options, random);
  const answerLabels = ["A", "B", "C", "D"];
  let nextCorrectAnswer = correctAnswer;

  const nextOptions = shuffled.map((option, index) => {
    const relabeledOption = {
      ...option,
      label: answerLabels[index],
    };

    if (option.label === correctAnswer) {
      nextCorrectAnswer = relabeledOption.label;
    }

    return relabeledOption;
  });

  return {
    options: nextOptions,
    correct_answer: nextCorrectAnswer,
  };
}

function buildQuestionVariant(
  seed,
  index,
  prefixes,
  suffixes,
  prefixId,
  metadata = {},
) {
  const variantKey = `${prefixId}:${seed.id}:${index + 1}`;
  const textRandom = createRandom(`text:${variantKey}`);
  const prefix = randomItem(prefixes, textRandom);
  const suffix = randomItem(suffixes, textRandom);
  const variantNumber = index + 1;
  const remixed = remixOptions(seed.options, seed.correct_answer, variantKey);

  return {
    ...seed,
    ...remixed,
    ...metadata,
    id: `${prefixId}_${seed.id}_${variantNumber}`,
    text: `${prefix} ${seed.text} ${suffix}`,
    original_id: seed.id,
  };
}

export function buildPracticeQuestionBank(size = TOTAL_PRACTICE_QUESTIONS, seed = "practice-default") {
  return buildSeedSequence(size, `practice-seeds:${seed}:${size}`).map(
    (seedQuestion, index) =>
      buildQuestionVariant(
        seedQuestion,
        index,
        practiceScenarioPrefixes,
        practiceScenarioSuffixes,
        "practice",
        getPracticeBankMeta(index),
      ),
  );
}

export function buildFlashcardBank(size = 300, seed = "flashcards-default") {
  const generatedCards = Array.from({ length: size }, (_, index) =>
    buildQuestionVariant(
      baseQuestions[index % baseQuestions.length],
      index,
      flashcardScenarioPrefixes,
      flashcardScenarioSuffixes,
      "flashcard",
    ),
  );

  return shuffleWithRandom(generatedCards, createRandom(`flashcards-order:${seed}:${size}`));
}

export function buildMockExamQuestionSet(
  size = 85,
  sourceQuestions = null,
  seed = `mock-${Date.now()}`,
) {
  const selectedSeeds =
    Array.isArray(sourceQuestions) && sourceQuestions.length > 0
      ? shuffleStable(sourceQuestions, `mock-source:${seed}`).slice(0, size)
      : buildSeedSequence(size, `mock-seeds:${seed}`);

  const orderedSelection = selectedSeeds.map((seedQuestion, index) =>
    buildQuestionVariant(
      seedQuestion,
      index,
      practiceScenarioPrefixes,
      practiceScenarioSuffixes,
      "mock",
      getPracticeBankMeta(index),
    ),
  );

  return orderedSelection.map((question, index) => ({
    ...question,
    id: `${question.id}_mock_${index + 1}`,
    original_id: question.original_id || question.id,
  }));
}
