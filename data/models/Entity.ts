export type EntityType = "brew" | "receipt";

export class Entity {
  id: number;
  user_id?: string;

  constructor(data: Entity) {
    this.id = data.id;
    this.user_id = data.user_id;
  }
}
