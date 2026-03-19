import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { NgccHeader } from './header/ngcc-header';
import { NgccHeaderName } from './header-name/ngcc-header-name';
import { NgccHeaderNavigation } from './header-navigation/ngcc-header-navigation';
import { NgccHeaderItem } from './header-navigation/header-item/ngcc-header-item';
import { NgccHeaderMenu } from './header-menu/ngcc-header-menu';
import { NgccHeaderMenuItem } from './header-menu/header-menu-item/ngcc-header-menu-item';
import { NgccHeaderGlobal } from './header-global/ngcc-header-global';
import { NgccHeaderAction } from './header-action/ngcc-header-action';
import { NgccHeaderPanel } from './header-panel/ngcc-header-panel';
import { NgccHamburger } from './hamburger/ngcc-hamburger';

import { NgccI18nPipe } from '../ngcc-i18n/pipe';
import { provideNgccI18n } from '../ngcc-i18n/provider';
import { NgccDropdown } from '../ngcc-dropdown/ngcc-dropdown';
import type { NgccDropdownItem } from '../ngcc-dropdown/ngcc-dropdown.types';

// ─── Inline translations for Storybook (no HTTP loader needed) ───────────────

const EN_TRANSLATIONS: Record<string, string> = {
  'header.search': 'Search',
  'header.notifications': 'Notifications',
  'header.appSwitcher': 'Switch applications',
  'header.userProfile': 'User profile',
  'header.quickAdd': 'Quick Add',
  'header.openNav': 'Open navigation menu',
  'header.closeNav': 'Close navigation menu',
  'header.skipToContent': 'Skip to main content',
  'header.settings': 'Settings',
  'header.region': 'Region',
};

// ─── Storybook wrapper class ─────────────────────────────────────────────────

class HeaderWrapper {
  ariaLabel = 'CarbideUI';
  skipTo = 'main-content';
  sideNavOpen = false;
  searchOpen = false;
  notifOpen = false;
  switcherOpen = false;
  settingsOpen = false;
  currentPage = '/';
  regionItems: NgccDropdownItem<string>[] = [
    { label: 'Americas — US East', value: 'us-east' },
    { label: 'Americas — US South', value: 'us-south' },
    { label: 'Europe — Frankfurt', value: 'eu-de' },
    { label: 'Europe — London', value: 'eu-gb' },
    { label: 'Asia Pacific — Tokyo', value: 'jp-tok' },
    { label: 'Asia Pacific — Sydney', value: 'au-syd' },
  ];
}

// ─── Shared providers ────────────────────────────────────────────────────────

const withI18n = applicationConfig({
  providers: [
    provideNgccI18n({
      defaultLanguage: 'en',
      loader: { load: async () => ({}) },
      cache: new Map([['en', EN_TRANSLATIONS]]),
    }),
  ],
});

// ─── Shared imports ──────────────────────────────────────────────────────────

