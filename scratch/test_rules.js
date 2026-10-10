const eng = "Congratulations! You have WON ₹25,000 in the lucky draw. Pay a small fee to claim your reward now: bit.ly/3xK9claim";
const hindi = "बधाई हो! आपने लकी ड्रॉ में ₹25,000 जीते हैं। अपना इनाम पाने के लिए अभी एक छोटी सी फ़ीस दें: bit.ly/3xK9claim";

async function translateToEnglish(text) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=Autodetect|en`
    const res = await fetch(url)
    const json = await res.json()
    return json.responseData?.translatedText || text
  } catch {
    return text
  }
}

const MESSAGE_RULES = [
  { id: 'urgency', test: /\b(urgent|immediately|act now|final notice|final warning|last chance|within \d+ hours?|expires? (today|tonight|soon)|right now)\b/i, weight: 14, label: 'Urgency / pressure tactic detected', cat: 'PHISHING' },
  { id: 'otp', test: /\b(otp|one[- ]time password|verification code|upi pin|atm pin)\b/i, weight: 22, label: 'OTP / PIN requested or mentioned', cat: 'PHISHING' },
  { id: 'credentials', test: /\b(password|cvv|card number|bank details?|account number|ifsc|security code)\b/i, weight: 18, label: 'Asks for credentials or card data', cat: 'PHISHING' },
  { id: 'acct_threat', test: /\b(account|card|sim|wallet|net ?banking|kyc)\b[^.]{0,40}\b(blocked|suspended|frozen|deactivated|locked|limited|expire[ds]?)\b|\b(blocked|suspended|frozen|deactivated|locked|limited)\b[^.]{0,40}\b(account|card|sim|wallet|kyc)\b/i, weight: 20, label: 'Account suspension threat', cat: 'IMPERSONATION' },
  { id: 'bank', test: /\b(sbi|hdfc|icici|axis|kotak|pnb|paytm|paypal|bank|rbi|income tax|irs|customs)\b/i, weight: 8, label: 'Impersonates a bank / authority', cat: 'IMPERSONATION' },
  { id: 'prize', test: /\b(congratulations|you (have )?won|winner|prize|lottery|lucky draw|jackpot|cashback|reward)\b/i, weight: 18, label: 'Fake prize / lottery lure', cat: 'PRIZE / LOTTERY SCAM' },
  { id: 'payment', test: /\b(pay|payment|fee|penalty|fine|charge)\b[^.]{0,30}\b(now|immediately|urgent|today|to avoid)\b/i, weight: 15, label: 'Payment demanded under pressure', cat: 'FINANCIAL SCAM' },
  { id: 'crypto', test: /\b(bitcoin|btc|crypto|usdt|double your|guaranteed returns?|investment)\b/i, weight: 14, label: 'Crypto / guaranteed-return scheme', cat: 'FINANCIAL SCAM' },
  { id: 'authority', test: /\b(legal action|arrest|police|court order|lawsuit|warrant)\b/i, weight: 16, label: 'Threatens legal action', cat: 'IMPERSONATION' },
  { id: 'refund', test: /\b(refund|subsidy|claim)\b[^.]{0,40}\b(click|enter|link|details|upi)\b/i, weight: 13, label: 'Refund / claim bait', cat: 'FINANCIAL SCAM' },
  { id: 'job', test: /\b(work from home|earn\b[^.]{0,20}\b(daily|weekly)|registration fee|part[- ]time job)\b/i, weight: 13, label: 'Job / easy-money scam pattern', cat: 'FINANCIAL SCAM' },
  { id: 'link', test: /(https?:\/\/|www\.|bit\.ly|tinyurl|t\.co\/|cutt\.ly)/i, weight: 8, label: 'Contains an embedded link', cat: 'MALICIOUS LINK' },
  { id: 'stranger_family', test: /\b(lost my phone|new number|send (me )?money|need money urgently)\b/i, weight: 15, label: 'Family-in-distress impersonation', cat: 'IMPERSONATION' },
]

async function run(textName, rawText) {
  const text = await translateToEnglish(rawText);
  console.log(`\n--- ${textName} ---`);
  console.log(`Original: ${rawText}`);
  console.log(`Translated: ${text}`);

  let ruleRaw = 0;
  for (const rule of MESSAGE_RULES) {
    if (rule.test.test(text)) {
      console.log(`Matched rule: ${rule.id} (+${rule.weight})`);
      ruleRaw += rule.weight;
    }
  }
  const ruleScore = Math.min(100, Math.round(ruleRaw * 2.5));
  console.log(`Rule Raw: ${ruleRaw}, Rule Score: ${ruleScore}%`);
}

run('English', eng).then(() => run('Hindi', hindi));
