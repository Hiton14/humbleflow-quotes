import { companyInfo } from '../config/company';

export const getWhatsAppLink = (productName: string, productId?: string) => {
    // Use config phone number or fallback, stripping non-numeric characters
    // Assuming COMPANY_CONFIG.phone is available, otherwise allow passing it or hardcode/fallback
    // We'll use a generic placeholder or try to import config if it exists
    const rawPhone = companyInfo?.contact?.phone || '254700000000'; // Default fallback
    const phone = rawPhone.replace(/\D/g, '');

    const text = `Hi, I'm interested in a quote for: ${productName}${productId ? ` (ID: ${productId})` : ''}. Could you please provide more details?`;
    const encodedText = encodeURIComponent(text);

    return `https://wa.me/${phone}?text=${encodedText}`;
};
