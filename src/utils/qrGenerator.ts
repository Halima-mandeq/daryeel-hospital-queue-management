import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generate a Data URL (base64 image) for a given text or URL
 */
export async function generateQRCodeDataUrl(
  text: string, 
  options?: QRCodeOptions
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options?.width || 220,
      margin: options?.margin !== undefined ? options?.margin : 1,
      color: {
        dark: options?.color?.dark || '#0f172a',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}

/**
 * Generate an SVG string for a given text or URL
 */
export async function generateQRCodeSvg(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: options?.width || 220,
      margin: options?.margin !== undefined ? options?.margin : 1,
      color: {
        dark: options?.color?.dark || '#0f172a',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return svg;
  } catch (err) {
    console.error('Failed to generate QR code SVG:', err);
    return '';
  }
}

/**
 * Build the full URL that patients can scan with their phone camera to check their status
 */
export function buildTicketScanUrl(ticketNumber: string): string {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?ticket=${encodeURIComponent(ticketNumber.toUpperCase())}`;
  }
  return `https://daryeelqoys.health/ticket?id=${encodeURIComponent(ticketNumber.toUpperCase())}`;
}
