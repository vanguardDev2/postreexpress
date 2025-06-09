"use server";
import FiltersPanel from "@/components/filters-panel";
import Header from "@/components/header";
import PostresList from "@/components/postres-list";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { getPostres } from "./actions/actions";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const postres = await getPostres(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4">
            <FiltersPanel />
          </div>

          <div className="w-full md:w-3/4">
            <h2 className="text-2xl font-bold text-gray-800">
              Bienvenido, {session?.user?.name || "Invitado"}!
            </h2>

            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Nuestros Postres
            </h3>
            <Suspense fallback={<p>Cargando postres...</p>}>
              <PostresList postres={postres} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
