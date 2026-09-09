'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface EnquiryFormProps {
  initialService?: string;
  onSuccess?: () => void;
  standalone?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialService = '',
  onSuccess,
  standalone = false,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: initialService,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic client validation
    if (!formData.name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please provide details regarding your project scope or enquiry.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit enquiry. Please try again.');
      }

      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-sand/30 p-8 sm:p-12 rounded-sm text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-olive/10 text-olive flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-olive" strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mb-3">
          Enquiry Received
        </h3>
        <p className="text-sm text-warm-grey max-w-md font-light leading-relaxed mb-6">
          Thank you for reaching out to Projecto. Our senior estimating and engineering directors will review your brief and contact you within 24 business hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', phone: '', service_type: '', message: '' });
            }}
          >
            Submit Another Project Brief
          </Button>
          <Button
            variant="olive"
            size="sm"
            href="/projects"
            icon={<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
          >
            Explore Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-800 text-xs rounded-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
            Full Name <span className="text-olive">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-sand/30 focus:bg-white text-near-black text-sm px-4 py-3 rounded-sm border-0 ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
            Email Address <span className="text-olive">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-sand/30 focus:bg-white text-near-black text-sm px-4 py-3 rounded-sm border-0 ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-sand/30 focus:bg-white text-near-black text-sm px-4 py-3 rounded-sm border-0 ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
            Discipline / Project Scope
          </label>
          <select
            name="service_type"
            value={formData.service_type}
            onChange={handleChange}
            className="w-full bg-sand/30 focus:bg-white text-near-black text-sm px-4 py-3 rounded-sm border-0 ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all cursor-pointer"
          >
            <option value="">Select project classification</option>
            <option value="Luxury Residential Build">Luxury Residential Build</option>
            <option value="Commercial Structural Development">Commercial Structural Development</option>
            <option value="Architectural Renovation & Adaptive Reuse">Architectural Renovation & Adaptive Reuse</option>
            <option value="Civil & Structural Engineering">Civil & Structural Engineering</option>
            <option value="Pre-construction Consultation">Pre-construction Consultation</option>
            <option value="Other Architectural Works">Other Architectural Works</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
          Project Brief & Objectives <span className="text-olive">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-sand/30 focus:bg-white text-near-black text-sm p-4 rounded-sm border-0 ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50 resize-y"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="olive"
          size="lg"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
          icon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
        >
          Submit Architectural Enquiry
        </Button>
      </div>
    </form>
  );
};
