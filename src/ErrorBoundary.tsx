import React from 'react';

interface State { hasError: boolean; error: Error | null; }
export default class ErrorBoundary extends React.Component<{children: React.ReactNode}, State> {
  constructor(props: {children: React.ReactNode}) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('App error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff0000', background: '#000', height: '100%', fontFamily: 'monospace' }}>
          <h2>游戏加载出错</h2>
          <pre style={{ color: '#ff4400', marginTop: '12px', whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
          <pre style={{ color: '#888', marginTop: '8px', fontSize: '12px', whiteSpace: 'pre-wrap' }}>{this.state.error?.stack}</pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 24px', cursor: 'pointer', border: '1px solid #ff0000', background: '#000', color: '#ff0000', fontSize: '14px' }}>
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
