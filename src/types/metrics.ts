export interface ModelMetrics {
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  balanced_accuracy: number | null;
  average_precision: number | null;
  confusion_matrix: number[][];
  roc_curve?: { fpr: number; tpr: number }[];
  roc_auc: number | null;
}

export interface ModelsComparison {
  logistic_regression: ModelMetrics;
  random_forest: ModelMetrics;
}
