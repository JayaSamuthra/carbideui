/**
 * Dashboard Page Stories
 *
 * Three fully themed Carbon Design System dashboard examples combining
 * Header · Side Navigation · KPI Cards · Charts · Table · Buttons.
 *
 * Every story has user-configurable Controls (no code changes needed):
 *   - theme         → Carbon theme token (white / g10 / g90 / g100)
 *   - brandPrefix   → Text shown as the "[Platform]" prefix in the header
 *   - brandName     → Application name shown in the header
 *   - sideNavOpen   → Side navigation expanded / collapsed
 *   - notifOpen     → Notifications panel open state
 *   - userOpen      → User profile panel open state
 */
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartTheme, ScaleTypes } from '@carbon/charts';

// ── UI Shell ──────────────────────────────────────────────────────────────────
import { NgccHeader } from './header/ngcc-header';
import { NgccHeaderName } from './header-name/ngcc-header-name';
import { NgccHeaderNavigation } from './header-navigation/ngcc-header-navigation';
import { NgccHeaderItem } from './header-navigation/header-item/ngcc-header-item';
import { NgccHeaderGlobal } from './header-global/ngcc-header-global';
import { NgccHeaderAction } from './header-action/ngcc-header-action';
import { NgccHamburger } from './hamburger/ngcc-hamburger';
import { NgccSideNav } from '../ngcc-side-nav/ngcc-side-nav';
import { NgccSideNavItem } from '../ngcc-side-nav/ngcc-side-nav-item';
import { NgccSideNavMenu } from '../ngcc-side-nav/ngcc-side-nav-menu';
import { NgccSideNavMenuItem } from '../ngcc-side-nav/ngcc-side-nav-menu-item';
import { NgccSideNavDivider } from '../ngcc-side-nav/ngcc-side-nav-divider';

// ── Content components ────────────────────────────────────────────────────────
import { NgccCharts } from '../ngcc-charts/ngcc-charts';
import { NgccTable } from '../ngcc-table/ngcc-table';
import { NgccButton } from '../ngcc-button/ngcc-button';

// ── Types ─────────────────────────────────────────────────────────────────────
import type { NgccTableColumn } from '../ngcc-table/ngcc-table.types';

// ─── Carbon theme → Chart theme map ──────────────────────────────────────────
type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100';

const CHART_THEME_MAP: Record<CarbonTheme, ChartTheme> = {
  white: ChartTheme.WHITE,
  g10: ChartTheme.G10,
  g90: ChartTheme.G90,
  g100: ChartTheme.G100,
};

// ─── Side nav item model ───────────────────────────────────────────────────────
interface SideNavChild {
  label: string;
  href: string;
  active?: boolean;
}
interface SideNavItemConfig {
  type: 'item' | 'menu' | 'divider';
  label?: string;
  href?: string;
  icon?: string;
  active?: boolean;
  expanded?: boolean;
  children?: SideNavChild[];
}

// ─── KPI card model ────────────────────────────────────────────────────────────
interface KpiCard {
  label: string;
  value: string;
  trend: string;
  /** CSS color value, e.g. 'var(--cds-support-success)' */
  trendColor: string;
}

// ─── Action button model ───────────────────────────────────────────────────────
interface ActionButton {
  label: string;
  variant: string;
  icon?: string;
}

// ─── Storybook wrapper class ──────────────────────────────────────────────────
class DashboardArgs {
  theme: CarbonTheme = 'white';
  brandPrefix = '[Platform]';
  brandName = 'CloudOps';
  sideNavOpen = true;
  notifOpen = false;
  userOpen = false;
}

// ─── Shared module metadata ────────────────────────────────────────────────────
const withModules = moduleMetadata({
  imports: [
    NgccHeader,
    NgccHamburger,
    NgccHeaderName,
    NgccHeaderNavigation,
    NgccHeaderItem,
    NgccHeaderGlobal,
    NgccHeaderAction,
    NgccSideNav,
    NgccSideNavItem,
    NgccSideNavMenu,
    NgccSideNavMenuItem,
    NgccSideNavDivider,
    NgccCharts,
    NgccTable,
    NgccButton,
  ],
});

