'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  paragraphs: string[];
  setParagraphs: (v: string[]) => void;
}

export default function TabRelevancia({ paragraphs, setParagraphs }: Props) {
  const add = () => setParagraphs([...paragraphs, '']);
  const remove = (i: number) => setParagraphs(paragraphs.filter((_, idx) => idx !== i));
  const update = (i: number, value: string) => {
    const updated = [...paragraphs];
    updated[i] = value;
    setParagraphs(updated);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Por que esta capacitação é relevante? ({paragraphs.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={add}>
            <Plus className="w-4 h-4 mr-1" /> Parágrafo
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">Adicione os parágrafos que explicam a relevância do curso. Aparecem na LP após o público-alvo.</p>
          {paragraphs.map((p, i) => (
            <div key={i} className="p-4 rounded-lg border bg-gray-50 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-500">Parágrafo {i + 1}</Label>
                <Button variant="ghost" size="sm" onClick={() => remove(i)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <Textarea
                value={p}
                onChange={(e) => update(i, e.target.value)}
                rows={4}
                placeholder="Texto do parágrafo..."
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
