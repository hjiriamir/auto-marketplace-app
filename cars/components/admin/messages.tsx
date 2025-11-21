'use client';

import { ContactMessage } from '@/lib/db';
import { Mail, Phone } from 'lucide-react';

interface MessagesProps {
  messages: ContactMessage[];
}

export function AdminMessages({ messages }: MessagesProps) {
  return (
    <div className="grid gap-4">
      {messages.length === 0 ? (
        <div className="bg-card rounded-lg p-8 border border-border text-center">
          <p className="text-muted-foreground">Aucun message</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="bg-card rounded-lg p-6 border border-border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{msg.name}</h3>
                <p className="text-sm text-muted-foreground">{msg.subject}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>

            <p className="text-foreground mb-4">{msg.message}</p>

            <div className="flex gap-4 pt-4 border-t border-border">
              <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-primary hover:underline text-sm">
                <Mail className="w-4 h-4" />
                {msg.email}
              </a>
              <a href={`tel:${msg.phone}`} className="flex items-center gap-2 text-primary hover:underline text-sm">
                <Phone className="w-4 h-4" />
                {msg.phone}
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
