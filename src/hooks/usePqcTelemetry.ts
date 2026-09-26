import { useEffect, useState } from "react";
import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";

interface PqcStatus {
  authenticated: boolean;
  keyExchange: string;
  signature: string;
  publicKey: string;
}

interface TelemetryEnvelope {
  telemetry: {
    keyId: string;
    sequence: number;
    trainId: string;
    status: string;
    speedKph: number;
    routeProgress: number;
    issuedAt: string;
  };
  signature: string;
  algorithm: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`PQC request failed: ${response.status}`);
  return (await response.json()) as T;
}

export function usePqcTelemetry() {
  const [status, setStatus] = useState<PqcStatus | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryEnvelope["telemetry"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const security = await getJson<PqcStatus>("/api/pqc/status");
        const envelope = await getJson<TelemetryEnvelope>("/api/telemetry");
        const message = new TextEncoder().encode(JSON.stringify(envelope.telemetry));
        const verified = ml_dsa65.verify(
          fromBase64(envelope.signature),
          message,
          fromBase64(security.publicKey),
        );

        if (!active) return;
        if (!verified || envelope.algorithm !== security.signature) {
          throw new Error("Telemetry signature could not be verified");
        }
        setStatus(security);
        setTelemetry(envelope.telemetry);
        setError(null);
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : "PQC unavailable");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    const refreshTimer = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  return { status, telemetry, isLoading, error };
}
