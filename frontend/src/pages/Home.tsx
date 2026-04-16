import HomeNav from '../components/home/HomeNav';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CtaSection from '../components/home/CtaSection';
import HomeFooter from '../components/home/HomeFooter';

export default function Home() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased overflow-x-hidden selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]">
            <HomeNav />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CtaSection />
            <HomeFooter />
        </div>
    );
}
