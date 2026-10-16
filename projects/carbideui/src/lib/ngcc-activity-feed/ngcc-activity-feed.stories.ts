import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccActivityFeed, NgccActivityItem } from './ngcc-activity-feed';

const items: NgccActivityItem[] = [
  { id: 1, actor: 'Ann', title: 'deployed vm-web-01', status: 'success', timestamp: '2 min ago' },
  {
    id: 2,
    title: 'Backup job failed',
    description: 'Disk quota exceeded',
    status: 'error',
    timestamp: '1 hour ago',
  },
  { id: 3, actor: 'Raj', title: 'resized volume data-02', status: 'info', timestamp: 'Yesterday' },
  { id: 4, title: 'Certificate expires in 7 days', status: 'warning', timestamp: '2 days ago' },
];

const meta: Meta<NgccActivityFeed> = {
  title: 'Components/Activity Feed',
  component: NgccActivityFeed,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccActivityFeed] })],
  argTypes: { variant: { control: 'select', options: ['feed', 'timeline'] } },
  args: { items, variant: 'feed' },
};
export default meta;
type Story = StoryObj<NgccActivityFeed>;

export const Feed: Story = {};
export const Timeline: Story = { args: { variant: 'timeline' } };
export const Empty: Story = { args: { items: [] } };
