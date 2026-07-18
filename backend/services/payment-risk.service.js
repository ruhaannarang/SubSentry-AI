const paymentRiskService = {
  assess(input = '') {
    const value = String(input || '').trim().toLowerCase();

    if (!value) {
      return { input: '', score: 0, level: 'Low', reasons: ['No payment input provided.'], isUrl: false, isUpi: false };
    }

    const reasons = [];
    let score = 0;

    const hasHttps = value.startsWith('https://');
    const looksLikeUrl = value.includes('.') && (value.includes('http') || value.includes('/') || value.includes('.in') || value.includes('.com') || value.includes('.org'));
    const looksLikeUpi = value.includes('@') && !value.includes(' ');

    if (looksLikeUrl && !hasHttps) {
      score += 25;
      reasons.push('Connection is not secured with HTTPS');
    }

    if (/(gift|reward|urgent|verify|claim|bonus|free|winner)/.test(value)) {
      score += 20;
      reasons.push('Contains urgency or incentive wording');
    }

    if (/(paytm|gpay|googlepay|phonepe|amazon|flipkart|sbi|hdfc|icici)/.test(value)) {
      const cleaned = value.replace(/[^a-z0-9]/g, '');
      const brandMatch = cleaned.includes('paytm') || cleaned.includes('gpay') || cleaned.includes('googlepay') || cleaned.includes('phonepe') || cleaned.includes('amazon') || cleaned.includes('flipkart') || cleaned.includes('sbi') || cleaned.includes('hdfc') || cleaned.includes('icici');
      if (!brandMatch || cleaned.includes('help') || value.includes('help') || value.includes('fast')) {
        score += 35;
        reasons.push('Looks like a branded payment link but does not match the official handle');
      }
    }

    if (/[0-9]/.test(value.replace(/(paytm|gpay|googlepay|phonepe|amazon|flipkart|sbi|hdfc|icici)/g, '')) && looksLikeUrl) {
      score += 10;
      reasons.push('Domain contains unusual numeric substitutions');
    }

    if (looksLikeUpi && value.split('@')[0].length > 18) {
      score += 15;
      reasons.push('Unusually long UPI handle');
    }

    if (reasons.length === 0) {
      score += 8;
      reasons.push('No strong red flags found in structure, but external verification is still recommended');
    }

    score = Math.min(score, 96);

    let level = 'Low';
    if (score >= 60) level = 'High';
    else if (score >= 30) level = 'Medium';

    return { input: value, score, level, reasons, isUrl: looksLikeUrl, isUpi: looksLikeUpi };
  },
};

module.exports = { paymentRiskService };
