export default class Question {
  constructor(data = {}) {
    this.id = data.id ?? "";
    this.prompt = data.prompt ?? "";
    this.choices = data.choices ?? [];
    this.correctAnswer = data.correctAnswer ?? null;
    this.explanation = data.explanation ?? "";
  }
}
