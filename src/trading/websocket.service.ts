import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { WS_HUB_URL } from '../constants';

export interface WebSocketMessage {
  type: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  public readonly message$: Observable<WebSocketMessage>;

  private readonly connectedSubject = new BehaviorSubject<boolean>(false);
  private readonly messageSubject = new Subject<WebSocketMessage>();
  private readonly snackBar = inject(MatSnackBar);

  private readonly maxReconnectAttempts = 5;
  private readonly initialReconnectDelay = 1000;
  private readonly connectionTimeoutMs = 10000;
  private readonly autoReconnect = true;

  private ws: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: number | null = null;
  private connectionTimeout: number | null = null;
  private isConnecting: boolean = false;
  private hasEmittedFailure: boolean = false;

  constructor() {
    this.message$ = this.messageSubject.asObservable();
  }

  public connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.hasEmittedFailure = false;

    try {
      this.ws = new WebSocket(WS_HUB_URL);

      this.connectionTimeout = window.setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          this.handleConnectionError(new Error('Connection timeout'));
        }
      }, this.connectionTimeoutMs);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onclose = (event) => this.handleClose(event);
      this.ws.onerror = () => this.handleError();
    } catch (error) {
      this.handleConnectionError(error as Error);
    }
  }

  public disconnect(): void {
    this.clearTimeouts();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectedSubject.next(false);
    this.isConnecting = false;
  }

  public send(message: WebSocketMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        this.snackBar.open('Failed to send WebSocket message', 'Close', { duration: 5000 });
        return false;
      }
    }
    return false;
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getConnectionState(): number | null {
    return this.ws?.readyState ?? null;
  }

  public destroy(): void {
    this.disconnect();
    this.connectedSubject.complete();
    this.messageSubject.complete();

    console.log('WebSocket service destroyed');
  }

  private handleOpen(): void {
    this.clearTimeouts();
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.connectedSubject.next(true);

    this.send({
      type: 'register-ui-client',
      data: null,
    });
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.messageSubject.next(message);
    } catch (error) {
      this.snackBar.open('Failed to parse WebSocket message', 'Close', { duration: 5000 });
    }
  }

  private handleClose(event: CloseEvent): void {
    this.clearTimeouts();
    this.isConnecting = false;
    this.connectedSubject.next(false);
    console.log('WebSocket disconnected');

    if (this.autoReconnect && !event.wasClean) {
      this.scheduleReconnect();
    }
  }

  private handleError(): void {
    this.clearTimeouts();
    this.isConnecting = false;
    const error = new Error('WebSocket connection error');
    this.handleConnectionError(error);
  }

  private handleConnectionError(wsError: Error): void {
    this.clearTimeouts();
    this.isConnecting = false;
    this.connectedSubject.next(false);

    if (!this.hasEmittedFailure) {
      this.snackBar.open(`WebSocket error: ${wsError.message}`, 'Close', { duration: 5000 });
      this.hasEmittedFailure = true;
    }

    if (this.autoReconnect) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    const delay = this.initialReconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.reconnectTimeout = window.setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearTimeouts(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}