const withHeaderModules = moduleMetadata({
  imports: [
    NgccHeader,
    NgccHamburger,
    NgccHeaderName,
    NgccHeaderNavigation,
    NgccHeaderItem,
    NgccHeaderMenu,
    NgccHeaderMenuItem,
    NgccHeaderGlobal,
    NgccHeaderAction,
    NgccHeaderPanel,
    NgccI18nPipe,
    NgccDropdown,
  ],
});

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<HeaderWrapper> = {
  title: 'UI Shell/Header',
  component: HeaderWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Enterprise Carbon Design System header shell built with Angular v20+ signal APIs.

## Composition
The header is composed of individually importable components:

| Selector | Purpose |
|---|---|
| \`<ngcc-header>\` | Root \`<header role="banner">\` with skip link |
| \`<ngcc-hamburger>\` | Left-side hamburger / close toggle |
| \`<ngcc-header-name>\` | Brand prefix + product name link |
| \`<ngcc-header-navigation>\` | \`<nav>\` + \`<ul role="menubar">\` wrapper |
| \`<ngcc-header-item>\` | Single nav link (\`role="menuitem"\`) |
| \`<ngcc-header-menu>\` | Flyout dropdown with full keyboard nav |
| \`<ngcc-header-menu-item>\` | Item inside a dropdown |
| \`<ngcc-header-global>\` | Right-side action button bar |
| \`<ngcc-header-action>\` | Toggleable action button (search, bell, apps…) |
| \`<ngcc-header-panel>\` | Slide-in panel linked to an action |

## Icon integration
Pass the icon name via \`iconName\` input — \`NgccButton\` (ghost, icon-only) renders it internally.
No inline SVGs or \`<ngcc-icon>\` required in the parent template.

## i18n integration
Action button labels are translated via the \`ngccI18n\` pipe.
Provide translations with \`provideNgccI18n()\` in \`app.config.ts\`.

## Keyboard navigation
- **Tab** — moves between interactive elements
- **Enter / Space** — activates buttons, opens dropdowns
- **Arrow Up / Down** — navigates within open dropdown
- **Home / End** — jumps to first / last dropdown item
- **Escape** — closes dropdowns and panels, returns focus to trigger
        `,
      },
    },
  },
  decorators: [withI18n, withHeaderModules],
  argTypes: {
    ariaLabel: { control: 'text', description: 'Accessible label for the <header> landmark' },
    skipTo: { control: 'text', description: 'ID of the main content skip-link target' },
  },
};

export default meta;
type Story = StoryObj<HeaderWrapper>;

// ─── Layout helper ────────────────────────────────────────────────────────────

const PAGE_WRAP = `style="min-height:200px;padding-top:3rem;background:var(--cds-background,#f4f4f4);"`;
const PAGE_WRAP_TALL = `style="min-height:400px;padding-top:3rem;background:var(--cds-background,#f4f4f4);"`;

// ─── 1. Brand Only ────────────────────────────────────────────────────────────

/** Minimal header — brand name link only. Good starting point. */
export const BrandOnly: Story = {
  args: { ariaLabel: 'CarbideUI', skipTo: 'main-content' },
  render: (args) => ({
    props: args,
    template: `
      <div ${PAGE_WRAP}>
        <ngcc-header [ariaLabel]="ariaLabel" [skipTo]="skipTo">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>
        </ngcc-header>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">← Press Tab then Enter on the skip link above</p>
        </main>
      </div>
    `,
  }),
};

// ─── 2. With Navigation ───────────────────────────────────────────────────────

/** Header with horizontal navigation links. \`isCurrentPage\` highlights the active route. */
export const WithNavigation: Story = {
  args: { ariaLabel: 'CarbideUI' },
  render: (args) => ({
    props: { ...args, currentPage: '/' },
    template: `
      <div ${PAGE_WRAP}>
        <ngcc-header [ariaLabel]="ariaLabel">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>

          <ngcc-header-navigation ariaLabel="CarbideUI">
            <ngcc-header-item href="/" [isCurrentPage]="currentPage === '/'">Dashboard</ngcc-header-item>
            <ngcc-header-item href="/analytics" [isCurrentPage]="currentPage === '/analytics'">Analytics</ngcc-header-item>
            <ngcc-header-item href="/reports" [isCurrentPage]="currentPage === '/reports'">Reports</ngcc-header-item>
            <ngcc-header-item href="/settings" [isCurrentPage]="currentPage === '/settings'">Settings</ngcc-header-item>
          </ngcc-header-navigation>
        </ngcc-header>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">Active: {{ currentPage }}</p>
        </main>
      </div>
    `,
  }),
};

// ─── 3. With Dropdown Menus ───────────────────────────────────────────────────

/**
 * Navigation with flyout dropdowns.
 * Keyboard: **Enter/Space** opens, **Arrow Up/Down** navigates, **Escape** closes.
 */
