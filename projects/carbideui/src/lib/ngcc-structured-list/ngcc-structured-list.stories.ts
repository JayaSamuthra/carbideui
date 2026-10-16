import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccStructuredList } from './ngcc-structured-list';

const meta: Meta<NgccStructuredList> = {
  title: 'Components/Structured List',
  component: NgccStructuredList,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccStructuredList] })],
  args: {
    condensed: false,
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'region', header: 'Region' },
      { key: 'size', header: 'Size' },
    ],
    rows: [
      { id: 1, name: 'vm-web-01', region: 'us-east', size: '4 vCPU' },
      { id: 2, name: 'vm-db-01', region: 'eu-west', size: '8 vCPU' },
    ],
  },
};
export default meta;
type Story = StoryObj<NgccStructuredList>;

export const Default: Story = {};
export const Condensed: Story = { args: { condensed: true } };
