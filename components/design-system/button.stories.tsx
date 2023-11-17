import type { Meta, StoryObj } from "@storybook/react";

import Button from "./button";
import React from "react";

const meta: Meta<typeof Button> = {
  component: Button,
  decorators: [
    (Story) => (
      <div className="m-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    intent: "primary",
    children: "Button",
    size: "medium",
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    intent: "secondary",
  },
};

export const Danger: Story = {
  args: {
    ...Primary.args,
    intent: "danger",
  },
};

export const PrimaryOutline: Story = {
  args: {
    ...Primary.args,
    intent: "primary-outline",
  },
};
