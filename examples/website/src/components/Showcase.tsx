import { Section } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';
import { Chip } from '@/components/ui/Chip';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Globe2,
  Home,
  Link as LinkIcon,
  MoreHorizontal,
  Settings,
  Users,
} from 'lucide-react';

export function Showcase() {
  return (
    <Section id="showcase">
      <Eyebrow>Side-by-side</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight">Vibe-coded vs. rules-applied.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
        The same SaaS dashboard, two ways. Left: what AI generates without the design rules in
        context. Right: same content, with the rules applied. Look for the AI tells called out in{' '}
        <code className="rounded bg-[var(--color-code-bg)] px-1.5 py-0.5 font-mono text-base">
          anti-patterns.md
        </code>
        .
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Comparison
          label="Vibe-coded"
          tone="bad"
          tells={[
            'Emoji icons in nav',
            'Gradient avatar with monogram',
            'Bright clashing KPI cards',
            'Same KPI block repeated',
            'Thin black borders',
            'Robotic copy',
          ]}
        >
          <VibeCodedDashboard />
        </Comparison>

        <Comparison
          label="Rules-applied"
          tone="good"
          tells={[
            'Lucide icons',
            'Account card, no monogram',
            'Compact 2-col KPI grid',
            'Sparklines instead of repeated tiles',
            '~85% white borders',
            'Brand-voice copy',
          ]}
        >
          <RulesAppliedDashboard />
        </Comparison>
      </div>
    </Section>
  );
}