export const WithDropdownMenus: Story = {
  args: { ariaLabel: 'CarbideUI' },
  render: (args) => ({
    props: args,
    template: `
      <div ${PAGE_WRAP}>
        <ngcc-header [ariaLabel]="ariaLabel">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>

          <ngcc-header-navigation ariaLabel="CarbideUI">
            <ngcc-header-item href="/" [isCurrentPage]="true">Dashboard</ngcc-header-item>

            <ngcc-header-menu title="Catalog">
              <ngcc-header-menu-item href="/catalog/services">Services</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/catalog/products">Products</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/catalog/solutions">Solutions</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/catalog/deprecated" [disabled]="true">
                Deprecated (disabled)
              </ngcc-header-menu-item>
            </ngcc-header-menu>

            <ngcc-header-menu title="Platform">
              <ngcc-header-menu-item href="/platform/overview">Overview</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/platform/activity">Activity Log</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/platform/billing">Billing</ngcc-header-menu-item>
            </ngcc-header-menu>

            <ngcc-header-item href="/docs">Docs</ngcc-header-item>
          </ngcc-header-navigation>
        </ngcc-header>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">Click or hover the nav menus above</p>
        </main>
      </div>
    `,
  }),
};

// ─── 4. With Global Action Buttons ───────────────────────────────────────────

/**
 * Right-side global action buttons using \`iconName\` prop and \`ngccI18n\` pipe for labels.
 */
export const WithGlobalActions: Story = {
  args: { ariaLabel: 'CarbideUI' },
  render: (args) => ({
    props: { ...args, searchOpen: false, notifOpen: false, switcherOpen: false },
    template: `
      <div ${PAGE_WRAP}>
        <ngcc-header [ariaLabel]="ariaLabel">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>

          <ngcc-header-global>
            <ngcc-header-action [ariaLabel]="'header.search' | ngccI18n" [(active)]="searchOpen" iconName="search" />
            <ngcc-header-action [ariaLabel]="'header.notifications' | ngccI18n" [(active)]="notifOpen" iconName="notification" />
            <ngcc-header-action [ariaLabel]="'header.appSwitcher' | ngccI18n" [(active)]="switcherOpen" iconName="app_switcher" />
          </ngcc-header-global>
        </ngcc-header>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">
            Search: {{ searchOpen }} | Notifications: {{ notifOpen }} | Switcher: {{ switcherOpen }}
          </p>
        </main>
      </div>
    `,
  }),
};

// ─── 5. With Header Panel ─────────────────────────────────────────────────────

/**
 * Action button linked to a slide-in panel.
 * Click the search button to toggle the panel open / closed.
 */
export const WithPanel: Story = {
  args: { ariaLabel: 'CarbideUI' },
  render: (args) => ({
    props: { ...args, searchOpen: false },
    template: `
      <div ${PAGE_WRAP_TALL}>
        <ngcc-header [ariaLabel]="ariaLabel">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>

          <ngcc-header-global>
            <ngcc-header-action [ariaLabel]="'header.search' | ngccI18n" [(active)]="searchOpen" iconName="search" />
          </ngcc-header-global>
        </ngcc-header>

        <ngcc-header-panel [expanded]="searchOpen" [ariaLabel]="'header.search' | ngccI18n">
          <div style="padding:1.5rem;">
            <p style="color:var(--cds-text-primary);font-weight:600;margin-bottom:1rem;">
              {{ 'header.search' | ngccI18n }}
            </p>
            <input
              type="search"
              placeholder="Search…"
              class="cds--search-input"
              style="width:100%;padding:0.5rem;border:1px solid var(--cds-border-subtle-01);background:var(--cds-field-01);color:var(--cds-text-primary);"
            />
            <p style="color:var(--cds-text-secondary);font-size:0.75rem;margin-top:0.5rem;">
              Press Esc to close
            </p>
          </div>
        </ngcc-header-panel>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">
            Panel: {{ searchOpen ? 'Open' : 'Closed' }}
          </p>
        </main>
      </div>
    `,
  }),
};

// ─── 6. Full Header ───────────────────────────────────────────────────────────

/**
 * Complete enterprise header — all regions active:
 * hamburger → brand → navigation → global actions → panels.
 *
 * - Icons via \`iconName\` prop on \`<ngcc-header-action>\`
 * - Labels via \`ngccI18n\` pipe
 * - User profile panel includes a \`<ngcc-dropdown>\` region selector
 */
