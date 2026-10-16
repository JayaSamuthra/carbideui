import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccFilterBar, NgccFilterField } from './ngcc-filter-bar';

const fields: NgccFilterField[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Running', value: 'running' },
      { label: 'Stopped', value: 'stopped' },
      { label: 'Failed', value: 'failed' },
    ],
  },
  {
    key: 'region',
    label: 'Region',
    options: [
      { label: 'US East', value: 'us-east' },
      { label: 'EU West', value: 'eu-west' },
    ],
  },
];

const meta: Meta<NgccFilterBar> = {
  title: 'Components/Filter Bar',
  component: NgccFilterBar,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccFilterBar] })],
  args: { fields, placeholder: 'Search or filter' },
};
export default meta;
type Story = StoryObj<NgccFilterBar>;

export const Default: Story = {
  render: (args) => ({
    props: { ...args, state: { query: '', filters: {} } },
    template: `
      <div style="max-width: 40rem">
        <ngcc-filter-bar [fields]="fields" [placeholder]="placeholder" [(value)]="state" />
        <pre style="margin-top: 1rem">{{ state | json }}</pre>
      </div>`,
  }),
};

export const Preselected: Story = {
  render: (args) => ({
    props: {
      ...args,
      state: { query: 'web', filters: { status: ['running'], region: ['us-east'] } },
    },
    template: `<div style="max-width: 40rem"><ngcc-filter-bar [fields]="fields" [(value)]="state" /></div>`,
  }),
};
