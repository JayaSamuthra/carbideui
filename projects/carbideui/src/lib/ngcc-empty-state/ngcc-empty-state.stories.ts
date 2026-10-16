import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccEmptyState } from './ngcc-empty-state';
import { NgccButton } from '../ngcc-button/ngcc-button';

const meta: Meta<NgccEmptyState> = {
  title: 'Components/Empty State',
  component: NgccEmptyState,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccEmptyState, NgccButton] })],
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
};
export default meta;
type Story = StoryObj<NgccEmptyState>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ngcc-empty-state [title]="title" [description]="description" [icon]="icon" [size]="size">
        <ngcc-button ngccEmptyAction label="Create instance" />
      </ngcc-empty-state>`,
  }),
  args: {
    title: 'No instances yet',
    description: 'Create your first instance to get started.',
    icon: 'search',
    size: 'md',
  },
};

export const NoAction: Story = {
  args: { title: 'No results', description: 'Try adjusting your filters.', size: 'sm' },
};
