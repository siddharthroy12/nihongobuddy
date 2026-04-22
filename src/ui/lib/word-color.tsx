const typeToColorMap = {
  noun: "#BD08B4",
  verb: "#BD4E08",
  adjective: "#BD0808",
  adverb: "#08BDAB",
  particle: "#05BA1A",
  conjunction: "#BA7805",
  interjection: "#96BA05",
  determiner: "#5A53E2",
  prefix: "#1A73C1",
  postfix: "#1A73C1",
};

export function getColorForWordType(type: string): string {
  type = type.toLowerCase();
  for (let key of Object.keys(typeToColorMap)) {
    if (type.includes(key)) {
      return typeToColorMap[key as keyof typeof typeToColorMap];
    }
  }
  return "#4b4b4b";
}
