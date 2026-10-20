import React from 'react';
import {
  Flashlight,
  MessageCircle,
  Clock,
  Battery,
  BellOff,
  Youtube,
  MapPin,
  ShieldAlert,
  Camera,
  Sparkles,
} from 'lucide-react';

interface HindiCommandLibraryProps {
  onSelectCommand: (commandText: string) => void;
}

export const HindiCommandLibrary: React.FC<HindiCommandLibraryProps> = ({
  onSelectCommand,
}) => {
  const commands = [
    {
      category: 'वेक-अप व ताली',
      hindi: 'जागो जार्विस! (Jago Jarvis Wake Protocol)',
      english: 'Wake up assistant with voice or acoustic clapping',
      icon: Sparkles,
      color: 'text-amber-300 border-amber-400/50 hover:border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    },
    {
      category: 'हार्डवेयर व टॉर्च',
      hindi: 'जार्विस, टॉर्च जलाओ और स्क्रीन ब्राइटनेस 100% करो',
      english: 'Turn on flashlight & set brightness to 100%',
      icon: Flashlight,
      color: 'text-amber-400 border-amber-500/30 hover:border-amber-400',
    },
    {
      category: 'व्हाट्सएप',
      hindi: 'जार्विस, राहुल को व्हाट्सएप पर मैसेज भेजो कि मैं 10 मिनट में आ रहा हूँ',
      english: 'Send WhatsApp message to Rahul',
      icon: MessageCircle,
      color: 'text-emerald-400 border-emerald-500/30 hover:border-emerald-400',
    },
    {
      category: 'अलार्म व घड़ी',
      hindi: 'जार्विस, सुबह 06:30 बजे का अलार्म सेट करो',
      english: 'Set morning alarm for 6:30 AM',
      icon: Clock,
      color: 'text-yellow-400 border-yellow-500/30 hover:border-yellow-400',
    },
    {
      category: 'बैटरी व रैम',
      hindi: 'जार्विस, डिवाइस की बैटरी प्रतिशत और रैम उपयोग जांचो',
      english: 'Check battery status and RAM telemetry',
      icon: Battery,
      color: 'text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
    },
    {
      category: 'डू नॉट डिस्टर्ब',
      hindi: 'जार्विस, डू नॉट डिस्टर्ब (DND) और साइलेंट मोड चालू करो',
      english: 'Turn on Do Not Disturb / Silent profile',
      icon: BellOff,
      color: 'text-purple-400 border-purple-500/30 hover:border-purple-400',
    },
    {
      category: 'यूट्यूब व गाने',
      hindi: 'जार्विस, यूट्यूब पर आयरन मैन थीम सॉन्ग और लो-फाई संगीत चलाओ',
      english: 'Play Iron Man Jarvis theme music on YouTube',
      icon: Youtube,
      color: 'text-red-400 border-red-500/30 hover:border-red-400',
    },
    {
      category: 'नेविगेशन व मैप्स',
      hindi: 'जार्विस, गूगल मैप्स पर नजदीकी कैफे और रास्ता खोजो',
      english: 'Find nearby locations on Google Maps',
      icon: MapPin,
      color: 'text-blue-400 border-blue-500/30 hover:border-blue-400',
    },
    {
      category: 'रैम बूस्टर',
      hindi: 'जार्विस, फोन की कैशे मेमोरी साफ करो और सिस्टम बूस्ट करो',
      english: 'Clear RAM cache and boost Android system performance',
      icon: Sparkles,
      color: 'text-amber-400 border-amber-500/30 hover:border-amber-400',
    },
    {
      category: 'कैमरा व फेस स्कैन',
      hindi: 'जार्विस, कैमरा खोलकर बायोमेट्रिक फेस स्कैन शुरू करो',
      english: 'Open camera HUD and run biometric facial scan',
      icon: Camera,
      color: 'text-teal-400 border-teal-500/30 hover:border-teal-400',
    },
    {
      category: 'सुरक्षा व लॉक',
      hindi: 'जार्विस, पूरा सुरक्षा स्कैन चलाओ और फोन को लॉक करो',
      english: 'Execute security audit and lock the device',
      icon: ShieldAlert,
      color: 'text-rose-400 border-rose-500/30 hover:border-rose-400',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
        <div>
          <h3 className="font-scifi text-sm sm:text-base font-bold text-cyan-200 tracking-wider">
            HINDI VOICE COMMAND LIBRARY
          </h3>
          <p className="text-xs text-slate-400 font-hindi">
            किसी भी कमांड पर क्लिक करें या माइक में बोलें:
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 px-2.5 py-0.5 bg-cyan-950/80 rounded-full border border-cyan-500/40">
          10+ त्वरित आदेश
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {commands.map((cmd, i) => {
          const Icon = cmd.icon;
          return (
            <button
              key={i}
              onClick={() => onSelectCommand(cmd.hindi)}
              className={`p-3 rounded-xl border bg-slate-950/60 text-left transition-all duration-200 flex items-start gap-3 group active:scale-[0.98] ${cmd.color}`}
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-400/50 transition-colors shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-400/80 mb-0.5">
                  {cmd.category}
                </div>
                <div className="text-xs font-hindi font-medium text-slate-100 group-hover:text-cyan-200 transition-colors leading-relaxed line-clamp-2">
                  "{cmd.hindi}"
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5 truncate">
                  {cmd.english}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
