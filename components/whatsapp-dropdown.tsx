"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { WhatsApp } from "@/components/icons";
import { cn } from "@/lib/utils";
import { branches } from "@/lib/data";

interface WhatsAppDropdownProps {
  message?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  children?: React.ReactNode;
  showIcon?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export function WhatsAppDropdown({
  message = "Hola, me gustaría recibir más información.",
  className,
  variant = "default",
  children,
  showIcon = true,
  side = "bottom",
  align = "end"
}: WhatsAppDropdownProps) {

  const handleWhatsApp = (number: string) => {
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant, className }),
          "gap-2 transition-all",
          variant === "default" && "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20",
          variant === "outline" && "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
        )}
      >
        {showIcon && <WhatsApp size={20} />}
        {children || "Contactar por WhatsApp"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Selecciona una sucursal</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {branches.map((branch) => (
            <DropdownMenuItem
              key={branch.id}
              className="cursor-pointer flex flex-col items-start gap-1 p-3"
              onClick={() => handleWhatsApp(branch.whatsappNumber)}
            >
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                {branch.name.replace('Sucursal ', '')}
              </div>
              <span className="text-xs text-muted-foreground ml-6">
                {branch.phone}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
