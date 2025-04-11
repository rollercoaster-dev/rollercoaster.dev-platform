import type { Meta, StoryObj } from '@storybook/vue3';
import { UICard, UICardHeader, UICardTitle, UICardDescription, UICardContent, UICardFooter, UIButton } from '#components';

const meta: Meta<typeof UICard> = {
  title: 'UI/Card',
  component: UICard,
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: 'text',
      description: 'Additional classes to apply to the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof UICard>;

export const Default: Story = {
  render: () => ({
    components: { 
      UICard, 
      UICardHeader, 
      UICardTitle, 
      UICardDescription, 
      UICardContent, 
      UICardFooter 
    },
    template: `
      <UICard class="w-[350px]">
        <UICardHeader>
          <UICardTitle>Card Title</UICardTitle>
          <UICardDescription>Card Description</UICardDescription>
        </UICardHeader>
        <UICardContent>
          <p>Card Content</p>
        </UICardContent>
        <UICardFooter>
          <p>Card Footer</p>
        </UICardFooter>
      </UICard>
    `,
  }),
};

export const SimpleCard: Story = {
  render: () => ({
    components: { UICard, UICardContent },
    template: `
      <UICard class="w-[350px]">
        <UICardContent>
          <p>This is a simple card with only content.</p>
        </UICardContent>
      </UICard>
    `,
  }),
};

export const WithFooterActions: Story = {
  render: () => ({
    components: { 
      UICard, 
      UICardHeader, 
      UICardTitle, 
      UICardDescription, 
      UICardContent, 
      UICardFooter,
      UIButton
    },
    template: `
      <UICard class="w-[350px]">
        <UICardHeader>
          <UICardTitle>Newsletter</UICardTitle>
          <UICardDescription>Get updates on our latest features and releases.</UICardDescription>
        </UICardHeader>
        <UICardContent>
          <p>Subscribe to our newsletter to receive updates on new features, bug fixes, and more.</p>
        </UICardContent>
        <UICardFooter class="flex justify-between">
          <UIButton variant="ghost">Cancel</UIButton>
          <UIButton>Subscribe</UIButton>
        </UICardFooter>
      </UICard>
    `,
  }),
};

export const CustomStyling: Story = {
  render: () => ({
    components: { 
      UICard, 
      UICardHeader, 
      UICardTitle, 
      UICardContent
    },
    template: `
      <UICard class="w-[350px] border-primary/50 bg-primary/5">
        <UICardHeader>
          <UICardTitle class="text-primary">Custom Styled Card</UICardTitle>
        </UICardHeader>
        <UICardContent>
          <p>This card has custom styling applied to it.</p>
        </UICardContent>
      </UICard>
    `,
  }),
};
