// QR Code generation utilities
export const generateUniqueQRCode = (role: string, id?: number, timestamp?: number): string => {
  const now = timestamp || Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  switch (role) {
    case 'admin':
      return `ECO-ADMIN-${id || now}-${randomSuffix}`;
    case 'petugas':
      return `ECO-OFFICER-${id || now}-${randomSuffix}`;
    case 'penumpang':
      return `ECO-PASS-${now}-${randomSuffix}`;
    default:
      return `ECO-USER-${now}-${randomSuffix}`;
  }
};

// Validate QR code format
export const validateQRCode = (qrCode: string): boolean => {
  const patterns = [
    /^ECO-ADMIN-\d+-[A-Z0-9]{6}$/,
    /^ECO-OFFICER-\d+-[A-Z0-9]{6}$/,
    /^ECO-PASS-\d+-[A-Z0-9]{6}$/,
    /^ECO-USER-\d+-[A-Z0-9]{6}$/
  ];
  
  return patterns.some(pattern => pattern.test(qrCode));
};

// Extract role from QR code
export const extractRoleFromQR = (qrCode: string): string | null => {
  if (qrCode.startsWith('ECO-ADMIN-')) return 'admin';
  if (qrCode.startsWith('ECO-OFFICER-')) return 'petugas';
  if (qrCode.startsWith('ECO-PASS-')) return 'penumpang';
  if (qrCode.startsWith('ECO-USER-')) return 'penumpang'; // Legacy support
  return null;
};

// Check if QR code is unique (would need backend verification in real app)
export const isQRCodeUnique = async (qrCode: string): Promise<boolean> => {
  try {
    // In a real app, this would check against the database
    // For now, we assume timestamp-based codes are unique
    return validateQRCode(qrCode);
  } catch (error) {
    console.error('Error checking QR code uniqueness:', error);
    return false;
  }
};