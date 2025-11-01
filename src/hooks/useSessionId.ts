import { useEffect, useState } from 'react';

export function useSessionId() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem('museum-session-id');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('museum-session-id', id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
}
