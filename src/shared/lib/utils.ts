export const getRandomText = (texts: readonly string[]): string => {
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
};
 
export const formatPrompt = (template: string, params: Record<string, string>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] || match;
  });
}; 