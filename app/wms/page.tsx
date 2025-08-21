import Header from "@/components/Header";
import ClientWrapper from "@/components/client-wrapper";
import React from "react";

const Wms = () => {
  return (
    <>
      <ClientWrapper>
        <div className="flex flex-col bg-gray-950 text-gray-100 min-h-screen">
          <Header />
          <section className="py-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="container mx-auto px-4 py-8 max-w-6xl">WMS</div>
            </div>
          </section>
        </div>
      </ClientWrapper>
    </>
  );
};

export default Wms;
