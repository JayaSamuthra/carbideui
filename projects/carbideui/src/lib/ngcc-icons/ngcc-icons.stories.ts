import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { NgccIcon } from './ngcc-icon';
import * as categorySets from './categories';
import { ICONS, NgccIconNameType } from './icons';

interface IconGroup {
  title: string;
  names: string[];
}

const CATEGORY_TITLES: Record<string, string> = {
  cloudInfrastructureIcons: 'Cloud infrastructure',
  computeIcons: 'Compute & virtual machines',
  networkingIcons: 'Networking & connectivity',
  storageIcons: 'Storage management',
  kubernetesIcons: 'Kubernetes & containers',
  securityIcons: 'Security & access management',
  monitoringIcons: 'Monitoring & observability',
  billingIcons: 'Billing & cost management',
  operationsIcons: 'Cloud operations & automation',
  commonUiIcons: 'Common UI',
};

/** Story-only placement of the original icons into the category groups; anything unlisted goes to Common UI. */
const CORE_PLACEMENT: Record<string, string[]> = {
  'Cloud infrastructure': ['cloud', 'server', 'globe', 'location'],
  'Compute & virtual machines': ['cpu', 'memory', 'services', 'launch'],
  'Networking & connectivity': ['network', 'link'],
  'Storage management': ['disk', 'document', 'save'],
  'Security & access management': [
    'lock',
    'unlock',
    'user',
    'user_multi',
    'user_avatar',
    'user_admin',
    'customer',
    'sign_out',
  ],
  'Monitoring & observability': [
    'activity',
    'notification',
    'reports',
    'information',
    'info_filled',
    'warn',
    'warning_filled',
    'error',
    'error_filled',
    'success_filled',
  ],
  'Billing & cost management': ['billing', 'license', 'marketplace', 'tag'],
  'Cloud operations & automation': [
    'configuration',
    'settings_adjust',
    'renew',
    'refresh',
    'export',
    'upload',
    'download',
  ],
};

function buildGroups(): IconGroup[] {
  const sets = categorySets as Record<string, Record<string, unknown>>;
  const placed = new Set<string>();
  const groups: IconGroup[] = Object.keys(CATEGORY_TITLES).map((key) => {
    const title = CATEGORY_TITLES[key];
    const core = (CORE_PLACEMENT[title] ?? []).filter((n) => n in ICONS);
    core.forEach((n) => placed.add(n));
    return { title, names: [...Object.keys(sets[key]), ...core].sort() };
  });
  const categorized = new Set(groups.flatMap((g) => g.names));
  const rest = Object.keys(ICONS).filter((n) => !categorized.has(n) && !placed.has(n));
  const common = groups.find((g) => g.title === 'Common UI');
  common?.names.push(...rest);
  common?.names.sort();
  return groups;
}

@Component({
  selector: 'ngcc-icon-browser',
  standalone: true,
  imports: [NgccIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem">
      <input
        type="search"
        class="cds--text-input"
        style="max-width:24rem"
        placeholder="Search icons (name or category)"
        aria-label="Search icons"
        [value]="query()"
        (input)="query.set($any($event.target).value)"
      />
      <select
        class="cds--select-input"
        style="max-width:18rem"
        aria-label="Filter by category"
        (change)="category.set($any($event.target).value)"
      >
        <option value="">All categories</option>
        @for (g of groups; track g.title) {
          <option [value]="g.title">{{ g.title }} ({{ g.names.length }})</option>
        }
      </select>
      <span style="font-size:0.875rem">{{ total() }} icons</span>
    </div>
    @for (g of filtered(); track g.title) {
      <section style="margin-bottom:2rem">
        <h3 style="margin:0 0 0.75rem">
          {{ g.title }} <small>({{ g.names.length }})</small>
        </h3>
        <div
          style="display:grid;grid-template-columns:repeat(auto-fill,minmax(8rem,1fr));gap:0.75rem"
        >
          @for (name of g.names; track name) {
            <div
              style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:1rem;border:1px solid var(--cds-border-subtle, #e0e0e0)"
            >
              <ngcc-icon [name]="$any(name)" size="lg" [decorative]="true"></ngcc-icon>
              <code style="font-size:0.75rem;word-break:break-all;text-align:center">{{
                name
              }}</code>
            </div>
          }
        </div>
      </section>
    } @empty {
      <p>No icons match "{{ query() }}".</p>
    }
  `,
})
class IconBrowser {
  readonly groups = buildGroups();
  readonly query = signal('');
  readonly category = signal('');
  readonly filtered = computed<IconGroup[]>(() => {
    const q = this.query()
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_');
    const cat = this.category();
    return this.groups
      .filter((g) => !cat || g.title === cat)
      .map((g) => ({
        title: g.title,
        names:
          q && !g.title.toLowerCase().includes(q.replace(/_/g, ' '))
            ? g.names.filter((n) => n.includes(q))
            : g.names,
      }))
      .filter((g) => g.names.length > 0);
  });
  readonly total = computed(() => this.filtered().reduce((n, g) => n + g.names.length, 0));
}

const meta: Meta<NgccIcon> = {
  decorators: [moduleMetadata({ imports: [IconBrowser] })],
  title: 'Components/Icon',
  component: NgccIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: Object.keys(ICONS) as NgccIconNameType[],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 2, 3, 4], // presets + numbers
    },
    color: { control: 'color' },
    ariaLabel: { control: 'text' },
    decorative: { control: 'boolean' },
    svgClass: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<NgccIcon>;

export const Default: Story = {
  args: {
    name: 'add',
    size: 'md',
    color: 'currentColor',
    ariaLabel: 'Add',
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <ngcc-icon name="add" size="sm"></ngcc-icon>
        <ngcc-icon name="add" size="md"></ngcc-icon>
        <ngcc-icon name="add" size="lg"></ngcc-icon>
        <ngcc-icon name="add" size="xl"></ngcc-icon>
        <ngcc-icon name="add" [size]="2"></ngcc-icon>
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <ngcc-icon name="add" size="lg" color="red"></ngcc-icon>
        <ngcc-icon name="add" size="lg" color="green"></ngcc-icon>
        <ngcc-icon name="add" size="lg" color="blue"></ngcc-icon>
        <ngcc-icon name="add" size="lg" color="#ff9900"></ngcc-icon>
      </div>
    `,
  }),
};

export const Decorative: Story = {
  args: {
    name: 'close',
    size: 'lg',
    decorative: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    name: 'edit',
    svgClass: 'custom-class',
  },
};

/** Searchable gallery grouped by category. Search matches icon names and category titles. */
export const AllIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({ template: `<ngcc-icon-browser></ngcc-icon-browser>` }),
};
