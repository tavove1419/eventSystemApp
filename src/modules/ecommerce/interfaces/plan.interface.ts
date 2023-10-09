export interface PlanInterface {
  id: string;
  name: string;
  quantity_number: number;
  quantity_sale?: number;
  price: number;
  active: boolean;
}
