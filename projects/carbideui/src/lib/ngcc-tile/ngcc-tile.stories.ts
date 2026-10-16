import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgccTile } from './ngcc-tile';
import { NgccTag } from '../ngcc-tag/ngcc-tag';

const meta: Meta<NgccTile> = {
  title: 'Components/Tile',
  component: NgccTile,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgccTile, NgccTag] })],
  args: { heading: 'Compute usage', clickable: false, light: false, disabled: false },
};
export default meta;
type Story = StoryObj<NgccTile>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ngcc-tile [heading]="heading" [light]="light">
        Body content goes here.
        <span ngccTileFooter>Updated 5 minutes ago</span>
      </ngcc-tile>`,
  }),
};

export const WithAction: Story = {
  render: () => ({
    template: `
      <ngcc-tile heading="Instance web-01">
        <ngcc-tag ngccTileAction type="green" [dot]="true">Running</ngcc-tag>
        4 vCPU · 16 GB RAM
        <a ngccTileFooter href="#">View details</a>
      </ngcc-tile>`,
  }),
};

export const Clickable: Story = {
  render: () => ({
    template: `<ngcc-tile heading="Open reports" [clickable]="true">Click anywhere on the tile.</ngcc-tile>`,
  }),
};

export const AsLink: Story = {
  render: () => ({
    template: `<ngcc-tile heading="Documentation" href="#docs">Renders as an anchor.</ngcc-tile>`,
  }),
};
