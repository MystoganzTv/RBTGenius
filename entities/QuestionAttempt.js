export default class QuestionAttempt {
  constructor(data = {}) {
    this.id = data.id ?? "";
    this.questionId = data.questionId ?? "";
    this.selectedAnswer = data.selectedAnswer ?? null;
    this.isCorrect = data.isCorrect ?? false;
    this.answeredAt = data.answeredAt ?? null;
  }
}
