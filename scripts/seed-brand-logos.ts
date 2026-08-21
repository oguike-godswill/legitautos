import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "";

const BRAND_LOGOS: Record<string, string> = {
  Toyota: "toyota-logo.svg",
  Honda: "honda-logo.png",
  Lexus: "lexus-logo.png",
  Mercedes: "mercedes-benz-logo.svg",
  "Mercedes-Benz": "mercedes-benz-logo.svg",
  BMW: "bmw-logo.svg",
  Audi: "audi-logo.svg",
  Ford: "ford-logo.png",
  Nissan: "nissan-logo.svg",
  Hyundai: "hyundai-logo.svg",
  Kia: "kia-logo.svg",
  Volkswagen: "volkswagen-logo.svg",
  Chevrolet: "chevrolet-logo.svg",
  Peugeot: "peugeot-logo.svg",
  Renault: "renault-logo.svg",
  Mazda: "mazda-logo.svg",
  Subaru: "subaru-logo.svg",
  Mitsubishi: "mitsubishi-logo.svg",
  Suzuki: "suzuki-logo.svg",
  Jeep: "jeep-logo.svg",
  "Land Rover": "land-rover-logo.svg",
  "Range Rover": "range-rover-logo.svg",
  Volvo: "volvo-logo.svg",
  Porsche: "porsche-logo.svg",
  Ferrari: "ferrari-logo.svg",
  "Mercedes-AMG": "mercedes-amg-logo.svg",
  Jaguar: "jaguar-logo.svg",
  Infiniti: "infiniti-logo.svg",
  Acura: "acura-logo.svg",
  Genesis: "genesis-logo.svg",
  Tesla: "tesla-logo.svg",
  Dodge: "dodge-logo.svg",
  Chrysler: "chrysler-logo.svg",
  GMC: "gmc-logo.svg",
  Buick: "buick-logo.svg",
  Cadillac: "cadillac-logo.svg",
  Lincoln: "lincoln-logo.svg",
  Fiat: "fiat-logo.svg",
  "Alfa Romeo": "alfa-romeo-logo.svg",
  Maserati: "maserati-logo.svg",
  Bentley: "bentley-logo.svg",
  "Rolls-Royce": "rolls-royce-logo.svg",
  "Aston Martin": "aston-martin-logo.svg",
  McLaren: "mclaren-logo.svg",
  Lamborghini: "lamborghini-logo.svg",
  Bugatti: "bugatti-logo.svg",
  Mini: "mini-logo.svg",
  Smart: "smart-logo.svg",
  Citroen: "citroen-logo.svg",
  Dacia: "dacia-logo.svg",
  Skoda: "skoda-logo.svg",
  SEAT: "seat-logo.svg",
  Cupra: "cupra-logo.svg",
  Opel: "opel-logo.svg",
  Vauxhall: "vauxhall-logo.svg",
  Saab: "saab-logo.svg",
  SsangYong: "ssangyong-logo.svg",
  Proton: "proton-logo.svg",
  Perodua: "perodua-logo.svg",
  Tata: "tata-logo.svg",
  Mahindra: "mahindra-logo.svg",
  "Maruti Suzuki": "maruti-suzuki-logo.svg",
  Geely: "geely-logo.svg",
  BYD: "byd-logo.svg",
  Chery: "chery-logo.svg",
  "Great Wall": "great-wall-logo.svg",
  Haval: "haval-logo.svg",
  Changan: "changan-logo.svg",
  GAC: "gac-logo.svg",
  MG: "mg-logo.svg",
  Polestar: "polestar-logo.svg",
  Rivian: "rivian-logo.svg",
  Lucid: "lucid-logo.svg",
  Fisker: "fisker-logo.svg",
  Nikola: "nikola-logo.svg",
  Hummer: "hummer-logo.svg",
  Pontiac: "pontiac-logo.svg",
  Saturn: "saturn-logo.svg",
  Oldsmobile: "oldsmobile-logo.svg",
  Plymouth: "plymouth-logo.svg",
  Mercury: "mercury-logo.svg",
  Eagle: "eagle-logo.svg",
  Daewoo: "daewoo-logo.svg",
  Holden: "holden-logo.svg",
  Rover: "rover-logo.svg",
  Triumph: "triumph-logo.svg",
  Austin: "austin-logo.svg",
  Morris: "morris-logo.svg",
  Lancia: "lancia-logo.svg",
  DeLorean: "delorean-logo.svg",
  Lotus: "lotus-logo.svg",
  TVR: "tvr-logo.svg",
  Spyker: "spyker-logo.svg",
  Koenigsegg: "koenigsegg-logo.svg",
  Pagani: "pagani-logo.svg",
  Rimac: "rimac-logo.svg",
  Wuling: "wuling-logo.svg",
  JAC: "jac-logo.svg",
  Foton: "foton-logo.svg",
  BAIC: "baic-logo.svg",
  Zotye: "zotye-logo.svg",
  Haima: "haima-logo.svg",
  Lifan: "lifan-logo.svg",
  Brilliance: "brilliance-logo.svg",
  BYTON: "byton-logo.svg",
  NIO: "nio-logo.svg",
  XPeng: "xpeng-logo.svg",
  "Li Auto": "li-auto-logo.svg",
  Leapmotor: "leapmotor-logo.svg",
  Dongfeng: "dongfeng-logo.svg",
  FAW: "faw-logo.svg",
  SAIC: "saic-logo.svg",
};

const CDN_BASE = "https://cdn.jsdelivr.net/npm/car-brand-logos@latest";

async function seedBrandLogos() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const Brand = mongoose.model(
    "Brand",
    new mongoose.Schema(
      {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        logo: { type: String },
        country: { type: String, required: true },
        carCount: { type: Number, default: 0 },
      },
      { timestamps: true }
    )
  );

  const brands = await Brand.find({});
  console.log(`Found ${brands.length} brands`);

  let updated = 0;
  let skipped = 0;

  for (const brand of brands) {
    const logoFile = BRAND_LOGOS[brand.name];
    if (logoFile) {
      const logoUrl = `${CDN_BASE}/${logoFile}`;
      await Brand.updateOne({ _id: brand._id }, { $set: { logo: logoUrl } });
      console.log(`Updated: ${brand.name} -> ${logoUrl}`);
      updated++;
    } else {
      console.log(`Skipped: ${brand.name} (no logo mapping found)`);
      skipped++;
    }
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seedBrandLogos().catch(console.error);
