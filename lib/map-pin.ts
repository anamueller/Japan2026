export function numberedPinSvg(label: string, active = false): string {
  const stroke = active ? "#8f0022" : "#bc002d";
  const fill = active ? "#bc002d" : "#fff";
  const text = active ? "#fff" : "#bc002d";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/><text x="10" y="13.4" text-anchor="middle" font-size="8.5" font-family="system-ui,sans-serif" font-weight="600" fill="${text}">${label}</text></svg>`;
}

export function numberedPinUrl(label: string, active = false): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(numberedPinSvg(label, active))}`;
}
