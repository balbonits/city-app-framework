import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'UI/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Neutral: Story = { args: { children: 'Neutral' } };
export const Success: Story = { args: { tone: 'success', children: 'Deployed' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Failed' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Pending' } };
export const InfoStory: Story = { args: { tone: 'info', children: 'New' } };

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip>Neutral</Chip>
      <Chip tone="success">
        <CheckCircle2 size={12} aria-hidden /> Deployed
      </Chip>
      <Chip tone="danger">
        <AlertCircle size={12} aria-hidden /> Failed
      </Chip>
      <Chip tone="warning">
        <AlertTriangle size={12} aria-hidden /> Pending
      </Chip>
      <Chip tone="info">
        <Info size={12} aria-hidden /> New
      </Chip>
    </div>
  ),
};
