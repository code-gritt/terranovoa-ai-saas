import LoginForm from "@/components/auth/login-form";
import Image from "next/image";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="relative h-[50vh] w-full md:h-screen md:w-1/2">
        <Image
          src="/woman.jpg"
          alt="Form Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col gap-8 items-center justify-center w-full md:w-1/2 p-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
