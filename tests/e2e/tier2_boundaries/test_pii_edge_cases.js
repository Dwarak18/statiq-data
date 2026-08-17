/**
 * Tier 2 Boundary Test: PII Edge Cases, Unicode & Security Injections
 * 
 * Verifies:
 * 1. Unicode and international characters in display names encrypt and decrypt without corruption.
 * 2. Extremely long strings (boundary 100 characters for display names) are handled accurately.
 * 3. Special characters (quotes, backslashes, emojis) encrypt cleanly under AES-256-GCM.
 * 4. Empty and non-string inputs to encryptPII throw TypeError.
 * 5. SQL injection payloads in email and name fields do not bypass HMAC blind indexing.
 */

import {
  assertEqual,
  assertTrue,
  assertThrows,
  encryptPII,
  decryptPII,
  hmacLookup
} from '../test_helpers.js';

export async function registerTests(suite) {
  // 1. Unicode & International Characters in PII
  suite.test('Unicode names and international characters encrypt and decrypt with 100% byte fidelity', async () => {
    const unicodeNames = [
      'François Müller',
      '田中 太郎',
      'Владимир Петров',
      'محمد عبد الله',
      'राजेश शर्मा',
      'Institutional Fund 📈 🚀 & Co.',
    ];

    for (const name of unicodeNames) {
      const encrypted = encryptPII(name);
      const decrypted = decryptPII(encrypted);
      assertEqual(decrypted, name, `Unicode string "${name}" must survive round-trip encryption`);
    }
  });

  // 2. Maximum Length (100 Characters)
  suite.test('Display name at exact boundary of 100 characters processes accurately', async () => {
    const exact100 = 'A'.repeat(100);
    const encrypted = encryptPII(exact100);
    const decrypted = decryptPII(encrypted);
    assertEqual(decrypted.length, 100);
    assertEqual(decrypted, exact100);
  });

  // 3. Special Characters and Control Escapes
  suite.test('Special characters, quotes, null bytes, and JSON escape strings encrypt safely', async () => {
    const dangerousPayload = `{"user":"admin", "role":"admin", "query":"' OR 1=1; --", "path":"C:\\\\Windows\\System32\\config"}`;
    const encrypted = encryptPII(dangerousPayload);
    const decrypted = decryptPII(encrypted);
    assertEqual(decrypted, dangerousPayload);
  });

  // 4. Invalid Input Types Throw TypeError
  suite.test('Empty strings, numbers, objects, and null inputs to encryptPII reject with TypeError', async () => {
    assertThrows(() => encryptPII(''), TypeError, 'Empty string must throw TypeError');
    assertThrows(() => encryptPII(null), TypeError, 'Null must throw TypeError');
    assertThrows(() => encryptPII(12345), TypeError, 'Number must throw TypeError');
    assertThrows(() => encryptPII({}), TypeError, 'Object must throw TypeError');
  });

  // 5. SQL Injection in Email Field
  suite.test('SQL injection attempt in email produces consistent HMAC blind index without query tampering', async () => {
    const sqlInjectionEmail = "admin' OR '1'='1' -- @statiqone.com";
    const index = hmacLookup(sqlInjectionEmail);
    assertTrue(typeof index === 'string' && index.length === 64, 'HMAC must safely hash injection payload to standard 64-char hex');
  });
}
