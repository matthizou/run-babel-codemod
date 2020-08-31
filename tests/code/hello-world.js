const GREETINGS = {
  en: 'Hello!',
  fr: 'Bonjour!',
  es: ' ¡Hola!',
};

export function getGreeting(locale) {
  return GREETINGS[locale] || GREETINGS.en;
}
