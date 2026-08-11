import { createClient } from '@/lib/supabase/server';
import AlterarSenhaForm from '@/components/admin/AlterarSenhaForm';

export const metadata = { title: 'Minha conta' };

export default async function ContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minha conta</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
      </div>
      <AlterarSenhaForm />
    </div>
  );
}
