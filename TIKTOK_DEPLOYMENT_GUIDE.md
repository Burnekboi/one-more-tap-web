# TikTok Developer Deployment & App Setup Guide

This guide walks you step-by-step through registering **One More Tap** in your TikTok Developer Account, configuring the Rewarded Ad slot, setting up your Privacy Policy & ToS, and pushing your codebase to GitHub.

---

## Part 1: How to Push This Game to Your GitHub Account

### Method A: Using Google AI Studio's Built-in Export (Recommended & Easiest)
1. In the top-right header of Google AI Studio, click the **Settings** or **Export** menu icon.
2. Select **Export to GitHub**.
3. If prompted, authorize Google AI Studio with your GitHub account.
4. Choose or create your repository name (e.g. `one-more-tap-tiktok-mini`).
5. Click **Confirm / Export**. Your entire project including `PRIVACY.md`, `TERMS.md`, `game.json`, and all game source code will be committed and pushed directly to your GitHub repository!

### Method B: Using Terminal Git Commands
If you prefer pushing directly via the command line:

```bash
# 1. Initialize git if not already initialized
git init

# 2. Add all project files
git add .

# 3. Create your initial release commit
git commit -m "feat: One More Tap - TikTok Mini Game with Rewarded Ads, Privacy Policy & ToS"

# 4. Rename default branch to main
git branch -M main

# 5. Link to your GitHub repository (replace with your actual GitHub username and repo)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push to GitHub
git push -u origin main
```

---

## Part 2: Registering & Adding "One More Tap" in TikTok Developer Portal

### Step 1: Access TikTok Developer Portal
1. Navigate to **[TikTok for Developers](https://developers.tiktok.com/)** (or the ByteDance MicroApp Developer Console: `partner.tiktok.com` / `developer.toutiao.com`).
2. Log in with your TikTok account credentials.
3. Complete developer registration/verification if you haven't already.

### Step 2: Create a New App
1. On your Developer Dashboard, click **"Create an App"** (or **"Create Mini Program / Mini Game"**).
2. Select **Mini Game / Casual Game** as the application type.
3. Fill in the App Identity details:
   - **App Name:** `One More Tap`
   - **Category:** `Games` -> `Casual` / `Arcade` / `Reflex`
   - **Supported Devices:** Mobile (iOS & Android)
   - **Screen Orientation:** **Portrait (9:16)**
   - **Description:** `Ultra-responsive hyper-casual reflex arcade game. Tap targets, survive 10-second timer banks, watch rewarded video for stage revives, and conquer Weird and Crazy modes!`

### Step 3: Configure Legal URLs (Mandatory for Store Review)
In the App Details section of the TikTok Developer Portal, you must provide public URLs for Privacy Policy and Terms of Service:

- **Privacy Policy URL:**
  - Option 1 (Live Deployed App): `https://ais-pre-4ok3yft4e3zbw4gexyrzx5-272629888165.asia-southeast1.run.app` (under TikTok & Legal tab)
  - Option 2 (GitHub Raw URL): `https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/PRIVACY.md`
  - Option 3 (GitHub Pages): `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO/PRIVACY.md`

- **Terms of Service URL:**
  - Option 1 (Live Deployed App): `https://ais-pre-4ok3yft4e3zbw4gexyrzx5-272629888165.asia-southeast1.run.app` (under TikTok & Legal tab)
  - Option 2 (GitHub Raw URL): `https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/TERMS.md`
  - Option 3 (GitHub Pages): `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO/TERMS.md`

- **Developer Support Email:** `niconan.shaun1128@gmail.com`

---

## Part 3: Setting Up the Rewarded Video Ad Slot

1. In your TikTok Developer Console, navigate to the **Monetization** or **Ad Management** tab on the left sidebar.
2. Click **Create Ad Unit**.
3. Select **Rewarded Video Ad**.
4. Configure the Ad Unit:
   - **Ad Unit Name:** `Revive Ad Slot`
   - **Placement:** In-game Game Over screen (Revive at current stage)
   - **Reward Description:** `+10s Timer Bank & Stage Resurrect`
5. Copy the generated **Ad Unit ID** (e.g. `tt_rewarded_revive_01`).
6. Paste the ID into `src/utils/tiktokAds.ts`:
   ```typescript
   export const TIKTOK_AD_CONFIG = {
     REWARDED_AD_UNIT_ID: 'YOUR_COPIED_AD_UNIT_ID',
   };
   ```

---

## Part 5: Opening & Building Directly in Cocos Creator (v3.8+)

This repository is pre-configured as an autonomous Cocos Creator project. **No manual scene creation or node setup is required**:

1. **Open in Cocos Dashboard**:
   - Launch Cocos Dashboard -> Click **Add** -> Select this repository folder.
   - Select Cocos Creator **3.8.x** (or 3.x) and open the project.
2. **Instant Preview (Zero Node Setup)**:
   - Click the **Play / Preview** button in the top toolbar (or select Browser / Simulator).
   - The default start scene `Main.scene` immediately mounts the dynamic `GameManager`, setting up the 720×1280 resolution, Canvas, Camera, 10s continuous timer bank, Weird Mode (24 stages), and Crazy Mode (50 stages).
3. **1-Click Build for TikTok / ByteDance Mini Game**:
   - In Cocos Creator top menu: Click **Project** -> **Build**.
   - The build panel will automatically load the pre-configured profile:
     - **Platform**: `ByteDance Mini Game`
     - **Start Scene**: `Main.scene`
     - **App ID**: `tt_one_more_tap_app_id` (or your registered ID)
   - Click **Build**.
   - Cocos Creator will compile everything into `build/bytedance-mini-game`.
   - Open that folder directly in **ByteDance DevTools**, test the Rewarded Ad revive (`tt.createRewardedVideoAd`), and click **Upload** to submit for audit!


1. Download and install **ByteDance DevTools** (or TikTok Mini Game DevTools) from the developer portal.
2. Launch DevTools and click **Import Project**.
3. Select this project root directory containing `project.config.json` and `game.json`.
4. Enter your **App ID** obtained from Step 2.
5. In the DevTools Simulator:
   - Test portrait orientation (9:16)
   - Test touch input response
   - Trigger a Game Over and click **[REVIVE AT STAGE {X}]** to test rewarded ad delivery
6. Click **Preview (QR Code)**: Scan with the TikTok app on your mobile phone to play the live build directly inside TikTok!
7. Click **Upload**:
   - Set Version Name: `1.0.0`
   - Set Version Description: `Initial release: 24 Weird Mode stages, 50 Crazy Mode stages, rewarded video revives`
   - Click **Confirm Upload**.
8. Go back to your TikTok Developer Console -> **Version Management** -> select `1.0.0` and click **Submit for Audit**.

Once TikTok's review team completes moderation, your game will be published live on TikTok!
