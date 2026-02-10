function ErrorState({ message = 'Something went wrong', onRetry }) {
    return (
        <div className="error-state fade-in">
            <div className="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>{message}</p>
            {onRetry && (
                <button className="btn btn-primary" onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorState;
