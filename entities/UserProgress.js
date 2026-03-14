export default class UserProgress {
  constructor(data = {}) {
    this.userId = data.userId ?? "";
    this.completedLessons = data.completedLessons ?? [];
    this.score = data.score ?? 0;
    this.streak = data.streak ?? 0;
    this.updatedAt = data.updatedAt ?? null;
  }
}
