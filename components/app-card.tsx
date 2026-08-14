"use client";

import Image from "next/image";
import Link from "next/link";
import { App } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download } from "lucide-react";

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <div className="h-full cursor-pointer">
      <Link href={app.url} passHref>
        <Card className="h-full flex flex-col overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
          <CardHeader className="p-0 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
                src={app.icon}
                alt={app.name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Badge variant={app.condition === "Pago" ? "default" : "secondary"} className="shadow-sm">
                {app.condition}
              </Badge>
              {app.featured && (
                <Badge variant="default" className="shadow-sm bg-primary">
                  Destacado
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-5">
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{app.category}</p>
              <h3 className="font-semibold text-lg line-clamp-1 mt-1 group-hover:text-primary transition-colors">{app.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{app.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{app.rating}</span>
                <span>·</span>
                <Download className="w-4 h-4" />
                <span>{app.downloads}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {app.packageName.split(".").pop()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
