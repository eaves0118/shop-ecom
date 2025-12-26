import RegisterPage from "@/components/pages/user/RegisterPage";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center w-full p-5 md:p-9">
      <div className="w-full max-w-sm md:max-w-md">
        <RegisterPage />
      </div>
    </div>
  );
}
