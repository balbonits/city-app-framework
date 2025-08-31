# Project Context Definition System

## Overview: The Mayor's City Planning Process

In the City App Framework, the **Developer is the Mayor** who governs their digital city, while **AI agents are the citizens** who build, maintain, and expand the city based on the mayor's vision. The Context Definition System is like the mayor's comprehensive city planning documents - it captures the vision, goals, constraints, and policies that guide all AI citizens in building the perfect digital city.

## The Mayor-AI Relationship

### The Mayor (Developer) Provides:
- **Vision**: What should this city become?
- **Purpose**: What problems does this city solve?
- **Policies**: What rules and constraints must be followed?
- **Resources**: What budget and timeline do we have?
- **Citizens**: Who will live in this city (users)?

### The AI Citizens Execute:
- **Urban Planning**: Architecture and system design
- **Construction**: Code implementation
- **Infrastructure**: APIs, databases, services
- **Utilities**: Testing, security, performance
- **Documentation**: Record keeping and knowledge management
- **Maintenance**: Bug fixes, updates, improvements

## Context Building Approaches

### 1. Interactive Mayor's Briefing (Recommended)

#### The Vision Session
```
┌─────────────────────────────────────────────────┐
│  🏛️ Welcome, Mayor! Let's Plan Your City        │
├─────────────────────────────────────────────────┤
│  Your AI citizens are ready to build, but       │
│  they need your vision to create the perfect    │
│  digital city for your users.                   │
└─────────────────────────────────────────────────┘

🎯 What problem will your city solve?
"I want to create a fitness tracking city where residents can log workouts, track progress, and achieve their health goals through personalized recommendations."

👥 Who are your city's residents (users)?
"Health-conscious individuals aged 25-45 who want data-driven fitness optimization and social motivation."

🏆 What's your main goal as mayor?
○ Build the largest city (user growth)
○ Create the most engaged community (retention) ●
○ Generate revenue (monetization)
○ Become the best in class (quality)
○ Solve a social problem (impact)
```

#### The Policy Framework
```
📋 What policies must all AI citizens follow?

🔒 Security Policies:
• All user data must be encrypted at rest
• No third-party trackers allowed
• HTTPS only for all communications
• Rate limiting on all APIs

⚡ Performance Policies:
• Bundle size must stay under 1MB
• Time to interactive under 3 seconds
• 90%+ mobile performance score
• Offline functionality for core features

♿ Accessibility Policies:
• WCAG 2.1 AA compliance required
• Screen reader support mandatory
• Keyboard navigation for all features
• High contrast mode support

🌍 Platform Policies:
• Mobile-first design (primary usage on phones)
• Progressive Web App capabilities
• Work offline in gym environments
• Integration with fitness APIs (Strava, MyFitnessPal)
```

#### The Resource Allocation
```
💰 What's your city's budget?

👨‍💻 Development Team:
○ Solo mayor (just you)
○ Small team (2-3 people)
○ Medium team (4-10 people)
○ Large team (10+ people)

⏰ Timeline:
○ Rapid prototype (1-2 weeks)
○ MVP launch (1-2 months)
○ Full featured app (3-6 months) ●
○ Long-term project (6+ months)

🏗️ Technical Constraints:
• Must integrate with existing fitness APIs
• Need offline functionality for gym use
• GDPR compliance for EU users
• Must scale to 10,000+ users
• Host on AWS with CI/CD pipeline
```

### 2. Document Upload & Analysis

#### Upload Existing Documentation
```
📄 Upload Your Existing City Plans

Supported formats:
• Business Requirements Document (BRD)
• Product Requirements Document (PRD)  
• Technical Specifications
• User Stories (Jira, GitHub Issues)
• Design Documents (Figma, Sketch)
• API Documentation
• Competitive Analysis
• User Research

🤖 AI Analysis Process:
1. Extract business goals and objectives
2. Identify target users and personas
3. Map out core features and functionality
4. Detect technical constraints and requirements
5. Understand performance and quality standards
6. Generate comprehensive AI context

📊 Confidence Score: 87%
✅ Business domain: Fitness/Health tracking
✅ Target users: Fitness enthusiasts
✅ Core features: Workout tracking, progress analytics
✅ Platform: Mobile-first PWA
⚠️  Security requirements: Need clarification
⚠️  Performance budget: Not specified
```

