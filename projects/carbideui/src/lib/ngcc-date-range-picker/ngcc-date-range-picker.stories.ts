import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccDateRangePicker, ngccResolveDatePreset } from './ngcc-date-range-picker';

const meta: Meta<NgccDateRangePicker> = {
  title: 'Components/Date Range Picker',
  component: NgccDateRangePicker,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccDateRangePicker] })],
};
export default meta;
type Story = StoryObj<NgccDateRangePicker>;

export const Default: Story = {
  render: (args) => ({
    props: { ...args, range: ngccResolveDatePreset('last-30-days') },
    template: `
      <div style="max-width: 20rem">
        <ngcc-date-range-picker [(value)]="range" [label]="label" />
        <p style="margin-top: 1rem">
          {{ range.preset }}: {{ range.start?.toDateString() }} – {{ range.end?.toDateString() }}
        </p>
      </div>`,
  }),
  args: { label: 'Date range' },
};

export const Custom: Story = {
  render: () => ({
    props: { range: { start: null, end: null, preset: 'custom' } },
    template: `<div style="max-width: 24rem"><ngcc-date-range-picker [(value)]="range" /></div>`,
  }),
};

export const Empty: Story = {
  render: () => ({
    props: { range: { start: null, end: null, preset: '' } },
    template: `<div style="max-width: 20rem"><ngcc-date-range-picker [(value)]="range" /></div>`,
  }),
};
