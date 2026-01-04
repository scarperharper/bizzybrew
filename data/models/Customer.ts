import { Entity } from "./Entity";

export class Customer extends Entity {
  created_at: Date;
  name: string;

  constructor(data: Customer) {
    super(data);
    this.created_at = data.created_at;
    this.name = data.name;
  }
}
