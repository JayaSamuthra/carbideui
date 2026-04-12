import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NgccSideNav } from './ngcc-side-nav';
import { NgccSideNavItem } from './ngcc-side-nav-item';
import { NgccSideNavMenu } from './ngcc-side-nav-menu';
import { NgccSideNavMenuItem } from './ngcc-side-nav-menu-item';
import { NgccSideNavDivider } from './ngcc-side-nav-divider';

// ─── Storybook wrapper class ─────────────────────────────────────────────────

class SideNavWrapper {
  ariaLabel = 'Side navigation';
  expanded = true;
  allowExpansion = false;
  rail = false;
  hidden = false;
  currentPage = '/dashboard';
}

// ─── Shared imports ──────────────────────────────────────────────────────────

const withSideNavModules = moduleMetadata({
  imports: [NgccSideNav, NgccSideNavItem, NgccSideNavMenu, NgccSideNavMenuItem, NgccSideNavDivider],
});

// ─── Layout helpers ───────────────────────────────────────────────────────────

/**
 * Side nav uses position:fixed — wrap in a relative container with enough
 * height so the panel is visible in the canvas.
 */
const SHELL_WRAP = `
  style="position:relative;min-height:480px;background:var(--cds-background,#f4f4f4);"
`;

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<SideNavWrapper> = {
  title: 'UI Shell/Side Navigation',
  component: SideNavWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Carbon Design System Side Navigation shell built with Angular v20+ signal APIs.

## Composition

| Selector | Purpose |
|---|---|
| \`<ngcc-side-nav>\` | Root \`<nav>\` — fixed left panel with expand/collapse |
| \`<ngcc-side-nav-item>\` | Single navigable link (optional icon) |
| \`<ngcc-side-nav-menu>\` | Collapsible submenu with nested items |
| \`<ngcc-side-nav-menu-item>\` | Link nested inside a submenu |
| \`<ngcc-side-nav-divider>\` | Visual separator between groups |

## Basic usage

\`\`\`html
<ngcc-side-nav ariaLabel="App navigation" [(expanded)]="sideNavOpen">
  <ngcc-side-nav-item href="/" iconName="home" [active]="true">Home</ngcc-side-nav-item>

  <ngcc-side-nav-menu title="Settings" iconName="configuration">
    <ngcc-side-nav-menu-item href="/settings/profile">Profile</ngcc-side-nav-menu-item>
    <ngcc-side-nav-menu-item href="/settings/security">Security</ngcc-side-nav-menu-item>
  </ngcc-side-nav-menu>

  <ngcc-side-nav-divider />
  <ngcc-side-nav-item href="/help">Help</ngcc-side-nav-item>
</ngcc-side-nav>
\`\`\`

## Expand / collapse toggle

Add \`[allowExpansion]="true"\` to render the expand/collapse button in the footer.
Bind \`[(expanded)]="sideNavOpen"\` for two-way control.

## Rail mode

Use \`[rail]="true"\` for the compact icon-only variant. All items should have \`iconName\`.

## Active state

Set \`[active]="true"\` on \`<ngcc-side-nav-item>\` or \`<ngcc-side-nav-menu-item>\`.
\`NgccSideNavMenu\` automatically adds \`cds--side-nav__item--active\` when any child is active.
        `,
      },
    },
  },
  decorators: [withSideNavModules],
  argTypes: {
    ariaLabel: { control: 'text', description: 'Accessible label for the navigation landmark' },
    expanded: { control: 'boolean', description: 'Expanded/collapsed state' },
    allowExpansion: { control: 'boolean', description: 'Show expand/collapse toggle in footer' },
    rail: { control: 'boolean', description: 'Rail (icon-only) mode' },
    hidden: { control: 'boolean', description: 'Hide the side nav' },
  },
};

export default meta;
type Story = StoryObj<SideNavWrapper>;

// ─── 1. Basic ─────────────────────────────────────────────────────────────────

