function EmptyState({ icon = '📭', title, message, action }) {
    return (
        <div className="empty-state fade-in">
            <div className="empty-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{message}</p>
            {action && <div style={{ marginTop: '16px' }}>{action}</div>}
        </div>
    );
}

export default EmptyState;
