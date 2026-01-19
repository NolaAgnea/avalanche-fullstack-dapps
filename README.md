# 🚀 Avalanche Fullstack dApp

> Complete Web3 Full Stack Application dengan Smart Contract, Backend API, dan Frontend

Aplikasi dApp lengkap yang dibangun dengan:

- **Smart Contract**: Solidity + Hardhat (Avalanche Fuji Testnet)
- **Backend API**: NestJS + viem (Read blockchain data)
- **Frontend**: Next.js + Web3 Integration

---

## 📁 Struktur Project

```
avalanche-fullstack-dapps/
  dapps/
    ├── contracts/     # Smart Contract (Hardhat + Solidity)
    ├── backend/       # Backend API (NestJS + viem)
    └── frontend/      # Frontend (Next.js)
```

---

## 🏗️ Arsitektur Aplikasi

```text
┌─────────────────────┐
│   User (Browser)    │
│   + Core Wallet     │
└──────────┬──────────┘
           │
           ├─── Read Data ───────►  ┌──────────────────┐
           │                        │  Backend API     │
           │                        │  (NestJS)        │
           │                        └────────┬─────────┘
           │                                 │
           │                                 │ viem
           │                                 ▼
           │                        ┌──────────────────┐
           └─── Write Data ─────────►  Smart Contract  │
             (Sign Transaction)     │  (Avalanche)     │
                                    └──────────────────┘
```

### Flow Interaksi

**📖 Read (Baca Data):**

```
Frontend → Backend API → Blockchain (via viem)
```

- Frontend tidak langsung akses RPC
- Backend aggregasi & format data
- Lebih aman & efisien

**✍️ Write (Tulis Data):**

```
Frontend → Wallet (Core) → Smart Contract
```

- User sign transaksi via wallet
- Backend **tidak** terlibat dalam transaksi
- Decentralized & secure

---

## 🛠️ Setup Lokal

### Prerequisites

- Node.js v18+
- pnpm (package manager)
- Core Wallet extension
- Git

### 1️⃣ Install Dependencies

Install dependencies untuk semua folder:

```powershell
# Install contracts dependencies
cd dapps/contracts
pnpm install

# Install backend dependencies
cd ../backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 2️⃣ Konfigurasi Environment

#### **Backend** (dapps/backend/.env)

```env
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=0x8b427e7f1291dc686bd32315afafe44be50fefce
PORT=3001
```

#### **Frontend** (dapps/frontend/.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_CONTRACT_ADDRESS=0x8b427e7f1291dc686bd32315afafe44be50fefce
```

> ⚠️ **PENTING**: Gunakan `NEXT_PUBLIC_` prefix untuk environment variable yang diakses di browser

### 3️⃣ Jalankan Aplikasi

Buka 3 terminal terpisah:

**Terminal 1 - Backend:**

```powershell
cd dapps/backend
pnpm start:dev
```

✅ Backend running di: http://localhost:3001
✅ Swagger API docs: http://localhost:3001/documentation

**Terminal 2 - Frontend:**

```powershell
cd dapps/frontend
pnpm dev
```

✅ Frontend running di: http://localhost:3000

**Terminal 3 - Compile Smart Contract (Opsional):**

```powershell
cd dapps/contracts
pnpm hardhat compile
```

---

## 📦 Deploy Smart Contract (Opsional)

Jika ingin deploy smart contract baru:

### 1️⃣ Setup Private Key

Edit file `dapps/contracts/.env`:

```env
PRIVATE_KEY=your_private_key_here
```

> ⚠️ **JANGAN** commit private key ke Git!

### 2️⃣ Deploy ke Fuji Testnet

```powershell
cd dapps/contracts
pnpm hardhat run scripts/deployment.ts --network fuji
```

### 3️⃣ Update Contract Address

Setelah deploy, update contract address di:

- `dapps/backend/.env` → `CONTRACT_ADDRESS`
- `dapps/frontend/.env.local` → `NEXT_PUBLIC_CONTRACT_ADDRESS`

---

## 🚀 Deployment Production

### 🔵 Deploy Backend ke Railway

#### Prerequisites

