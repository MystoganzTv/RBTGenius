export default class MockExam {
  constructor(data = {}) {
    this.id = data.id ?? "";
    this.title = data.title ?? "";
    this.questions = data.questions ?? [];
    this.createdAt = data.createdAt ?? null;
  }
}
