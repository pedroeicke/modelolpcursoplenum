'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AlterarSenhaForm() {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setOk(false);

    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }

    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSalvando(false);

    if (error) {
      setErro('Não foi possível alterar a senha. Tente novamente.');
      return;
    }
    setSenha('');
    setConfirmacao('');
    setOk(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-xl p-6">
      <div>
        <h2 className="font-semibold text-gray-900">Alterar senha</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Escolha uma senha nova com no mínimo 6 caracteres.
        </p>
      </div>

      {erro && (
        <Alert variant="destructive">
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      {ok && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <AlertDescription className="text-emerald-800">
            Senha alterada. Use a nova senha no próximo acesso.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="senha">Nova senha</Label>
        <Input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmacao">Repita a nova senha</Label>
        <Input
          id="confirmacao"
          type="password"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <Button type="submit" disabled={salvando}>
        {salvando ? 'Salvando...' : 'Alterar senha'}
      </Button>
    </form>
  );
}
