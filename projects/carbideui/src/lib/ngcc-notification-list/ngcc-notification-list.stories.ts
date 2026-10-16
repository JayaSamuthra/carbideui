import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccNotificationList, NgccNotificationItem } from './ngcc-notification-list';

const items: NgccNotificationItem[] = [
  {
    id: 1,
    title: 'Instance stopped',
    message: 'vm-web-01 stopped unexpectedly',
    severity: 'error',
    timestamp: '5 min ago',
  },
  { id: 2, title: 'Backup complete', severity: 'success', timestamp: '1 hour ago' },
  {
    id: 3,
    title: 'Maintenance window',
    message: 'Sunday 02:00 UTC',
    severity: 'info',
    read: true,
    timestamp: 'Yesterday',
  },
];

const meta: Meta<NgccNotificationList> = {
  title: 'Components/Notification List',
  component: NgccNotificationList,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccNotificationList] })],
  args: { items },
};
export default meta;
type Story = StoryObj<NgccNotificationList>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      markAll() {
        this['items'] = (this['items'] as NgccNotificationItem[]).map((i) => ({
          ...i,
          read: true,
        }));
      },
      clearAll() {
        this['items'] = [];
      },
    },
    template: `
      <div style="width: 20rem; background: var(--cds-layer-01);">
        <ngcc-notification-list [items]="items" (markAllRead)="markAll()" (clear)="clearAll()" />
      </div>`,
  }),
};
export const Empty: Story = { args: { items: [] } };
