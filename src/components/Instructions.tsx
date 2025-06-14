import React from 'react';

export function Instructions() {
  return (
    <div className="mt-8 bg-blue-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        Proceso paso a paso:
      </h3>
      <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
        <div className="space-y-2">
          <p><strong>1. Subir PDF:</strong> Selecciona el documento que deseas firmar</p>
          <p><strong>2. Ingresar datos:</strong> Escribe tu nombre y apellido correctamente</p>
          <p><strong>3. Generar firma:</strong> Visualiza y regenera hasta que te guste</p>
        </div>
        <div className="space-y-2">
          <p><strong>4. Procesamiento:</strong> La firma se inserta automáticamente</p>
          <p><strong>5. Descargar:</strong> Obtén tu PDF firmado digitalmente</p>
        </div>
      </div>
    </div>
  );
}