### 3. Domain Template Selection

#### Pre-built Industry Templates
```
🏭 Choose Your City Type (Industry Domain)

🛒 E-commerce City
   • Product catalogs and inventory
   • Shopping cart and checkout
   • Payment processing
   • Order management
   • Customer reviews and ratings
   
💼 SaaS Dashboard City  
   • User management and auth
   • Analytics and reporting
   • Subscription management
   • Admin panels and controls
   • API integrations

📝 Content Management City
   • Article/blog management
   • SEO optimization
   • Comment systems
   • Media galleries
   • Publishing workflows

💪 Fitness/Health City ● (Selected)
   • Workout planning and tracking
   • Nutrition logging and analysis
   • Progress tracking and analytics
   • Social challenges and sharing
   • Wearable device integration
   • Personal trainer connections

🏦 Financial Services City
   • Account management
   • Transaction processing
   • Investment tracking
   • Compliance and reporting
   • Security and fraud prevention
```

#### Template Customization
```
💪 Fitness City Template Selected

🎨 Customize Your Fitness City:

Core Districts (Features):
☑ Authentication District (User registration/login)
☑ Workout District (Exercise tracking and planning)
☑ Nutrition District (Food logging and analysis)
☑ Progress District (Analytics and reporting)
☑ Social District (Sharing and challenges)
☐ Marketplace District (Premium features, coaches)
☐ Integration District (Wearables, third-party apps)

Special Amenities:
☑ AI Workout Recommendations
☑ Offline Gym Mode
☑ Photo Progress Tracking
☐ Video Exercise Library
☐ Live Workout Streaming
☐ Nutritionist Chat Support

City Policies (Auto-configured from template):
✅ Health data encryption (HIPAA-like standards)
✅ Social features with privacy controls
✅ Gamification elements (achievements, streaks)
✅ Mobile-optimized interface
✅ API integrations (fitness trackers, nutrition databases)
```

### 4. Minimal Setup (Quick Start)

#### Essential Context Only
```
🚀 Quick City Setup

Just the essentials - you can expand later:

Project Name: fitness-tracker-pro
Purpose: Help users track workouts and nutrition
Platform: Web app (mobile-friendly)
Users: Fitness enthusiasts
AI Agent: Claude Code

🏗️ Basic City Infrastructure:
✅ User authentication
✅ Data storage
✅ Responsive design
✅ Basic testing setup
✅ Deployment pipeline

📝 Context Level: Minimal
   • Basic project structure
   • Core patterns and conventions
   • Essential AI instructions
   • Expandable architecture

You can always run `npm run ai:expand-context` later to add more detailed context as your city grows!
```

## Context Generation Process

### AI Context Builder Engine
```typescript
/**
 * City Context Builder - Transforms mayor's vision into AI-readable context
 */
class CityContextBuilder {
  // Transform human vision into structured AI context
  buildCityPlan(mayorVision: MayorVision): CityContext {
    return {
      cityOverview: this.extractCityOverview(mayorVision),
      residents: this.defineResidents(mayorVision.users),
      districts: this.planDistricts(mayorVision.features),
      policies: this.establishPolicies(mayorVision.constraints),
      infrastructure: this.designInfrastructure(mayorVision.platform),
      aiCitizenInstructions: this.generateAIInstructions(mayorVision)
    };
  }
  
  // Generate district-specific context
  planDistrict(districtName: string, requirements: Requirements): DistrictContext {
    return {
      purpose: this.definePurpose(districtName, requirements),
      layout: this.designLayout(districtName),
      utilities: this.planUtilities(requirements),
      regulations: this.applyRegulations(districtName),
      connections: this.mapConnections(districtName),
      aiWorkInstructions: this.generateDistrictAI(districtName)
    };
  }
}
```

