export interface ModelMetrics {
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1_score: number | null;
  roc_auc: number | null;
}

export interface ModelsComparison {
  logistic_regression: ModelMetrics;
  random_forest: ModelMetrics;
}
