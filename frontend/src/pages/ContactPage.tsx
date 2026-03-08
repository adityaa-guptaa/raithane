import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call or integrate real contact API here
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Contact Information Side */}
        <div className="bg-[#992A16] text-white p-8 md:w-1/3 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="mb-6 opacity-90">
              We'd love to hear from you! Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6" />
              <span>support@raithane.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6" />
              <span>+977 9800000000</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6" />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 cursor-pointer transition">F</div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 cursor-pointer transition">I</div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 cursor-pointer transition">T</div>
            </div>
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="p-8 md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#992A16] focus:outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#992A16] focus:outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#992A16] focus:outline-none transition"
                placeholder="How can we help?"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#992A16] focus:outline-none transition resize-none"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#992A16] text-white font-semibold py-3 rounded-lg hover:bg-[#7a2112] transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
