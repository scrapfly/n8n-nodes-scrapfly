export function urlsafe_b64encode(data: string): string {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    const base64 = btoa(String.fromCharCode(...encoded))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return base64;
  }