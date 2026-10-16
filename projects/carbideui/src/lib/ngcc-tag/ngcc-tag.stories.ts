import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccTag } from './ngcc-tag';

const types = [
  'red',
  'magenta',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
  'gray',
  'cool-gray',
  'warm-gray',
  'high-contrast',
  'outline',
];

const meta: Meta<NgccTag> = {
  title: 'Components/Tag',
  component: NgccTag,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccTag] })],
  argTypes: {
    type: { control: 'select', options: types },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<NgccTag>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ngcc-tag [type]="type" [size]="size" [dot]="dot" [dismissible]="dismissible" [disabled]="disabled">Label</ngcc-tag>`,
  }),
  args: { type: 'blue', size: 'md', dot: false, dismissible: false, disabled: false },
};

export const AllColors: Story = {
  render: () => ({
    props: { types },
    template: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">@for (t of types; track t) {<ngcc-tag [type]="t">{{ t }}</ngcc-tag>}</div>`,
  }),
};

export const StatusDots: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <ngcc-tag type="green" [dot]="true">Running</ngcc-tag>
        <ngcc-tag type="blue" [dot]="true">Pending</ngcc-tag>
        <ngcc-tag type="purple" [dot]="true">Degraded</ngcc-tag>
        <ngcc-tag type="red" [dot]="true">Failed</ngcc-tag>
        <ngcc-tag type="gray" [dot]="true">Stopped</ngcc-tag>
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `<div style="display: flex; gap: 0.5rem; align-items: center;"><ngcc-tag size="sm">Small</ngcc-tag><ngcc-tag>Medium</ngcc-tag><ngcc-tag size="lg">Large</ngcc-tag></div>`,
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `<ngcc-tag type="cyan" [dismissible]="true" (dismissed)="alert('dismissed')">Region: eu-west</ngcc-tag>`,
  }),
};