- ✅ Akun GitHub
- ✅ Akun Railway (https://railway.app)
- ✅ Project sudah di-push ke GitHub

#### Step-by-Step

**1. Persiapan Project Backend**

Pastikan file `dapps/backend/src/main.ts` menggunakan `process.env.PORT`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // WAJIB: Gunakan PORT dari environment
  const port = process.env.PORT || 3001;

  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}
```

**2. Push ke GitHub**

```powershell
cd avalanche-fullstack-dapps
git add .
git commit -m "Ready for deployment"
git push origin main
```

**3. Deploy di Railway**

1. Login ke [Railway.app](https://railway.app)
2. Klik **New Project** → **Deploy from GitHub repo**
3. Pilih repository: `avalanche-fullstack-dapps`
4. Pilih **root directory**: `dapps/backend`
5. Klik **Deploy**

**4. Setup Environment Variables**

Di Railway dashboard:

1. Masuk ke **Variables** tab
2. Tambahkan environment variables:

```
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=0x8b427e7f1291dc686bd32315afafe44be50fefce
```

3. Klik **Save**

**5. Dapatkan URL Production**

1. Buka **Settings** → **Domains**
2. Copy URL: `https://your-app.up.railway.app`

> 📝 Simpan URL ini untuk config frontend!

**6. Test Backend**

Buka di browser:

```
https://your-app.up.railway.app/documentation
```

Harus muncul Swagger UI dengan API documentation.

#### ⚠️ Troubleshooting Backend

Jika gagal, cek di **Deployments** → **Logs**:

| Error                             | Solusi                            |
| --------------------------------- | --------------------------------- |
| `Cannot find module dist/main.js` | Pastikan `npm run build` jalan    |
| `Port already in use`             | Pastikan pakai `process.env.PORT` |
| `RPC connection failed`           | Cek ENV `RPC_URL` sudah diset     |

---

### 🟢 Deploy Frontend ke Vercel

#### Prerequisites

