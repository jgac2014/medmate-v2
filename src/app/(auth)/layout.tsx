export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center">
      {children}
    </div>
  );
}
