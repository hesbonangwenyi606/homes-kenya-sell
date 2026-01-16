import React from 'react';
import { Phone, Mail, MessageCircle, Star } from 'lucide-react';

export interface Agent {
  id: number;
  name: string;
  title: string;
  image: string;
  phone: string;
  email: string;
  listings: number;
  rating: number;
  reviews: number;
}

interface AgentCardProps {
  agent: Agent;
  onContact: (agent: Agent, method: 'phone' | 'email' | 'whatsapp') => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onContact }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center group">
      <div className="relative inline-block mb-4">
        <img 
          src={agent.image} 
          alt={agent.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-emerald-100 group-hover:border-emerald-500 transition-colors duration-300"
        />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {agent.listings} Listings
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-1">{agent.name}</h3>
      <p className="text-emerald-600 font-medium text-sm mb-3">{agent.title}</p>
      <div className="flex items-center justify-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm text-gray-500 ml-2">({agent.reviews} reviews)</span>
      </div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => onContact(agent, 'phone')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors duration-300"
        >
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium">Call</span>
        </button>
        <button
          onClick={() => onContact(agent, 'whatsapp')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors duration-300"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">WhatsApp</span>
        </button>
        <button
          onClick={() => onContact(agent, 'email')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors duration-300"
        >
          <Mail className="w-4 h-4" />
          <span className="text-sm font-medium">Email</span>
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
