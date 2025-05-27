import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMessageCircle, FiUser, FiAward } from 'react-icons/fi';

const Testimonials = () => {
  // References for the scrolling rows
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);

  // Row 1 testimonials (moving right to left)
  const row1Testimonials = [
    {
      quote: "Proposly helped me land 3 new clients in my first week! The proposals are so well-written and personalized.",
      author: "Sarah Johnson",
      role: "UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      platform: "Upwork",
    },
    {
      quote: "I used to spend hours writing proposals. Now it takes me 5 minutes and they're even better.",
      author: "Michael Chen",
      role: "Web Developer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      platform: "Freelancer",
    },
    {
      quote: "As a non-native English speaker, Proposly has been a game-changer for my freelance business.",
      author: "Elena Kowalski",
      role: "Graphic Designer",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
      platform: "Fiverr",
    },
    {
      quote: "The AI understands exactly what clients are looking for and highlights my relevant experience perfectly.",
      author: "James Wilson",
      role: "Marketing Consultant",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 5,
      platform: "LinkedIn",
    },
    {
      quote: "My proposal acceptance rate went from 10% to over 40% in just one month using Proposly.",
      author: "David Rodriguez",
      role: "Content Writer",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      platform: "Upwork",
    },
  ];
  
  // Row 2 testimonials (moving left to right)
  const row2Testimonials = [
    {
      quote: "The time I save with Proposly lets me focus on delivering great work instead of writing proposals.",
      author: "Jennifer Lee",
      role: "Social Media Manager",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      platform: "Fiverr",
    },
    {
      quote: "I was skeptical at first, but the quality of proposals from Proposly is truly impressive.",
      author: "Robert Taylor",
      role: "SEO Specialist",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4,
      platform: "Freelancer",
    },
    {
      quote: "Clients have specifically mentioned how professional my proposals look since using Proposly.",
      author: "Sophia Martinez",
      role: "Copywriter",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      platform: "Upwork",
    },
    {
      quote: "The personalization options make each proposal feel custom-made for each client.",
      author: "Thomas Wright",
      role: "Video Editor",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 5,
      platform: "LinkedIn",
    },
    {
      quote: "I've recommended Proposly to all my freelancer friends. It's a real game-changer.",
      author: "Emma Johnson",
      role: "Illustrator",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
      rating: 5,
      platform: "Dribbble",
    },
  ];
  
  // Row 3 testimonials (moving right to left)
  const row3Testimonials = [
    {
      quote: "The AI analyzes job posts better than I could and highlights exactly what clients want to hear.",
      author: "Daniel Kim",
      role: "Mobile Developer",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      rating: 5,
      platform: "Upwork",
    },
    {
      quote: "I landed a $15,000 contract with my first Proposly-generated proposal. Best investment ever.",
      author: "Olivia Garcia",
      role: "Business Consultant",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
      rating: 5,
      platform: "LinkedIn",
    },
    {
      quote: "As someone new to freelancing, Proposly gave me the confidence to bid on high-value projects.",
      author: "Noah Wilson",
      role: "3D Modeler",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      rating: 5,
      platform: "Fiverr",
    },
    {
      quote: "The export options make it easy to send professional proposals through any platform.",
      author: "Ava Thompson",
      role: "Project Manager",
      avatar: "https://randomuser.me/api/portraits/women/39.jpg",
      rating: 4,
      platform: "Freelancer",
    },
    {
      quote: "My clients are impressed with how quickly I can turn around detailed, customized proposals.",
      author: "Liam Brown",
      role: "Data Analyst",
      avatar: "https://randomuser.me/api/portraits/men/29.jpg",
      rating: 5,
      platform: "Upwork",
    },
  ];

  // Animation effect for scrolling testimonials
  useEffect(() => {
    // Function to animate the testimonial rows
    const animateRows = () => {
      // First row: right to left (negative movement)
      if (row1Ref.current) {
        const firstRow = row1Ref.current;
        const firstCard = firstRow.querySelector('.testimonial-card');
        if (firstCard) {
          const cardWidth = firstCard.offsetWidth + 16; // card width + gap
          firstRow.style.transform = 'translateX(0)'; // Reset position
          firstRow.animate(
            [
              { transform: 'translateX(0)' },
              { transform: `translateX(-${cardWidth}px)` }
            ],
            {
              duration: 30000,
              iterations: Infinity
            }
          );
        }
      }

      // Second row: left to right (positive movement)
      if (row2Ref.current) {
        const secondRow = row2Ref.current;
        const firstCard = secondRow.querySelector('.testimonial-card');
        if (firstCard) {
          const cardWidth = firstCard.offsetWidth + 16; // card width + gap
          secondRow.style.transform = `translateX(-${cardWidth}px)`; // Start from negative position
          secondRow.animate(
            [
              { transform: `translateX(-${cardWidth}px)` },
              { transform: 'translateX(0)' }
            ],
            {
              duration: 30000,
              iterations: Infinity
            }
          );
        }
      }

      // Third row: right to left (negative movement)
      if (row3Ref.current) {
        const thirdRow = row3Ref.current;
        const firstCard = thirdRow.querySelector('.testimonial-card');
        if (firstCard) {
          const cardWidth = firstCard.offsetWidth + 16; // card width + gap
          thirdRow.style.transform = 'translateX(0)'; // Reset position
          thirdRow.animate(
            [
              { transform: 'translateX(0)' },
              { transform: `translateX(-${cardWidth}px)` }
            ],
            {
              duration: 30000,
              iterations: Infinity
            }
          );
        }
      }
    };

    // Start animation after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      animateRows();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to render star ratings
  const renderStars = (rating) => {
    return Array(rating)
      .fill(0)
      .map((_, i) => (
        <FiStar key={i} className="w-3 h-3 text-yellow-500 fill-current" />
      ));
  };

  // Function to render a testimonial card
  const renderTestimonialCard = (testimonial, index) => (
    <div 
      key={`${testimonial.author}-${index}`}
      className="testimonial-card flex-shrink-0 bg-white rounded-lg shadow-md p-6 w-72 mx-4"
    >
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0 mr-4">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.author} 
            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{testimonial.author}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
          <div className="flex items-center mt-1">
            <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 rounded-full text-emerald-700 mr-2">
              {testimonial.platform}
            </span>
            <div className="flex">
              {renderStars(testimonial.rating)}
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed italic h-24 break-words whitespace-normal">
        "{testimonial.quote}"
      </p>
    </div>
  );

  // Stats data
  const stats = [
    {
      value: '40%',
      label: 'Average Increase in Win Rate',
      icon: <FiAward className="w-6 h-6" />,
    },
    {
      value: '75%',
      label: 'Time Saved on Proposal Writing',
      icon: <FiMessageCircle className="w-6 h-6" />,
    },
    {
      value: '10,000+',
      label: 'Freelancers Using Proposly',
      icon: <FiUser className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-emerald-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Trusted by 10,000+ freelancers worldwide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of freelancers who are winning more projects with less effort
          </p>
        </div>

        {/* Testimonial rows */}
        <div className="mb-16 space-y-8 overflow-hidden">
          {/* Row 1: Right to Left */}
          <div className="relative">
            <div 
              ref={row1Ref}
              className="flex py-1"
            >
              {/* Duplicate testimonials to create infinite scroll effect */}
              {[...row1Testimonials, ...row1Testimonials].map((testimonial, index) => 
                renderTestimonialCard(testimonial, index)
              )}
            </div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="relative">
            <div 
              ref={row2Ref}
              className="flex py-1"
            >
              {/* Duplicate testimonials to create infinite scroll effect */}
              {[...row2Testimonials, ...row2Testimonials].map((testimonial, index) => 
                renderTestimonialCard(testimonial, index)
              )}
            </div>
          </div>

          {/* Row 3: Right to Left */}
          <div className="relative">
            <div 
              ref={row3Ref}
              className="flex py-1"
            >
              {/* Duplicate testimonials to create infinite scroll effect */}
              {[...row3Testimonials, ...row3Testimonials].map((testimonial, index) => 
                renderTestimonialCard(testimonial, index)
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 ${index === 1 ? 'bg-emerald-600 text-white' : 'bg-white'}`}
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${index === 1 ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${index === 1 ? 'text-white' : 'text-emerald-600'}`}>{stat.value}</div>
                <div className={index === 1 ? 'text-emerald-100' : 'text-gray-600'}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
