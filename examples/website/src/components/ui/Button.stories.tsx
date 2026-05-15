import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: 'View on GitHub' },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <Github size={16} aria-hidden />
        View on GitHub
        <ArrowRight size={16} aria-hidden />
      </>
    ),
  },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          <span className="w-20 font-mono text-sm text-fg-muted">{variant}</span>
          <Button variant={variant}>Default</Button>
          <Button variant={variant} loading>
            Loading
          </Button>
          <Button variant={variant} disabled>
            Disabled
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