export const FullHeader: Story = {
  args: { ariaLabel: 'CarbideUI' },
  render: (args) => ({
    props: {
      ...args,
      sideNavOpen: false,
      searchOpen: false,
      notifOpen: false,
      switcherOpen: false,
      regionItems: [
        { label: 'Americas — US East', value: 'us-east' },
        { label: 'Americas — US South', value: 'us-south' },
        { label: 'Europe — Frankfurt', value: 'eu-de' },
        { label: 'Europe — London', value: 'eu-gb' },
        { label: 'Asia Pacific — Tokyo', value: 'jp-tok' },
        { label: 'Asia Pacific — Sydney', value: 'au-syd' },
      ],
    },
    template: `
      <div ${PAGE_WRAP_TALL}>

        <ngcc-header [ariaLabel]="ariaLabel">

          <!-- 1. Hamburger -->
          <ngcc-hamburger
            [(active)]="sideNavOpen"
            [label]="'header.openNav' | ngccI18n"
            [labelClose]="'header.closeNav' | ngccI18n">
          </ngcc-hamburger>

          <!-- 2. Brand -->
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>

          <!-- 3. Navigation -->
          <ngcc-header-navigation ariaLabel="CarbideUI">
            <ngcc-header-item href="/" [isCurrentPage]="true">Dashboard</ngcc-header-item>

            <ngcc-header-menu title="Catalog">
              <ngcc-header-menu-item href="/catalog/services">Services</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/catalog/products">Products</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/catalog/solutions">Solutions</ngcc-header-menu-item>
            </ngcc-header-menu>

            <ngcc-header-menu title="Platform">
              <ngcc-header-menu-item href="/platform/overview">Overview</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/platform/activity">Activity Log</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/platform/billing">Billing</ngcc-header-menu-item>
            </ngcc-header-menu>

            <ngcc-header-item href="/docs">Docs</ngcc-header-item>
          </ngcc-header-navigation>

          <!-- 4. Global actions -->
          <ngcc-header-global>
            <ngcc-header-action [ariaLabel]="'header.search' | ngccI18n" [(active)]="searchOpen" iconName="search" />
            <ngcc-header-action [ariaLabel]="'header.notifications' | ngccI18n" [(active)]="notifOpen" iconName="notification" />
            <ngcc-header-action [ariaLabel]="'header.appSwitcher' | ngccI18n" [(active)]="switcherOpen" iconName="app_switcher" />
          </ngcc-header-global>
        </ngcc-header>

        <!-- Search Panel -->
        <ngcc-header-panel [expanded]="searchOpen" [ariaLabel]="'header.search' | ngccI18n">
          <div style="padding:1.5rem;">
            <p style="color:var(--cds-text-primary);font-weight:600;margin-bottom:1rem;">
              {{ 'header.search' | ngccI18n }}
            </p>
            <input type="search" placeholder="Search…"
              style="width:100%;padding:0.5rem;border:1px solid var(--cds-border-subtle-01);background:var(--cds-field-01);color:var(--cds-text-primary);" />
          </div>
        </ngcc-header-panel>

        <!-- Notifications Panel -->
        <ngcc-header-panel [expanded]="notifOpen" [ariaLabel]="'header.notifications' | ngccI18n">
          <div style="padding:1.5rem;">
            <p style="color:var(--cds-text-primary);font-weight:600;margin-bottom:1rem;">
              {{ 'header.notifications' | ngccI18n }}
            </p>
            <div style="padding:0.75rem 0;border-bottom:1px solid var(--cds-border-subtle-01);">
              <p style="color:var(--cds-text-primary);font-size:0.875rem;">Deployment succeeded</p>
              <p style="color:var(--cds-text-secondary);font-size:0.75rem;">2 minutes ago</p>
            </div>
            <div style="padding:0.75rem 0;border-bottom:1px solid var(--cds-border-subtle-01);">
              <p style="color:var(--cds-text-primary);font-size:0.875rem;">New user signed up</p>
              <p style="color:var(--cds-text-secondary);font-size:0.75rem;">15 minutes ago</p>
            </div>
            <div style="padding:0.75rem 0;">
              <p style="color:var(--cds-text-primary);font-size:0.875rem;">Storage limit at 85%</p>
              <p style="color:var(--cds-text-secondary);font-size:0.75rem;">1 hour ago</p>
            </div>
          </div>
        </ngcc-header-panel>

        <!-- App Switcher / User Panel — includes NgccDropdown for region selection -->
        <ngcc-header-panel [expanded]="switcherOpen" [ariaLabel]="'header.appSwitcher' | ngccI18n">
          <div style="padding:1.5rem;">
            <p style="color:var(--cds-text-primary);font-weight:600;margin-bottom:0.5rem;">
              Jane Smith
            </p>
            <p style="color:var(--cds-text-secondary);font-size:0.875rem;margin-bottom:1.5rem;">
              jane@company.com
            </p>

            <!-- Region picker via NgccDropdown -->
            <ngcc-dropdown
              [label]="'header.region' | ngccI18n"
              [items]="regionItems"
              placeholder="Select region…"
              size="sm">
            </ngcc-dropdown>

            <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.75rem;">
              <a href="/profile" style="color:var(--cds-link-primary);font-size:0.875rem;">
                Manage profile
              </a>
              <a href="/logout" style="color:var(--cds-link-primary);font-size:0.875rem;">
                Sign out
              </a>
            </div>
          </div>
        </ngcc-header-panel>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary);font-weight:600;margin-bottom:0.5rem;">
            Main content area
          </p>
          <p style="color:var(--cds-text-secondary);font-size:0.875rem;">
            Side nav: {{ sideNavOpen ? 'Open' : 'Closed' }} |
            Search: {{ searchOpen ? 'Open' : 'Closed' }} |
            Notifications: {{ notifOpen ? 'Open' : 'Closed' }} |
            Switcher: {{ switcherOpen ? 'Open' : 'Closed' }}
          </p>
        </main>
      </div>
    `,
  }),
};

