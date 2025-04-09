export function shortenAddress(address: string, chars = 3): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