/** Side nav with plain text links — no icons, no submenus. */
export const Basic: Story = {
  args: { ariaLabel: 'Side navigation', expanded: true },
  render: (args) => ({
    props: { ...args, currentPage: '/dashboard' },
    template: `
      <div ${SHELL_WRAP}>
        <ngcc-side-nav
          [ariaLabel]="ariaLabel"
          [(expanded)]="expanded"
        >
          <ngcc-side-nav-item href="/dashboard" [active]="currentPage === '/dashboard'">Dashboard</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/analytics" [active]="currentPage === '/analytics'">Analytics</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/reports" [active]="currentPage === '/reports'">Reports</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/settings" [active]="currentPage === '/settings'">Settings</ngcc-side-nav-item>
        </ngcc-side-nav>
      </div>
    `,
  }),
};

// ─── 2. With Icons ────────────────────────────────────────────────────────────

/** Items with icons beside the link text. */
export const WithIcons: Story = {
  args: { ariaLabel: 'Side navigation', expanded: true },
  render: (args) => ({
    props: { ...args, currentPage: '/dashboard' },
    template: `
      <div ${SHELL_WRAP}>
        <ngcc-side-nav
          [ariaLabel]="ariaLabel"
          [(expanded)]="expanded"
        >
          <ngcc-side-nav-item href="/dashboard" iconName="home" [active]="currentPage === '/dashboard'">
            Dashboard
          </ngcc-side-nav-item>
          <ngcc-side-nav-item href="/analytics" iconName="services">Analytics</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/notifications" iconName="notification">Notifications</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/users" iconName="user_multi">Users</ngcc-side-nav-item>
        </ngcc-side-nav>
      </div>
    `,
  }),
};

// ─── 3. With Submenus ─────────────────────────────────────────────────────────

/** Collapsible submenus — click a section title to expand/collapse its items. */
export const WithSubmenus: Story = {
  args: { ariaLabel: 'Side navigation', expanded: true },
  render: (args) => ({
    props: args,
    template: `
      <div ${SHELL_WRAP}>
        <ngcc-side-nav
          [ariaLabel]="ariaLabel"
          [(expanded)]="expanded"
        >
          <ngcc-side-nav-item href="/dashboard" iconName="home">Dashboard</ngcc-side-nav-item>

          <ngcc-side-nav-menu title="Compute" iconName="cpu" [expanded]="true">
            <ngcc-side-nav-menu-item href="/compute/instances">Instances</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/compute/images">Images</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/compute/volumes">Volumes</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>

          <ngcc-side-nav-menu title="Network" iconName="network">
            <ngcc-side-nav-menu-item href="/network/vpc">VPC</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/network/subnets">Subnets</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>

          <ngcc-side-nav-menu title="Storage" iconName="disk">
            <ngcc-side-nav-menu-item href="/storage/buckets">Buckets</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/storage/snapshots">Snapshots</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>
        </ngcc-side-nav>
      </div>
    `,
  }),
};

// ─── 4. With Active Item ──────────────────────────────────────────────────────

/** Active state on a nested menu item auto-activates the parent menu. */
export const WithActiveItem: Story = {
  args: { ariaLabel: 'Side navigation', expanded: true },
  render: (args) => ({
    props: args,
    template: `
      <div ${SHELL_WRAP}>
        <ngcc-side-nav
          [ariaLabel]="ariaLabel"
          [(expanded)]="expanded"
        >
          <ngcc-side-nav-item href="/dashboard" iconName="home">Dashboard</ngcc-side-nav-item>

          <ngcc-side-nav-menu title="Compute" iconName="cpu" [expanded]="true">
            <ngcc-side-nav-menu-item href="/compute/instances">Instances</ngcc-side-nav-menu-item>
            <!-- This item is active — parent menu li gains cds--side-nav__item--active -->
            <ngcc-side-nav-menu-item href="/compute/images" [active]="true">Images</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/compute/volumes">Volumes</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>

          <ngcc-side-nav-menu title="Network" iconName="network">
            <ngcc-side-nav-menu-item href="/network/vpc">VPC</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>
        </ngcc-side-nav>
      </div>
    `,
  }),
};

// ─── 5. With Divider ─────────────────────────────────────────────────────────

