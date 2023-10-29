export interface EventInterface {
  id?: string;
  name: string;
  description: string;
  img?: string;
  status: boolean;
}

export interface EventListInterface {
  label: string,
  value: string,
  id?: string;
  name: string;
  description: string;
  status: boolean;
}
