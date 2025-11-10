'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate API call (replace with actual implementation later)
    setTimeout(() => {
      // For now, just show success
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={t('form.subjectPlaceholder')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder={t('form.messagePlaceholder')}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('form.send')}
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    {t('success')}
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {t('error')}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('info.title')}
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {t('info.email')}
                    </h3>
                    <a
                      href="mailto:contact@dulundu.dev"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      contact@dulundu.dev
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {t('info.location')}
                    </h3>
                    <p className="text-gray-600">Remote / Global</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {t('info.hours')}
                    </h3>
                    <p className="text-gray-600">Mon - Fri: 9:00 - 18:00 UTC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
