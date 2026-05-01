/**
 * Maps every RBT-eligible concept ID to its primary RBT 2.0 Task List item code.
 *
 * Some concepts plausibly span multiple items (e.g. token economy could fit
 * under C-3 reinforcement contingencies OR C-12 token economy). When that
 * happens we pick the *most specific* item — that's how the BACB exam tends
 * to classify questions.
 *
 * Coverage is enforced at startup by validateConceptCoverage(): if a concept
 * exists in the question bank but is missing from this map, the assertion
 * throws so we don't silently drop attempts from the section-mastery counts.
 */

import { TASK_LIST_ITEM_BY_CODE } from "./task-list.js";

export const CONCEPT_TO_TASK_LIST = {
  // ─── A. Measurement ────────────────────────────────────────────────────────
  measurement_data_collection_preparation: "A-1",
  measurement_timing_accuracy:            "A-1",

  measurement_frequency:                  "A-2",
  measurement_duration:                   "A-2",
  measurement_latency:                    "A-2",
  measurement_rate:                       "A-2",
  measurement_trial_by_trial:             "A-2",

  measurement_partial_interval:           "A-3",
  measurement_whole_interval:             "A-3",
  measurement_momentary_time_sampling:    "A-3",

  measurement_permanent_product:          "A-4",

  measurement_graph_updating:             "A-5",
  measurement_percentage_correct:         "A-5",
  measurement_percentage_opportunities:   "A-5",

  measurement_observable_terms:           "A-6",
  measurement_measurable_terms:           "A-6",
  measurement_topography:                 "A-6",

  // ─── B. Assessment ─────────────────────────────────────────────────────────
  assessment_preference:                  "B-1",
  assessment_paired_stimulus:             "B-1",
  assessment_mswo:                        "B-1",
  assessment_single_stimulus_preference:  "B-1",
  assessment_multiple_stimulus_preference:"B-1",
  assessment_preference_hierarchy:        "B-1",
  assessment_reinforcer:                  "B-1",

  assessment_skill_strengths:             "B-2",
  assessment_skill_deficits:              "B-2",
  assessment_probe_assessment:            "B-2",
  assessment_baseline:                    "B-2",
  assessment_direct:                      "B-2",
  assessment_direct_observation:          "B-2",
  assessment_operational_definition:      "B-2",

  assessment_abc:                         "B-3",
  assessment_indirect:                    "B-3",
  assessment_interview:                   "B-3",
  assessment_functional_assessment_participation: "B-3",

  // ─── C. Skill Acquisition ──────────────────────────────────────────────────
  skill_positive_reinforcement:           "C-3",
  skill_negative_reinforcement:           "C-3",
  skill_conditioned_reinforcer:           "C-3",
  skill_continuous_reinforcement:         "C-3",
  skill_intermittent_reinforcement:       "C-3",

  skill_dtt:                              "C-4",
  skill_net:                              "C-5",

  skill_task_analysis:                    "C-6",
  skill_forward_chaining:                 "C-6",
  skill_backward_chaining:                "C-6",

  skill_discrimination_training:          "C-7",

  skill_prompt_fading:                    "C-8",

  skill_least_to_most:                    "C-9",
  skill_most_to_least_prompting:          "C-9",
  skill_model_prompt:                     "C-9",
  skill_gesture_prompt:                   "C-9",
  skill_verbal_prompt:                    "C-9",
  skill_physical_prompt:                  "C-9",
  skill_errorless_teaching:               "C-9",

  skill_maintenance:                      "C-10",

  skill_shaping:                          "C-11",

  skill_token_exchange:                   "C-12",

  // ─── D. Behavior Reduction ─────────────────────────────────────────────────
  behavior_antecedent:                    "D-3",
  behavior_high_p:                        "D-3",
  behavior_choice_making:                 "D-3",
  behavior_precorrection:                 "D-3",
  behavior_redirection:                   "D-3",

  behavior_dra_specific:                  "D-4",
  behavior_dri:                           "D-4",
  behavior_dro:                           "D-4",
  behavior_fct:                           "D-4",

  behavior_extinction:                    "D-5",
  behavior_planned_ignoring:              "D-5",

  // ─── E. Documentation and Reporting ────────────────────────────────────────
  documentation_caregiver_log:            "E-3",

  documentation_notes:                    "E-4",
  documentation_immediate_entry:          "E-4",
  documentation_timestamp:                "E-4",
  documentation_abc_note:                 "E-4",
  documentation_trial_by_trial:           "E-4",
  documentation_prompt_levels:            "E-4",
  documentation_mastery_tracking:         "E-4",

  documentation_integrity:                "E-5",

  // ─── F. Professional Conduct and Scope of Practice ─────────────────────────
  professional_supervision:               "F-1",
  professional_scope:                     "F-1",

  professional_communication:             "F-2",
  professional_record_honesty:            "F-2",

  professional_boundaries:                "F-4",
  professional_confidentiality:           "F-4",

  professional_dignity:                   "F-5",
  professional_assent:                    "F-5",
  professional_cultural_responsiveness:   "F-5",
};

/**
 * O(1) lookup. Returns the Task List code for a given concept ID, or null
 * if the concept isn't mapped.
 */
export function getTaskListCode(conceptId) {
  return CONCEPT_TO_TASK_LIST[conceptId] || null;
}

/**
 * Returns the section letter ("A".."F") for a concept. Convenience for
 * computing section-level mastery from attempts that only carry concept_id.
 */
export function getTaskListSection(conceptId) {
  const code = getTaskListCode(conceptId);
  if (!code) return null;
  const [section] = code.split("-");
  return section;
}

/**
 * Run-time invariant. Given the list of concept IDs the question bank
 * actually emits, throws if any concept is missing from the map (so a new
 * concept added in question-bank.js without a code shows up as a hard error
 * instead of silently dropping out of the analytics).
 */
export function validateConceptCoverage(conceptIds = []) {
  const missing = [];
  const invalidCodes = [];

  conceptIds.forEach((conceptId) => {
    const code = CONCEPT_TO_TASK_LIST[conceptId];
    if (!code) {
      missing.push(conceptId);
    } else if (!TASK_LIST_ITEM_BY_CODE[code]) {
      invalidCodes.push({ conceptId, code });
    }
  });

  if (missing.length || invalidCodes.length) {
    const lines = [];
    if (missing.length) {
      lines.push(`Concepts missing from CONCEPT_TO_TASK_LIST: ${missing.join(", ")}`);
    }
    if (invalidCodes.length) {
      lines.push(
        `Concepts mapped to unknown task-list codes: ${invalidCodes
          .map((entry) => `${entry.conceptId}=>${entry.code}`)
          .join(", ")}`,
      );
    }
    throw new Error(lines.join(" | "));
  }

  return true;
}
