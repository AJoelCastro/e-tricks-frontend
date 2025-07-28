import React, { useState } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';

// Simulamos framer-motion con CSS animations para el ejemplo
// En tu proyecto real, importarías: import { motion, AnimatePresence } from 'framer-motion';

// Para este ejemplo, crearemos componentes que simulan motion
const motion = {
  div: ({ children, className, variants, initial, animate, exit, whileHover, whileTap, transition, ...props }: any) => (
    <div className={`${className} transition-all duration-300`} {...props}>
      {children}
    </div>
  ),
  button: ({ children, className, whileHover, whileTap, ...props }: any) => (
    <button className={`${className} transition-all duration-200 hover:scale-105 active:scale-95`} {...props}>
      {children}
    </button>
  ),
};

const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface WhatsAppFloatProps {
  phoneNumber?: string;
  message?: string;
  companyName?: string;
  companyAvatar?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  showBadge?: boolean;
}

const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({
  phoneNumber = "51969742589",
  message = "¡Hola! Me gustaría obtener más información sobre sus productos.",
  companyName = "Tricks",
  companyAvatar,
  primaryColor = "#25D366",
  position = "bottom-right",
  showBadge = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>(message);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Simular que la empresa está escribiendo
      setTimeout(() => setIsTyping(true), 1000);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const sendMessage = (): void => {
    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-6 right-6' 
    : 'bottom-6 left-6';

  const chatPositionClasses = position === 'bottom-right'
    ? 'bottom-24 right-6'
    : 'bottom-24 left-6';

  return (
    <>
      {/* Botón flotante principal */}
      <motion.div
        className={`fixed ${positionClasses} z-50 group`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
      >
        {/* Efecto de pulso */}
        <div className="absolute inset-0 rounded-full animate-ping" 
             style={{ backgroundColor: `${primaryColor}40` }}></div>
        
        {/* Badge de notificación */}
        {showBadge && !isOpen && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce z-10">
            1
          </div>
        )}

        {/* Tooltip */}
        <div className={`absolute bottom-full ${position === 'bottom-right' ? 'right-0' : 'left-0'} mb-3 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg`}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>¿Necesitas ayuda? ¡Escríbenos!</span>
          </div>
          <div className={`absolute top-full ${position === 'bottom-right' ? 'right-4' : 'left-4'} w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800`}></div>
        </div>

        <motion.button
          onClick={toggleChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-16 h-16 rounded-full text-white shadow-2xl transition-all duration-300 hover:shadow-3xl focus:outline-none"
          style={{ 
            backgroundColor: primaryColor,
            boxShadow: `0 8px 32px ${primaryColor}50`
          }}
          onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
            e.target.style.boxShadow = `0 0 0 4px #7950f2, 0 8px 32px ${primaryColor}50`;
          }}
          onBlur={(e : React.FocusEvent<HTMLButtonElement>) => {
            e.target.style.boxShadow = `0 8px 32px ${primaryColor}50`;
          }}
          aria-label="Abrir chat de WhatsApp"
        >
          <div className="flex items-center justify-center">
            {isOpen ? (
              <X className="w-7 h-7 transform rotate-0 transition-transform duration-300" />
            ) : (
              <MessageCircle className="w-7 h-7 transform rotate-0 transition-transform duration-300" />
            )}
          </div>
        </motion.button>
      </motion.div>

      {/* Backdrop TRANSPARENTE para móviles - SIN FONDO NEGRO */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 sm:hidden"
            style={{ backgroundColor: 'transparent' }}
            onClick={toggleChat}
          />
        )}
      </AnimatePresence>

      {/* Ventana de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed ${chatPositionClasses} z-50 w-80 max-w-[calc(100vw-2rem)] sm:w-96`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-lg">
              {/* Header con colores de Tricks */}
              <div className="text-white px-6 py-4 flex items-center justify-between relative overflow-hidden"
                   style={{ 
                     background: 'linear-gradient(135deg, #7950f2 0%, #6950E8 50%, #592BE7 100%)'
                   }}>
                {/* Patrón de fondo sutil */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
                
                <motion.div
                  className="flex items-center space-x-3 relative z-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20">
                      {companyAvatar ? (
                        <img src={companyAvatar} alt={companyName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        // Icono personalizado para Tricks con el color principal
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                             style={{ background: 'linear-gradient(135deg, #7950f2 0%, #A996F8 100%)' }}>
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full animate-pulse"
                         style={{ backgroundColor: '#11b886' }}></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{companyName}</h3>
                    <motion.div
                      className="flex items-center space-x-1 text-sm opacity-90"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="w-2 h-2 rounded-full animate-pulse" 
                           style={{ backgroundColor: '#11b886' }}></div>
                      <span>En línea • Responde al instante</span>
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={toggleChat}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200 relative z-10"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Cuerpo del chat */}
              <div className="bg-gradient-to-b from-gray-50 to-white p-4 max-h-80 overflow-y-auto relative"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
                   }}>
                
                {/* Mensaje de bienvenida personalizado para Tricks */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-md border border-gray-100 relative">
                    <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-r-8 border-b-8 border-transparent border-r-white"></div>
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">✨</div>
                      <div>
                        <p className="text-gray-800 font-medium mb-1">
                          ¡Hola! Bienvenida a <span className="font-bold" style={{ color: '#7950f2' }}>{companyName}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Especialistas en calzado y belleza femenina. ¿En qué podemos ayudarte hoy?
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-1 text-xs rounded-full" 
                                style={{ backgroundColor: '#F7F5FE', color: '#7950f2' }}>
                            👠 Calzado
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 text-right">
                      {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>

                {/* Indicador de escritura */}
                {isTyping && (
                  <motion.div
                    className="mb-4 flex items-center space-x-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-md border border-gray-100 relative">
                      <div className="absolute -left-2 top-3 w-0 h-0 border-t-6 border-r-6 border-b-6 border-transparent border-r-white"></div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input de mensaje */}
              <div className="p-4 bg-white border-t border-gray-100">
                <motion.div
                  className="flex space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex-1">
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Pregúntanos sobre nuestros productos..."
                      className="w-full p-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:border-transparent text-sm bg-gray-50 transition-all duration-200 hover:bg-white"
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 2px #7950f2';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = 'none';
                      }}
                      rows={2}
                    />
                  </div>
                  <motion.button
                    onClick={sendMessage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="self-end p-3 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none"
                    style={{ 
                      backgroundColor: primaryColor,
                      boxShadow: `0 4px 12px ${primaryColor}30`
                    }}
                    onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
                      e.target.style.boxShadow = `0 0 0 2px #7950f2, 0 4px 12px ${primaryColor}30`;
                    }}
                    onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
                      e.target.style.boxShadow = `0 4px 12px ${primaryColor}30`;
                    }}
                    aria-label="Enviar mensaje"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </motion.div>
                
                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                    <span>💬</span>
                    <span>Te ayudamos con tu compra en minutos</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppFloat;