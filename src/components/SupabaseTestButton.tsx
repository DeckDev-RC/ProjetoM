import React, { useState } from 'react';
import { testSupabaseConnection, insertContactForm } from '../lib/supabase';

// Componente apenas para desenvolvimento - remover em produção
const SupabaseTestButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    addResult('Testando conexão...');
    
    try {
      const success = await testSupabaseConnection();
      if (success) {
        addResult('✅ Conexão com Supabase estabelecida com sucesso!');
      } else {
        addResult('❌ Falha na conexão com Supabase');
      }
    } catch (error) {
      addResult(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testInsert = async () => {
    setIsLoading(true);
    addResult('Testando inserção...');
    
    try {
      const result = await insertContactForm({
        name: 'Teste Desenvolvimento',
        email: 'teste@desenvolvimento.com',
        phone: '11999999999',
        company: 'Empresa de Teste'
      });
      
      addResult(`✅ Inserção bem-sucedida! ID: ${result.id}`);
    } catch (error) {
      addResult(`❌ Erro na inserção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  // Só mostrar em desenvolvimento
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-md">
      <h3 className="text-white font-medium mb-3">Teste Supabase (Dev)</h3>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Testar Conexão
        </button>
        
        <button
          onClick={testInsert}
          disabled={isLoading}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          Testar Inserção
        </button>
        
        <button
          onClick={clearResults}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          Limpar
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-gray-800 rounded p-3 max-h-32 overflow-y-auto">
          {results.map((result, index) => (
            <div key={index} className="text-xs text-gray-300 mb-1">
              {result}
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="text-yellow-400 text-sm">
          Processando...
        </div>
      )}
    </div>
  );
};

export default SupabaseTestButton; 