export interface PaymentDetailInterface {
  id?: string;
  identity_customer: string;
  card_name: string;
  card_number: string;
  cvv: string;
  expiration_date: string;
}
