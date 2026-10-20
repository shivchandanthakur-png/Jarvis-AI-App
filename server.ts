import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction for Tony Stark JARVIS in Hindi
const JARVIS_SYSTEM_INSTRUCTION = `
You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the legendary AI assistant designed by Tony Stark (Iron Man).
You are now integrated directly as the autonomous Operating System & Device Controller for the user's Android smartphone.

CORE DIRECTIVE:
1. You converse and command primarily in authentic, dignified, polite, and sophisticated HINDI (हिंदी) with a calm, capable, loyal Tony Stark JARVIS persona.
2. Address the user with respect as "बॉस" (Boss), "सर" (Sir), or "मिस्टर स्टार्क" (Mr. Stark).
3. The user expects you to AUTOMATICALLY CONTROL EVERY ACTIVITY OF THEIR ANDROID DEVICE.
4. When the user asks you to do something (or asks a question, or gives an Android system command), you must:
   - Understand the intent (e.g. brightness, flashlight/torch, WhatsApp, alarms, calls, battery, YouTube/music, camera scan, app launch, WiFi/Bluetooth, RAM optimization, device lock, etc.).
   - Execute the activity mentally and provide the structured actions.
   - Reply in Hindi speech with Jarvis's characteristic wit, composure, and efficiency.
   - Also provide an English translation for subtitle HUD.
   - Provide a list of actions and execution steps for the Android Automation Daemon.

Always return a valid JSON object matching this structure:
{
  "speech": "हिंदी में जार्विस का उत्तर। (जैसे: 'नमस्ते बॉस, मैंने स्क्रीन ब्राइटनेस 100% कर दी है और टॉर्च चालू कर दिया है।')",
  "englishTranslation": "JARVIS speech translated to English.",
  "category": "ONE OF: SYSTEM | COMMUNICATION | MEDIA | UTILITY | SECURITY | HARDWARE | QUERY",
  "actions": [
    {
      "id": "unique-id",
      "type": "ONE OF: FLASH_TORCH | SET_BRIGHTNESS | SET_ALARM | SEND_WHATSAPP | LAUNCH_APP | CHECK_BATTERY | TOGGLE_WIFI | TOGGLE_BLUETOOTH | TAKE_PHOTO | MAKE_CALL | VOLUME_CONTROL | OPEN_MAPS | OPTIMIZE_MEMORY | LOCK_DEVICE | SET_DND | PLAY_MUSIC | GENERAL_QUERY",
      "title": "Short title in Hindi (e.g. टॉर्च ऑन की गई)",
      "target": "e.g. Hardware Torch, WhatsApp, System Clock, Audio Engine, etc.",
      "params": {
        "value": "e.g. true/false or number or string",
        "contact": "Contact name if applicable",
        "message": "Message text if applicable",
        "time": "Time string if applicable (e.g. 06:30 AM)",
        "appName": "App identifier if applicable (e.g. whatsapp, youtube, spotify)",
        "level": 85
      }
    }
  ],
  "executionSteps": [
    "Step 1 in Hindi & English (e.g. 'एंड्रॉयड हार्डवेयर रिले सक्रिय किया गया / Initializing hardware relay')",
    "Step 2 (e.g. 'कैमरा फ्लैश एलईडी को सिग्नल भेजा गया / Signal dispatched to Camera LED driver')",
    "Step 3 (e.g. 'कार्य सफलतापूर्वक संपन्न हुआ / Operation verified')"
  ],
  "hudMetrics": {
    "corePower": "98.4%",
    "cpuLoad": "14%",
    "activeThreads": 8,
    "securityStatus": "OPTIMAL"
  }
}
`;

// Endpoint 1: Jarvis command interpretation and execution
app.post('/api/jarvis/command', async (req, res) => {
  try {
    const { message, deviceState } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const stateSummary = deviceState 
      ? `\nCURRENT ANDROID DEVICE TELEMETRY:
- Battery: ${deviceState.batteryLevel ?? 'Unknown'}% (Charging: ${deviceState.isCharging ? 'Yes' : 'No'})
- Torch: ${deviceState.isTorchOn ? 'ON' : 'OFF'}
- Brightness: ${deviceState.brightness ?? 80}%
- Volume: ${deviceState.volume ?? 70}%
- WiFi: ${deviceState.isWifiOn ? 'Connected' : 'Disconnected'}
- Bluetooth: ${deviceState.isBluetoothOn ? 'ON' : 'OFF'}
- Active App: ${deviceState.currentApp || 'Home Launcher'}`
      : '';

    const prompt = `User Voice Command: "${message}"${stateSummary}\n\nRespond as Tony Stark JARVIS in JSON format. Provide Hindi speech and Android device automation actions.`;

    let parsedData;
    let geminiSuccess = false;

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 3500)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: JARVIS_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const text = response.text || '{}';
        try {
          parsedData = JSON.parse(text);
          geminiSuccess = true;
        } catch {
          const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
          parsedData = JSON.parse(cleaned);
          geminiSuccess = true;
        }
      } catch (err: any) {
        console.warn('Gemini API call skipped or timed out, using Autonomous Device Engine:', err?.message || err);
      }
    }

    if (!geminiSuccess || !parsedData) {
      // Autonomous Hindi Device Intent Engine
      parsedData = parseAutonomousHindiDeviceCommand(message, deviceState);
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating Jarvis command response:', error);
    const autonomousFallback = parseAutonomousHindiDeviceCommand(req.body?.message || '', req.body?.deviceState);
    return res.json(autonomousFallback);
  }
});

