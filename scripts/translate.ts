import "dotenv/config";
import fs from "fs";
import path from "path";
import * as deepl from "deepl-node";
console.log(process.env.DEEPL_API_KEY);
const deeplClient = new deepl.DeepLClient(process.env.DEEPL_API_KEY!);

// Base file
const BASE_FILE = "en-US.json";
const BASE_LANG = "en";

// Folder path
const messagesPath = path.join(process.cwd(), "src/messages");

// Load all JSON files
const files = fs.readdirSync(messagesPath).filter((f) => f.endsWith(".json"));

// Target languages (exclude base)
const TARGET_FILES = files.filter((f) => f !== BASE_FILE);

// Detect HTML/XML tags
const containsTags = (str: string) => /<[^>]+>/.test(str);

// Placeholder protectors
const wrapPlaceholders = (str: string) =>
  str.replace(/\{[^}]+\}/g, (m) => `<ignore>${m}</ignore>`);

const unwrapPlaceholders = (str: string) => str.replace(/<\/?ignore>/g, "");

async function translateMissing() {
  const base = JSON.parse(
    fs.readFileSync(path.join(messagesPath, BASE_FILE), "utf8"),
  );

  let totalMissing = 0;

  // Count missing keys
  for (const file of TARGET_FILES) {
    const target = JSON.parse(
      fs.readFileSync(path.join(messagesPath, file), "utf8"),
    );

    const missingKeys = Object.keys(base).filter((k) => !(k in target));
    totalMissing += missingKeys.length;
  }

  console.log(`\n✨ Total missing translations: ${totalMissing}\n`);

  if (totalMissing === 0) {
    console.log("🎉 Everything is already up to date!");
  }

  // Process all languages
  for (const file of TARGET_FILES) {
    const targetPath = path.join(messagesPath, file);
    const target = JSON.parse(fs.readFileSync(targetPath, "utf8"));

    const langCode = file.split(".")[0].split("-")[0].toLowerCase();

    console.log(`\n🌍 Processing: ${file}`);
    console.log(`→ Language code: ${langCode}`);

    // 1️⃣ REMOVE EXTRA KEYS NOT IN BASE FILE
    const extraKeys = Object.keys(target).filter((k) => !(k in base));

    if (extraKeys.length > 0) {
      console.log(`🧹 Removing ${extraKeys.length} extra keys from ${file}`);
      extraKeys.forEach((key) => {
        delete target[key];
        console.log(`   🗑 Removed: ${key}`);
      });
    }

    // 2️⃣ FIND MISSING KEYS
    const missingKeys = Object.keys(base).filter((k) => !(k in target));

    if (missingKeys.length === 0) {
      // Save cleaned file
      fs.writeFileSync(targetPath, JSON.stringify(target, null, 2), "utf8");
      console.log(`✔ ${file} is fully synced!`);
      continue;
    }

    console.log(`🔍 Missing: ${missingKeys.length} keys`);

    // 3️⃣ PREPARE TEXTS WITH PROTECTED PLACEHOLDERS
    const textsToTranslate = missingKeys.map((key) =>
      wrapPlaceholders(base[key]),
    );

    const anyHasTags = missingKeys.some(
      (key) => containsTags(base[key]) || /\{[^}]+\}/.test(base[key]),
    );

    const translationOptions = anyHasTags
      ? ({
          tagHandling: "xml",
          ignoreTags: ["ignore"],
        } as deepl.TranslateTextOptions)
      : undefined;

    // 4️⃣ TRANSLATE ALL MISSING KEYS (ONE CALL)
    const results = await deeplClient.translateText(
      textsToTranslate,
      BASE_LANG,
      langCode as deepl.TargetLanguageCode,
      translationOptions,
    );

    // 5️⃣ APPLY TRANSLATIONS
    missingKeys.forEach((key, index) => {
      const translatedWrapped = results[index].text;
      const finalText = unwrapPlaceholders(translatedWrapped);

      target[key] = finalText;

      console.log(`➡️  ${key} → ${finalText}`);
    });

    // 6️⃣ SAVE FILE
    fs.writeFileSync(targetPath, JSON.stringify(target, null, 2), "utf8");
    console.log(`✔ Updated ${file}`);
  }

  console.log("\n✨ Translation sync complete!\n");
}

translateMissing();
