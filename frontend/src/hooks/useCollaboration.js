// src/hooks/useCollaboration.js
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

const SERVER_URL = "http://localhost:3000";

export function useCollaboration(username) {
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const providerRef = useRef(null);
  
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText('monaco'), [ydoc]);

  const disconnect = useCallback(() => {
    if (providerRef.current) {
      providerRef.current.awareness.setLocalStateField('user', null);
      providerRef.current.disconnect();
      providerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!username) return;

    const provider = new SocketIOProvider(SERVER_URL, 'monaco', ydoc, {
      autoConnect: true,
    });
    
    providerRef.current = provider;

    provider.awareness.setLocalStateField('user', { username });

    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      const userList = states
        .filter(state => state.user?.username)
        .map(state => state.user);
      setUsers(userList);
    };

    updateUsers();
    provider.awareness.on('change', updateUsers);
    provider.on('status', ({ status }) => {
      setIsConnected(status === 'connected');
    });

    return () => {
      provider.awareness.off('change', updateUsers);
      provider.off('status');
      disconnect();
    };
  }, [username, ydoc, disconnect]);

  return {
    ydoc,
    yText,
    users,
    isConnected,
    disconnect,
    provider: providerRef.current,
  };
}