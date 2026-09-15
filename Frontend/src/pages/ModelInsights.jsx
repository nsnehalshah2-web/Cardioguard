import { BarChart3, Database, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmptyState from '../components/common/EmptyState';
import { getApiErrorMessage, getModelInsights } from '../services/api';

const metricLabels = [
  ['accuracy', 'Accuracy'],
  ['precision', 'Precision'],
  ['recall', 'Recall'],
  ['f1_score', 'F1-score'],
  ['roc_auc', 'ROC-AUC'],
];

export default function ModelInsights() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getModelInsights().then(setData).catch((requestError) => {
      setError(getApiErrorMessage(requestError, 'Model evaluation is unavailable right now.'));
    });
  }, []);

  if (error) return <div className="center-page"><EmptyState title="Model insights unavailable" text={error} action="Back to overview" /></div>;
  if (!data) return <div className="auth-loading"><div className="loading-spinner" /><span>Evaluating the current model...</span></div>;

  return (
    <div className="model-insights-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow"><BarChart3 size={13} /> Model transparency</span>
          <h1>Model insights</h1>
          <p>Evaluation details for the currently deployed CardioGuard model.</p>
        </div>
        <span className="last-updated"><ShieldCheck size={15} /> Educational evaluation</span>
      </div>
      <section className="panel evaluation-method">
        <div><Database size={19} /><div><strong>Evaluation method</strong><p>{data.evaluation_method}</p></div></div>
        <span>{data.test_samples} test samples</span>
      </section>
      <section className="model-metric-grid">
        {metricLabels.map(([key, label]) => <div className="model-metric" key={key}><span>{label}</span><strong>{(data[key] * 100).toFixed(1)}%</strong></div>)}
      </section>
      <div className="model-insights-grid">
        <section className="panel confusion-panel">
          <div className="panel-heading"><div><span className="eyebrow">Held-out results</span><h2>Confusion matrix</h2></div></div>
          <p className="table-note">Rows are actual classes; columns are predicted classes.</p>
          <div className="confusion-matrix"><div /><strong>Predicted 0</strong><strong>Predicted 1</strong><strong>Actual 0</strong><span>{data.confusion_matrix[0][0]}</span><span>{data.confusion_matrix[0][1]}</span><strong>Actual 1</strong><span>{data.confusion_matrix[1][0]}</span><span>{data.confusion_matrix[1][1]}</span></div>
        </section>
        <section className="panel feature-importance-panel">
          <div className="panel-heading"><div><span className="eyebrow">Serialized model</span><h2>Feature importance</h2></div></div>
          <div className="importance-list">{[...data.feature_importance].sort((a, b) => b.importance - a.importance).map((item) => <div className="importance-row" key={item.feature}><div><strong>{item.feature}</strong><span>{(item.importance * 100).toFixed(1)}%</span></div><i style={{ width: `${Math.max(item.importance * 100, 2)}%` }} /></div>)}</div>
        </section>
      </div>
      <p className="model-disclaimer">These are technical model evaluation metrics, not clinical validation or a guarantee about an individual result.</p>
    </div>
  );
}