// ─── 7. Mouseover Dropdowns ───────────────────────────────────────────────────

/**
 * Dropdown menus that open on mouse hover instead of click.
 * Set \`trigger="mouseover"\` on \`<ngcc-header-menu>\`.
 */
export const MouseoverDropdowns: Story = {
  args: { ariaLabel: 'CarbideUI' },
  render: (args) => ({
    props: args,
    template: `
      <div ${PAGE_WRAP}>
        <ngcc-header [ariaLabel]="ariaLabel">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>

          <ngcc-header-navigation ariaLabel="CarbideUI">
            <ngcc-header-item href="/" [isCurrentPage]="true">Dashboard</ngcc-header-item>

            <ngcc-header-menu title="Catalog" trigger="mouseover">
              <ngcc-header-menu-item href="/catalog/services">Services</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/catalog/products">Products</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/catalog/solutions">Solutions</ngcc-header-menu-item>
            </ngcc-header-menu>

            <ngcc-header-menu title="Platform" trigger="mouseover">
              <ngcc-header-menu-item href="/platform/overview">Overview</ngcc-header-menu-item>
              <ngcc-header-menu-item href="/platform/billing">Billing</ngcc-header-menu-item>
            </ngcc-header-menu>
          </ngcc-header-navigation>
        </ngcc-header>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">Hover the nav items to open dropdowns</p>
        </main>
      </div>
    `,
  }),
};

// ─── 8. Fire-and-forget Action ────────────────────────────────────────────────

/**
 * Action button with \`[toggleable]="false"\` — fires a one-shot event without toggling state.
 * The \`iconName="add"\` prop is used for a quick-add action.
 */
