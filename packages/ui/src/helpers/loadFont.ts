export async function loadFont(name: string, url: string) {
  // @ts-ignore
  const myFont = new FontFace("PragmataPro Mono Liga", `url(${url})`);
  const font = await myFont.load();

  // @ts-ignore
  document.fonts.add(font);

  return font;
}
