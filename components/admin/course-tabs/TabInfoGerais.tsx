'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { GeneralInfoItem } from '@/types/course';

interface Props {
  items: GeneralInfoItem[];
  setItems: (v: GeneralInfoItem[]) => void;
}

export default function TabInfoGerais({ items, setItems }: Props) {
  const add = () => setItems([...items, { title: '', content: '' }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof GeneralInfoItem, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informações Gerais ({items.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={add}>
            <Plus className="w-4 h-4 mr-1" /> Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">Itens do accordion de informações gerais (exibido no final da LP).</p>
          {items.map((item, i) => (
            <div key={i} className="p-4 rounded-lg border bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Item {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => remove(i)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Título</Label>
                <Input value={item.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Ex: Estrutura do Programa" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Conteúdo</Label>
                <Textarea value={item.content} onChange={(e) => update(i, 'content', e.target.value)} rows={4} placeholder="Texto detalhado..." />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
