import React from 'react';

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function OverlayDialog({ title, onClose, children }: Props) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <span className="dialog-icon">■</span>
          <span className="dialog-title">{title}</span>
          <span className="dialog-close" onClick={onClose}>✕</span>
        </div>
        <div className="dialog-content">{children}</div>
      </div>
    </div>
  );
}
