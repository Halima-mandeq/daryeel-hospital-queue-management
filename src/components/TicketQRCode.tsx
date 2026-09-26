import { useState, useEffect } from 'react';
import { generateQRCodeDataUrl, buildTicketScanUrl } from '../utils/qrGenerator';
import { QrCode, Download, Printer, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { ThemePalette } from '../types/clinic';
import { getThemeStyles } from '../utils/theme';

interface TicketQRCodeProps {
  ticketNumber: string;
  patientName?: string;
  department?: string;
  size?: number;
  showDetails?: boolean;
  showActions?: boolean;
  theme?: ThemePalette;
  lang?: 'so' | 'en';
  onOpenPrintSlip?: () => void;
}

export function TicketQRCode({
  ticketNumber,
  patientName,
  department,
  size = 180,
  showDetails = true,
  showActions = true,
  theme = 'sapphire',
  lang = 'so',
  onOpenPrintSlip,
}: TicketQRCodeProps) {
  const styles = getThemeStyles(theme);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const scanUrl = buildTicketScanUrl(ticketNumber);

  useEffect(() => {
    let isMounted = true;
    generateQRCodeDataUrl(scanUrl, {
      width: size * 2, // 2x for sharp retina rendering
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then((url) => {
      if (isMounted) setQrDataUrl(url);
    });

    return () => {
      isMounted = false;
    };
  }, [ticketNumber, scanUrl, size]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(scanUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {}
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    setDownloading(true);

    // Create a high-res styled canvas ticket badge
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 520;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.roundRect ? ctx.roundRect(0, 0, width, height, 24) : ctx.rect(0, 0, width, height);
    ctx.fill();

    // Top hospital header banner
    ctx.fillStyle = '#1e3a8a'; // Deep blue
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(0, 0, width, 80, [24, 24, 0, 0]) : ctx.fillRect(0, 0, width, 80);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DARYEELQOYS CLINIC', width / 2, 35);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('MCH · Triage · Entrance Pass', width / 2, 58);

    // Ticket Number
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 32px monospace';
    ctx.fillText(ticketNumber.toUpperCase(), width / 2, 125);

    // Patient info
    if (patientName) {
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(patientName, width / 2, 150);
    }

    // QR Image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const qrSize = 220;
      const qrX = (width - qrSize) / 2;
      const qrY = 170;

      // Draw subtle border around QR
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);

      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      // Bottom guidance note
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(
        lang === 'so' ? 'Ku skaan garee albaabka isbitaalka' : 'Scan at hospital entrance kiosk',
        width / 2,
        430
      );

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText(
        lang === 'so' ? 'Waqtiga tooska ah & booskaaga safka' : 'Real-time queue & room status',
        width / 2,
        452
      );

      ctx.fillText(`Issued: ${new Date().toLocaleDateString()}`, width / 2, 485);

      // Trigger download
      const link = document.createElement('a');
      link.download = `ticket-${ticketNumber}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloading(false);
    };
    img.src = qrDataUrl;
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* QR Code Container */}
      <div className="relative group p-3 bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`QR code for ticket ${ticketNumber}`}
            width={size}
            height={size}
            className="rounded-xl object-contain block mx-auto"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl"
          >
            <QrCode className="h-8 w-8 text-slate-400 animate-pulse" />
          </div>
        )}

        {/* Small Center Hospital Badge on the QR Code */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-8 w-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center">
            <span className="font-mono font-black text-[10px] text-blue-600">
              {ticketNumber.split('-')[0] || 'DQ'}
            </span>
          </div>
        </div>
      </div>

      {/* Details Under QR Code */}
      {showDetails && (
        <div className="mt-2.5 space-y-0.5">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3 w-3" />
            <span>
              {lang === 'so' ? 'Tikidhka Skaanka Albaabka' : 'Entrance Scannable Ticket'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[210px] leading-tight">
            {lang === 'so'
              ? 'Ku qabo taleefankaaga ama shaashadda albaabka si aad u aragto safka'
              : 'Scan with smartphone camera or at entrance kiosk'}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={handleDownloadQR}
            disabled={!qrDataUrl || downloading}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
            title={lang === 'so' ? 'Soo daji sawirka QR-ka' : 'Download QR Badge'}
          >
            <Download className="h-3 w-3 text-blue-600" />
            <span>{downloading ? '...' : lang === 'so' ? 'Daji QR' : 'Save QR'}</span>
          </button>

          {onOpenPrintSlip && (
            <button
              type="button"
              onClick={onOpenPrintSlip}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
              title={lang === 'so' ? 'Daabac Tikidhka Rasmiga ah' : 'Print Official Slip'}
            >
              <Printer className="h-3 w-3 text-emerald-600" />
              <span>{lang === 'so' ? 'Daabac' : 'Print'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
            title={lang === 'so' ? 'Koobiyeey link-ga' : 'Copy direct link'}
          >
            {copiedUrl ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
