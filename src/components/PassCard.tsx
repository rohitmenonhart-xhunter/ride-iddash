import React from 'react';
import { MapPin, Bike, Clock, User, Mail, Hash } from 'lucide-react';
import { Pass } from '../types/pass';

interface PassCardProps {
  pass: Pass;
}

export function PassCard({ pass }: PassCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bike className="text-blue-500" size={24} />
          <span className="font-semibold text-lg">{pass.bicycle}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          pass.status === 'issued' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {pass.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <User className="text-gray-400" size={18} />
          <span>{pass.displayName}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Mail className="text-gray-400" size={18} />
          <span className="text-sm text-gray-600">{pass.email}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Hash className="text-gray-400" size={18} />
          <span className="text-sm text-gray-600">{pass.registerNumber}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="text-gray-400" size={18} />
          <span className="text-sm text-gray-600">{pass.time}</span>
        </div>
        
        <a
          href={pass.location}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
        >
          <MapPin size={18} />
          <span className="text-sm">View Location</span>
        </a>
      </div>
    </div>
  );
}