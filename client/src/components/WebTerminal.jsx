import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'; // Import standard Xterm styles

const WebTerminal = ({ containerId }) => {
  const terminalRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!containerId) return;

    // 1. Initialize Xterm.js
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#0d0d0d', // Cyber Black
        foreground: '#00ff41', // Neon Green
        cursor: '#00ff41',
        selectionBackground: 'rgba(0, 255, 65, 0.3)',
      },
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      convertEol: true, // Converts \n to \r\n automatically
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // Mount terminal to DOM
    term.open(terminalRef.current);
    fitAddon.fit();

    // 2. Connect to WebSocket
    // Note: We use the Vite env variable for the WS URL base if needed, 
    // but for now we'll derive it from the HTTP URL.
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = 'localhost:8000'; // Or use import.meta.env.VITE_API_URL logic
    const wsUrl = `${protocol}//${host}/ws/shell/${containerId}`;

    console.log(`Connecting to Shell: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    // 3. Handle Events
    
    // WS -> Terminal (Display what server sends)
    ws.onmessage = (event) => {
      term.write(event.data);
    };

    // Terminal -> WS (Send what user types)
    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    ws.onclose = () => {
      term.write('\r\n\x1b[31m[CONNECTION CLOSED]\x1b[0m\r\n');
    };

    // Handle Resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    // Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (ws.readyState === WebSocket.OPEN) ws.close();
      term.dispose();
    };
  }, [containerId]);

  // Render a container that fills the parent
  return <div ref={terminalRef} className="w-full h-full" />;
};

export default WebTerminal;