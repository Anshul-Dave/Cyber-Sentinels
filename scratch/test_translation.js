const text = "बधाई हो! आपने लकी ड्रॉ में ₹25,000 जीते हैं। अपना इनाम पाने के लिए अभी एक छोटी सी फ़ीस दें: bit.ly/3xK9claim";
const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=Autodetect|en`;

fetch(url)
  .then(res => res.json())
  .then(json => {
    console.log("Translation:", json.responseData.translatedText);
  })
  .catch(err => console.error("Fetch error:", err));
