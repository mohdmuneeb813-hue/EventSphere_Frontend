import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Tag, 
  ArrowRight,
  Filter
} from 'lucide-react';
import PublicNavbar from '../../components/common/PublicNavbar';
import PublicFooter from '../../components/common/PublicFooter';

export const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const categories = [
    'All',
    'Technology & AI',
    'Fashion & Lifestyle',
    'Automotive & Hardware',
    'Architecture & Real Estate',
    'Food & Gastronomy'
  ];

  const galleryItems = [
    {
      id: 1,
      title: 'Global Tech Innovators Keynote',
      expo: 'Global Tech Innovation Expo 2026',
      category: 'Technology & AI',
      location: 'Dubai World Trade Centre',
      date: 'March 2026',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      description: 'Opening keynote discussing autonomous artificial intelligence breakthroughs before 5,000 global delegates.'
    },
    {
      id: 2,
      title: 'Haute Couture Runway Presentation',
      expo: 'International Fashion & Lifestyle Summit',
      category: 'Fashion & Lifestyle',
      location: 'Expo Centre Karachi, Hall 2',
      date: 'April 2026',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      description: 'Sustainable luxury fabrics and artisan designer showcases celebrating contemporary heritage fashion.'
    },
    {
      id: 3,
      title: 'Hyper-EV Prototype Reveal',
      expo: 'Auto & Mobility Future Expo',
      category: 'Automotive & Hardware',
      location: 'Abu Dhabi ADNEC Grand Hall',
      date: 'May 2026',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      description: 'First public reveal of next-generation solid-state electric performance concepts with aerodynamic bodywork.'
    },
    {
      id: 4,
      title: 'Biophilic Pavilion Architecture',
      expo: 'Sustainable Urban Living Summit',
      category: 'Architecture & Real Estate',
      location: 'Expo City Dubai Pavilion',
      date: 'June 2026',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      description: 'Immersive timber and green facade architectural scale models engineered for carbon-neutral smart cities.'
    },
    {
      id: 5,
      title: 'Artisan Masterclass & Culinary Theatre',
      expo: 'Gourmet World Food & Beverage',
      category: 'Food & Gastronomy',
      location: 'Lahore Expo Centre, Hall 1',
      date: 'July 2026',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      description: 'Michelin-starred masterclasses pairing molecular gastronomy techniques with regional organic spices.'
    },
    {
      id: 6,
      title: 'Robotics & Automation Pavilion',
      expo: 'Global Tech Innovation Expo 2026',
      category: 'Technology & AI',
      location: 'Dubai World Trade Centre, Hall 4',
      date: 'March 2026',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      description: 'Bipedal robotics and industrial warehouse automated logistics in live synchronized demonstrations.'
    },
    {
      id: 7,
      title: 'Luxury Watch & Fine Jewelry Lounge',
      expo: 'International Fashion & Lifestyle Summit',
      category: 'Fashion & Lifestyle',
      location: 'Expo Centre Karachi, VIP Suite',
      date: 'April 2026',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      description: 'Curated private viewing salon featuring rare horological complications and bespoke fine jewelry.'
    },
    {
      id: 8,
      title: 'Next-Gen Hydrogen Powertrain Showcase',
      expo: 'Auto & Mobility Future Expo',
      category: 'Automotive & Hardware',
      location: 'Abu Dhabi ADNEC Grand Hall',
      date: 'May 2026',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
      description: 'Zero-emission freight transport systems engineered for harsh desert climates and rapid charging.'
    },
    {
      id: 9,
      title: 'Modernist Spatial Installations',
      expo: 'Sustainable Urban Living Summit',
      category: 'Architecture & Real Estate',
      location: 'Expo City Dubai Pavilion',
      date: 'June 2026',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description: 'Interactive residential interior displays illustrating minimalist, energy-efficient luxury apartments.'
    }
  ];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  const activeItem = activeImageIndex !== null ? filteredItems[activeImageIndex] : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#221A15] flex flex-col font-sans selection:bg-[#A4512D] selection:text-white">
      <PublicNavbar />

      {/* Header Banner */}
      <section className="pt-16 pb-12 px-4 sm:px-8 border-b border-[#E8DFD5] bg-gradient-to-b from-[#FAF7F2] via-[#F6EFE6] to-[#FAF7F2]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#A4512D]/10 text-[#A4512D] text-xs font-bold uppercase tracking-widest border border-[#A4512D]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exhibition Photo Gallery</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#221A15]">
            Capturing <span className="italic font-normal text-[#A4512D]">Unforgettable</span> Moments
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#6E5D50] leading-relaxed">
            Browse through highlights, keynote addresses, booth showcases, and vibrant networking moments 
            captured across our global trade exhibitions.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#A4512D] text-white shadow-md shadow-[#A4512D]/20'
                    : 'bg-white text-[#5A4B40] border border-[#D8C9BB] hover:bg-[#F2EAE0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between pb-6 text-xs text-[#8C7A6B]">
          <span>
            Showing <strong className="text-[#221A15]">{filteredItems.length}</strong> photographs in{' '}
            <strong className="text-[#A4512D]">{selectedCategory}</strong>
          </span>
          <span className="hidden sm:inline">Click any photo to enlarge</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveImageIndex(index)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#E8DFD5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8DFD5]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#221A15]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-[#221A15] flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Maximize2 className="w-5 h-5 text-[#A4512D]" />
                  </div>
                </div>

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#A4512D] uppercase tracking-wider border border-[#E8DFD5]">
                  {item.category}
                </div>
              </div>

              {/* Information Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#221A15] group-hover:text-[#A4512D] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6E5D50] line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0E6DB] flex items-center justify-between text-[11px] text-[#8C7A6B]">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A4512D]" />
                    <span className="truncate max-w-[150px]">{item.location}</span>
                  </span>
                  <span className="flex items-center space-x-1 font-semibold text-[#5A4B40]">
                    <Calendar className="w-3.5 h-3.5 text-[#A4512D]" />
                    <span>{item.date}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox / Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-[#18120E]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          {/* Close button */}
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20"
            title="Previous Photo"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20"
            title="Next Photo"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Modal Content */}
          <div className="max-w-5xl w-full bg-[#221A15] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row max-h-[90vh]">
            {/* Image section */}
            <div className="lg:w-2/3 bg-black/60 flex items-center justify-center p-2 overflow-hidden">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[60vh] lg:max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Info details section */}
            <div className="lg:w-1/3 p-6 sm:p-8 text-white flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#A4512D] text-white text-[10px] font-bold uppercase tracking-wider">
                  {activeItem.category}
                </span>

                <h3 className="font-serif text-2xl font-bold leading-snug">
                  {activeItem.title}
                </h3>

                <p className="text-xs text-[#D3C6BC] leading-relaxed">
                  {activeItem.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-[#AFA49C]">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-[#DDB892]" />
                    <span className="text-white font-medium">{activeItem.expo}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#DDB892]" />
                    <span>{activeItem.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#DDB892]" />
                    <span>{activeItem.date}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#8C7A6B]">
                  Photo {activeImageIndex + 1} of {filteredItems.length}
                </span>
                <Link
                  to="/expos"
                  onClick={() => setActiveImageIndex(null)}
                  className="px-4 py-2 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold rounded-full transition flex items-center space-x-1.5"
                >
                  <span>Browse Upcoming Expos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-8 bg-[#F5EFEB] border-t border-[#E8DFD5]">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#221A15]">
            Experience It Live In Person
          </h2>
          <p className="text-sm text-[#6E5D50] max-w-xl mx-auto">
            Photographs only tell part of the story. Secure your verified attendee pass or book your exhibition booth today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-7 py-3 bg-[#A4512D] hover:bg-[#8C3F1F] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md shadow-[#A4512D]/20 transition"
            >
              Get Your Pass
            </Link>
            <Link
              to="/expos"
              className="px-7 py-3 bg-white hover:bg-[#EFE7DC] text-[#221A15] border border-[#D8C9BB] text-xs font-bold uppercase tracking-wider rounded-full transition"
            >
              Browse All Expos
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default GalleryPage;
