import { useEffect, useState, useCallback, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useErrorHandler } from './use-error-handling';
import { useSession } from 'next-auth/react';

export interface NotificationContent {
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
}

export interface UseSignalROptions {
  url: string;
  automaticReconnect?: boolean;
}

export interface UseSignalRReturn {
  connection: HubConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  sendNotification: (content: NotificationContent) => Promise<void>;
  joinGroup: (groupName: string) => Promise<void>;
  leaveGroup: (groupName: string) => Promise<void>;
  stopConnection: () => Promise<void>;
}

export const useSignalR = (
  options: UseSignalROptions,
  onNotificationReceived?: (notification: NotificationContent) => void
): UseSignalRReturn => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { handleError } = useErrorHandler();
  const { data: session } = useSession();

  const createConnection = useCallback(() => {
    const builder = new HubConnectionBuilder()
      .withUrl(options.url, {
        accessTokenFactory: () => session?.accessToken || ''
      })
      .withAutomaticReconnect(options.automaticReconnect ? [0, 2000, 10000, 30000] : [])
      .configureLogging(LogLevel.Information);

    return builder.build();
  }, [options.url, session?.accessToken, options.automaticReconnect]);

  const startConnection = useCallback(async () => {
    if (!connection || isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      await connection.start();
      setIsConnected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      handleError(errorMessage);
      if (options.automaticReconnect) {
        reconnectTimeoutRef.current = setTimeout(() => {
          startConnection();
        }, 5000);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [connection, isConnecting, options.automaticReconnect, handleError]);

  const stopConnection = useCallback(async () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (connection && isConnected) {
      try {
        await connection.stop();
        setIsConnected(false);
      } catch (err) {
        handleError(err);
      }
    }
  }, [connection, isConnected, handleError]);

  const sendNotification = useCallback(async (content: NotificationContent) => {
    if (connection && isConnected) {
      try {
        await connection.invoke('SendNotification', content);
      } catch (err) {
        handleError(err);
        throw err;
      }
    } else {
      throw new Error('SignalR connection not established');
    }
  }, [connection, isConnected, handleError]);

  const joinGroup = useCallback(async (groupName: string) => {
    if (connection && isConnected) {
      try {
        await connection.invoke('JoinGroup', groupName);
      } catch (err) {
        handleError(err);
        throw err;
      }
    }
  }, [connection, isConnected, handleError]);

  const leaveGroup = useCallback(async (groupName: string) => {
    if (connection && isConnected) {
      try {
        await connection.invoke('LeaveGroup', groupName);
      } catch (err) {
        handleError(err);
        throw err;
      }
    }
  }, [connection, isConnected, handleError]);

  useEffect(() => {
    const newConnection = createConnection();
    setConnection(newConnection);

    newConnection.on('ReceiveNotification', (notification: NotificationContent) => {
      onNotificationReceived?.(notification);
    });

    newConnection.onclose(() => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    newConnection.onreconnecting(() => {
      setIsConnecting(true);
    });

    newConnection.onreconnected(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    return () => {
      newConnection.stop();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [createConnection, onNotificationReceived, handleError]);

  useEffect(() => {
    if (connection && !isConnected && !isConnecting) {
      startConnection();
    }
  }, [connection, isConnected, isConnecting, startConnection]);

  return {
    connection,
    isConnected,
    isConnecting,
    error,
    sendNotification,
    joinGroup,
    leaveGroup,
    stopConnection
  };
};