/** <ngcc-side-nav-divider /> separates groups of navigation items. */
export const WithDivider: Story = {
  args: { ariaLabel: 'Side navigation', expanded: true },
  render: (args) => ({
    props: args,
    template: `
      <div ${SHELL_WRAP}>
        <ngcc-side-nav
          [ariaLabel]="ariaLabel"
          [(expanded)]="expanded"
        >
          <ngcc-side-nav-item href="/dashboard" iconName="home" [active]="true">Dashboard</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/analytics" iconName="services">Analytics</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/users" iconName="user_multi">Users</ngcc-side-nav-item>

          <ngcc-side-nav-divider />

          <ngcc-side-nav-item href="/settings" iconName="configuration">Settings</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/help" iconName="information">Help</ngcc-side-nav-item>
        </ngcc-side-nav>
      </div>
    `,
  }),
};

// ─── 6. Expandable ───────────────────────────────────────────────────────────

/** Footer toggle button — click to collapse/expand. Uses `[(expanded)]` two-way binding. */
export const Expandable: Story = {
  args: { ariaLabel: 'Side navigation', expanded: true, allowExpansion: true },
  render: (args) => ({
    props: args,
    template: `
      <div ${SHELL_WRAP}>
        <ngcc-side-nav
          [ariaLabel]="ariaLabel"
          [(expanded)]="expanded"
          [allowExpansion]="allowExpansion"
        >
          <ngcc-side-nav-item href="/dashboard" iconName="home" [active]="true">Dashboard</ngcc-side-nav-item>

          <ngcc-side-nav-menu title="Compute" iconName="cpu" [expanded]="true">
            <ngcc-side-nav-menu-item href="/compute/instances">Instances</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/compute/images">Images</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>

          <ngcc-side-nav-item href="/settings" iconName="configuration">Settings</ngcc-side-nav-item>
        </ngcc-side-nav>
      </div>
    `,
  }),
};

// ─── 7. Full Example (with header) ────────────────────────────────────────────

/** Complete shell: hamburger-controlled side nav alongside the Carbon header. */
export const FullExample: Story = {
  args: { ariaLabel: 'Side navigation', expanded: false, allowExpansion: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="min-height:480px;background:var(--cds-background,#f4f4f4);">
        <ngcc-side-nav
          [ariaLabel]="ariaLabel"
          [(expanded)]="expanded"
          [allowExpansion]="allowExpansion"
        >
          <ngcc-side-nav-item href="/dashboard" iconName="home" [active]="true">Dashboard</ngcc-side-nav-item>

          <ngcc-side-nav-menu title="Compute" iconName="cpu" [expanded]="true">
            <ngcc-side-nav-menu-item href="/compute/instances">Instances</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/compute/images" [active]="false">Images</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/compute/volumes">Volumes</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>

          <ngcc-side-nav-menu title="Network" iconName="network">
            <ngcc-side-nav-menu-item href="/network/vpc">VPC</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/network/subnets">Subnets</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>

          <ngcc-side-nav-menu title="Storage" iconName="disk">
            <ngcc-side-nav-menu-item href="/storage/buckets">Buckets</ngcc-side-nav-menu-item>
            <ngcc-side-nav-menu-item href="/storage/snapshots">Snapshots</ngcc-side-nav-menu-item>
          </ngcc-side-nav-menu>

          <ngcc-side-nav-divider />

          <ngcc-side-nav-item href="/settings" iconName="configuration">Settings</ngcc-side-nav-item>
          <ngcc-side-nav-item href="/help" iconName="notification">Help &amp; Support</ngcc-side-nav-item>
        </ngcc-side-nav>

        <main style="padding:2rem;margin-left:16rem;">
          <p style="color:var(--cds-text-primary);font-size:0.875rem;">
            Expand state: <strong>{{ expanded }}</strong>
          </p>
          <button
            type="button"
            style="margin-top:1rem;padding:0.5rem 1rem;cursor:pointer;"
            (click)="expanded = !expanded"
          >
            Toggle side nav
          </button>
        </main>
      </div>
    `,
  }),
};
