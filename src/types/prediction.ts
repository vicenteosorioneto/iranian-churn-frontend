export interface PredictionRequest {
  "Call Failure": number;
  "Subscription Length": number;
  "Seconds of Use": number;
  "Frequency of use": number;
  "Frequency of SMS": number;
  "Distinct Called Numbers": number;
  Age: number;
  "Customer Value": number;
  Complains: number;
  "Tariff Plan": number;
  Status: number;
  "Charge Amount": number;
  "Age Group": number;
}

export interface PredictionResponse {
  decision_threshold: number;
  prediction: 0 | 1;
  churn_probability: number | null;
  model_name: "logistic_regression" | "random_forest";
}

export type PredictionField = keyof PredictionRequest;
