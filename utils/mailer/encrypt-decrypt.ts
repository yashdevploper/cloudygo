import crypto from "crypto";

const algorithm = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, encrypted, authTag]);

  return combined
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decrypt(encodedText: string): string {
  // Replace URL-safe characters and add padding
  let base64 = encodedText.replace(/-/g, "+").replace(/_/g, "/");
  // Calculate required padding
  const pad = base64.length % 4;
  if (pad) {
    if (pad === 1) throw new Error("Invalid Base64 string");
    base64 += "=".repeat(4 - pad);
  }

  const combined = Buffer.from(base64, "base64");

  const iv = combined.subarray(0, IV_LENGTH);
  const encrypted = combined.subarray(
    IV_LENGTH,
    combined.length - AUTH_TAG_LENGTH
  );
  const authTag = combined.subarray(combined.length - AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8"
  );
}
