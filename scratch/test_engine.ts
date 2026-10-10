import { analyzeMessage } from './src/lib/engine'

const eng = "Congratulations! You have won ₹25,000 in the lucky draw. Pay a small fee right now to claim your prize: bit.ly/3xK9claim";
const guj = "અભિનંદન! તમે લકી ડ્રોમાં ₹25,000 જીત્યા છો. તમારું ઇનામ મેળવવા માટે અત્યારે જ એક નાની ફી ચૂકવો: bit.ly/3xK9claim";

async function test() {
  const engResult = await analyzeMessage(eng);
  console.log("English Score:", engResult.score, "Rule:", engResult.ruleScore, "ML:", engResult.mlScore, "URL:", engResult.urlScore);

  const gujResult = await analyzeMessage(guj);
  console.log("Gujarati Score:", gujResult.score, "Rule:", gujResult.ruleScore, "ML:", gujResult.mlScore, "URL:", gujResult.urlScore);
}

test();
