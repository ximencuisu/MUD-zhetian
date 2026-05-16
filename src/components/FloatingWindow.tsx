import { useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import './FloatingWindow.css';

export interface FloatWinProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose: () => void;
  initialX?: number;
  initialY?: number;
  width?: number;
  minHeight?: number;
}

const TITLEBAR_H = 28;
const MIN_WIDTH = 280;
const EDGE_PAD = 8;
const STORAGE_KEY = 'wamud_window_positions';

interface WindowPosition {
  x: number;
  y: number;
  width?: number;
  minimized?: boolean;
}

function loadWindowPositions(): Record<string, WindowPosition> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveWindowPosition(id: string, pos: WindowPosition) {
  try {
    const positions = loadWindowPositions();
    positions[id] = pos;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
  }
}

function clearWindowPosition(id: string) {
  try {
    const positions = loadWindowPositions();
    delete positions[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
  }
}

function clampPos(x: number, y: number, w: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.max(EDGE_PAD, Math.min(x, vw - w - EDGE_PAD)),
    y: Math.max(EDGE_PAD, Math.min(y, vh - TITLEBAR_H - EDGE_PAD)),
  };
}

let _globalZ = 100;
function nextZ(): number {
  return ++_globalZ;
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h) + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

let _winOrdinal = 0;
function safeInitial(id: string, ix: number | undefined, iy: number | undefined, w: number) {
  const saved = loadWindowPositions()[id];
  if (saved) {
    return clampPos(saved.x, saved.y, saved.width || w);
  }
  const vw = window.innerWidth;
  const ordinal = _winOrdinal++ % 8;
  const defaultX = Math.max(8, 40 + ordinal * 36);
  const defaultY = 40 + ordinal * 60;
  return clampPos(ix ?? defaultX, iy ?? defaultY, w);
}

export default function FloatingWindow({
  id, title, children, onClose,
  initialX, initialY,
  width = 480, minHeight = 200,
}: FloatWinProps) {
  const effectiveWidth = Math.min(width, window.innerWidth - EDGE_PAD * 2);
  const [pos, setPos] = useState(() => safeInitial(id, initialX, initialY, effectiveWidth));
  const [winW, setWinW] = useState(effectiveWidth);
  const [minimized, setMinimized] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);

  const [zIndex, setZIndex] = useState(nextZ);
  const bringToFront = useCallback(() => {
    setZIndex(nextZ());
  }, []);

  useEffect(() => {
    const saved = loadWindowPositions()[id];
    if (saved?.minimized) {
      setMinimized(true);
    }
  }, [id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearWindowPosition(id);
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [id, onClose]);

  const handleClose = useCallback(() => {
    saveWindowPosition(id, {
      x: pos.x,
      y: pos.y,
      width: winW,
      minimized
    });
    onClose();
  }, [id, pos, winW, minimized, onClose]);

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      const raw = {
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      };
      const clamped = clampPos(raw.x, raw.y, winW);
      setPos(clamped);
    }
    function onMouseUp() {
      if (dragging.current) {
        dragging.current = false;
        saveWindowPosition(id, { x: pos.x, y: pos.y, width: winW, minimized });
      }
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [id, winW, pos, minimized]);

  function onTitleMouseDown(e: React.MouseEvent) {
    bringToFront();
    dragging.current = true;
    const rect = winRef.current?.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) };
    e.preventDefault();
  }

  const resizing = useRef(false);
  const resizeStartX = useRef(0);
  const resizeStartW = useRef(0);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!resizing.current) return;
      const delta = e.clientX - resizeStartX.current;
      const newW = Math.max(MIN_WIDTH, resizeStartW.current + delta);
      const maxW = window.innerWidth - pos.x - EDGE_PAD;
      setWinW(Math.min(newW, maxW));
    }
    function onMouseUp() {
      if (resizing.current) {
        resizing.current = false;
        saveWindowPosition(id, { x: pos.x, y: pos.y, width: winW, minimized });
      }
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [id, pos.x, winW, minimized]);

  function onResizeMouseDown(e: React.MouseEvent) {
    resizing.current = true;
    resizeStartX.current = e.clientX;
    resizeStartW.current = winW;
    e.preventDefault();
    e.stopPropagation();
  }

  const maxBodyH = Math.max(minHeight, window.innerHeight - pos.y - TITLEBAR_H - EDGE_PAD * 2);

  return (
    <div
      ref={winRef}
      className={`float-win appearing ${minimized ? 'minimized' : ''}`}
      style={{ left: pos.x, top: pos.y, width: winW, zIndex }}
      data-id={id}
      onMouseDown={bringToFront}
    >
      <div className="float-win-titlebar" onMouseDown={onTitleMouseDown}>
        <span className="float-win-title glow-effect">{title}</span>
        <div className="float-win-btns">
          <button
            className="fwb min"
            onClick={() => {
              setMinimized(m => !m);
              saveWindowPosition(id, { x: pos.x, y: pos.y, width: winW, minimized: !minimized });
            }}
            title={minimized ? '还原' : '最小化'}
          >
            {minimized ? '□' : '─'}
          </button>
          <button className="fwb close" onClick={handleClose} title="关闭">✕</button>
        </div>
      </div>

      {!minimized && (
        <div
          className="float-win-body"
          style={{ minHeight, maxHeight: maxBodyH, overflowY: 'auto' }}
        >
          {children}
        </div>
      )}

      <div className="float-win-resize-handle" onMouseDown={onResizeMouseDown} />
    </div>
  );
}
