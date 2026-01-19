import React from 'react';
import { Star, Quote } from 'lucide-react';

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  propertyType: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative">
      <div className="absolute -top-3 -left-3 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
        <Quote className="w-5 h-5 text-white" />
      </div>
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">Bought a {testimonial.propertyType} in {testimonial.location}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
