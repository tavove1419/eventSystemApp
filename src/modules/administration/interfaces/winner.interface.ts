export interface WinnerInterface {
  id?: string;
  number_winner: string;
  name_winner: string;
  identity_winner: string;
  city: string;
  event_id: string;
  event_name: string;
  date_winner: Date;
}

export interface TransferInterface {
  id?: string;
  document_winner: string;
  winner_id: string;
  bank: string;
  account_number: string;
  deposited_value: string;
  comment?: string;
  date_transfer: Date;
}

export interface PaidRegistered {
  id:             string;
  name:           string;
  identity:       string;
  event:          string;
  number_winner:  string;
  date_winner:    string;
  bank:           string;
  account_number: string;
  payment_date:   string;
  value_paid:     string;
}

