import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Video,
  Github,
  Mail,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { tikTokAds } from '../utils/tiktokAds';

interface TikTokLegalViewProps {
  onBackToDashboard?: () => void;
}

export function TikTokLegalView({ onBackToDashboard }: TikTokLegalViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'privacy' | 'terms' | 'deployment'>('privacy');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const supportEmail = 'niconan.shaun1128@gmail.com';
  const hostedUrl = window.location.origin;

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(identifier);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black border border-zinc-700 flex items-center justify-center flex-shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white">TikTok Mini &amp; Legal Center</h1>
                <span className="text-[10px] font-mono font-bold bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30 px-2 py-0.5 rounded-full">
                  ByteDance Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Store-compliant Privacy Policy, Terms of Service, and TikTok Developer submission metadata for One More Tap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-zinc-200 rounded-xl transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => copyToClipboard(hostedUrl, 'hosted_url')}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              {copiedSection === 'hosted_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'hosted_url' ? 'URL Copied!' : 'Copy Deployed URL'}</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-zinc-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'privacy'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveSubTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'terms'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveSubTab('deployment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'deployment'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#fe2c55]" />
            <span>TikTok App Setup &amp; GitHub Guide</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: PRIVACY POLICY */}
      {activeSubTab === 'privacy' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Privacy Policy for One More Tap
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Effective: September 19, 2026 • Suitable for TikTok Developer Console submission
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(PRIVACY_TEXT, 'privacy_md')}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              {copiedSection === 'privacy_md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'privacy_md' ? 'Markdown Copied' : 'Copy Privacy Markdown'}</span>
            </button>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                Store Submission Summary
              </div>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li><strong className="text-zinc-200">No Account Creation Required:</strong> Gameplay runs client-side with zero external login or server storage of user PII.</li>
                <li><strong className="text-zinc-200">Local Storage Only:</strong> High scores, combo peaks, and audio preferences stay in local storage (`localStorage` / `tt.setStorageSync`).</li>
                <li><strong className="text-zinc-200">TikTok Mini Rewarded Ads:</strong> Powered by the ByteDance/TikTok SDK (`tt.createRewardedVideoAd`) for opt-in stage revives.</li>
                <li><strong className="text-zinc-200">Children's Privacy:</strong> COPPA &amp; GDPR-K compliant; no personal data from minors is gathered.</li>
                <li><strong className="text-zinc-200">Developer Contact:</strong> <a href={`mailto:${supportEmail}`} className="text-cyan-400 underline">{supportEmail}</a></li>
              </ul>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white">1. Information We Collect</h3>
              <p>
                <strong>One More Tap</strong> is developed as an ultra-fast, hyper-casual reflex game. We do not operate secondary backend databases that harvest private identity information (names, physical locations, phone numbers, or passwords). All stage scores, daily challenge completions, and achievement unlocks are preserved locally on the user&apos;s device.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white">2. TikTok Mini Platform &amp; Rewarded Video Ads</h3>
              <p>
                When played inside the TikTok app, telemetry for rewarded video ads is handled securely by the ByteDance advertising network. Watching an ad grants an immediate in-game revive (+10s timer bank) without sending personal user records to the game developer.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white">3. Data Deletion &amp; User Control</h3>
              <p>
                Players may clear their local game progress at any time by clearing the TikTok application cache or browser cache in device settings.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white">4. Developer Contact</h3>
              <p>
                For questions regarding this policy, contact the developer at <span className="font-mono text-cyan-300">{supportEmail}</span>.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: TERMS OF SERVICE */}
      {activeSubTab === 'terms' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Terms of Service (EULA)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Effective: September 19, 2026 • Governs gameplay, intellectual property &amp; virtual revives
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(TERMS_TEXT, 'terms_md')}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              {copiedSection === 'terms_md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'terms_md' ? 'Markdown Copied' : 'Copy Terms Markdown'}</span>
            </button>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                Terms Highlights
              </div>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li><strong className="text-zinc-200">Entertainment License:</strong> Granted a personal, revocable license to play on TikTok Mini Games.</li>
                <li><strong className="text-zinc-200">Fair Play:</strong> Automated clickers, reverse engineering, and timer exploitation are strictly prohibited.</li>
                <li><strong className="text-zinc-200">Virtual Goods:</strong> High scores and rewarded ad revives have no financial value and cannot be exchanged for real currency.</li>
                <li><strong className="text-zinc-200">Platform Terms:</strong> Gameplay remains subject to TikTok&apos;s Terms of Service and Community Guidelines.</li>
              </ul>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white">1. Agreement to Terms</h3>
              <p>
                By opening or playing One More Tap, you agree to comply with these Terms of Service. If you do not agree to these terms, discontinue playing immediately.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white">2. Rewarded Video Revives</h3>
              <p>
                In-game revives granted from watching rewarded advertisements are purely virtual and discretionary. Revives cannot be sold, transferred, or converted to real-world financial assets.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white">3. Intellectual Property</h3>
              <p>
                All rights, game artwork, algorithms, audio synthesis parameters, and code for One More Tap remain the exclusive intellectual property of the developer.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: TIKTOK APP SETUP & GITHUB GUIDE */}
      {activeSubTab === 'deployment' && (
        <div className="space-y-6">
          {/* TikTok Developer Portal Checklist */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#fe2c55]" />
                  TikTok Developer Account Configuration
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Values to enter into your app profile on developers.tiktok.com or ByteDance Developer Console
                </p>
              </div>
              <a
                href="https://developers.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#fe2c55] hover:bg-[#fe2c55]/90 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-rose-500/20"
              >
                <span>Open TikTok Developer Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">App Name</div>
                <div className="text-sm font-black text-white font-mono flex items-center justify-between">
                  <span>One More Tap</span>
                  <button
                    onClick={() => copyToClipboard('One More Tap', 'app_name')}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    {copiedSection === 'app_name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Category &amp; Orientation</div>
                <div className="text-sm font-bold text-zinc-200">
                  Games &gt; Casual / Arcade • <span className="text-cyan-400 font-mono">Portrait (9:16)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Support Email</div>
                <div className="text-xs font-bold text-zinc-200 font-mono flex items-center justify-between">
                  <span>{supportEmail}</span>
                  <button
                    onClick={() => copyToClipboard(supportEmail, 'email')}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    {copiedSection === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Rewarded Ad Unit ID</div>
                <div className="text-xs font-bold text-cyan-300 font-mono flex items-center justify-between">
                  <span>{tikTokAds.getAdUnitId()}</span>
                  <button
                    onClick={() => copyToClipboard(tikTokAds.getAdUnitId(), 'ad_id')}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    {copiedSection === 'ad_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step-by-Step App Registration */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white">Step-by-Step: Adding the Game to Your TikTok Developer Account</h3>
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <strong className="text-white">Create the App:</strong> In TikTok for Developers dashboard, click <strong>Create an App</strong> and choose <strong>Mini Game</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <strong className="text-white">Paste Legal URLs:</strong> In the App Info tab, paste your deployed URL (<span className="text-cyan-400 font-mono">{hostedUrl}</span>) or your GitHub repository URL into the <strong>Privacy Policy URL</strong> and <strong>Terms of Service URL</strong> inputs.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-black font-black flex items-center justify-center flex-shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <strong className="text-white">Set Up Rewarded Video Ad:</strong> Go to <strong>Monetization</strong> &gt; <strong>Ad Units</strong> &gt; Create <strong>Rewarded Video Ad</strong>. Name it <em>Revive Ad Slot</em> and assign it ID <span className="font-mono text-cyan-300 font-bold">tt_rewarded_revive_01</span>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    4
                  </div>
                  <div>
                    <strong className="text-white">Upload Code via TikTok DevTools:</strong> Open ByteDance/TikTok Mini Game DevTools, select this project folder (with <code className="text-zinc-200">game.json</code> and <code className="text-zinc-200">project.config.json</code>), preview on phone via QR code, then click <strong>Upload</strong>.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Push Guide */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Github className="w-5 h-5" />
              <h2 className="text-base font-black">How to Push This Project to Your GitHub Account</h2>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold">Recommended: AI Studio 1-Click Export</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Instant
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Click the <strong>Settings / Export</strong> menu icon in Google AI Studio, select <strong>Export to GitHub</strong>, authenticate with your GitHub profile, and choose your repository. All project code, config files (<code className="text-zinc-200">game.json</code>, <code className="text-zinc-200">project.config.json</code>), and documentation will be automatically committed and pushed!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 font-bold">Alternative: Git CLI Terminal Commands</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `git init\ngit add .\ngit commit -m "feat: One More Tap TikTok Mini Game"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git\ngit push -u origin main`,
                      'git_commands'
                    )
                  }
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedSection === 'git_commands' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'git_commands' ? 'Copied' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`git init
git add .
git commit -m "feat: One More Tap - TikTok Mini Game with Rewarded Ads, Privacy Policy & ToS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PRIVACY_TEXT = `# Privacy Policy for One More Tap
Effective Date: September 19, 2026
Developer Contact: niconan.shaun1128@gmail.com
Platform: TikTok Mini Games (ByteDance MicroApp) & Web

One More Tap stores gameplay progress (high scores, combos, unlocked achievements, audio settings) locally on the player's device. No personal identifiable information (PII) is collected on external servers. Rewarded video advertisements for stage revives are served directly through the TikTok Mini Games advertising framework.`;

const TERMS_TEXT = `# Terms of Service for One More Tap
Effective Date: September 19, 2026
Developer Contact: niconan.shaun1128@gmail.com
Platform: TikTok Mini Games (ByteDance MicroApp) & Web

By playing One More Tap, you receive a personal, non-commercial license to play on the TikTok Mini Games platform. In-game revives granted from rewarded video ads have no financial value and are non-transferable. Automated bot clickers and game tampering are prohibited.`;
