# World Reward Coin Mini App

Mini app staking & reward berbasis World ID dan Worldcoin Mini Apps Toolkit.

## Fitur
- Login World ID wajib (integrasi @worldcoin/id)
- Reward WRC bertambah otomatis setiap detik (rate berbeda untuk user orb dan non-orb)
- Staking APY 70% dengan reward bunga fleksibel (bisa claim/compound kapanpun)
- Semua progress user persistent per World ID (localStorage)
- UI clean, siap mobile dan desktop

## Cara Jalankan

1. Clone repo ini & install dependencies:
   ```
   npm install
   ```
2. Buat file `.env.local`:
   ```
   NEXT_PUBLIC_WORLDID_APP_ID=wid_staging_xxxxxxxxxxxxxxxxxx
   ```
   Ganti dengan App ID Worldcoin kamu.

3. Jalankan lokal:
   ```
   npm run dev
   ```
   Buka di [http://localhost:3000](http://localhost:3000)

4. Deploy ke Vercel:
   - Push ke GitHub, import ke [Vercel](https://vercel.com/), isi App ID di environment.
   - Deploy & akses URL public.

## Struktur Folder

- `pages/` : Halaman utama & entry point mini app
- `components/` : Komponen modular UI (dashboard, modal, world id login)
- `utils/` : Utility untuk rate, storage per user, dsb
- `styles/` : Tailwind & global style

## Catatan

- Semua progress user **persistent** di browser per World ID (localStorage).
- Jika ingin full persistent antar device, perlu backend (bisa custom di masa depan).
- Sudah sesuai [Worldcoin Mini Apps Toolkit](https://docs.world.org/mini-apps).

---

Happy hacking!