// ─── Shared template ──────────────────────────────────────────────────────────
/**
 * Single template used by all three stories.
 * All domain-specific content is driven by `props` from the `render` function.
 *
 * Side nav structure is hardcoded per story (separate templates) because
 * ngcc-side-nav-menu / ngcc-side-nav-item have different tag names and
 * each domain benefits from explicit nesting.
 */

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<DashboardArgs> = {
  title: 'Pages/Dashboard',
  component: DashboardArgs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Dashboard Page Examples

Three fully themed dashboards showing the **complete Carbon UI Shell** with real content.

Each story combines:
- **Header** — hamburger · brand · nav links · notification & profile actions
- **Side Navigation** — collapsible icon+label nav with submenus and dividers
- **KPI Cards** — four metric tiles using \`cds--tile\` with trend indicators
- **Charts** — primary chart (2/3 width) + secondary chart (1/3 width)
- **Table** — domain-specific data table with sortable columns
- **Buttons** — primary · secondary · ghost (or danger) action bar

Use the **Controls panel** to customise the \`theme\`, \`brandName\`, \`brandPrefix\`,
and navigation state — no code changes needed.

| Story | Default theme | Domain |
|---|---|---|
| \`CloudOpsDashboard\` | White | Cloud infrastructure operations |
| \`SecOpsDashboard\` | G100 (Dark) | Security operations center |
| \`AnalyticsDashboard\` | G10 | Business intelligence & analytics |

## Layout

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│  Header  (hamburger · brand · nav links · global actions)       │
├───────────────┬─────────────────────────────────────────────────┤
│               │  Page title  subtitle                           │
│   Side Nav    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  (collapsible │  │ KPI  │ │ KPI  │ │ KPI  │ │ KPI  │          │
│   with icons) │  └──────┘ └──────┘ └──────┘ └──────┘          │
│               │  ┌──────────────────────┐ ┌──────────────┐     │
│               │  │   Primary Chart      │ │  Secondary   │     │
│               │  └──────────────────────┘ └──────────────┘     │
│               │  ┌────────────────────────────────────────┐     │
│               │  │               Data Table               │     │
│               │  └────────────────────────────────────────┘     │
│               │  [ Primary ] [ Secondary ] [ Ghost/Danger ]     │
└───────────────┴─────────────────────────────────────────────────┘
\`\`\`
        `,
      },
    },
  },
  decorators: [withModules],
  argTypes: {
    theme: {
      control: 'select',
      options: ['white', 'g10', 'g90', 'g100'],
      description: 'Carbon Design System theme applied to the entire dashboard shell',
      table: { category: 'Appearance', defaultValue: { summary: 'white' } },
    },
    brandPrefix: {
      control: 'text',
      description: 'Brand prefix rendered before the product name, e.g. "[IBM]"',
      table: { category: 'Branding', defaultValue: { summary: '[Platform]' } },
    },
    brandName: {
      control: 'text',
      description: 'Application or product name shown in the header',
      table: { category: 'Branding', defaultValue: { summary: 'CloudOps' } },
    },
    sideNavOpen: {
      control: 'boolean',
      description: 'Whether the side navigation is expanded',
      table: { category: 'Navigation', defaultValue: { summary: 'true' } },
    },
    notifOpen: {
      control: 'boolean',
      description: 'Notifications panel open state',
      table: { category: 'Navigation', defaultValue: { summary: 'false' } },
    },
    userOpen: {
      control: 'boolean',
      description: 'User profile panel open state',
      table: { category: 'Navigation', defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<DashboardArgs>;

// ─────────────────────────────────────────────────────────────────────────────
// Story 1: Cloud Operations — White Theme
// ─────────────────────────────────────────────────────────────────────────────

/**
 * **Cloud Operations Dashboard** — White (light) theme.
 *
 * An infrastructure management view for cloud operations teams.
 * Shows system load over 24 hours, resource distribution, active instances, and quick actions.
 *
 * Toggle `theme` in Controls to preview any Carbon palette without changing code.
 */
export const CloudOpsDashboard: Story = {
  name: 'Cloud Operations (White)',
  args: {
    theme: 'white',
    brandPrefix: '[Platform]',
    brandName: 'CloudOps',
    sideNavOpen: true,
    notifOpen: false,
    userOpen: false,
  },
  render: (args) => {
    const ct = CHART_THEME_MAP[args.theme as CarbonTheme] ?? ChartTheme.WHITE;

    // ── Chart data (deterministic) ──────────────────────────────────────────
    const lineData = [
      { group: 'CPU %', key: '0:00', value: 42 },
      { group: 'CPU %', key: '2:00', value: 48 },
      { group: 'CPU %', key: '4:00', value: 45 },
      { group: 'CPU %', key: '6:00', value: 52 },
      { group: 'CPU %', key: '8:00', value: 68 },
      { group: 'CPU %', key: '10:00', value: 74 },
      { group: 'CPU %', key: '12:00', value: 71 },
      { group: 'CPU %', key: '14:00', value: 65 },
      { group: 'CPU %', key: '16:00', value: 70 },
      { group: 'CPU %', key: '18:00', value: 68 },
      { group: 'CPU %', key: '20:00', value: 62 },
      { group: 'CPU %', key: '22:00', value: 58 },
      { group: 'Memory %', key: '0:00', value: 62 },
      { group: 'Memory %', key: '2:00', value: 63 },
      { group: 'Memory %', key: '4:00', value: 65 },
      { group: 'Memory %', key: '6:00', value: 67 },
      { group: 'Memory %', key: '8:00', value: 72 },
      { group: 'Memory %', key: '10:00', value: 76 },
      { group: 'Memory %', key: '12:00', value: 74 },
      { group: 'Memory %', key: '14:00', value: 73 },
      { group: 'Memory %', key: '16:00', value: 75 },
      { group: 'Memory %', key: '18:00', value: 72 },
      { group: 'Memory %', key: '20:00', value: 70 },
      { group: 'Memory %', key: '22:00', value: 68 },
    ];
    const lineOptions = {
      title: 'System Load — Last 24 Hours',
      axes: {
        bottom: { title: 'Time', mapsTo: 'key', scaleType: ScaleTypes.LABELS },
        left: { title: 'Utilization (%)', mapsTo: 'value', scaleType: ScaleTypes.LINEAR },
      },
      curve: 'curveMonotoneX',
      legend: { enabled: true, position: 'bottom' },
      grid: { x: { enabled: false }, y: { enabled: true } },
      height: '260px',
      theme: ct,
    };

    const donutData = [
      { group: 'Compute', value: 45 },
      { group: 'Storage', value: 30 },
      { group: 'Network', value: 15 },
      { group: 'Database', value: 10 },
    ];
    const donutOptions = {
      title: 'Resource Distribution',
      resizable: true,
      donut: { center: { label: 'Resources' } },
      legend: { enabled: true, position: 'bottom' },
      height: '260px',
      theme: ct,
    };

    // ── Table data ──────────────────────────────────────────────────────────
    const tableColumns: NgccTableColumn[] = [
      { key: 'id', header: 'Instance ID', sortable: false },
      { key: 'type', header: 'Type', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
      { key: 'region', header: 'Region', sortable: false },
      { key: 'cpu', header: 'CPU %', sortable: true },
      { key: 'cost', header: 'Cost / hr', sortable: true },
    ];
    const tableRows = [
      {
        id: 'i-0a1b2c3d',
        type: 'Standard 4vCPU',
        status: 'Running',
        region: 'us-east-1',
        cpu: '68 %',
        cost: '$0.192',
      },
      {
        id: 'i-1e2f3a4b',
        type: 'Compute 8vCPU',
        status: 'Running',
        region: 'eu-west-1',
        cpu: '42 %',
        cost: '$0.384',
      },
      {
        id: 'i-5c6d7e8f',
        type: 'Memory 16 GB',
        status: 'Stopped',
        region: 'ap-east-1',
        cpu: '0 %',
        cost: '$0.000',
      },
      {
        id: 'i-9g0h1i2j',
        type: 'Standard 4vCPU',
        status: 'Running',
        region: 'us-west-2',
        cpu: '55 %',
        cost: '$0.192',
      },
      {
        id: 'i-3k4l5m6n',
        type: 'GPU 8×',
        status: 'Pending',
        region: 'us-east-1',
        cpu: '12 %',
        cost: '$3.060',
      },
    ];

    return {
      props: {
        ...args,
        lineData,
        lineOptions,
        donutData,
        donutOptions,
        tableColumns,
        tableRows,
        tableConfig: { pagination: false, pageSize: 10, rowSelection: 'none' },
      },
      template: `
        <div [attr.data-carbon-theme]="theme"
             style="position:relative;min-height:100vh;background:var(--cds-background,#f4f4f4);">

          <!-- ── Header ──────────────────────────────────────────────────── -->
          <ngcc-header ariaLabel="CloudOps platform">
            <ngcc-hamburger [(active)]="sideNavOpen"
              label="Open navigation" labelClose="Close navigation" />
            <ngcc-header-name [brand]="brandPrefix" [productName]="brandName" href="/" />

            <ngcc-header-navigation ariaLabel="CloudOps">
              <ngcc-header-item href="/dashboard" [isCurrentPage]="true">Dashboard</ngcc-header-item>
              <ngcc-header-item href="/instances">Instances</ngcc-header-item>
              <ngcc-header-item href="/storage">Storage</ngcc-header-item>
              <ngcc-header-item href="/networking">Networking</ngcc-header-item>
            </ngcc-header-navigation>

            <ngcc-header-global>
              <ngcc-header-action ariaLabel="Notifications" [(active)]="notifOpen" iconName="notification" />
              <ngcc-header-action ariaLabel="User profile"  [(active)]="userOpen"  iconName="user_avatar" />
            </ngcc-header-global>
          </ngcc-header>

          <!-- ── Side Navigation ─────────────────────────────────────────── -->
          <ngcc-side-nav ariaLabel="CloudOps navigation"
            [(expanded)]="sideNavOpen" [allowExpansion]="true" style="margin-top:3rem;">

            <ngcc-side-nav-item href="/dashboard" iconName="home" [active]="true">
              Dashboard
            </ngcc-side-nav-item>

            <ngcc-side-nav-menu title="Compute" iconName="cpu" [expanded]="true">
              <ngcc-side-nav-menu-item href="/compute/instances">Instances</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/compute/functions">Functions</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/compute/containers">Containers</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-menu title="Storage" iconName="disk">
              <ngcc-side-nav-menu-item href="/storage/buckets">Buckets</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/storage/volumes">Volumes</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/storage/snapshots">Snapshots</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-menu title="Network" iconName="network">
              <ngcc-side-nav-menu-item href="/network/vpc">VPC</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/network/dns">DNS</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/network/load-balancers">Load Balancers</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-divider />

            <ngcc-side-nav-item href="/billing"  iconName="customer">Billing</ngcc-side-nav-item>
            <ngcc-side-nav-item href="/settings" iconName="configuration">Settings</ngcc-side-nav-item>
          </ngcc-side-nav>

          <!-- ── Main Content ─────────────────────────────────────────────── -->
          <main id="main-content"
            style="margin-left:16rem;padding:calc(3rem + 1.5rem) 1.5rem 2rem 1.5rem;min-height:calc(100vh - 3rem);">

            <!-- Page title -->
            <div style="margin-bottom:1.5rem;">
              <h1 style="font-size:1.75rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">
                Infrastructure Overview
              </h1>
              <p style="font-size:0.875rem;color:var(--cds-text-secondary);margin:0;">
                All regions · Updated just now
              </p>
            </div>

            <!-- KPI cards -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;">

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">CPU Avg</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">68 %</p>
                <p style="font-size:0.75rem;color:var(--cds-support-warning);margin:0;">↑ 4.2 % from yesterday</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Memory Avg</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">72 %</p>
                <p style="font-size:0.75rem;color:var(--cds-support-success);margin:0;">↓ 1.1 % from yesterday</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Active Instances</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">42</p>
                <p style="font-size:0.75rem;color:var(--cds-support-success);margin:0;">↑ 3 new today</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Uptime</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">99.9 %</p>
                <p style="font-size:0.75rem;color:var(--cds-support-success);margin:0;">SLA compliant</p>
              </div>

            </div>

            <!-- Charts row -->
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1.5rem;">
              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <ngcc-charts type="line" [data]="lineData" [options]="lineOptions" />
              </div>
              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <ngcc-charts type="donut" [data]="donutData" [options]="donutOptions" />
              </div>
            </div>

            <!-- Data table -->
            <div class="cds--tile" style="padding:0;margin-bottom:1.5rem;">
              <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--cds-border-subtle-01);
                          display:flex;align-items:center;justify-content:space-between;">
                <h3 style="font-size:1rem;font-weight:600;color:var(--cds-text-primary);margin:0;">
                  Active Instances
                </h3>
                <span style="font-size:0.75rem;color:var(--cds-text-secondary);">5 results</span>
              </div>
              <ngcc-table
                [columns]="tableColumns"
                [rows]="tableRows"
                [config]="tableConfig"
              />
            </div>

            <!-- Action buttons -->
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
              <ngcc-button variant="primary"   label="Create Instance" iconName="add" />
              <ngcc-button variant="secondary" label="Import Config" />
              <ngcc-button variant="ghost"     label="View All Resources" />
            </div>

          </main>
        </div>
      `,
    };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 2: Security Operations Center — G100 Dark Theme
// ─────────────────────────────────────────────────────────────────────────────

/**
 * **Security Operations Dashboard** — G100 (dark) theme.
 *
 * A threat monitoring and incident management view for SOC teams.
 * Displays alert counts by severity, weekly incident trends,
 * open incident list, and quick triage actions.
 *
 * Toggle `theme` to `white` or `g10` to see how the same layout adapts to lighter palettes.
 */
export const SecOpsDashboard: Story = {
  name: 'Security Operations (G100 Dark)',
  args: {
    theme: 'g100',
    brandPrefix: '[Platform]',
    brandName: 'SecOps',
    sideNavOpen: true,
    notifOpen: false,
    userOpen: false,
  },
  render: (args) => {
    const ct = CHART_THEME_MAP[args.theme as CarbonTheme] ?? ChartTheme.G100;

    // ── Chart data ──────────────────────────────────────────────────────────
    const barData = [
      { group: 'Critical', key: 'Mon', value: 2 },
      { group: 'Critical', key: 'Tue', value: 1 },
      { group: 'Critical', key: 'Wed', value: 3 },
      { group: 'Critical', key: 'Thu', value: 0 },
      { group: 'Critical', key: 'Fri', value: 1 },
      { group: 'Critical', key: 'Sat', value: 0 },
      { group: 'Critical', key: 'Sun', value: 2 },
      { group: 'High', key: 'Mon', value: 5 },
      { group: 'High', key: 'Tue', value: 4 },
      { group: 'High', key: 'Wed', value: 6 },
      { group: 'High', key: 'Thu', value: 3 },
      { group: 'High', key: 'Fri', value: 5 },
      { group: 'High', key: 'Sat', value: 2 },
      { group: 'High', key: 'Sun', value: 4 },
      { group: 'Medium', key: 'Mon', value: 12 },
      { group: 'Medium', key: 'Tue', value: 9 },
      { group: 'Medium', key: 'Wed', value: 11 },
      { group: 'Medium', key: 'Thu', value: 8 },
      { group: 'Medium', key: 'Fri', value: 10 },
      { group: 'Medium', key: 'Sat', value: 6 },
      { group: 'Medium', key: 'Sun', value: 8 },
    ];
    const barOptions = {
      title: 'Alerts by Severity — Last 7 Days',
      axes: {
        bottom: { title: 'Day', mapsTo: 'key', scaleType: ScaleTypes.LABELS },
        left: { title: 'Count', mapsTo: 'value', scaleType: ScaleTypes.LINEAR },
      },
      color: { scale: { Critical: '#DA1E28', High: '#FF832B', Medium: '#F1C21B' } },
      legend: { enabled: true, position: 'bottom' },
      grid: { x: { enabled: false }, y: { enabled: true } },
      height: '260px',
      theme: ct,
    };

    const stackedData = [
      { group: 'Malware', key: 'Week 1', value: 4 },
      { group: 'Malware', key: 'Week 2', value: 3 },
      { group: 'Malware', key: 'Week 3', value: 5 },
      { group: 'Malware', key: 'Week 4', value: 2 },
      { group: 'Phishing', key: 'Week 1', value: 6 },
      { group: 'Phishing', key: 'Week 2', value: 8 },
      { group: 'Phishing', key: 'Week 3', value: 5 },
      { group: 'Phishing', key: 'Week 4', value: 7 },
      { group: 'Unauthorised', key: 'Week 1', value: 2 },
      { group: 'Unauthorised', key: 'Week 2', value: 1 },
      { group: 'Unauthorised', key: 'Week 3', value: 3 },
      { group: 'Unauthorised', key: 'Week 4', value: 2 },
      { group: 'Insider Threat', key: 'Week 1', value: 1 },
      { group: 'Insider Threat', key: 'Week 2', value: 2 },
      { group: 'Insider Threat', key: 'Week 3', value: 1 },
      { group: 'Insider Threat', key: 'Week 4', value: 0 },
    ];
    const stackedOptions = {
      title: 'Incidents by Type — Last 4 Weeks',
      axes: {
        bottom: { title: 'Week', mapsTo: 'key', scaleType: ScaleTypes.LABELS },
        left: { title: 'Count', mapsTo: 'value', stacked: true },
      },
      legend: { enabled: true, position: 'bottom' },
      grid: { x: { enabled: false }, y: { enabled: true } },
      height: '260px',
      theme: ct,
    };

    // ── Table data ──────────────────────────────────────────────────────────
    const tableColumns: NgccTableColumn[] = [
      { key: 'id', header: 'Incident ID', sortable: false },
      { key: 'type', header: 'Type', sortable: true },
      { key: 'severity', header: 'Severity', sortable: true },
      { key: 'status', header: 'Status', sortable: true },
      { key: 'assigned', header: 'Assigned To', sortable: false },
      { key: 'opened', header: 'Opened', sortable: false },
    ];
    const tableRows = [
      {
        id: 'INC-2401',
        type: 'Malware',
        severity: 'Critical',
        status: 'Investigating',
        assigned: 'J. Chen',
        opened: '2 h ago',
      },
      {
        id: 'INC-2400',
        type: 'Phishing',
        severity: 'High',
        status: 'Contained',
        assigned: 'A. Patel',
        opened: '5 h ago',
      },
      {
        id: 'INC-2399',
        type: 'Unauthorised',
        severity: 'High',
        status: 'Open',
        assigned: 'M. Silva',
        opened: '8 h ago',
      },
      {
        id: 'INC-2398',
        type: 'Insider Threat',
        severity: 'Medium',
        status: 'Monitoring',
        assigned: 'K. Lee',
        opened: '1 day ago',
      },
      {
        id: 'INC-2397',
        type: 'Phishing',
        severity: 'Medium',
        status: 'Resolved',
        assigned: 'J. Chen',
        opened: '2 days ago',
      },
    ];

    return {
      props: {
        ...args,
        barData,
        barOptions,
        stackedData,
        stackedOptions,
        tableColumns,
        tableRows,
        tableConfig: { pagination: false, pageSize: 10, rowSelection: 'none' },
      },
      template: `
        <div [attr.data-carbon-theme]="theme"
             style="position:relative;min-height:100vh;background:var(--cds-background,#161616);">

          <!-- ── Header ──────────────────────────────────────────────────── -->
          <ngcc-header ariaLabel="SecOps platform">
            <ngcc-hamburger [(active)]="sideNavOpen"
              label="Open navigation" labelClose="Close navigation" />
            <ngcc-header-name [brand]="brandPrefix" [productName]="brandName" href="/" />

            <ngcc-header-navigation ariaLabel="SecOps">
              <ngcc-header-item href="/dashboard" [isCurrentPage]="true">Dashboard</ngcc-header-item>
              <ngcc-header-item href="/alerts">Alerts</ngcc-header-item>
              <ngcc-header-item href="/incidents">Incidents</ngcc-header-item>
              <ngcc-header-item href="/reports">Reports</ngcc-header-item>
            </ngcc-header-navigation>

            <ngcc-header-global>
              <ngcc-header-action ariaLabel="Notifications" [(active)]="notifOpen" iconName="notification" />
              <ngcc-header-action ariaLabel="User profile"  [(active)]="userOpen"  iconName="user_avatar" />
            </ngcc-header-global>
          </ngcc-header>

          <!-- ── Side Navigation ─────────────────────────────────────────── -->
          <ngcc-side-nav ariaLabel="SecOps navigation"
            [(expanded)]="sideNavOpen" [allowExpansion]="true" style="margin-top:3rem;">

            <ngcc-side-nav-item href="/dashboard" iconName="home" [active]="true">
              Overview
            </ngcc-side-nav-item>

            <ngcc-side-nav-menu title="Threats" iconName="warn" [expanded]="true">
              <ngcc-side-nav-menu-item href="/threats/active">Active Threats</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/threats/history">Threat History</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/threats/intelligence">Intel Feed</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-menu title="Incidents" iconName="error">
              <ngcc-side-nav-menu-item href="/incidents/open">Open</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/incidents/investigating">Investigating</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/incidents/resolved">Resolved</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-menu title="Analytics" iconName="services">
              <ngcc-side-nav-menu-item href="/analytics/reports">Reports</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/analytics/metrics">Metrics</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-divider />

            <ngcc-side-nav-item href="/users"    iconName="user_admin">User Access</ngcc-side-nav-item>
            <ngcc-side-nav-item href="/settings" iconName="configuration">Settings</ngcc-side-nav-item>
          </ngcc-side-nav>

          <!-- ── Main Content ─────────────────────────────────────────────── -->
          <main id="main-content"
            style="margin-left:16rem;padding:calc(3rem + 1.5rem) 1.5rem 2rem 1.5rem;min-height:calc(100vh - 3rem);">

            <!-- Page title -->
            <div style="margin-bottom:1.5rem;">
              <h1 style="font-size:1.75rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">
                Security Operations Center
              </h1>
              <p style="font-size:0.875rem;color:var(--cds-text-secondary);margin:0;">
                Live threat monitoring · All environments
              </p>
            </div>

            <!-- KPI cards -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;">

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Critical Alerts</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-support-error);margin:0 0 0.25rem;">3</p>
                <p style="font-size:0.75rem;color:var(--cds-support-error);margin:0;">↑ 2 since last hour</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">High Risk</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-support-warning);margin:0 0 0.25rem;">17</p>
                <p style="font-size:0.75rem;color:var(--cds-support-warning);margin:0;">↑ 4 from yesterday</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Active Incidents</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">8</p>
                <p style="font-size:0.75rem;color:var(--cds-support-success);margin:0;">↓ 2 resolved today</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">MTTR</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">4.2 h</p>
                <p style="font-size:0.75rem;color:var(--cds-support-success);margin:0;">↓ 0.8 h vs last week</p>
              </div>

            </div>

            <!-- Charts row -->
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1.5rem;">
              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <ngcc-charts type="bar" [data]="barData" [options]="barOptions" />
              </div>
              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <ngcc-charts type="stackedBar" [data]="stackedData" [options]="stackedOptions" />
              </div>
            </div>

            <!-- Data table -->
            <div class="cds--tile" style="padding:0;margin-bottom:1.5rem;">
              <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--cds-border-subtle-01);
                          display:flex;align-items:center;justify-content:space-between;">
                <h3 style="font-size:1rem;font-weight:600;color:var(--cds-text-primary);margin:0;">
                  Open Incidents
                </h3>
                <span style="font-size:0.75rem;color:var(--cds-support-error);">5 active</span>
              </div>
              <ngcc-table
                [columns]="tableColumns"
                [rows]="tableRows"
                [config]="tableConfig"
              />
            </div>

            <!-- Action buttons -->
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
              <ngcc-button variant="primary"   label="Acknowledge All" />
              <ngcc-button variant="secondary" label="Export Report" />
              <ngcc-button variant="danger"    label="Quarantine Host" iconName="warn" />
            </div>

          </main>
        </div>
      `,
    };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Story 3: Business Analytics — G10 Tinted Theme
// ─────────────────────────────────────────────────────────────────────────────

/**
 * **Analytics Dashboard** — G10 (light gray) theme.
 *
 * A business intelligence view for product and revenue analytics.
 * Shows monthly revenue trends, customer segments, top-performing products, and data actions.
 *
 * Toggle `theme` to `g90` or `g100` to preview the dark palette.
 */
export const AnalyticsDashboard: Story = {
  name: 'Business Analytics (G10)',
  args: {
    theme: 'g10',
    brandPrefix: '[Platform]',
    brandName: 'Insights',
    sideNavOpen: true,
    notifOpen: false,
    userOpen: false,
  },
  render: (args) => {
    const ct = CHART_THEME_MAP[args.theme as CarbonTheme] ?? ChartTheme.G10;

    // ── Chart data ──────────────────────────────────────────────────────────
    const areaData = [
      { group: 'Product A', key: 'Jan', value: 120000 },
      { group: 'Product A', key: 'Feb', value: 145000 },
      { group: 'Product A', key: 'Mar', value: 138000 },
      { group: 'Product A', key: 'Apr', value: 162000 },
      { group: 'Product A', key: 'May', value: 175000 },
      { group: 'Product A', key: 'Jun', value: 190000 },
      { group: 'Product B', key: 'Jan', value: 85000 },
      { group: 'Product B', key: 'Feb', value: 92000 },
      { group: 'Product B', key: 'Mar', value: 88000 },
      { group: 'Product B', key: 'Apr', value: 101000 },
      { group: 'Product B', key: 'May', value: 115000 },
      { group: 'Product B', key: 'Jun', value: 108000 },
    ];
    const areaOptions = {
      title: 'Monthly Revenue — H1',
      axes: {
        bottom: { title: 'Month', mapsTo: 'key', scaleType: ScaleTypes.LABELS },
        left: { title: 'Revenue ($)', mapsTo: 'value', scaleType: ScaleTypes.LINEAR },
      },
      curve: 'curveMonotoneX',
      legend: { enabled: true, position: 'bottom' },
      grid: { x: { enabled: false }, y: { enabled: true } },
      height: '260px',
      theme: ct,
    };

    const pieData = [
      { group: 'Enterprise', value: 45 },
      { group: 'SMB', value: 30 },
      { group: 'Consumer', value: 15 },
      { group: 'Partner', value: 10 },
    ];
    const pieOptions = {
      title: 'Revenue by Segment',
      resizable: true,
      legend: { enabled: true, position: 'bottom' },
      height: '260px',
      theme: ct,
    };

    // ── Table data ──────────────────────────────────────────────────────────
    const tableColumns: NgccTableColumn[] = [
      { key: 'product', header: 'Product', sortable: true },
      { key: 'revenue', header: 'Revenue', sortable: true },
      { key: 'units', header: 'Units Sold', sortable: true },
      { key: 'growth', header: 'Growth', sortable: true },
      { key: 'status', header: 'Status', sortable: false },
    ];
    const tableRows = [
      {
        product: 'Analytics Pro',
        revenue: '$190,000',
        units: '1,240',
        growth: '+18 %',
        status: 'On track',
      },
      {
        product: 'Data Platform',
        revenue: '$108,000',
        units: '720',
        growth: ' −6 %',
        status: 'At risk',
      },
      {
        product: 'Insights Basic',
        revenue: ' $62,400',
        units: '3,120',
        growth: '+24 %',
        status: 'Exceeding',
      },
      {
        product: 'ML Toolkit',
        revenue: ' $48,000',
        units: '320',
        growth: '+41 %',
        status: 'Exceeding',
      },
      {
        product: 'Report Builder',
        revenue: ' $31,200',
        units: '1,560',
        growth: '+3 %',
        status: 'On track',
      },
    ];

    return {
      props: {
        ...args,
        areaData,
        areaOptions,
        pieData,
        pieOptions,
        tableColumns,
        tableRows,
        tableConfig: { pagination: false, pageSize: 10, rowSelection: 'none' },
      },
      template: `
        <div [attr.data-carbon-theme]="theme"
             style="position:relative;min-height:100vh;background:var(--cds-background,#f4f4f4);">

          <!-- ── Header ──────────────────────────────────────────────────── -->
          <ngcc-header ariaLabel="Insights platform">
            <ngcc-hamburger [(active)]="sideNavOpen"
              label="Open navigation" labelClose="Close navigation" />
            <ngcc-header-name [brand]="brandPrefix" [productName]="brandName" href="/" />

            <ngcc-header-navigation ariaLabel="Insights">
              <ngcc-header-item href="/dashboard"  [isCurrentPage]="true">Dashboard</ngcc-header-item>
              <ngcc-header-item href="/revenue">Revenue</ngcc-header-item>
              <ngcc-header-item href="/customers">Customers</ngcc-header-item>
              <ngcc-header-item href="/products">Products</ngcc-header-item>
            </ngcc-header-navigation>

            <ngcc-header-global>
              <ngcc-header-action ariaLabel="Notifications" [(active)]="notifOpen" iconName="notification" />
              <ngcc-header-action ariaLabel="User profile"  [(active)]="userOpen"  iconName="user_avatar" />
            </ngcc-header-global>
          </ngcc-header>

          <!-- ── Side Navigation ─────────────────────────────────────────── -->
          <ngcc-side-nav ariaLabel="Insights navigation"
            [(expanded)]="sideNavOpen" [allowExpansion]="true" style="margin-top:3rem;">

            <ngcc-side-nav-item href="/dashboard" iconName="home" [active]="true">
              Overview
            </ngcc-side-nav-item>

            <ngcc-side-nav-menu title="Revenue" iconName="services" [expanded]="true">
              <ngcc-side-nav-menu-item href="/revenue/monthly">Monthly</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/revenue/ytd">Year to Date</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/revenue/forecast">Forecast</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-menu title="Customers" iconName="customer">
              <ngcc-side-nav-menu-item href="/customers/all">All Customers</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/customers/segments">Segments</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/customers/churn">Churn Analysis</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-menu title="Products" iconName="disk">
              <ngcc-side-nav-menu-item href="/products/catalog">Catalog</ngcc-side-nav-menu-item>
              <ngcc-side-nav-menu-item href="/products/performance">Performance</ngcc-side-nav-menu-item>
            </ngcc-side-nav-menu>

            <ngcc-side-nav-divider />

            <ngcc-side-nav-item href="/reports"  iconName="information">Reports</ngcc-side-nav-item>
            <ngcc-side-nav-item href="/settings" iconName="configuration">Settings</ngcc-side-nav-item>
          </ngcc-side-nav>

          <!-- ── Main Content ─────────────────────────────────────────────── -->
          <main id="main-content"
            style="margin-left:16rem;padding:calc(3rem + 1.5rem) 1.5rem 2rem 1.5rem;min-height:calc(100vh - 3rem);">

            <!-- Page title -->
            <div style="margin-bottom:1.5rem;">
              <h1 style="font-size:1.75rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">
                Business Analytics
              </h1>
              <p style="font-size:0.875rem;color:var(--cds-text-secondary);margin:0;">
                H1 2026 · All products &amp; segments
              </p>
            </div>

            <!-- KPI cards -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;">

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Total Revenue</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">$1.21 M</p>
                <p style="font-size:0.75rem;color:var(--cds-support-success);margin:0;">↑ 14 % vs H1 2025</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Active Users</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">8,432</p>
                <p style="font-size:0.75rem;color:var(--cds-support-success);margin:0;">↑ 623 new this month</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Orders Today</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">1,247</p>
                <p style="font-size:0.75rem;color:var(--cds-support-warning);margin:0;">↓ 3 % vs yesterday</p>
              </div>

              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;
                           color:var(--cds-text-secondary);margin:0 0 0.5rem;">Conversion Rate</p>
                <p style="font-size:2rem;font-weight:600;color:var(--cds-text-primary);margin:0 0 0.25rem;">3.4 %</p>
                <p style="font-size:0.75rem;color:var(--cds-support-success);margin:0;">↑ 0.4 pp this week</p>
              </div>

            </div>

            <!-- Charts row -->
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1.5rem;">
              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <ngcc-charts type="area" [data]="areaData" [options]="areaOptions" />
              </div>
              <div class="cds--tile" style="padding:1.25rem 1.5rem;">
                <ngcc-charts type="pie" [data]="pieData" [options]="pieOptions" />
              </div>
            </div>

            <!-- Data table -->
            <div class="cds--tile" style="padding:0;margin-bottom:1.5rem;">
              <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--cds-border-subtle-01);
                          display:flex;align-items:center;justify-content:space-between;">
                <h3 style="font-size:1rem;font-weight:600;color:var(--cds-text-primary);margin:0;">
                  Top Products by Revenue
                </h3>
                <span style="font-size:0.75rem;color:var(--cds-text-secondary);">H1 2026</span>
              </div>
              <ngcc-table
                [columns]="tableColumns"
                [rows]="tableRows"
                [config]="tableConfig"
              />
            </div>

            <!-- Action buttons -->
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
              <ngcc-button variant="primary"   label="Generate Report" />
              <ngcc-button variant="secondary" label="Export Data" />
              <ngcc-button variant="ghost"     label="Schedule Report" />
            </div>

          </main>
        </div>
      `,
    };
  },
};
