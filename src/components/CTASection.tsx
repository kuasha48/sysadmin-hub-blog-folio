import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Mail } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const { content: ctaContent, loading } = useContent('cta_hire');
  const { content: whatsappContent } = useContent('cta_whatsapp');
  
  const title = ctaContent?.title || 'Want to hire for short term or long term project please contact';
  const whatsappNumber = whatsappContent?.content || '+38345677497';
  
  // Function to open live chat
  const openLiveChat = () => {
    // Check if Tawk is available
    if ((window as any).Tawk_API) {
      (window as any).Tawk_API.maximize();
    }
  };

  // Format WhatsApp number for URL (remove + and spaces)
  const formatWhatsAppNumber = (number: string) => {
    return number.replace(/[+\s]/g, '');
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="h-40 animate-pulse bg-muted rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={openLiveChat}
              className="min-w-[180px]"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Live Chat
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="min-w-[180px]"
            >
              <a 
                href={`https://wa.me/${formatWhatsAppNumber(whatsappNumber)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              asChild
              className="min-w-[180px]"
            >
              <Link to="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Send Message
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