- ✅ Akun GitHub
- ✅ Akun Vercel (https://vercel.com)
- ✅ Backend sudah live di Railway

#### Step-by-Step

**1. Update Backend URL**

Edit `dapps/frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-app.up.railway.app
```

> ⚠️ Ganti dengan URL Railway dari step backend!

**2. Test Lokal Dulu**

```powershell
cd dapps/frontend
pnpm dev
```

Pastikan frontend bisa konek ke backend production.

**3. Push ke GitHub**

```powershell
git add .
git commit -m "Update backend URL for production"
git push origin main
```

**4. Deploy di Vercel**

1. Login ke [Vercel.com](https://vercel.com)
2. Klik **Add New** → **Project**
3. Import repository: `avalanche-fullstack-dapps`
4. **Root Directory**: pilih `dapps/frontend`
5. Framework Preset: **Next.js** (auto-detect)

**5. Setup Environment Variables**

Di **Environment Variables** section, tambahkan:

```
Key: NEXT_PUBLIC_BACKEND_URL
Value: https://your-app.up.railway.app
```

- Environment: **Production** ✅
- (Opsional) Centang **Preview** & **Development**

6. Klik **Deploy**

**6. Akses Aplikasi**

Setelah deploy selesai:

```
https://your-app.vercel.app
```

#### 🎯 Testing Production

1. **Buka frontend di browser**
2. **Connect Core Wallet** (switch ke Fuji Testnet)
3. **Test Read**: Lihat data dari blockchain
4. **Test Write**: Update value via wallet
5. **Verify**: Cek data ter-update

#### ⚠️ Troubleshooting Frontend

| Issue                                  | Solusi                                         |
| -------------------------------------- | ---------------------------------------------- |
| CORS error                             | Pastikan backend enable CORS                   |
| `NEXT_PUBLIC_BACKEND_URL is undefined` | Tambahkan ENV di Vercel settings               |
| Cannot connect wallet                  | Pastikan Core Wallet terinstall & Fuji network |
| API calls fail                         | Cek backend URL benar & backend running        |

---

## 🔧 Configuration Production

### Backend Configuration Checklist

- ✅ `process.env.PORT` untuk Railway
- ✅ `RPC_URL` environment variable
- ✅ `CONTRACT_ADDRESS` environment variable
- ✅ CORS enabled untuk frontend domain
- ✅ Error handling untuk RPC timeout
- ✅ Swagger documentation accessible

### Frontend Configuration Checklist

- ✅ `NEXT_PUBLIC_BACKEND_URL` environment variable
- ✅ `NEXT_PUBLIC_CONTRACT_ADDRESS` environment variable
- ✅ Contract ABI file tersedia
- ✅ Core Wallet integration
- ✅ Network validation (Fuji Testnet)
- ✅ Loading & error states

### Smart Contract Configuration

- ✅ Deployed ke Avalanche Fuji Testnet
- ✅ Contract address documented
- ✅ ABI file saved & accessible
- ✅ Verified on Snowtrace (opsional)

---

## 📝 Submission Checklist

Untuk submission Day 5:

- [ ] **Smart contract deployed** ke Fuji Testnet
- [ ] **Backend API live** & accessible (Railway)
- [ ] **Frontend live** & accessible (Vercel)
- [ ] **Wallet connect** berfungsi
- [ ] **Read blockchain data** via backend API
- [ ] **Write transaction** via Core Wallet
- [ ] **Full flow end-to-end** berjalan
- [ ] Screenshot aplikasi running
- [ ] Link backend: `___________________`
- [ ] Link frontend: `___________________`

---

## 🎓 Learning Outcomes

Setelah menyelesaikan project ini, kamu memahami:

### Technical Skills

- ✅ Solidity smart contract development
- ✅ Hardhat deployment workflow
- ✅ NestJS backend architecture
- ✅ viem untuk blockchain interaction
- ✅ Next.js App Router
- ✅ Web3 wallet integration
- ✅ Environment configuration
- ✅ Production deployment (Railway & Vercel)

### Architectural Concepts

- ✅ Separation of concerns (Contract / Backend / Frontend)
- ✅ Read vs Write flow dalam dApp
- ✅ RPC abstraction via backend
- ✅ Decentralized transaction signing
- ✅ Production-grade Web3 app structure

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"

**Diagnosis:**

```powershell
# Test backend langsung
curl https://your-backend.up.railway.app/blockchain/value
```

**Solutions:**

- Pastikan backend deployed & running (cek Railway logs)
- Cek ENV `NEXT_PUBLIC_BACKEND_URL` di Vercel
- Pastikan CORS enabled di backend

---

### Issue: "Transaction failed"

**Solutions:**

- Pastikan Core Wallet terkoneksi
- Switch ke Fuji Testnet
- Pastikan punya AVAX untuk gas fee
- Cek contract address benar

---

### Issue: "Build failed di Railway"

**Solutions:**

- Cek `package.json` ada script `build` & `start`
- Pastikan `dist/` folder ter-generate
- Cek TypeScript errors di lokal
- Pastikan dependencies complete

---

### Issue: "Environment variable undefined"

**Solutions:**

- Frontend: Prefix dengan `NEXT_PUBLIC_`
- Redeploy setelah tambah ENV
- Clear cache & rebuild
- Cek typo di ENV key

---

## 📚 Resources

### Documentation

- [Avalanche Docs](https://docs.avax.network)
- [Hardhat Docs](https://hardhat.org/docs)
- [viem Documentation](https://viem.sh)
- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)

### Tools

- [Core Wallet](https://core.app) - Avalanche wallet
- [Snowtrace Fuji](https://testnet.snowtrace.io) - Block explorer
- [Railway](https://railway.app) - Backend hosting
- [Vercel](https://vercel.com) - Frontend hosting

### Course Materials

- Day 2: Smart Contract Development
- Day 3: Frontend Web3 Integration
- Day 4: Backend API with NestJS
- Day 5: Full Stack Integration & Deployment

---

## 🤝 Contributing

Project ini adalah hasil dari Avalanche Indonesia Short Course. Untuk improvement:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

---

## 📄 License

Educational project - Avalanche Indonesia Short Course 2026

---

## 👨‍💻 Developer

**Kandhi Nala Dri Asmara**

- NIM: 221011401576
- Course: Avalanche Indonesia Short Course
- Institution: Pamulang University

---

## 🎉 Next Steps

Setelah deployment sukses:

1. ✅ Test semua fitur di production
2. ✅ Share link ke instructor
3. ✅ Submit via form submission
4. 🚀 Build your own dApp!
5. 🌟 Explore advanced Web3 topics

---

**🔥 You are now Full Stack Web3 Developer! 🔥**

Ready to build the decentralized future? Let's ship it! 🚀