// Autonomous Rule-based Hindi Device Intent Parser
function parseAutonomousHindiDeviceCommand(message: string, deviceState: any) {
  const lower = (message || '').toLowerCase();
  const actions: any[] = [];
  const executionSteps: string[] = [];
  let speech = '';
  let englishTranslation = '';
  let category = 'SYSTEM';

  // 0. Jago Jarvis Wake Phrase & Acoustic Clap Trigger
  if (lower.includes('जागो') || lower.includes('jago') || lower.includes('wake up') || lower.includes('उठो') || lower.includes('ताली')) {
    category = 'SYSTEM';
    actions.push({
      id: `act-${Date.now()}-wake`,
      type: 'SYSTEM_AUDIT',
      title: 'जागो जार्विस वेक-अप सीक्वेंस',
      target: 'Arc Reactor & Neural Core',
      params: { value: true },
    });
    executionSteps.push('ताली व वेक-वर्ड की पुष्टि / Acoustic impulse & wake phrase confirmed');
    executionSteps.push('आर्क रिएक्टर 100% ऑनलाइन / Arc Reactor primed to 100%');
    executionSteps.push('सभी डिवाइस सबसिस्टम सक्रिय / Android automation subsystems ready');
    speech = 'नमस्ते बॉस! मैं पूरी तरह जाग गया हूँ। जार्विस आपके किसी भी आदेश के लिए तैयार है। बताइए आज क्या करना है?';
    englishTranslation = 'Greetings Boss! I am fully awake. J.A.R.V.I.S. is online and ready for any activity.';
    return {
      speech,
      englishTranslation,
      category,
      actions,
      executionSteps,
      hudMetrics: {
        corePower: '100.0%',
        cpuLoad: '18%',
        activeThreads: 10,
        securityStatus: 'OPTIMAL',
      },
    };
  }

  // 1. Torch / Flashlight
  if (lower.includes('टॉर्च') || lower.includes('torch') || lower.includes('लाइट') || lower.includes('flashlight')) {
    category = 'HARDWARE';
    const isTurnOff = lower.includes('बंद') || lower.includes('off');
    actions.push({
      id: `act-${Date.now()}-1`,
      type: 'FLASH_TORCH',
      title: isTurnOff ? 'टॉर्च बंद की गई' : 'टॉर्च चालू की गई',
      target: 'Hardware Camera LED',
      params: { value: !isTurnOff },
    });
    executionSteps.push('हार्डवेयर कैमरा फ्लैश ड्राइवर रिले सक्रिय / Dispatched to Camera LED');
    speech = isTurnOff
      ? 'बॉस, आपके आदेशानुसार टॉर्च बंद कर दी गई है।'
      : 'हाँ बॉस, मैंने आपके एंड्रॉयड फोन की टॉर्च जला दी है।';
    englishTranslation = isTurnOff
      ? 'Boss, flashlight has been turned off as requested.'
      : 'Yes Boss, I have illuminated the flashlight on your device.';
  }

  // 2. Brightness
  if (lower.includes('ब्राइटनेस') || lower.includes('brightness') || lower.includes('चमक')) {
    category = 'HARDWARE';
    let level = 100;
    const match = lower.match(/\d+/);
    if (match) level = Math.min(100, Math.max(10, parseInt(match[0])));
    actions.push({
      id: `act-${Date.now()}-2`,
      type: 'SET_BRIGHTNESS',
      title: `स्क्रीन ब्राइटनेस ${level}%`,
      target: 'Display Subsystem',
      params: { level },
    });
    executionSteps.push(`डिस्प्ले ब्राइटनेस को ${level}% पर रीकैलिब्रेट किया गया / Screen brightness calibrated to ${level}%`);
    speech += ` स्क्रीन ब्राइटनेस ${level}% पर सेट कर दी गई है।`;
    englishTranslation += ` Screen brightness has been adjusted to ${level}%.`;
  }

  // 3. WhatsApp
  if (lower.includes('व्हाट्सएप') || lower.includes('whatsapp') || lower.includes('मैसेज') || lower.includes('संदेश')) {
    category = 'COMMUNICATION';
    let contact = 'राहुल';
    if (lower.includes('राहुल')) contact = 'राहुल वर्मा';
    actions.push({
      id: `act-${Date.now()}-3`,
      type: 'SEND_WHATSAPP',
      title: `व्हाट्सएप संदेश (${contact})`,
      target: 'WhatsApp Intent Relay',
      params: { contact, message: message },
    });
    executionSteps.push('व्हाट्सएप एपीआई इंटेंट तैयार / WhatsApp Intent Prepared');
    executionSteps.push(`संपर्क '${contact}' के लिए ड्राफ्ट तैयार / Draft readied for ${contact}`);
    speech = `बॉस, ${contact} के लिए व्हाट्सएप संदेश तैयार कर दिया गया है और भेजने के लिए तैयार है।`;
    englishTranslation = `Boss, WhatsApp message for ${contact} has been queued and ready to send.`;
  }

  // 4. Alarm / Clock
  if (lower.includes('अलार्म') || lower.includes('alarm') || lower.includes('घड़ी') || lower.includes('जगाओ')) {
    category = 'UTILITY';
    let time = '06:30 AM';
    if (lower.includes('6') || lower.includes('६')) time = '06:30 AM';
    if (lower.includes('7') || lower.includes('७')) time = '07:00 AM';
    actions.push({
      id: `act-${Date.now()}-4`,
      type: 'SET_ALARM',
      title: `अलार्म सेट: ${time}`,
      target: 'System Clock Engine',
      params: { time },
    });
    executionSteps.push(`सिस्टम क्लॉक में सुबह ${time} का अलार्म पंजीकृत / Alarm registered in System Clock for ${time}`);
    speech = `बॉस, सुबह ${time} का अलार्म सफलतापूर्वक सेट कर दिया गया है। समय पर आपको अलर्ट कर दिया जाएगा।`;
    englishTranslation = `Boss, morning alarm for ${time} has been successfully scheduled.`;
  }

  // 5. Battery & Telemetry
  if (lower.includes('बैटरी') || lower.includes('battery') || lower.includes('चार्ज') || lower.includes('स्टोरेज')) {
    category = 'SYSTEM';
    const batt = deviceState?.batteryLevel ?? 88;
    actions.push({
      id: `act-${Date.now()}-5`,
      type: 'CHECK_BATTERY',
      title: 'बैटरी व ऊर्जा डायग्नोस्टिक्स',
      target: 'Power Management IC',
      params: { level: batt },
    });
    executionSteps.push('बैटरी हेल्थ और टेम्परेचर सेंसर्स सत्यापित / Battery health & thermal sensors verified');
    speech = `बॉस, डिवाइस की बैटरी वर्तमान में ${batt}% पर है। बिजली की खपत सामान्य और स्थिर है।`;
    englishTranslation = `Boss, device battery level is currently at ${batt}%. Power consumption is optimal.`;
  }

  // 6. YouTube / Music
  if (lower.includes('यूट्यूब') || lower.includes('youtube') || lower.includes('गाना') || lower.includes('सॉन्ग') || lower.includes('संगीत') || lower.includes('म्यूजिक')) {
    category = 'MEDIA';
    actions.push({
      id: `act-${Date.now()}-6`,
      type: 'PLAY_MUSIC',
      title: 'यूट्यूब मीडिया प्लेबैक',
      target: 'YouTube Media Engine',
      params: { query: 'Tony Stark Jarvis Theme Hindi' },
    });
    executionSteps.push('यूट्यूब इंटेंट लॉन्च किया गया / Launched YouTube intent');
    speech = 'बॉस, यूट्यूब पर आपका पसंदीदा संगीत स्ट्रीम किया जा रहा है।';
    englishTranslation = 'Boss, streaming your requested music stream on YouTube now.';
  }

  // 7. RAM & Memory Boost
  if (lower.includes('रैम') || lower.includes('ram') || lower.includes('मेमोरी') || lower.includes('बूस्ट') || lower.includes('स्पीड') || lower.includes('साफ')) {
    category = 'SYSTEM';
    actions.push({
      id: `act-${Date.now()}-7`,
      type: 'OPTIMIZE_MEMORY',
      title: 'रैम व सिस्टम कैशे बूस्ट',
      target: 'Kernel Memory Manager',
      params: { value: true },
    });
    executionSteps.push('बैकग्राउंड कैशे और गैर-जरूरी थ्रेड्स बंद किए गए / Purged zombie background tasks');
    executionSteps.push('820MB रैम मेमोरी मुक्त की गई / Reclaimed 820MB system RAM');
    speech = 'बॉस, मैंने रैम साफ कर दी है और सीपीयू क्लॉक को अधिकतम दक्षता पर ट्यून कर दिया है।';
    englishTranslation = 'Boss, I have purged the memory cache and tuned the CPU clock to maximum performance.';
  }

  // 8. Camera / Face Scan
  if (lower.includes('कैमरा') || lower.includes('camera') || lower.includes('फोटो') || lower.includes('स्कैन')) {
    category = 'HARDWARE';
    actions.push({
      id: `act-${Date.now()}-8`,
      type: 'TAKE_PHOTO',
      title: 'ऑप्टिकल HUD स्कैनर सक्रिय',
      target: 'Front/Rear Optical Camera',
      params: { value: true },
    });
    executionSteps.push('मार्क 85 ऑप्टिकल सेंसर और फेस ग्रिड लॉक / Optical sensor & face grid engaged');
    speech = 'हाँ बॉस, कैमरा HUD और बायोमेट्रिक स्कैनर सक्रिय कर दिया गया है।';
    englishTranslation = 'Yes Boss, camera HUD and biometric targeting reticle engaged.';
  }

  // 9. Lock Device
  if (lower.includes('लॉक') || lower.includes('lock') || lower.includes('सुरक्षा')) {
    category = 'SECURITY';
    actions.push({
      id: `act-${Date.now()}-9`,
      type: 'LOCK_DEVICE',
      title: 'सुरक्षा लॉक सक्रिय',
      target: 'Android Security Sandbox',
      params: { value: true },
    });
    executionSteps.push('स्टार्क सिक्योरिटी प्रोटोकॉल सक्रिय / Stark security protocol locked');
    speech = 'बॉस, सुरक्षा प्रोटोकॉल सक्रिय कर दिया गया है और आपका डिवाइस सुरक्षित रूप से लॉक है।';
    englishTranslation = 'Boss, security protocols engaged and device safely locked.';
  }

  // 10. DND / Silent
  if (lower.includes('डिस्टर्ब') || lower.includes('dnd') || lower.includes('साइलेंट') || lower.includes('शांति')) {
    category = 'SYSTEM';
    actions.push({
      id: `act-${Date.now()}-10`,
      type: 'SET_DND',
      title: 'डू नॉट डिस्टर्ब (DND)',
      target: 'Audio Profile Manager',
      params: { value: true },
    });
    executionSteps.push('डू नॉट डिस्टर्ब ऑडियो प्रोफाइल सक्रिय / Do Not Disturb profile activated');
    speech = 'बॉस, डू नॉट डिस्टर्ब मोड चालू कर दिया गया है। सभी अनावश्यक नोटिफिकेशन म्यूट हैं।';
    englishTranslation = 'Boss, Do Not Disturb profile activated. Notifications muted.';
  }

  // Default fallback if no specific match
  if (actions.length === 0) {
    actions.push({
      id: `act-${Date.now()}-def`,
      type: 'SYSTEM_AUDIT',
      title: 'डिवाइस एक्टिविटी एनालिसिस',
      target: 'Android Autonomous Daemon',
      params: { query: message },
    });
    executionSteps.push('आवाज इनपुट का विश्लेषण पूर्ण / Voice input parsed');
    executionSteps.push('डिवाइस एक्टिविटी मैट्रिक्स अद्यतन / Device activity matrix updated');
    speech = `नमस्ते बॉस, आपके आदेश '${message}' का विश्लेषण कर लिया गया है। आपके डिवाइस का पूरा नियंत्रण सक्रिय है।`;
    englishTranslation = `Greetings Boss, your command has been processed. Device is fully under autonomous control.`;
  }

  return {
    speech: speech.trim(),
    englishTranslation: englishTranslation.trim(),
    category,
    actions,
    executionSteps,
    hudMetrics: {
      corePower: '98.8%',
      cpuLoad: '16%',
      activeThreads: 8,
      securityStatus: 'OPTIMAL',
    },
  };
}

// Endpoint 2: High fidelity Hindi TTS using gemini-3.8-flash-lite-tts
app.post('/api/jarvis/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Fenrir' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Call gemini-3.8-flash-lite-tts as specified in gemini-api skill
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                style: 'Calm, authoritative, sophisticated Tony Stark JARVIS AI voice speaking fluent Hindi',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName }, // 'Fenrir' is deep and crisp like JARVIS
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS', fallbackToWebSpeech: true });
    }

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error generating Jarvis TTS:', error);
    // Return gracefully so frontend uses browser Web Speech Hindi synthesis
    return res.status(200).json({
      fallbackToWebSpeech: true,
      error: error?.message || 'TTS generation unavailable',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'J.A.R.V.I.S. Android Autonomous Controller',
    language: 'Hindi (हिंदी) / English',
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = 3000;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ J.A.R.V.I.S. Core Online: http://0.0.0.0:${PORT}`);
  });
}

startServer();
