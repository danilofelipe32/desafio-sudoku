import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
          aria-label="Fechar modal de informações"
        >
          <CloseIcon />
        </button>
        
        <h2 id="info-modal-title" className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
          Como Jogar
        </h2>

        <div className="space-y-6 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Objetivo</h3>
            <p>
              O objetivo é preencher a grade 9x9 com números de 1 a 9. Cada número deve aparecer <strong>apenas uma vez</strong> em cada linha, coluna e sub-grade 3x3.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Instruções</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Selecione uma dificuldade para começar um novo jogo.</li>
              <li>Clique em uma célula vazia para selecioná-la.</li>
              <li>Use o teclado numérico na parte inferior para inserir um número.</li>
              <li>Para remover um número, selecione a célula e use o botão de apagar (o ícone após o número 9) no teclado numérico.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Recursos do Jogo</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Destaque de Célula:</strong> A linha, coluna e bloco da célula selecionada são destacadas para ajudar na visualização.
              </li>
              <li>
                <span className="p-1 rounded bg-yellow-200 dark:bg-yellow-700/60 text-yellow-800 dark:text-yellow-200 font-medium">Conflito (Amarelo)</span>: Indica que o mesmo número aparece mais de uma vez na mesma linha, coluna ou bloco 3x3.
              </li>
              <li>
                <span className="p-1 rounded bg-red-200 dark:bg-red-800/80 text-red-700 dark:text-red-300 font-medium">Erro (Vermelho)</span>: Mostra que o número inserido não corresponde à solução final do quebra-cabeça.
              </li>
              <li>
                <strong>Dicas:</strong> Se estiver em dúvida, o botão "Dica" revela o número correto para a célula selecionada (ou para a primeira vazia). Use com sabedoria!
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};