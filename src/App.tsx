import React, { useState, useEffect } from "react";

interface AlertProps {
  type?: "info" | "success" | "warn" | "error";
  message: string;
  onClose: () => void;
}

function Alert({ type = "info", message, onClose }: AlertProps) {
  if (!message) return null;

  const base = "p-3 rounded-md mb-4 shadow-sm flex items-start gap-3";
  const styles: Record<string, string> = {
    info: "bg-blue-50 text-blue-700",
    success: "bg-green-50 text-green-700",
    warn: "bg-yellow-50 text-yellow-800",
    error: "bg-red-50 text-red-800",
  };

  return (
    <div className={`${base} ${styles[type]}`}>
      <div className="flex-1 text-sm">{message}</div>
      <button
        onClick={onClose}
        className="text-sm font-semibold px-2 py-1 rounded hover:bg-white/20"
      >
        ✕
      </button>
    </div>
  );
}

export default function App() {
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem("contador");
    return saved ? Number(saved) : 0;
  });

  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });

  const [isBouncing, setIsBouncing] = useState(false);


  useEffect(() => {
    localStorage.setItem("contador", count.toString());
  }, [count]);

  useEffect(() => {
  if (count >= 0) {
    setIsBouncing(true);

    const timer = setTimeout(() => setIsBouncing(false), 250); // 0.25s = duración de tu animación
    return () => clearTimeout(timer);
  }
}, [count]);


  function showAlert(type: "info" | "success" | "warn" | "error", message: string, timeout = 2000) {
    setAlert({ type, message });
    if (timeout) setTimeout(() => setAlert({ type: "", message: "" }), timeout);
  }

  function incrementar() {
    setCount((c) => {
      const next = c + 1;
      showAlert("success", "✅ Contador incrementado");
      return next;
    });
  }

  function decrementar() {
    setCount((c) => {
      if (c <= 0) {
        showAlert("warn", "⚠️ No puedes bajar de 0");
        return c;
      }
      showAlert("info", "Contador decrementado");
      return c - 1;
    });
  }

  function reiniciar() {
    setCount(0);
    showAlert("success", "🔄 Contador reiniciado");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Contador de Clics
        </h1>

        <Alert
          type={alert.type as any}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">Numero actual del contador:</p>
            <p className={`text-6xl font-bold ${isBouncing ? "bounce-once" : ""}`}>
              {count}
            </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={decrementar}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            -1
          </button>

          <button
            onClick={incrementar}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
          >
            +1
          </button>

          <button
            onClick={reiniciar}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
          >
            Reiniciar contador
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          El contador no puede bajar de 0
        </p>
      </div>
    </div>
  );
}
