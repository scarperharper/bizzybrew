"use client";

import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
} from "react";
import { forwardRef } from "react";

const Drawer = DialogPrimitive.Root;

const DrawerTrigger = DialogPrimitive.Trigger;

const DrawerCloseButton = DialogPrimitive.Close;

const portalVariants = cva("fixed inset-0 z-50 flex", {
  variants: {
    position: {
      top: "items-start",
      bottom: "items-end",
      left: "justify-start",
      right: "justify-end",
    },
  },
  defaultVariants: { position: "right" },
});

interface DrawerPortalProps
  extends DialogPrimitive.DialogPortalProps,
    VariantProps<typeof portalVariants> {}

const DrawerPortal = ({ position, children, ...props }: DrawerPortalProps) => (
  <DialogPrimitive.Portal {...props}>
    <div className={portalVariants({ position })}>{children}</div>
  </DialogPrimitive.Portal>
);
DrawerPortal.displayName = DialogPrimitive.Portal.displayName;

const DrawerOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/10 backdrop-blur-sm  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DrawerBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col flex-1 items-start justify-start overflow-y-auto w-full px-6 py-4",
      className
    )}
    {...props}
  />
);
DrawerBody.displayName = "DrawerBody";

const sheetVariants = cva(
  "fixed flex flex-col z-50 scale-100 bg-card opacity-100 shadow-lg border border-border overflow-y-auto transition-all duration-100 focus-visible:outline-none focus-visible:ring-0",
  {
    variants: {
      position: {
        top: "animate-in slide-in-from-top w-full duration-300",
        bottom: "animate-in slide-in-from-bottom w-full duration-300",
        left: "animate-in slide-in-from-left h-full duration-300",
        right: "animate-in slide-in-from-right h-full duration-300",
      },
      size: {
        content: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    compoundVariants: [
      {
        position: ["top", "bottom"],
        size: "content",
        class: "max-h-screen",
      },
      {
        position: ["top", "bottom"],
        size: "md",
        class: "h-1/3",
      },
      {
        position: ["top", "bottom"],
        size: "sm",
        class: "h-1/4",
      },
      {
        position: ["top", "bottom"],
        size: "lg",
        class: "h-1/2",
      },
      {
        position: ["top", "bottom"],
        size: "xl",
        class: "h-5/6",
      },
      {
        position: ["top", "bottom"],
        size: "full",
        class: "h-screen",
      },
      {
        position: ["right", "left"],
        size: "content",
        class: "max-w-screen",
      },
      {
        position: ["right", "left"],
        size: "md",
        class: "w-1/3",
      },
      {
        position: ["right", "left"],
        size: "sm",
        class: "w-1/4",
      },
      {
        position: ["right", "left"],
        size: "lg",
        class: "w-1/2",
      },
      {
        position: ["right", "left"],
        size: "xl",
        class: "w-5/6",
      },
      {
        position: ["right", "left"],
        size: "full",
        class: "w-screen",
      },
    ],
    defaultVariants: {
      position: "right",
      size: "md",
    },
  }
);

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  overlay?: boolean;
  container?: HTMLElement;
}

const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      position,
      size,
      overlay = true,
      container,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <DrawerPortal position={position} container={container}>
      {overlay && <DrawerOverlay />}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ position, size }), className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            className="mr-2 h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DrawerPortal>
  )
);
DrawerContent.displayName = DialogPrimitive.Content.displayName;

const DrawerHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col flex-0 space-y-1 text-left px-6 py-4 border-b border-border",
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-0 sm:flex-row border-t border-border flex-col-reverse px-6 py-4 sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-foreground line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Title>
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

const DrawerDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
