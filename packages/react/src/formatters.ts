export function shortenAddress(address: string, chars = 3): string {
  if (!address) {
    return "";
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
