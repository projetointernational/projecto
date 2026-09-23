'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, ArrowRight, Upload, Paperclip } from 'lucide-react';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';

interface FormOptions {
  project_types?: string[];
  required_support?: string[];
  project_stages?: string[];
  contact_methods?: string[];
}

interface EnquiryFormProps {
  initialService?: string;
  onSuccess?: () => void;
  formOptions?: FormOptions;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialService = '',
  onSuccess,
  formOptions,
}) => {
  const router = useRouter();

  // Configurable options with approved fallbacks
  const projectTypes = formOptions?.project_types || [
    'Residential',
    'Commercial',
    'Interior',
    'Renovation',
    'New Construction',
    'Other',
  ];

  const requiredSupportOptions = formOptions?.required_support || [
    'Procurement',
    'Procurement Consultancy',
    'Project Coordination',
    'Complete Project Support',
    'Material Supply',
    'Contractor Coordination',
    'Professional Coordination',
    'Other',
  ];

  const projectStages = formOptions?.project_stages || [
    'Planning',
    'Design',
    'BOQ Ready',
    'Procurement',
    'Construction',
    'Interior',
    'Other',
  ];

  const contactMethods = formOptions?.contact_methods || [
    'Phone',
    'WhatsApp',
    'Email',
  ];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    location: '',
    project_type: '',
    required_support: initialService || '',
    project_stage: '',
    message: '',
    contact_method: 'WhatsApp',
    file_url: '',
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

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide a contact phone number.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Please specify your project location.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please describe your project requirement or support needs.');
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
      <div className="bg-sand/30 p-8 sm:p-12 rounded-sm text-center flex flex-col items-center border border-sand">
        <div className="w-14 h-14 rounded-full bg-olive/10 text-olive flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-olive" strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mb-3">
          Project Enquiry Received
        </h3>
        <p className="text-sm text-near-black/75 max-w-md font-light leading-relaxed mb-6">
          Thank you for reaching out to Projeto. Our procurement and project coordination directors will review your brief and contact you promptly via your preferred method.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                phone: '',
                email: '',
                company: '',
                location: '',
                project_type: '',
                required_support: '',
                project_stage: '',
                message: '',
                contact_method: 'WhatsApp',
                file_url: '',
              });
            }}
          >
            Submit Another Project Requirement
          </Button>
          <Button
            variant="olive"
            size="sm"
            href="/services"
            icon={<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
          >
            Explore Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-800 text-xs rounded-sm flex items-center space-x-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
            Full Name <span className="text-olive">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full bg-sand/20 focus:bg-white text-near-black text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
            Phone Number <span className="text-olive">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full bg-sand/20 focus:bg-white text-near-black text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50"
          />
        </div>
      </div>

      {/* Row 2: Email & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
            Email Address <span className="text-[10px] text-warm-grey lowercase font-normal">(optional)</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            className="w-full bg-sand/20 focus:bg-white text-near-black text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
            Company / Firm <span className="text-[10px] text-warm-grey lowercase font-normal">(optional)</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Studio / Builder / Owner"
            className="w-full bg-sand/20 focus:bg-white text-near-black text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50"
          />
        </div>
      </div>

      {/* Row 3: Project Location & Project Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
            Project Location <span className="text-olive">*</span>
          </label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Kochi, Thrissur, Bangalore"
            className="w-full bg-sand/20 focus:bg-white text-near-black text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
            Project Type
          </label>
          <select
            name="project_type"
            value={formData.project_type}
            onChange={handleChange}
            className="w-full bg-sand/20 focus:bg-white text-near-black text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all cursor-pointer"
          >
            <option value="">Select project type</option>
            {projectTypes.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Required Support & Project Stage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
            Required Support
          </label>
          <select
            name="required_support"
            value={formData.required_support}
            onChange={handleChange}
            className="w-full bg-sand/20 focus:bg-white text-near-black text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all cursor-pointer"
          >
            <option value="">Select required support</option>
            {requiredSupportOptions.map((rs) => (
              <option key={rs} value={rs}>
                {rs}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
            Project Stage
          </label>
          <select
            name="project_stage"
            value={formData.project_stage}
            onChange={handleChange}
            className="w-full bg-sand/20 focus:bg-white text-near-black text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all cursor-pointer"
          >
            <option value="">Select project stage</option>
            {projectStages.map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 5: Requirement / Message */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
          Project Requirement / Scope <span className="text-olive">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us what you are working on, required materials, or execution teams to coordinate..."
          className="w-full bg-sand/20 focus:bg-white text-near-black text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all placeholder:text-warm-grey/50 resize-y"
        />
      </div>

      {/* Row 6: BOQ / Drawings Link or Upload */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5">
          Upload BOQ / Drawings / Requirement <span className="text-[10px] text-warm-grey lowercase font-normal">(optional)</span>
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="file_url"
            value={formData.file_url}
            onChange={handleChange}
            placeholder="Paste Google Drive / Dropbox link or Cloudinary file URL"
            className="flex-1 bg-sand/20 focus:bg-white text-near-black text-xs px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none transition-all"
          />
        </div>
        <p className="text-[11px] text-warm-grey mt-1">
          Have a Bill of Quantities or architectural drawing? Paste a shared drive link or send directly via WhatsApp.
        </p>
      </div>

      {/* Row 7: Preferred Contact Method */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
          Preferred Contact Method
        </label>
        <div className="flex flex-wrap gap-4">
          {contactMethods.map((method) => (
            <label key={method} className="flex items-center space-x-2 text-xs text-near-black cursor-pointer">
              <input
                type="radio"
                name="contact_method"
                value={method}
                checked={formData.contact_method === method}
                onChange={handleChange}
                className="text-olive focus:ring-olive"
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="olive"
          size="lg"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
          icon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
        >
          Submit Project Requirement
        </Button>
      </div>
    </form>
  );
};