### Generated Context Structure
```typescript
interface CityContext {
  // Mayor's Vision
  cityOverview: {
    name: string;
    purpose: string;
    vision: string;
    success_metrics: string[];
  };
  
  // Residents (Users)  
  residents: {
    primary_users: UserPersona[];
    user_journeys: UserJourney[];
    pain_points: string[];
    desired_outcomes: string[];
  };
  
  // City Districts (Features)
  districts: {
    [districtName: string]: {
      purpose: string;
      core_functionality: string[];
      user_interactions: string[];
      business_rules: string[];
      api_requirements: string[];
    };
  };
  
  // City Policies (Constraints)
  policies: {
    security: SecurityPolicy[];
    performance: PerformancePolicy[];
    accessibility: AccessibilityPolicy[];
    compliance: CompliancePolicy[];
    quality: QualityPolicy[];
  };
  
  // Infrastructure (Technical)
  infrastructure: {
    platform: Platform;
    architecture: Architecture;
    integrations: Integration[];
    deployment: DeploymentConfig;
  };
  
  // AI Citizen Instructions
  aiCitizenInstructions: {
    global_instructions: string[];
    coding_standards: CodingStandards;
    testing_requirements: TestingRequirements;
    documentation_standards: DocumentationStandards;
    review_criteria: ReviewCriteria[];
  };
}
```

## Context Templates by Domain

### Fitness/Health City Template
```yaml
city_type: fitness_health
default_policies:
  security:
    - encrypt_health_data: true
    - hipaa_compliance: recommended
    - social_privacy_controls: required
  performance:
    - offline_core_features: required
    - mobile_first: true
    - load_time_under_3s: true
  integrations:
    - fitness_trackers: [fitbit, apple_health, google_fit]
    - nutrition_apis: [usda_food_data, nutritionix]
    - social_platforms: [strava, myfitnesspal]

common_districts:
  - authentication: User registration and profiles
  - workout_tracking: Exercise logging and planning
  - nutrition_tracking: Food logging and analysis
  - progress_analytics: Charts, reports, achievements
  - social_features: Sharing, challenges, community

ai_instructions:
  - prioritize_user_health_data_security
  - optimize_for_mobile_gym_usage
  - generate_motivational_ui_copy
  - include_accessibility_for_disabilities
  - gamify_user_engagement
```

### E-commerce City Template
```yaml
city_type: ecommerce
default_policies:
  security:
    - pci_compliance: required
    - user_data_encryption: required
    - secure_payment_processing: required
  performance:
    - fast_product_search: true
    - optimized_images: true
    - cart_persistence: required
  integrations:
    - payment_processors: [stripe, paypal, square]
    - shipping_apis: [fedex, ups, usps]
    - analytics: [google_analytics, mixpanel]

common_districts:
  - product_catalog: Browse and search products
  - shopping_cart: Cart management and checkout
  - user_accounts: Profiles, orders, wishlists
  - payment_processing: Secure transactions
  - order_management: Fulfillment and tracking
  - customer_service: Returns, support, reviews
```

## Interactive Context Building

### Smart Question Flow
```typescript
class SmartQuestionFlow {
  // Adapts questions based on previous answers
  async askAdaptiveQuestions(context: PartialContext): Promise<FullContext> {
    const questions = this.generateQuestions(context);
    
    for (const question of questions) {
      const answer = await this.askQuestion(question);
      context = this.updateContext(context, question, answer);
      
      // AI adapts future questions based on answers
      this.adaptQuestionFlow(context);
    }
    
    return this.finalizeContext(context);
  }
  
  // Generate contextual follow-up questions
  generateFollowUps(answer: Answer, context: Context): Question[] {
    // If user mentions mobile-first...
    if (answer.includes('mobile')) {
      return [
        'What mobile features are most important?',
        'Do you need offline functionality?',
        'Which mobile platforms to target?'
      ];
    }
    
    // If user mentions e-commerce...
    if (answer.includes('payment', 'cart', 'shop')) {
      return [
        'Which payment methods to support?',
        'Do you need inventory management?',
        'What shipping integrations needed?'
      ];
    }
  }
}
```

