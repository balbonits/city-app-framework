import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-xl font-semibold">Card title</h3>
        <p className="mt-2 text-sm text-fg-muted">
          Cards group related content. Avoid double-nesting them — group via whitespace instead.
        </p>
      </div>
    ),
  },
};

export const Raised: Story = {
  args: {
    raised: true,
    children: (
      <div>
        <h3 className="text-xl font-semibold">Raised surface</h3>
        <p className="mt-2 text-sm text-fg-muted">
          Use raised cards to elevate above the default surface — popovers, modals, drawer sheets.
        </p>
      </div>
    ),
  },
};
