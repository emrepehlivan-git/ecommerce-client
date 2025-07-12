"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { useI18n } from "@/i18n/client";
import Link from "next/link";

interface HeroSectionProps extends React.ComponentProps<"section"> {
  primaryAction?: {
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    onClick?: () => void;
    href?: string;
  };
  showBadge?: boolean;
  backgroundImage?: string;
  variant?: "default" | "centered" | "split";
}

function HeroSection({
  className,
  primaryAction,
  secondaryAction,
  showBadge = false,
  backgroundImage,
  variant = "default",
  children,
  ...props
}: HeroSectionProps) {
  const t = useI18n();
  
  const renderActions = () => {
    if (!primaryAction && !secondaryAction) return null;

    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {primaryAction && (
          <Button
            size="lg"
            onClick={primaryAction.onClick}
            asChild={!!primaryAction.href}
          >
            {primaryAction.href ? (
              <Link href={primaryAction.href}>{t("hero.primaryAction")}</Link>
            ) : (
              t("hero.primaryAction")
            )}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="outline"
            size="lg"
            onClick={secondaryAction.onClick}
            asChild={!!secondaryAction.href}
          >
            {secondaryAction.href ? (
              <Link href={secondaryAction.href}>{t("hero.secondaryAction")}</Link>
            ) : (
              t("hero.secondaryAction")
            )}
          </Button>
        )}
      </div>
    );
  };

  const renderContent = () => (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
      {showBadge && (
        <Badge variant="default" className="mb-4">
          {t("hero.badge")}
        </Badge>
      )}
      
      <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
        {t("hero.subtitle")}
      </p>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
        {t("hero.title")}
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
        {t("hero.description")}
      </p>
      
      {renderActions()}
      
      {children}
    </div>
  );

  if (variant === "split") {
    return (
      <section
        className={cn(
          "relative min-h-screen flex items-center",
          backgroundImage && "bg-cover bg-center bg-no-repeat",
          className
        )}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        {...props}
      >
        {backgroundImage && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        )}
        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
          <div className="flex flex-col text-left max-w-none">
            {showBadge && (
              <Badge variant="default" className="mb-4 w-fit">
                {t("hero.badge")}
              </Badge>
            )}
            
            <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("hero.subtitle")}
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {t("hero.title")}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {t("hero.description")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryAction && (
                <Button
                  size="lg"
                  onClick={primaryAction.onClick}
                  asChild={!!primaryAction.href}
                >
                  {primaryAction.href ? (
                    <Link href={primaryAction.href}>{t("hero.primaryAction")}</Link>
                  ) : (
                    t("hero.primaryAction")
                  )}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={secondaryAction.onClick}
                  asChild={!!secondaryAction.href}
                >
                  {secondaryAction.href ? (
                    <Link href={secondaryAction.href}>{t("hero.secondaryAction")}</Link>
                  ) : (
                    t("hero.secondaryAction")
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {children && (
            <div className="lg:order-first">
              {children}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section
        className={cn(
          "relative min-h-screen flex items-center justify-center",
          backgroundImage && "bg-cover bg-center bg-no-repeat",
          className
        )}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        {...props}
      >
        {backgroundImage && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        )}
        <div className="container relative z-10 py-20">
          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur">
            <CardContent className="p-12">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center",
        backgroundImage && "bg-cover bg-center bg-no-repeat",
        className
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      {...props}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      )}
      <div className="container relative z-10 py-20">
        {renderContent()}
      </div>
    </section>
  );
}

export { HeroSection, type HeroSectionProps };