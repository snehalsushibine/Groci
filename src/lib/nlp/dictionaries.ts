// English fallback dictionary for parsing logic where full localized terms are not available
const EN_FALLBACK = {
  add: ['add', 'insert', 'put', 'need', 'buy'],
  remove: ['remove', 'delete', 'drop', 'discard'],
  modify: ['change', 'update', 'modify', 'set'],
  search: ['find', 'search', 'looking', 'show'],
  units: ['bottles', 'bottle', 'kg', 'g', 'litre', 'litres', 'ml', 'lbs', 'lb'],
  numbers: { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'a': 1, 'an': 1 }
};

export const DICTIONARIES: Record<string, any> = {
  'en-US': EN_FALLBACK,
  
  // Indian Languages
  'hi-IN': {
    add: ['जोड़ें', 'डालें', 'चाहिए', 'खरीदना'],
    remove: ['हटाएं', 'निकालें'],
    modify: ['बदलें', 'सेट'],
    search: ['खोजें', 'दिखाएं', 'ढूंढें'],
    units: ['बोतल', 'किलो', 'ग्राम', 'लीटर', 'मिली'],
    numbers: { 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10 }
  },
  'ta-IN': {
    add: ['சேர்', 'வேண்டும்'],
    remove: ['நீக்கு', 'அகற்று'],
    modify: ['மாற்று', 'அமை'],
    search: ['தேடு', 'காட்டு'],
    units: ['பாட்டில்', 'கிலோ', 'கிராம்', 'லிட்டர்', 'மிலி'],
    numbers: { 'ஒன்று': 1, 'இரண்டு': 2, 'மூன்று': 3, 'நான்கு': 4, 'ஐந்து': 5, 'ஆறு': 6, 'ஏழு': 7, 'எட்டு': 8, 'ஒன்பது': 9, 'பத்து': 10 }
  },
  'te-IN': {
    add: ['చేర్చు', 'కావాలి', ...EN_FALLBACK.add],
    remove: ['తొలగించు', ...EN_FALLBACK.remove],
    modify: ['మార్చు', ...EN_FALLBACK.modify],
    search: ['వెతుకు', 'చూపు', ...EN_FALLBACK.search],
    units: ['బాటిల్', 'కిలో', 'గ్రాములు', 'లీటర్', 'మిలీ', ...EN_FALLBACK.units],
    numbers: { 'ఒకటి': 1, 'రెండు': 2, 'మూడు': 3, 'నాలుగు': 4, 'ఐదు': 5, ...EN_FALLBACK.numbers }
  },
  'kn-IN': {
    add: ['ಸೇರಿಸು', 'ಬೇಕು', ...EN_FALLBACK.add],
    remove: ['ತೆಗೆದುಹಾಕು', ...EN_FALLBACK.remove],
    modify: ['ಬದಲಾಯಿಸು', ...EN_FALLBACK.modify],
    search: ['ಹುಡುಕು', 'ತೋರಿಸು', ...EN_FALLBACK.search],
    units: ['ಬಾಟಲ್', 'ಕೆಜಿ', 'ಗ್ರಾಂ', 'ಲೀಟರ್', 'ಮಿಲಿ', ...EN_FALLBACK.units],
    numbers: { 'ಒಂದು': 1, 'ಎರಡು': 2, 'ಮೂರು': 3, 'ನಾಲ್ಕು': 4, 'ಐದು': 5, ...EN_FALLBACK.numbers }
  },
  'ml-IN': {
    add: ['ചേർക്കുക', 'വേണം', ...EN_FALLBACK.add],
    remove: ['നീക്കം ചെയ്യുക', ...EN_FALLBACK.remove],
    modify: ['മാറ്റുക', ...EN_FALLBACK.modify],
    search: ['തിരയുക', 'കാണിക്കുക', ...EN_FALLBACK.search],
    units: ['കുപ്പി', 'കിലോ', 'ഗ്രാം', 'ലിറ്റർ', ...EN_FALLBACK.units],
    numbers: { 'ഒന്ന്': 1, 'രണ്ട്': 2, 'മൂന്ന്': 3, 'നാല്': 4, 'അഞ്ച്': 5, ...EN_FALLBACK.numbers }
  },
  'bn-IN': {
    add: ['যোগ করুন', 'চাই', ...EN_FALLBACK.add],
    remove: ['মুছে ফেলুন', 'বাদ দিন', ...EN_FALLBACK.remove],
    modify: ['পরিবর্তন করুন', ...EN_FALLBACK.modify],
    search: ['খুঁজুন', 'দেখান', ...EN_FALLBACK.search],
    units: ['বোতল', 'কেজি', 'গ্রাম', 'লিটার', 'মিলি', ...EN_FALLBACK.units],
    numbers: { 'এক': 1, 'দুই': 2, 'তিন': 3, 'চার': 4, 'পাঁচ': 5, ...EN_FALLBACK.numbers }
  },
  'mr-IN': {
    add: ['जोडा', 'टाका', 'घाला', 'पाहिजे', ...EN_FALLBACK.add],
    remove: ['काढून टाका', ...EN_FALLBACK.remove],
    modify: ['बदला', ...EN_FALLBACK.modify],
    search: ['शोधा', 'दाखवा', ...EN_FALLBACK.search],
    units: ['बाटली', 'किलो', 'ग्रॅम', 'लिटर', 'मिली', ...EN_FALLBACK.units],
    numbers: { 'एक': 1, 'दोन': 2, 'तीन': 3, 'चार': 4, 'पाच': 5, ...EN_FALLBACK.numbers }
  },
  'gu-IN': {
    add: ['ઉમેરો', 'જોઈએ', ...EN_FALLBACK.add],
    remove: ['દૂર કરો', ...EN_FALLBACK.remove],
    modify: ['બદલો', ...EN_FALLBACK.modify],
    search: ['શોધો', 'બતાવો', ...EN_FALLBACK.search],
    units: ['બોટલ', 'કિલો', 'ગ્રામ', 'લિટર', 'મિલી', ...EN_FALLBACK.units],
    numbers: { 'એક': 1, 'બે': 2, 'ત્રણ': 3, 'ચાર': 4, 'પાંચ': 5, ...EN_FALLBACK.numbers }
  },
  'pa-IN': {
    add: ['ਸ਼ਾਮਲ ਕਰੋ', 'ਚਾਹੀਦਾ', ...EN_FALLBACK.add],
    remove: ['ਹਟਾਓ', ...EN_FALLBACK.remove],
    modify: ['ਬਦਲੋ', ...EN_FALLBACK.modify],
    search: ['ਖੋਜੋ', 'ਦਿਖਾਓ', ...EN_FALLBACK.search],
    units: ['ਬੋਤਲ', 'ਕਿਲੋ', 'ਗ੍ਰਾਮ', 'ਲੀਟਰ', 'ਮਿਲੀ', ...EN_FALLBACK.units],
    numbers: { 'ਇੱਕ': 1, 'ਦੋ': 2, 'ਤਿੰਨ': 3, 'ਚਾਰ': 4, 'ਪੰਜ': 5, ...EN_FALLBACK.numbers }
  },

  // International Languages
  'es-ES': {
    add: ['añadir', 'agregar', 'necesito', 'comprar'],
    remove: ['eliminar', 'quitar', 'borrar'],
    modify: ['cambiar', 'modificar', 'actualizar'],
    search: ['buscar', 'encontrar', 'mostrar'],
    units: ['botella', 'botellas', 'kg', 'g', 'litro', 'litros', 'ml'],
    numbers: { 'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5, 'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10, 'un': 1, 'una': 1 }
  },
  'fr-FR': {
    add: ['ajouter', 'besoin', 'acheter'],
    remove: ['supprimer', 'enlever', 'retirer'],
    modify: ['modifier', 'changer'],
    search: ['trouver', 'chercher', 'montrer'],
    units: ['bouteille', 'bouteilles', 'kg', 'g', 'litre', 'litres', 'ml'],
    numbers: { 'un': 1, 'une': 1, 'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5, 'six': 6, 'sept': 7, 'huit': 8, 'neuf': 9, 'dix': 10 }
  },
  'de-DE': {
    add: ['hinzufügen', 'brauche', 'kaufen'],
    remove: ['entfernen', 'löschen'],
    modify: ['ändern', 'aktualisieren'],
    search: ['finden', 'suchen', 'zeigen'],
    units: ['flasche', 'flaschen', 'kg', 'g', 'liter', 'ml'],
    numbers: { 'eins': 1, 'ein': 1, 'eine': 1, 'zwei': 2, 'drei': 3, 'vier': 4, 'fünf': 5, 'sechs': 6, 'sieben': 7, 'acht': 8, 'neun': 9, 'zehn': 10 }
  },
  'pt-BR': {
    add: ['adicionar', 'preciso', 'comprar'],
    remove: ['remover', 'excluir', 'tirar'],
    modify: ['mudar', 'alterar', 'modificar'],
    search: ['buscar', 'encontrar', 'mostrar'],
    units: ['garrafa', 'garrafas', 'kg', 'g', 'litro', 'litros', 'ml'],
    numbers: { 'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'três': 3, 'quatro': 4, 'cinco': 5, 'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10 }
  },
  'ar-SA': {
    add: ['إضافة', 'أضف', 'أحتاج', 'شراء'],
    remove: ['حذف', 'إزالة'],
    modify: ['تغيير', 'تعديل'],
    search: ['ابحث', 'بحث', 'أظهر'],
    units: ['زجاجة', 'كيلو', 'جرام', 'لتر', 'مل'],
    numbers: { 'واحد': 1, 'اثنين': 2, 'ثلاثة': 3, 'أربعة': 4, 'خمسة': 5, 'ستة': 6, 'سبعة': 7, 'ثمانية': 8, 'تسعة': 9, 'عشرة': 10 }
  },
  'ja-JP': {
    add: ['追加', '欲しい', '買う'],
    remove: ['削除', '外す'],
    modify: ['変更'],
    search: ['探す', '検索', '見せる'],
    units: ['本', 'キロ', 'グラム', 'リットル', 'ミリ'],
    numbers: { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '1': 1, '2': 2, '3': 3 }
  }
};
