"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-surface-lowest flex items-center justify-center">
      <div className="bg-surface-low border border-outline-variant rounded-lg p-8 max-w-md text-center">
        <h2 className="text-[14px] text-on-surface font-semibold mb-2">Algo deu errado</h2>
        <p className="text-xs text-on-surface-variant mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-black rounded-[5px] text-[12px] font-bold cursor-pointer hover:bg-primary-hover"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
