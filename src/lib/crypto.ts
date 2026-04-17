import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const PREFIX = "enc:v1:";
const ALGO = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 12;
const TAG_LEN = 16;

let cachedKey: Buffer | null = null;

function getKey(): Buffer {
  if (cachedKey) return cachedKey;
  const secret =
    process.env.ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "No encryption secret available. Set ENCRYPTION_KEY (preferred) or NEXTAUTH_SECRET/AUTH_SECRET."
    );
  }
  cachedKey = scryptSync(secret, "liketica-salt-v1", KEY_LEN);
  return cachedKey;
}

export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;
  if (plaintext.startsWith(PREFIX)) return plaintext;
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, getKey(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + Buffer.concat([iv, tag, ct]).toString("base64");
}

export function decrypt(value: string | null | undefined): string {
  if (!value) return "";
  if (!value.startsWith(PREFIX)) return value;
  const raw = Buffer.from(value.slice(PREFIX.length), "base64");
  const iv = raw.subarray(0, IV_LEN);
  const tag = raw.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ct = raw.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString("utf8");
}

export function isEncrypted(value: string | null | undefined): boolean {
  return !!value && value.startsWith(PREFIX);
}
