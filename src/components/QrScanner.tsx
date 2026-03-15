"use client";

import { useEffect, useRef, useState } from "react";

interface QrScannerProps {
  onScan: (locationSlug: string) => void;
  onClose: () => void;
}

export function QrScanner({ onScan, onClose }: QrScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);
  const scannerRunningRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (!mounted || !scannerRef.current) return;

      const scanner = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            // Extract location slug from URL like tazizi.ae/order?location=marina-01
            try {
              const url = new URL(decodedText);
              const loc = url.searchParams.get("location");
              if (loc) {
                scannerRunningRef.current = false;
                scanner.stop().catch(() => {});
                onScan(loc);
                return;
              }
            } catch {
              // Not a URL — try using the raw text as a slug
            }
            // Fallback: treat raw text as location slug
            if (decodedText && !decodedText.includes(" ")) {
              scannerRunningRef.current = false;
              scanner.stop().catch(() => {});
              onScan(decodedText);
            }
          },
          () => {} // ignore scan failures
        );
        scannerRunningRef.current = true;
      } catch {
        if (mounted) {
          setError("Camera access denied. Please allow camera permissions and try again.");
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;
      if (html5QrCodeRef.current && scannerRunningRef.current) {
        scannerRunningRef.current = false;
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="overlay-enter fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-white text-lg font-bold">Scan QR Code</h2>
          <p className="text-white/50 text-sm">Point your camera at the fridge QR code</p>
        </div>
        <button
          onClick={() => {
            if (html5QrCodeRef.current && scannerRunningRef.current) {
              scannerRunningRef.current = false;
              html5QrCodeRef.current.stop().catch(() => {});
            }
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scanner */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {error ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <p className="text-white/80 text-sm mb-6">{error}</p>
              <button
                onClick={onClose}
                className="bg-white text-charcoal px-6 py-3 rounded-xl font-semibold text-sm press"
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-black">
              <div id="qr-reader" ref={scannerRef} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
