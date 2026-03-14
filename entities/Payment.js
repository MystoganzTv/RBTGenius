export default class Payment {
  constructor(data = {}) {
    this.id = data.id ?? "";
    this.userId = data.userId ?? "";
    this.amount = data.amount ?? 0;
    this.status = data.status ?? "pending";
    this.createdAt = data.createdAt ?? null;
  }
}