function Comparison({
  label,
  tone,
  tells,
  children,
}: {
  label: string;
  tone: 'bad' | 'good';
  tells: string[];
  children: React.ReactNode;
}) {
  const accent = tone === 'bad' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]';
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className={`font-mono text-sm font-semibold uppercase tracking-wider ${accent}`}>
          {label}
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border-DEFAULT bg-surface">
        {children}
      </div>
      <ul className="mt-4 space-y-1.5">
        {tells.map((t) => (
          <li key={t} className="flex items-start gap-2 text-sm text-fg-muted">
            <span aria-hidden className={`mt-2 h-1 w-1 shrink-0 rounded-full ${accent}`} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------- Vibe-coded ----------------------------- */

function VibeCodedDashboard() {
  return (
    <div
      className="flex h-[420px] text-xs"
      style={{ background: '#1a0033', color: '#e0e0ff', fontFamily: 'ui-sans-serif, system-ui' }}
    >
      <aside
        className="w-32 shrink-0 p-3"
        style={{ background: 'linear-gradient(180deg, #4c1d95 0%, #6d28d9 100%)' }}
      >
        <div className="mb-4 flex items-center gap-2">
          <span style={{ fontSize: '20px' }}>🚀</span>
          <span className="font-bold text-white">Linkr</span>
        </div>
        <nav className="space-y-1">
          {[
            { emoji: '📊', label: 'Dashboard', active: true },
            { emoji: '🔗', label: 'Links' },
            { emoji: '🌍', label: 'Domains' },
            { emoji: '👥', label: 'Teams' },
            { emoji: '⚙️', label: 'Settings' },
            { emoji: '💳', label: 'Billing' },
            { emoji: '📈', label: 'Usage' },
            { emoji: '👤', label: 'Profile' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded px-2 py-1.5"
              style={{
                background: item.active ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: 'white',
              }}
            >
              <span>{item.emoji}</span>
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-hidden p-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold" style={{ color: '#fff' }}>
            Dashboard
          </h3>
          <div
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #f472b6, #818cf8)' }}
          >
            JD
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total Clicks', value: '12,450', emoji: '👁️', bg: '#7c3aed' },
            { label: 'Unique Visits', value: '8,201', emoji: '✨', bg: '#10b981' },
            { label: 'Total Links', value: '142', emoji: '🔗', bg: '#3b82f6' },
            { label: 'Conversion', value: '3.8%', emoji: '🚀', bg: '#f97316' },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg p-2 text-white"
              style={{ background: kpi.bg, border: '1px solid #000' }}
            >
              <div className="text-xs opacity-90">
                {kpi.emoji} {kpi.label}
              </div>
              <div className="mt-1 text-base font-bold">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { label: 'Avg CTR', value: '4.2%', emoji: '💯', bg: '#ec4899' },
            { label: 'Top Country', value: 'USA', emoji: '🇺🇸', bg: '#06b6d4' },
            { label: 'Mobile %', value: '67%', emoji: '📱', bg: '#84cc16' },
            { label: 'New Today', value: '23', emoji: '🆕', bg: '#eab308' },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg p-2 text-white"
              style={{ background: kpi.bg, border: '1px solid #000' }}
            >
              <div className="text-xs opacity-90">
                {kpi.emoji} {kpi.label}
              </div>
              <div className="mt-1 text-base font-bold">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-lg p-2" style={{ background: '#2d1b4e', border: '1px solid #000' }}>
          <div className="mb-2 text-xs font-bold" style={{ color: '#fff' }}>
            🔥 Recent Links
          </div>
          {[
            { url: 'lnkr.io/abc123', clicks: '1,245' },
            { url: 'lnkr.io/promo', clicks: '892' },
            { url: 'lnkr.io/launch', clicks: '432' },
          ].map((link) => (
            <div
              key={link.url}
              className="flex items-center justify-between border-t py-1.5 text-xs"
              style={{ borderColor: '#000' }}
            >
              <span>🔗 {link.url}</span>
              <span style={{ color: '#a78bfa' }}>👆 {link.clicks}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* --------------------------- Rules-applied --------------------------- */

function RulesAppliedDashboard() {
  return (
    <div className="flex h-[420px] bg-bg text-fg" style={{ fontFamily: 'var(--font-sans)' }}>
      <aside className="flex w-36 shrink-0 flex-col border-r border-border-DEFAULT bg-surface p-3">
        <div className="mb-5 flex items-center gap-2 px-1">
          <span
            aria-hidden
            className="flex h-5 w-5 items-center justify-center rounded bg-accent text-accent-contrast"
          >
            <LinkIcon size={11} />
          </span>
          <span className="font-mono text-sm font-semibold text-fg-strong">linkr</span>
        </div>
        <nav className="flex-1 space-y-0.5">
          {[
            { Icon: Home, label: 'Overview', active: true },
            { Icon: LinkIcon, label: 'Links' },
            { Icon: BarChart3, label: 'Analytics' },
            { Icon: Globe2, label: 'Domains' },
            { Icon: Users, label: 'Team' },
            { Icon: Settings, label: 'Settings' },
          ].map(({ Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                active ? 'bg-surface-raised text-fg-strong' : 'text-fg-muted'
              }`}
            >
              <Icon size={13} aria-hidden />
              <span>{label}</span>
            </div>
          ))}
        </nav>
        <div className="rounded-md border border-border-DEFAULT bg-surface-raised p-2">
          <p className="text-sm font-semibold text-fg-strong">Jane D.</p>
          <p className="text-sm text-fg-muted">Pro plan</p>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden p-4">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-fg-strong">Overview</h3>
          <span className="font-mono text-sm text-fg-faint">Last 30 days</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric label="Clicks" value="12,450" delta="+12%" trend="up" />
          <Metric label="Unique visitors" value="8,201" delta="+8%" trend="up" />
          <Metric label="Active links" value="142" delta="−3" trend="down" />
          <Metric label="Conversion" value="3.8%" delta="+0.4 pp" trend="up" />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-fg">Recent links</p>
            <button className="text-sm text-fg-muted hover:text-fg" type="button">
              <MoreHorizontal size={14} aria-hidden />
            </button>
          </div>
          <ul className="divide-y divide-border-DEFAULT rounded-md border border-border-DEFAULT bg-surface">
            {[
              { url: 'lnkr.io/abc123', clicks: '1,245', status: 'live' as const },
              { url: 'lnkr.io/promo', clicks: '892', status: 'live' as const },
              { url: 'lnkr.io/launch', clicks: '432', status: 'paused' as const },
            ].map((link) => (
              <li
                key={link.url}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2 font-mono text-fg-strong">
                  <LinkIcon size={11} className="text-fg-faint" aria-hidden />
                  {link.url}
                </span>
                <span className="flex items-center gap-3">
                  <Chip tone={link.status === 'live' ? 'success' : 'warning'}>
                    {link.status}
                  </Chip>
                  <span className="text-fg-muted">{link.clicks} clicks</span>
                  <ChevronRight size={12} className="text-fg-faint" aria-hidden />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
}) {
  const trendColor = trend === 'up' ? 'text-[var(--color-success)]' : 'text-fg-muted';
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="rounded-md border border-border-DEFAULT bg-surface p-3">
      <p className="text-sm text-fg-muted">{label}</p>
      <p className="mt-1 text-base font-semibold text-fg-strong">{value}</p>
      <p className={`mt-1 inline-flex items-center gap-1 text-sm ${trendColor}`}>
        <TrendIcon size={11} aria-hidden />
        {delta}
      </p>
    </div>
  );
}
