'use client'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 mx-auto w-fit px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Powered by Chainlink Runtime Environment • Ethereum Sepolia • Fully Regulated
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-balance mx-auto">
              <span className="text-blue-600">CRE</span>
            </h1>
            <h2 className="text-xl sm:text-2xl text-gray-600 mt-4 mb-8">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-600 block mt-2">
                Trade Intelligence & Tokenized Asset Network
              </span>
              <br />
              <span className="text-blue-600 leading-6 text-lg sm:text-xl text-balance max-w-2xl mx-auto block mt-4">
                Unlock Web3 for Your Small Business Working Capital
              </span>
            </h2>
            <div className="mt-8 max-w-3xl mx-auto">
              <ul className="text-lg leading-8 text-gray-600 text-left space-y-4 max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span>
                    Enter the world of Agentic Commerce and Stablecoins.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span>
                    Stop waiting weeks for payments - transform your Invoices, A R, Bills of Lading and other trade instruments to instant liquidity
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span>Get paid faster with automated smart contracts and compliance built for enterprises and small businesses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span>
                    Access global markets and earn better yields on cash through regulated blockchain technology
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors">
                Start Free Trial →
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium text-lg transition-colors">
                Watch Demo
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <span>Supports:</span>
              <span className="px-2 py-1 border border-gray-300 rounded text-xs">ETH</span>
              <span className="px-2 py-1 border border-gray-300 rounded text-xs">USDC</span>
              <span className="px-2 py-1 border border-gray-300 rounded text-xs">MetaMask</span>
              <span className="px-2 py-1 border border-gray-300 rounded text-xs">Ethereum Sepolia</span>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-20">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-600 to-blue-800" />
          </div>
        </div>
      </section>

      {/* Trade News Section with RSS Feeds */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Current on Global Trade</h2>
            <p className="mt-4 text-lg text-gray-600">
              Stay informed with real-time updates on global trade developments, supply chain impacts, and market
              opportunities affecting small businesses worldwide. Find new trading partners and expand your global reach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* WTO News Feed */}
            <div className="bg-white rounded-lg shadow-lg h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🌐</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">WTO Updates</h3>
                  <p className="text-sm text-gray-600">World Trade Organization</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium text-sm mb-1">Trade Facilitation Agreement Implementation</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    New digital customs procedures reduce MSME compliance costs by 15-30% across participating
                    countries. Find verified trading partners through enhanced transparency.
                  </p>
                  <span className="text-xs text-blue-600">2 hours ago</span>
                </div>
                <div className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium text-sm mb-1">Small Business Trade Support Initiative</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    WTO launches $50M fund to help MSMEs access international markets through digital platforms.
                    New partner discovery programs launching Q2 2025.
                  </p>
                  <span className="text-xs text-gray-500">6 hours ago</span>
                </div>
                <div className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium text-sm mb-1">Supply Chain Resilience Framework</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    New guidelines help small exporters diversify supply chains and discover alternative trading partners to reduce single-point failures.
                  </p>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                View All WTO News
              </button>
            </div>

            {/* Trade Finance News */}
            <div className="bg-white rounded-lg shadow-lg h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Trade Finance</h3>
                  <p className="text-sm text-gray-600">Market & Regulatory Updates</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium text-sm mb-1">Digital Trade Finance Adoption Surges</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Blockchain-based trade finance reduces processing time from 7-10 days to 24 hours for SMEs.
                    Partner verification now happens in real-time.
                  </p>
                  <span className="text-xs text-blue-600">4 hours ago</span>
                </div>
                <div className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium text-sm mb-1">SWIFT Pilots Instant Cross-Border Payments</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    New system promises same-day settlement for international trade transactions under $50K.
                    Enhanced KYC allows faster partner onboarding.
                  </p>
                  <span className="text-xs text-gray-500">8 hours ago</span>
                </div>
                <div className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium text-sm mb-1">Trade Credit Insurance Rates Drop</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Improved risk assessment tools reduce insurance costs by 20% for emerging market trades.
                    Better partner verification reduces default rates.
                  </p>
                  <span className="text-xs text-gray-500">12 hours ago</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                View Finance News
              </button>
            </div>

            {/* Supply Chain & Impact */}
            <div className="bg-white rounded-lg shadow-lg h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 text-xl">📈</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Supply Chain Impact</h3>
                  <p className="text-sm text-gray-600">Price & Logistics Updates</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium text-sm mb-1">Container Shipping Rates Stabilize</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Asia-Europe routes see 25% cost reduction, benefiting small importers with better margins.
                    New carrier partnerships available through verified networks.
                  </p>
                  <span className="text-xs text-blue-600">1 hour ago</span>
                </div>
                <div className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium text-sm mb-1">Raw Material Price Volatility Alert</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Copper and steel prices fluctuate 15% weekly, impacting manufacturing SME cost planning.
                    Alternative suppliers emerging in new markets.
                  </p>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
                <div className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium text-sm mb-1">Alternative Shipping Routes Open</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    New rail corridors through Central Asia offer 30% faster delivery for European-bound goods.
                    Connect with logistics partners on verified platforms.
                  </p>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                View Impact Analysis
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-4">
              News updates powered by WTO RSS feeds, Reuters Trade API, and global supply chain monitoring systems
            </p>
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Subscribe to Trade Alerts →
            </button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why MSMEs Choose CRE</h2>
            <p className="mt-4 text-lg text-gray-600">
              Traditional trade finance is slow, expensive, and excludes small businesses. CRE changes everything with Chainlink Runtime Environment and stablecoins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <span className="text-red-600 text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Faster Business Velocity</h3>
              <p className="text-gray-600">
                Reduce settlement times from weeks to minutes. Smart contracts automate compliance and payments,
                eliminating traditional banking delays that hurt cash flow. Ethereum enables instant global transactions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Better Treasury Yields</h3>
              <p className="text-gray-600">
                Earn 4-8% APY on working capital through regulated DeFi protocols and stablecoin yields, compared to 0.1% in traditional
                business accounts. Keep liquidity operational while maximizing returns through USDC and ETH staking.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Regulatory Compliance</h3>
              <p className="text-gray-600">
                Built for international trade standards with automatic compliance reporting. Meet jurisdictional requirements
                while accessing global markets through regulated stablecoin settlements and blockchain transparency.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">🏭</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">MSME-First Design</h3>
              <p className="text-gray-600">
                No minimum transaction sizes or complex requirements. Start with $100 trades and scale up. Educational
                resources help small businesses transition to Web3 and stablecoins confidently.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Digital Negotiable Instruments</h3>
              <p className="text-gray-600">
                Transform traditional trade documents into programmable RWA NFTs using Ethereum. Bills of lading, letters of credit,
                and invoices become instantly tradeable and verifiable assets on Ethereum Sepolia.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                <span className="text-teal-600 text-xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-gray-600">
                Ethereum's enterprise-grade blockchain with institutional custody solutions. Multi-signature wallets,
                insurance coverage, and 24/7 monitoring protect your digital assets and stablecoin holdings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* User Types Section */}
      <UserTypesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Gopal Velusamy",
      role: "Business Head",
      company: "Jupiter Knitting Company",
      avatar: "GV",
      avatarBg: "bg-blue-500",
      rating: 5,
      quote: "CRE transformed our working capital cycle from 90 days to instant settlements. We tokenized our bills of lading and got instant liquidity from global investors. Game-changer for Indian MSMEs!",
      metric: "90 days → Instant settlement",
      industry: "Textiles"
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "CFO",
      company: "Global Import Partners",
      avatar: "MS",
      avatarBg: "bg-green-500",
      rating: 5,
      quote: "As an importer, we used to struggle with LC requirements. Now we buy tokenized trade instruments directly on the marketplace with USDC. Fast, transparent, and cost-effective.",
      metric: "$2.3M in trade volume",
      industry: "Import/Export"
    },
    {
      id: 3,
      name: "David Chen",
      role: "Investment Director",
      company: "Asia Pacific Fund",
      avatar: "DC",
      avatarBg: "bg-purple-500",
      rating: 5,
      quote: "We're earning 12-14% APY on trade finance RWAs with full regulatory compliance. The fractionalization allows us to diversify across 50+ shipments with just $50K. Unprecedented access to trade finance.",
      metric: "14% APY returns",
      industry: "Institutional Finance"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Trade Professionals Worldwide</h2>
          <p className="mt-4 text-lg text-gray-600">
            See how exporters, importers, investors, and carriers are transforming their trade finance operations with CRE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`${testimonial.avatarBg} rounded-full h-14 w-14 flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {testimonial.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-lg truncate">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 truncate">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow">
                "{testimonial.quote}"
              </blockquote>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {testimonial.industry}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {testimonial.metric}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Join 500+ Trade Professionals</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start transforming your trade finance operations today. Connect your MetaMask wallet and experience
              the future of cross-border commerce on Ethereum Sepolia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Get Started Free →
              </button>
              <button className="border border-gray-300 hover:bg-white text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserTypesSection() {
  const userTypes = [
    {
      id: 1,
      icon: "📦",
      title: "For Exporters",
      description: "Sell goods internationally and need fast payment",
      benefits: [
        "Get paid in 3 days instead of 90 days",
        "Tokenize bills of lading for instant liquidity",
        "Access global investor funding",
        "No need to wait for buyer payments"
      ],
      ctaText: "Start Exporting →",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: 2,
      icon: "🏪",
      title: "For Importers",
      description: "Purchase goods and need flexible payment options",
      benefits: [
        "Buy verified trade documents on marketplace",
        "No letter of credit hassles",
        "Pay with USDC stablecoins",
        "Transparent pricing and instant settlement"
      ],
      ctaText: "Start Importing →",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      id: 3,
      icon: "🚢",
      title: "For Carriers",
      description: "Transport goods and issue bills of lading",
      benefits: [
        "Digital bills of lading (no paperwork!)",
        "85% faster document processing",
        "Smart contract automation",
        "IPFS decentralized storage"
      ],
      ctaText: "Digitize Operations →",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      buttonColor: "bg-teal-600 hover:bg-teal-700"
    },
    {
      id: 4,
      icon: "🏛️",
      title: "For Institutional Investors",
      description: "Large funds seeking trade finance opportunities",
      benefits: [
        "Earn 12-14% APY on trade finance",
        "Diversify across global trade instruments",
        "Full regulatory compliance",
        "Fractionalized RWA access"
      ],
      ctaText: "View Investment Opportunities →",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      id: 5,
      icon: "💵",
      title: "For Retail Investors",
      description: "Individual investors with any amount of capital",
      benefits: [
        "Start investing with just $50",
        "Earn steady returns on real trade",
        "Support MSMEs globally",
        "Web3 made simple and accessible"
      ],
      ctaText: "Start Investing →",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    },
    {
      id: 6,
      icon: "🛡️",
      title: "For Regulators",
      description: "Ensure compliance and maintain oversight",
      benefits: [
        "Real-time audit trails and monitoring",
        "DCSA v3 compliance built-in",
        "Complete transparency and traceability",
        "International trade standards met"
      ],
      ctaText: "Learn About Compliance →",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      buttonColor: "bg-red-600 hover:bg-red-700"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Built for Every Trade Participant
          </h2>
          <p className="text-lg text-gray-600">
            Whether you're an exporter, importer, carrier, investor, or regulator - CRE has
            powerful solutions tailored to your specific needs in the global trade ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {userTypes.map((userType) => (
            <div
              key={userType.id}
              className={`${userType.bgColor} ${userType.borderColor} border-2 rounded-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full`}
            >
              <div className="text-center mb-6">
                <span className="text-5xl">{userType.icon}</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {userType.title}
              </h3>

              <p className="text-gray-600 text-center mb-6 text-sm">
                {userType.description}
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {userType.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-500 text-lg mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>

              <button className={`${userType.buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-colors w-full mt-auto`}>
                {userType.ctaText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">6+</div>
                <div className="text-gray-600 text-sm">User Types Supported</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">40+</div>
                <div className="text-gray-600 text-sm">Countries Worldwide</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600 text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-600">Simple, transparent pricing for businesses of all sizes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 flex flex-col">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🌱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-sm text-gray-600">Perfect for small businesses</p>
            </div>
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">$99</div>
              <div className="text-gray-600 text-sm">per month</div>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Up to 10 Bills of Lading/month</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Basic marketplace access</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">1 user account</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Email support</span></li>
            </ul>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium w-full">Start Free Trial</button>
          </div>

          <div className="bg-blue-50 border-4 border-blue-600 rounded-2xl p-8 flex flex-col relative scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">⭐ POPULAR</span>
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <p className="text-sm text-gray-600">For growing businesses</p>
            </div>
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">$499</div>
              <div className="text-gray-600 text-sm">per month</div>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Unlimited Bills of Lading</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Full marketplace access</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Up to 10 user accounts</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Priority support</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Advanced analytics</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">API access</span></li>
            </ul>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium w-full">Start 14-Day Trial</button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-2xl p-8 flex flex-col">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-sm text-gray-600">Custom solutions</p>
            </div>
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">Custom</div>
              <div className="text-gray-600 text-sm">Contact us</div>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Everything in Professional</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Unlimited users & BLs</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Dedicated account manager</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">24/7 phone support</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">Custom integrations</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span className="text-sm">White-label solution</span></li>
            </ul>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium w-full">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Accelerate Your Business?
          </h2>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 500+ businesses transforming their trade finance operations with Chainlink Runtime Environment.
            Get paid instantly instead of 90 days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg">
              Get Started Free →
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-colors">
              Schedule a Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-blue-100 text-sm mb-8">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Setup in 5 minutes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-blue-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$45M+</div>
              <div className="text-blue-200 text-sm">Trade Volume Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">40+</div>
              <div className="text-blue-200 text-sm">Countries Worldwide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterSection() {
  return (
    <footer className="border-t bg-gray-100">
      <div className="container mx-auto py-12 px-4 text-center">
        <p className="text-gray-600">&copy; 2026 <span className="text-blue-600 font-bold">CRE</span>. All rights reserved.</p>
        <p className="text-gray-500 text-sm mt-2">Powered by Chainlink Runtime Environment • Ethereum Sepolia</p>
      </div>
    </footer>
  );
}