export const FireAndForgetAction: Story = {
  args: { ariaLabel: 'CarbideUI' },
  render: (args) => ({
    props: { ...args, lastAction: 'none' },
    template: `
      <div ${PAGE_WRAP}>
        <ngcc-header [ariaLabel]="ariaLabel">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>

          <ngcc-header-global>
            <!-- toggleable (default) — retains active state -->
            <ngcc-header-action [ariaLabel]="'header.notifications' | ngccI18n" iconName="notification" />

            <!-- fire-and-forget — no active state retained -->
            <ngcc-header-action
              [ariaLabel]="'header.quickAdd' | ngccI18n"
              iconName="add"
              [toggleable]="false"
              (actionClick)="lastAction = 'quick-add'" />
          </ngcc-header-global>
        </ngcc-header>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">
            Last fire-and-forget action: {{ lastAction }}
          </p>
        </main>
      </div>
    `,
  }),
};

// ─── 9. No Skip Link ─────────────────────────────────────────────────────────

/** Pass \`skipTo=""\` to disable the skip-to-content link entirely. */
export const NoSkipLink: Story = {
  args: { ariaLabel: 'CarbideUI', skipTo: '' },
  render: (args) => ({
    props: args,
    template: `
      <div ${PAGE_WRAP}>
        <ngcc-header [ariaLabel]="ariaLabel" [skipTo]="skipTo">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>
          <ngcc-header-navigation ariaLabel="CarbideUI">
            <ngcc-header-item href="/">Home</ngcc-header-item>
            <ngcc-header-item href="/about">About</ngcc-header-item>
          </ngcc-header-navigation>
        </ngcc-header>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">skipTo is empty — no skip link rendered</p>
        </main>
      </div>
    `,
  }),
};

// ─── 10. With Dropdown Panel ──────────────────────────────────────────────────

/**
 * Dedicated story showing \`NgccDropdown\` inside a header panel.
 * Click the settings button to open a preferences panel with a region picker.
 */
export const WithDropdownPanel: Story = {
  args: { ariaLabel: 'CarbideUI' },
  render: (args) => ({
    props: {
      ...args,
      settingsOpen: false,
      regionItems: [
        { label: 'Americas — US East', value: 'us-east' },
        { label: 'Americas — US South', value: 'us-south' },
        { label: 'Europe — Frankfurt', value: 'eu-de' },
        { label: 'Europe — London', value: 'eu-gb' },
        { label: 'Asia Pacific — Tokyo', value: 'jp-tok' },
        { label: 'Asia Pacific — Sydney', value: 'au-syd' },
      ],
    },
    template: `
      <div ${PAGE_WRAP_TALL}>
        <ngcc-header [ariaLabel]="ariaLabel">
          <ngcc-header-name productName="[Platform]" href="/"></ngcc-header-name>

          <ngcc-header-global>
            <ngcc-header-action [ariaLabel]="'header.settings' | ngccI18n" [(active)]="settingsOpen" iconName="configuration" />
          </ngcc-header-global>
        </ngcc-header>

        <!-- Preferences panel with NgccDropdown region picker -->
        <ngcc-header-panel [expanded]="settingsOpen" [ariaLabel]="'header.settings' | ngccI18n">
          <div style="padding:1.5rem;display:flex;flex-direction:column;gap:1.25rem;">
            <p style="color:var(--cds-text-primary);font-weight:600;margin:0;">
              {{ 'header.settings' | ngccI18n }}
            </p>

            <ngcc-dropdown
              [label]="'header.region' | ngccI18n"
              [items]="regionItems"
              placeholder="Select region…"
              size="md">
            </ngcc-dropdown>

            <ngcc-dropdown
              label="Theme"
              [items]="[
                { label: 'White', value: 'white' },
                { label: 'Gray 10', value: 'g10' },
                { label: 'Gray 90', value: 'g90' },
                { label: 'Gray 100', value: 'g100' }
              ]"
              placeholder="Select theme…"
              size="md">
            </ngcc-dropdown>
          </div>
        </ngcc-header-panel>

        <main id="main-content" style="padding:2rem;">
          <p style="color:var(--cds-text-primary)">
            Settings panel: {{ settingsOpen ? 'Open' : 'Closed' }}
          </p>
        </main>
      </div>
    `,
  }),
};
