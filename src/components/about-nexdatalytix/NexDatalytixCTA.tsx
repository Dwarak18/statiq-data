import React, { useState } from 'react';

export function NexDatalytixCTA() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section
      id="contact"
      className="border-t border-b border-[#DEDDD7] bg-[#F7F6F2] py-28 sm:py-36 lg:py-48 scroll-mt-24"
      style={{
        paddingBlock: 'clamp(120px, 14vw, 220px)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-28 items-start">
          {/* Left Column: Heading, Description & Email per Spec §4, §6, §7 */}
          <div className="space-y-8">
            {/* Eyebrow per Spec §5 */}
            <span className="text-[0.78rem] font-mono tracking-[0.08em] uppercase text-[#77756E] block">
              START A CONVERSATION
            </span>

            {/* Prominent Responsive Heading per Spec §4 */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-[#20201E] font-heading leading-[0.98] max-w-[720px]">
              Start a<br />conversation.
            </h2>

            {/* Scaled Description per Spec §6 */}
            <p className="text-lg sm:text-xl lg:text-2xl text-[#4F4E49] font-sans leading-[1.55] max-w-[620px]">
              Have a research problem, data challenge, or technology project to discuss? Tell us what you&apos;re working on and we&apos;ll get back to you.
            </p>

            {/* Prominent Email Link per Spec §7 */}
            <div className="pt-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#77756E] block mb-1">
                General enquiries
              </span>
              <a
                href="mailto:contact@statiqone.com"
                className="inline-block text-xl sm:text-2xl font-medium text-[#20201E] hover:text-[#B9684E] transition-colors font-sans"
              >
                contact@statiqone.com
              </a>
            </div>
          </div>

          {/* Right Column: Form directly on surface per Spec §8, §9 */}
          <div className="w-full max-w-[620px]">
            {isSubmitted ? (
              <div className="p-8 bg-white border border-[#DEDDD7] rounded-[6px] space-y-4 font-sans">
                <h3 className="text-xl font-medium text-[#20201E]">Message received.</h3>
                <p className="text-base text-[#4F4E49] leading-relaxed">
                  Thanks for reaching out, <span className="font-semibold text-[#20201E]">{formData.name}</span>. We&apos;ll review your message and get back to you at <span className="font-semibold text-[#20201E]">{formData.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', company: '', email: '', message: '' });
                  }}
                  className="pt-2 inline-block text-xs font-mono text-[#B9684E] hover:underline cursor-pointer"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                {errorMsg && (
                  <div className="p-4 bg-[#9A5B55]/10 border border-[#9A5B55]/30 text-[#9A5B55] text-sm rounded-[6px]">
                    {errorMsg}
                  </div>
                )}

                {/* Field 1: Name * */}
                <div className="space-y-2">
                  <label htmlFor="form-name" className="block text-[0.9rem] font-medium text-[#20201E] leading-[1.4]">
                    Name <span className="text-[#B9684E]">*</span>
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full min-h-[54px] sm:min-h-[58px] px-4 py-3.5 text-base rounded-[6px] border border-[#DEDDD7] bg-white text-[#20201E] outline-none focus:border-[#20201E] focus:ring-1 focus:ring-[#20201E] transition-all"
                  />
                </div>

                {/* Field 2: Company */}
                <div className="space-y-2">
                  <label htmlFor="form-company" className="block text-[0.9rem] font-medium text-[#20201E] leading-[1.4]">
                    Company
                  </label>
                  <input
                    id="form-company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company / organisation"
                    className="w-full min-h-[54px] sm:min-h-[58px] px-4 py-3.5 text-base rounded-[6px] border border-[#DEDDD7] bg-white text-[#20201E] outline-none focus:border-[#20201E] focus:ring-1 focus:ring-[#20201E] transition-all"
                  />
                </div>

                {/* Field 3: Email * */}
                <div className="space-y-2">
                  <label htmlFor="form-email" className="block text-[0.9rem] font-medium text-[#20201E] leading-[1.4]">
                    Email <span className="text-[#B9684E]">*</span>
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    className="w-full min-h-[54px] sm:min-h-[58px] px-4 py-3.5 text-base rounded-[6px] border border-[#DEDDD7] bg-white text-[#20201E] outline-none focus:border-[#20201E] focus:ring-1 focus:ring-[#20201E] transition-all"
                  />
                </div>

                {/* Field 4: Message * */}
                <div className="space-y-2">
                  <label htmlFor="form-message" className="block text-[0.9rem] font-medium text-[#20201E] leading-[1.4]">
                    What can we help with? <span className="text-[#B9684E]">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us briefly about the research, data, or technology problem."
                    required
                    className="w-full min-h-[150px] px-4 py-3.5 text-base rounded-[6px] border border-[#DEDDD7] bg-white text-[#20201E] outline-none focus:border-[#20201E] focus:ring-1 focus:ring-[#20201E] transition-all resize-y"
                  />
                </div>

                {/* Form Actions per Spec §13 */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center h-[52px] px-7 rounded-[6px] bg-[#20201E] text-white text-[0.95rem] font-semibold hover:bg-[#B9684E] transition-colors disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E]"
                  >
                    {isSubmitting ? 'Sending enquiry...' : 'Start a conversation →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
