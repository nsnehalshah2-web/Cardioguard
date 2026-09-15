import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ActionPlan({ items = [] }) {
  return (
    <section className="panel action-plan-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow"><CheckCircle2 size={13} /> Personalized next steps</span>
          <h2>Your action plan</h2>
        </div>
      </div>
      <div className="action-plan-list">
        {items.map((item, index) => (
          <div className="action-plan-item" key={`${item.signal || 'general'}-${index}`}>
            <span className="action-plan-number">{index + 1}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
            <ArrowRight size={16} className="muted-icon" />
          </div>
        ))}
      </div>
      <p className="action-plan-disclaimer">This is general educational guidance, not a diagnosis or treatment plan.</p>
    </section>
  );
}
