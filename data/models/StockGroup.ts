import { Entity } from "./Entity";

export class StockGroup extends Entity {
  group_name!: string;
  group_order!: number;

  constructor(data: StockGroup) {
    super(data);
  }
}

const colors: { [key: string]: string } = {
  Malts: "#4992ff",
  Hops: "#7cffb2",
  Yeast: "#fddd60",
  Adjuncts: "#ff6e76",
  Packaging: "#58d9f9",
  Additives: "#05c091",
  Other: "#ff8a45",
  spare2: "#8d48e3",
  spare3: "#dd79ff",
};

export const getGroupColor = (groupName: string) => colors[groupName] || "#78716c";