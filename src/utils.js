export function encodeClassName(str) {
  return str
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, (ch) => "_" + ch.charCodeAt(0) + "_");
}

export function decodeClassName(encoded) {
  return encoded
    .replace(/_(\d+)_/g, (_, code) => String.fromCharCode(code)) // convert codes to chars
    .replace(/-/g, " "); // all remaining dashes → spaces
}