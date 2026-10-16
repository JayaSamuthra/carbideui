import type { Meta, StoryObj } from '@storybook/angular';
import { NgccProgressBar } from './ngcc-progress-bar';

const meta: Meta<NgccProgressBar> = {
  title: 'Components/Progress Bar',
  component: NgccProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'select', options: ['big', 'small'] },
  },
  args: {
    value: 40,
    label: 'CPU usage',
    helperText: '4 of 10 vCPU in use',
    warningThreshold: 75,
    criticalThreshold: 90,
  },
};
export default meta;
type Story = StoryObj<NgccProgressBar>;

export const Default: Story = {};

export const Thresholds: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 1.5rem; max-width: 30rem;">
        <ngcc-progress-bar [value]="40" label="Normal" />
        <ngcc-progress-bar [value]="80" label="Warning (>= 75%)" />
        <ngcc-progress-bar [value]="95" label="Critical (>= 90%)" />
      </div>`,
  }),
};

export const TaskProgress: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 1.5rem; max-width: 30rem;">
        <ngcc-progress-bar [value]="95" label="Uploading" [finishAtMax]="true" />
        <ngcc-progress-bar [value]="100" label="Upload complete" [finishAtMax]="true" />
      </div>`,
  }),
};

export const Small: Story = { args: { size: 'small', value: 60 } };