### Context Validation & Enrichment
```typescript
class ContextValidator {
  // Validate context completeness and consistency
  validateContext(context: CityContext): ValidationResult {
    const issues = [];
    const suggestions = [];
    
    // Check for completeness
    if (!context.residents.primary_users.length) {
      issues.push('No primary users defined');
      suggestions.push('Define at least one user persona');
    }
    
    // Check for consistency  
    if (context.policies.performance.mobile_first && 
        !context.infrastructure.platform.supports_mobile) {
      issues.push('Mobile-first policy conflicts with platform choice');
      suggestions.push('Choose mobile-compatible platform or adjust policy');
    }
    
    return { issues, suggestions, valid: issues.length === 0 };
  }
  
  // AI enriches context with domain knowledge
  enrichContext(context: CityContext): EnrichedContext {
    return {
      ...context,
      // Add domain-specific best practices
      best_practices: this.getDomainBestPractices(context.cityOverview.domain),
      // Suggest additional features
      suggested_features: this.suggestFeatures(context),
      // Identify potential risks
      risk_analysis: this.analyzeRisks(context),
      // Recommend integrations
      recommended_integrations: this.recommendIntegrations(context)
    };
  }
}
```

## Context Evolution & Learning

### Adaptive Context System
```typescript
class AdaptiveContextSystem {
  // Learn from development patterns
  learnFromDevelopment(context: CityContext, codeChanges: CodeChange[]): ContextUpdate {
    const patterns = this.identifyPatterns(codeChanges);
    const gaps = this.identifyContextGaps(context, patterns);
    
    return {
      new_patterns: patterns,
      context_gaps: gaps,
      suggested_updates: this.generateUpdates(gaps),
      confidence_score: this.calculateConfidence(patterns)
    };
  }
  
  // Update context based on user feedback
  updateFromFeedback(context: CityContext, feedback: UserFeedback): CityContext {
    return {
      ...context,
      // Refine based on what worked/didn't work
      refined_policies: this.refinePolicies(context.policies, feedback),
      updated_priorities: this.updatePriorities(context, feedback),
      new_insights: this.extractInsights(feedback)
    };
  }
}
```

## Benefits for Solo Developers

### Why Context Definition is a Game-Changer

1. **AI Citizens Know Their Job**: Clear context means AI generates exactly what you need
2. **Consistent Vision**: All AI-generated code follows your vision and constraints
3. **Faster Development**: Less back-and-forth explaining what you want
4. **Quality Assurance**: Built-in policies ensure quality standards
5. **Easy Onboarding**: New AI agents can understand your project immediately
6. **Scalable Growth**: Context guides expansion as your city grows

### Time Investment vs. Returns
- **Initial Setup**: 30-60 minutes (comprehensive context)
- **Quick Setup**: 5-10 minutes (minimal context, expand later)
- **Returns**: 3-5x faster AI-assisted development
- **Long-term**: Self-maintaining documentation and standards

## Success Metrics

### Context Quality Indicators
```typescript
interface ContextQualityMetrics {
  completeness: number;        // How complete is the context?
  clarity: number;            // How clear are the instructions?
  consistency: number;        // Are policies and goals aligned?
  actionability: number;      // Can AI act on this context?
  maintainability: number;    // Can context be updated easily?
}

// AI measures and improves context quality
class ContextQualityAnalyzer {
  analyzeQuality(context: CityContext): ContextQualityReport {
    return {
      score: this.calculateOverallScore(context),
      strengths: this.identifyStrengths(context),
      weaknesses: this.identifyWeaknesses(context),
      improvements: this.suggestImprovements(context),
      examples: this.provideExamples(context)
    };
  }
}
```

## Conclusion

The Context Definition System transforms the traditional developer-tool relationship into a **Mayor-Citizens collaboration**. By providing rich, structured context about your digital city's vision, policies, and goals, you enable AI citizens to build exactly what you envision - faster, more consistently, and with higher quality than ever before.

This isn't just documentation - it's the **constitutional framework** that governs your digital city and empowers your AI citizens to be the best builders they can be. 🏛️✨