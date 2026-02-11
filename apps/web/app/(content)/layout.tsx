import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { QueryProvider } from "@/shared/lib/providers";
import { MapboxProvider } from "@/shared/lib/mapbox";
import { MapLayoutClient } from "@/widgets/map-layout";
import { ENV } from "@/shared/config/env";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <MapboxProvider
        supabaseUrl={ENV.SUPABASE_URL}
        accessToken={ENV.MAPBOX_ACCESS_TOKEN}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <MapLayoutClient>{children}</MapLayoutClient>
          </main>
          <Footer />
        </div>
      </MapboxProvider>
    </QueryProvider>
  );
}
