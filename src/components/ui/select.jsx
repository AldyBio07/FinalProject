import React from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const SelectTriggerComponent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <Select.Trigger
      ref={ref}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <Select.Icon asChild>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </Select.Icon>
    </Select.Trigger>
  )
);
SelectTriggerComponent.displayName = "SelectTrigger";

const SelectScrollUpButtonComponent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectScrollUpButton
      ref={ref}
      className={`flex cursor-default items-center justify-center py-1 ${className}`}
      {...props}
    >
      <ChevronUp className="w-4 h-4" />
    </SelectScrollUpButton>
  )
);
SelectScrollUpButtonComponent.displayName = "SelectScrollUpButton";

const SelectScrollDownButtonComponent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectScrollDownButton
      ref={ref}
      className={`flex cursor-default items-center justify-center py-1 ${className}`}
      {...props}
    >
      <ChevronDown className="w-4 h-4" />
    </SelectScrollDownButton>
  )
);
SelectScrollDownButtonComponent.displayName = "SelectScrollDownButton";

const SelectContentComponent = React.forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => (
    <Portal>
      <SelectContent
        ref={ref}
        className={`relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${
          position === "popper"
            ? "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
            : ""
        } ${className}`}
        position={position}
        {...props}
      >
        <SelectScrollUpButtonComponent />
        <SelectViewport
          className={`p-1 ${
            position === "popper"
              ? "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
              : ""
          }`}
        >
          {children}
        </SelectViewport>
        <SelectScrollDownButtonComponent />
      </SelectContent>
    </Portal>
  )
);
SelectContentComponent.displayName = "SelectContent";

const SelectLabelComponent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectLabel
      ref={ref}
      className={`py-1.5 pl-8 pr-2 text-sm font-semibold ${className}`}
      {...props}
    />
  )
);
SelectLabelComponent.displayName = "SelectLabel";

const SelectItemComponent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectItem
      ref={ref}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl- 8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ItemIndicator>
          <Check className="w-4 h-4" />
        </ItemIndicator>
      </span>

      <ItemText>{children}</ItemText>
    </SelectItem>
  )
);
SelectItemComponent.displayName = "SelectItem";

const SelectSeparatorComponent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectSeparator
      ref={ref}
      className={`-mx-1 my-1 h-px bg-muted ${className}`}
      {...props}
    />
  )
);
SelectSeparatorComponent.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTriggerComponent as SelectTrigger,
  SelectContentComponent as SelectContent,
  SelectLabelComponent as SelectLabel,
  SelectItemComponent as SelectItem,
  SelectSeparatorComponent as SelectSeparator,
  SelectScrollUpButtonComponent as SelectScrollUpButton,
  SelectScrollDownButtonComponent as SelectScrollDownButton,
};
