import MultiStepForm from "@/components/auth/multi-step-form/multi-step-form";
import Image from "next/image";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="relative h-[50vh] w-full md:h-screen md:w-1/3">
        <Image
          src="/wind.jpg"
          alt="Form Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col gap-8 items-center justify-center w-full md:w-2/3 p-4">
        <MultiStepForm />
      </div>
    </div>
  );
};

export default page;
