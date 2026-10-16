import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccOverflowMenu, NgccOverflowMenuItem } from './ngcc-overflow-menu';

const items: NgccOverflowMenuItem[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'clone', label: 'Clone' },
  { id: 'share', label: 'Share', disabled: true },
  { id: 'delete', label: 'Delete', danger: true, divider: true },
];

const meta: Meta<NgccOverflowMenu> = {
  title: 'Components/Overflow Menu',
  component: NgccOverflowMenu,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccOverflowMenu] })],
  argTypes: {
    align: { control: 'select', options: ['start', 'end'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
  args: { items, align: 'end', size: 'md', orientation: 'vertical', disabled: false },
};
export default meta;
type Story = StoryObj<NgccOverflowMenu>;

export const Default: Story = {
  render: (args) => ({
    props: { ...args, last: '' },
    template: `
      <div style="display: flex; gap: 1rem; align-items: center; justify-content: flex-end; max-width: 24rem">
        <span>Last action: {{ last || 'none' }}</span>
        <ngcc-overflow-menu [items]="items" [align]="align" [size]="size"
          [orientation]="orientation" [disabled]="disabled" (itemSelected)="last = $event.label" />
      </div>`,
  }),
};

export const InTableRow: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="overflow: hidden; max-width: 28rem; border: 1px solid var(--cds-border-subtle)">
        <table style="width: 100%; border-collapse: collapse">
          @for (name of ['vm-web-01', 'vm-db-01']; track name) {
            <tr>
              <td style="padding: 0.5rem 1rem">{{ name }}</td>
              <td style="text-align: end"><ngcc-overflow-menu [items]="items" ariaLabel="Actions for {{ name }}" /></td>
            </tr>
          }
        </table>
      </div>`,
  }),
};
