import { Entity } from "./Entity";

export class ProductType extends Entity {
  name: string;

  constructor(data: ProductType) {
    super(data);
    this.name = data.name;
  }
}

const colors: { [key: string]: string } = {
  "19L Corny Keg": "#8d48e3",
  "20L Key Keg": "#7cffb2",
  "30L Key Keg": "#dd79ff",
  spare2: "#4992ff",
  spare3: "#fddd60",
};

export const getProductColor = (product: string) =>
  colors[product] || "#78716c";
