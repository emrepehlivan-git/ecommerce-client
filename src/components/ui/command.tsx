"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { 
  SearchIcon, 
  Loader2, 
  ChevronRight, 
  Filter,
  X,
  MoreHorizontal
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

function CommandLoading({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="command-loading"
      className={cn("flex items-center justify-center py-6", className)}
      {...props}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {children || "Loading..."}
      </div>
    </div>
  )
}

function CommandSkeleton({
  className,
  items = 3,
  ...props
}: React.ComponentProps<"div"> & {
  items?: number
}) {
  return (
    <div
      data-slot="command-skeleton"
      className={cn("p-1", className)}
      {...props}
    >
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-sm px-2 py-1.5 animate-pulse"
        >
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="h-4 flex-1 bg-muted rounded" />
          <div className="h-3 w-12 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}

function CommandHeader({
  className,
  title,
  subtitle,
  actions,
  filters,
  onClearFilters,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  filters?: string[]
  onClearFilters?: () => void
}) {
  return (
    <div
      data-slot="command-header"
      className={cn("border-b p-3 space-y-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h3 className="font-medium text-sm">{title}</h3>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-1">
            {actions}
          </div>
        )}
      </div>
      
      {filters && filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3 w-3 text-muted-foreground" />
          {filters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter}
            </Badge>
          ))}
          {onClearFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs"
              onClick={onClearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function CommandSubItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-sub-item"
      className={cn(
        "data-[selected=true]:bg-accent/50 data-[selected=true]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-6 py-1 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 ml-4 border-l-2 border-muted",
        className
      )}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  )
}

interface CommandItemProps extends React.ComponentProps<typeof CommandPrimitive.Item> {
  avatar?: string
  avatarFallback?: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  description?: string
  shortcut?: string
  hasSubItems?: boolean
  isLoading?: boolean
  metadata?: React.ReactNode
}

function CommandItemEnhanced({
  className,
  children,
  avatar,
  avatarFallback,
  badge,
  badgeVariant = "secondary",
  description,
  shortcut,
  hasSubItems,
  isLoading,
  metadata,
  ...props
}: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item-enhanced"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-default items-center gap-3 rounded-sm px-2 py-2 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    >
      {avatar && (
        <Avatar className="h-6 w-6">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="truncate">{children}</span>
          {badge && (
            <Badge variant={badgeVariant} className="text-xs">
              {badge}
            </Badge>
          )}
          {isLoading && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {metadata}
        {shortcut && (
          <CommandShortcut>{shortcut}</CommandShortcut>
        )}
        {hasSubItems && (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    </CommandPrimitive.Item>
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandLoading,
  CommandSkeleton,
  CommandHeader,
  CommandSubItem,
  CommandItemEnhanced,
}
