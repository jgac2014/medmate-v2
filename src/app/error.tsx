"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center">
      <div className="bg-bg-1 border border-border-subtle rounded-lg p-8 max-w-md text-center">
        <h2 className="text-[14px] text-text-primary font-semibold mb-2">Algo deu errado</h2>
        <p className="text-xs text-text-secondary mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-accent text-black rounded-[5px] text-[12px] font-bold cursor-pointer hover:bg-accent-hover"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
