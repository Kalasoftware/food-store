'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Star, ArrowRight } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-coral-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-coral-500 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-coral-600/90"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-coral-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container-custom py-24 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">Get In Touch</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Contact
            <span className="block bg-gradient-to-r from-white to-coral-100 bg-clip-text text-transparent">
              FoodStore
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Have questions about our products or need assistance? We're here to help you with all your food needs.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <div className="mb-12">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-coral-100 to-primary-100 rounded-full px-4 py-2 mb-6">
                  <Star className="w-4 h-4 text-coral-600" />
                  <span className="text-sm font-semibold text-coral-700">Contact Information</span>
                </div>
                <h2 className="heading-2 mb-6 bg-gradient-to-r from-coral-600 to-primary-600 bg-clip-text text-transparent">
                  Let's Start a Conversation
                </h2>
                <p className="text-body text-lg leading-relaxed">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-coral-400 to-secondary-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-medium">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-2">Email Us</h3>
                    <p className="text-muted mb-2">Send us an email anytime!</p>
                    <a href="mailto:support@foodstore.com" className="text-primary-600 hover:text-coral-600 font-semibold transition-colors">
                      support@foodstore.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-medium">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-2">Call Us</h3>
                    <p className="text-muted mb-2">Mon-Fri from 8am to 5pm</p>
                    <a href="tel:+1234567890" className="text-primary-600 hover:text-coral-600 font-semibold transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-medium">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-2">Visit Us</h3>
                    <p className="text-muted mb-2">Come say hello at our office</p>
                    <address className="text-primary-600 not-italic">
                      123 Food Street<br />
                      Gourmet District, FD 12345
                    </address>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-medium">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-2">Business Hours</h3>
                    <div className="text-muted space-y-1">
                      <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                      <p>Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="card p-8 lg:p-12">
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-semibold text-neutral-800 mb-4">
                    Send us a Message
                  </h3>
                  <p className="text-muted">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                {submitted && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Message Sent!</h4>
                        <p className="text-green-700">We'll get back to you soon.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-3">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-3">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn btn-primary btn-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50/50 to-coral-50/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-coral-100 to-primary-100 rounded-full px-4 py-2 mb-6">
              <MessageCircle className="w-4 h-4 text-coral-600" />
              <span className="text-sm font-semibold text-coral-700">Quick Answers</span>
            </div>
            <h2 className="heading-2 mb-6 bg-gradient-to-r from-coral-600 to-primary-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-body max-w-3xl mx-auto text-lg">
              Find quick answers to common questions about our products and services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="card p-8">
              <h3 className="font-semibold text-neutral-800 mb-4">How do I place an order?</h3>
              <p className="text-muted leading-relaxed">
                Simply browse our products, add items to your cart, and proceed to checkout. We accept various payment methods for your convenience.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="font-semibold text-neutral-800 mb-4">What are your delivery times?</h3>
              <p className="text-muted leading-relaxed">
                We offer same-day delivery for orders placed before 2 PM, and next-day delivery for all other orders within our service area.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="font-semibold text-neutral-800 mb-4">Do you offer organic products?</h3>
              <p className="text-muted leading-relaxed">
                Yes! We have a wide selection of certified organic products across all categories. Look for the organic label on product pages.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="font-semibold text-neutral-800 mb-4">What's your return policy?</h3>
              <p className="text-muted leading-relaxed">
                We offer a 100% satisfaction guarantee. If you're not happy with your purchase, contact us within 24 hours for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
