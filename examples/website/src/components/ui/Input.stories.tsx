import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  args: { label: 'Email', placeholder: 'jane@example.com' },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "We'll never share it." },
};

export const WithLeadingIcon: Story = {
  args: { leadingIcon: <Mail size={16} aria-hidden /> },
};

export const Error: Story = {
  args: { defaultValue: 'not-an-email', error: 'Enter a valid email address.' },
};

export const Warning: Story = {
  args: { defaultValue: 'jane@example', warning: 'Did you mean jane@example.com?' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'jane@example.com' },
};

export const SearchField: Story = {
  args: {
    label: undefined,
    placeholder: 'Search the docs',
    leadingIcon: <Search size={16} aria-hidden />,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-5">
      <Input label="Default" placeholder="jane@example.com" />
      <Input label="With hint" placeholder="jane@example.com" hint="We'll never share it." />
      <Input label="Error" defaultValue="not-an-email" error="Enter a valid email address." />
      <Input
        label="Warning"
        defaultValue="jane@example"
        warning="Did you mean jane@example.com?"
      />
      <Input label="Disabled" defaultValue="jane@example.com" disabled />
    </div>
  ),
};
