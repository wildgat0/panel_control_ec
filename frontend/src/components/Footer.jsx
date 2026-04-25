export default function Footer({ showNav = true }) {
  return (
    <footer style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #10C048' }}>
      <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">

        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold tracking-widest" style={{ color: '#10C048' }}>
            SISCOETHOS
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Sistema de Control Ethos Corp.<br />
            Gestión centralizada de proyectos y servicios.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {showNav && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#10C048' }}>
                Navegación
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contenedores</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Usuarios</a></li>
              </ul>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#10C048' }}>
            Contacto
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span>📞</span> +56 9 9876 2197
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span> contacto@busconciertos.cl
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>Galería Paseo del Mar – Av. Valparaíso 554, local 96, Viña del Mar</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="px-6 py-2 text-center text-xs font-bold text-white" style={{ borderTop: '1px solid #1a1a1a' }}>
        © {new Date().getFullYear()} Ethos Corp. Todos los derechos reservados.
      </div>
    </footer>
  )
}
