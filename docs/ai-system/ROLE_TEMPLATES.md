# AI Role Templates & Workflows

## Overview: Pre-Built Expertise for Autonomous AI Citizens

Role templates are **pre-configured workflows and expertise patterns** that allow AI citizens to work autonomously without constant mayor direction. When the mayor says "add user authentication," AI citizens automatically know what roles are needed, what work to do, and how to coordinate - no manual assignment required.

**Key Principle**: Give AI citizens enough structure to work efficiently, but flexibility to adapt to specific project needs.

## Template Architecture

### Template Structure
```typescript
interface RoleTemplate {
  name: string;
  trigger_patterns: string[];         // What mayor requests activate this template
  required_roles: TemplateRole[];     // What roles are needed
  workflow: WorkflowPattern;          // How roles coordinate
  success_criteria: string[];         // When the work is considered complete
  quality_gates: QualityGate[];      // What quality checks are required
}

interface TemplateRole {
  role: CityRole;
  priority: number;                   // 1 = first, 2 = second, etc.
  tasks: string[];                   // Specific tasks for this role
  dependencies: string[];            // What must be done before this role starts
  deliverables: string[];           // What this role produces
  quality_checks: string[];         // How to validate this role's work
}
```

## Core Template Library

### 1. ADD_FEATURE Template
**Triggers**: "add", "feature", "new", "implement", "build", "create"

```typescript
const ADD_FEATURE_TEMPLATE: RoleTemplate = {
  name: 'ADD_FEATURE',
  trigger_patterns: [
    'add * feature', 'implement *', 'build *', 'create *',
    'new * functionality', 'I need *', 'can you add *'
  ],
  
  required_roles: [
    {
      role: CityRole.CITY_PLANNER,
      priority: 1,
      tasks: [
        'analyze_feature_requirements',
        'research_existing_patterns',
        'identify_potential_challenges', 
        'estimate_complexity',
        'break_down_into_subtasks'
      ],
      dependencies: [],
      deliverables: [
        'feature_specification',
        'requirements_document',
        'complexity_assessment',
        'implementation_plan'
      ],
      quality_checks: [
        'requirements_completeness',
        'business_value_validation',
        'technical_feasibility'
      ]
    },
    
    {
      role: CityRole.UX_DESIGNER,
      priority: 2,
      tasks: [
        'design_user_journey',
        'create_wireframes',
        'plan_user_interactions',
        'ensure_accessibility',
        'validate_mobile_experience'
      ],
      dependencies: ['feature_specification'],
      deliverables: [
        'user_flow_diagram',
        'component_wireframes', 
        'interaction_patterns',
        'accessibility_requirements'
      ],
      quality_checks: [
        'usability_validation',
        'accessibility_compliance',
        'mobile_first_design'
      ]
    },
    
    {
      role: CityRole.LEAD_ARCHITECT,
      priority: 3,
      tasks: [
        'design_technical_approach',
        'plan_api_structure',
        'identify_data_requirements',
        'assess_performance_impact',
        'plan_testing_strategy'
      ],
      dependencies: ['feature_specification', 'user_flow_diagram'],
      deliverables: [
        'technical_architecture',
        'api_specification',
        'database_schema_changes',
        'performance_considerations'
      ],
      quality_checks: [
        'architecture_consistency',
        'scalability_validation',
        'security_review'
      ]
    },
    
    {
      role: CityRole.FRONTEND_ENGINEER,
      priority: 4,
      tasks: [
        'implement_ui_components',
        'integrate_with_apis',
        'ensure_responsive_design',
        'optimize_performance',
        'add_error_handling'
      ],
      dependencies: ['component_wireframes', 'api_specification'],
      deliverables: [
        'react_components',
        'component_stories',
        'integration_code',
        'error_boundaries'
      ],
      quality_checks: [
        'component_testing',
        'accessibility_testing',
        'performance_validation'
      ]
    },
    
    {
      role: CityRole.BACKEND_ENGINEER,
      priority: 4, // Parallel with frontend
      tasks: [
        'implement_api_endpoints',
        'update_database_schema',
        'add_business_logic',
        'implement_security_measures',
        'optimize_queries'
      ],
      dependencies: ['api_specification', 'database_schema_changes'],
      deliverables: [
        'api_endpoints',
        'database_migrations',
        'business_logic_modules',
        'security_implementations'
      ],
      quality_checks: [
        'api_testing',
        'security_validation',
        'performance_testing'
      ]
    },
    
    {
      role: CityRole.QA_DIRECTOR,
      priority: 5,
      tasks: [
        'write_comprehensive_tests',
        'perform_integration_testing',
        'validate_user_flows',
        'verify_accessibility',
        'conduct_performance_testing'
      ],
      dependencies: ['react_components', 'api_endpoints'],
      deliverables: [
        'unit_tests',
        'integration_tests',
        'e2e_tests',
        'performance_benchmarks'
      ],
      quality_checks: [
        'test_coverage_validation',
        'quality_gate_compliance',
        'user_acceptance_criteria'
      ]
    }
  ],
  
  workflow: 'sequential_analysis_parallel_implementation',
  success_criteria: [
    'All tests passing',
    'Feature meets requirements',
    'Performance benchmarks met',
    'Accessibility compliance verified',
    'Security review completed'
  ],
  quality_gates: [
    { gate: 'requirements_sign_off', required_roles: [CityRole.CITY_PLANNER] },
    { gate: 'design_approval', required_roles: [CityRole.UX_DESIGNER] },
    { gate: 'architecture_review', required_roles: [CityRole.LEAD_ARCHITECT] },
    { gate: 'implementation_complete', required_roles: [CityRole.FRONTEND_ENGINEER, CityRole.BACKEND_ENGINEER] },
    { gate: 'quality_validation', required_roles: [CityRole.QA_DIRECTOR] }
  ]
};
```

### 2. FIX_BUG Template
**Triggers**: "bug", "fix", "error", "broken", "issue", "problem"

```typescript
const FIX_BUG_TEMPLATE: RoleTemplate = {
  name: 'FIX_BUG',
  trigger_patterns: [
    'fix *', 'bug in *', '* is broken', '* not working',
    'error with *', 'problem with *', 'issue with *'
  ],
  
  required_roles: [
    {
      role: CityRole.QA_DIRECTOR,
      priority: 1,
      tasks: [
        'reproduce_bug',
        'analyze_error_logs',
        'identify_root_cause',
        'assess_impact_scope',
        'create_test_cases_for_regression'
      ],
      dependencies: [],
      deliverables: [
        'bug_reproduction_steps',
        'root_cause_analysis',
        'impact_assessment',
        'regression_test_plan'
      ],
      quality_checks: [
        'bug_confirmation',
        'cause_identification_accuracy'
      ]
    },
    
    {
      role: CityRole.FRONTEND_ENGINEER,
      priority: 2,
      tasks: [
        'fix_frontend_issues',
        'update_component_logic',
        'improve_error_handling',
        'test_fix_locally'
      ],
      dependencies: ['root_cause_analysis'],
      deliverables: [
        'fixed_components',
        'improved_error_handling',
        'local_test_results'
      ],
      quality_checks: [
        'fix_validation',
        'no_new_regressions'
      ]
    },
    
    {
      role: CityRole.BACKEND_ENGINEER,
      priority: 2, // Parallel with frontend
      tasks: [
        'fix_backend_issues',
        'update_api_logic',
        'improve_error_responses',
        'optimize_problematic_queries'
      ],
      dependencies: ['root_cause_analysis'],
      deliverables: [
        'fixed_api_endpoints',
        'improved_error_responses',
        'optimized_queries'
      ],
      quality_checks: [
        'api_fix_validation',
        'performance_improvement_verification'
      ]
    },
    
    {
      role: CityRole.QA_DIRECTOR,
      priority: 3,
      tasks: [
        'verify_bug_fix',
        'run_regression_tests',
        'validate_no_side_effects',
        'update_test_suite'
      ],
      dependencies: ['fixed_components', 'fixed_api_endpoints'],
      deliverables: [
        'fix_verification_report',
        'regression_test_results',
        'updated_test_suite'
      ],
      quality_checks: [
        'bug_resolution_confirmation',
        'regression_prevention_validation'
      ]
    }
  ],
  
  workflow: 'investigate_then_parallel_fix_then_verify',
  success_criteria: [
    'Bug no longer reproducible',
    'All existing tests still pass',
    'No performance regressions',
    'Fix documented and tested'
  ]
};
```

### 3. SECURITY_AUDIT Template
**Triggers**: "security", "audit", "vulnerability", "secure", "hack", "breach"

```typescript
const SECURITY_AUDIT_TEMPLATE: RoleTemplate = {
  name: 'SECURITY_AUDIT',
  trigger_patterns: [
    'security audit', 'check security', 'vulnerability scan',
    'secure *', 'security review', 'potential security issues'
  ],
  
  required_roles: [
    {
      role: CityRole.SECURITY_CHIEF,
      priority: 1,
      tasks: [
        'conduct_security_assessment',
        'scan_for_vulnerabilities',
        'review_authentication_logic',
        'analyze_data_flow',
        'check_input_validation'
      ],
      dependencies: [],
      deliverables: [
        'security_assessment_report',
        'vulnerability_scan_results',
        'risk_prioritization',
        'remediation_plan'
      ],
      quality_checks: [
        'comprehensive_coverage',
        'accurate_risk_assessment'
      ]
    },
    
    {
      role: CityRole.BACKEND_ENGINEER,
      priority: 2,
      tasks: [
        'implement_security_fixes',
        'improve_input_validation',
        'enhance_authentication',
        'secure_api_endpoints',
        'implement_rate_limiting'
      ],
      dependencies: ['remediation_plan'],
      deliverables: [
        'security_improvements',
        'enhanced_validation',
        'secured_endpoints'
      ],
      quality_checks: [
        'security_fix_validation',
        'no_functionality_regression'
      ]
    },
    
    {
      role: CityRole.DEVOPS_ENGINEER,
      priority: 3,
      tasks: [
        'secure_infrastructure',
        'update_security_configs',
        'implement_monitoring',
        'setup_security_alerts'
      ],
      dependencies: ['security_improvements'],
      deliverables: [
        'secured_infrastructure',
        'security_monitoring',
        'alert_systems'
      ],
      quality_checks: [
        'infrastructure_security_validation',
        'monitoring_effectiveness'
      ]
    }
  ],
  
  workflow: 'assess_then_implement_then_monitor',
  success_criteria: [
    'No high-risk vulnerabilities',
    'Security best practices implemented',
    'Monitoring and alerting active',
    'Security documentation updated'
  ]
};
```

### 4. OPTIMIZE_PERFORMANCE Template
**Triggers**: "slow", "performance", "optimize", "speed", "fast", "load time"

```typescript
const OPTIMIZE_PERFORMANCE_TEMPLATE: RoleTemplate = {
  name: 'OPTIMIZE_PERFORMANCE',
  trigger_patterns: [
    '* is slow', 'improve performance', 'optimize *', 'speed up *',
    'load time', 'performance issues', 'make * faster'
  ],
  
  required_roles: [
    {
      role: CityRole.LEAD_ARCHITECT,
      priority: 1,
      tasks: [
        'analyze_performance_bottlenecks',
        'profile_application_performance',
        'identify_optimization_opportunities',
        'plan_performance_improvements',
        'estimate_impact_of_changes'
      ],
      dependencies: [],
      deliverables: [
        'performance_analysis_report',
        'bottleneck_identification',
        'optimization_plan',
        'expected_improvements'
      ],
      quality_checks: [
        'accurate_bottleneck_identification',
        'realistic_improvement_estimates'
      ]
    },
    
    {
      role: CityRole.FRONTEND_ENGINEER,
      priority: 2,
      tasks: [
        'optimize_component_rendering',
        'implement_code_splitting',
        'reduce_bundle_size',
        'optimize_images_and_assets',
        'implement_lazy_loading'
      ],
      dependencies: ['optimization_plan'],
      deliverables: [
        'optimized_components',
        'reduced_bundle_sizes',
        'lazy_loaded_features'
      ],
      quality_checks: [
        'performance_improvement_validation',
        'functionality_preservation'
      ]
    },
    
    {
      role: CityRole.BACKEND_ENGINEER,
      priority: 2, // Parallel with frontend
      tasks: [
        'optimize_database_queries',
        'implement_caching_strategies',
        'improve_api_response_times',
        'optimize_data_structures',
        'reduce_server_processing_time'
      ],
      dependencies: ['optimization_plan'],
      deliverables: [
        'optimized_queries',
        'caching_implementation',
        'improved_apis'
      ],
      quality_checks: [
        'query_performance_validation',
        'caching_effectiveness_verification'
      ]
    },
    
    {
      role: CityRole.DEVOPS_ENGINEER,
      priority: 3,
      tasks: [
        'optimize_infrastructure_configuration',
        'implement_cdn_for_static_assets',
        'setup_performance_monitoring',
        'configure_auto_scaling'
      ],
      dependencies: ['optimized_components', 'optimized_queries'],
      deliverables: [
        'optimized_infrastructure',
        'cdn_configuration',
        'performance_monitoring_dashboard'
      ],
      quality_checks: [
        'infrastructure_performance_validation',
        'monitoring_accuracy'
      ]
    }
  ],
  
  workflow: 'analyze_then_parallel_optimize_then_monitor',
  success_criteria: [
    'Performance targets met',
    'Load times improved by target %',
    'User experience metrics improved',
    'Performance monitoring active'
  ]
};
```

## Template Selection & Execution

### Autonomous Template Matching
```typescript
class TemplateEngine {
  // AI automatically selects best template based on mayor's request
  selectTemplate(mayorRequest: string, projectContext: CityContext): RoleTemplate {
    const normalizedRequest = mayorRequest.toLowerCase().trim();
    const availableTemplates = this.getAvailableTemplates(projectContext);
    
    // Score each template based on pattern matching
    const templateScores = availableTemplates.map(template => ({
      template,
      score: this.calculateMatchScore(normalizedRequest, template.trigger_patterns),
      confidence: this.calculateConfidence(normalizedRequest, template)
    }));
    
    // Return highest scoring template
    const bestMatch = templateScores
      .sort((a, b) => b.score - a.score)[0];
      
    // If confidence is low, ask mayor for clarification
    if (bestMatch.confidence < 0.7) {
      return this.requestClarification(mayorRequest, templateScores.slice(0, 3));
    }
    
    return bestMatch.template;
  }
  
  // Execute template with autonomous role assignment
  async executeTemplate(
    template: RoleTemplate, 
    mayorRequest: string,
    projectContext: CityContext
  ): Promise<CityWorkResult> {
    
    // 1. AI citizens self-organize based on template
    const council = await this.formCouncil(template, projectContext);
    
    // 2. Citizens create detailed work plan
    const workPlan = await council.createWorkPlan(mayorRequest, template);
    
    // 3. Citizens execute work autonomously
    const results = await council.executeWorkPlan(workPlan);
    
    // 4. Citizens validate quality gates
    const qualityValidation = await council.validateQualityGates(template.quality_gates);
    
    // 5. Report back to mayor
    return this.formatMayorReport(results, qualityValidation);
  }
}
```

### Role Assignment Automation
```typescript
class RoleAssignmentEngine {
  // Automatically assign citizens to roles based on expertise and workload
  assignCitizensToRoles(
    template: RoleTemplate,
    availableCitizens: AICitizen[],
    projectContext: CityContext
  ): RoleAssignment[] {
    
    const assignments: RoleAssignment[] = [];
    
    for (const templateRole of template.required_roles) {
      // Find best citizen for this role
      const bestCitizen = this.findBestCitizenForRole(
        templateRole.role,
        availableCitizens,
        projectContext
      );
      
      // Configure citizen with role-specific context
      const roleContext = this.buildRoleContext(
        templateRole,
        projectContext,
        template
      );
      
      assignments.push({
        citizen: bestCitizen,
        role: templateRole.role,
        tasks: templateRole.tasks,
        context: roleContext,
        priority: templateRole.priority,
        dependencies: templateRole.dependencies
      });
    }
    
    return assignments;
  }
  
  private findBestCitizenForRole(
    role: CityRole,
    citizens: AICitizen[],
    context: CityContext
  ): AICitizen {
    // Score citizens based on:
    // - Role expertise match
    // - Current workload
    // - Project context familiarity
    // - Previous performance in similar roles
    
    return citizens
      .map(citizen => ({
        citizen,
        score: this.calculateRoleMatchScore(citizen, role, context)
      }))
      .sort((a, b) => b.score - a.score)[0]
      .citizen;
  }
}
```

## Quality Gates & Success Criteria

### Automated Quality Validation
```typescript
interface QualityGate {
  name: string;
  criteria: QualityCriteria[];
  required_roles: CityRole[];
  validation_method: 'automated' | 'manual' | 'hybrid';
}

class QualityGateValidator {
  async validateQualityGates(
    gates: QualityGate[],
    workResults: WorkResult[],
    assignments: RoleAssignment[]
  ): Promise<QualityValidationResult> {
    
    const results = [];
    
    for (const gate of gates) {
      const validation = await this.validateGate(gate, workResults, assignments);
      results.push(validation);
      
      // Stop if critical gate fails
      if (!validation.passed && gate.critical) {
        break;
      }
    }
    
    return {
      overall_passed: results.every(r => r.passed),
      gate_results: results,
      required_actions: this.generateRequiredActions(results)
    };
  }
  
  private async validateGate(
    gate: QualityGate,
    workResults: WorkResult[],
    assignments: RoleAssignment[]
  ): Promise<GateValidationResult> {
    
    switch (gate.validation_method) {
      case 'automated':
        return this.runAutomatedValidation(gate, workResults);
        
      case 'manual':
        return this.requestManualValidation(gate, assignments);
        
      case 'hybrid':
        const automated = await this.runAutomatedValidation(gate, workResults);
        if (!automated.passed) {
          return this.requestManualValidation(gate, assignments);
        }
        return automated;
    }
  }
}
```

## Benefits of Template System

### For Solo Developers (Mayors)
1. **No Role Management**: AI citizens organize themselves automatically
2. **Consistent Quality**: Templates ensure best practices are followed
3. **Predictable Outcomes**: Know what to expect from each type of request
4. **Reduced Cognitive Load**: Just describe what you want, let AI figure out how
5. **Enterprise-Level Process**: Get professional development workflows automatically

### For AI Citizens
1. **Clear Instructions**: Know exactly what to do for each scenario
2. **Coordinated Effort**: Understand how to work with other roles
3. **Quality Standards**: Built-in criteria for validating work
4. **Efficient Execution**: Proven patterns reduce trial and error
5. **Continuous Improvement**: Templates evolve based on outcomes

## Template Evolution & Learning

### Self-Improving Templates
```typescript
class TemplateEvolutionEngine {
  // Learn from successful and failed template executions
  evolveTemplates(
    executionHistory: TemplateExecution[],
    outcomeMetrics: OutcomeMetrics[]
  ): TemplateUpdate[] {
    
    const improvements = [];
    
    for (const template of this.getAllTemplates()) {
      const executions = executionHistory.filter(e => e.templateId === template.id);
      const outcomes = outcomeMetrics.filter(o => o.templateId === template.id);
      
      // Analyze patterns in successful vs failed executions
      const successPatterns = this.findSuccessPatterns(executions, outcomes);
      const failurePatterns = this.findFailurePatterns(executions, outcomes);
      
      // Generate template improvements
      const updates = this.generateTemplateUpdates(
        template,
        successPatterns,
        failurePatterns
      );
      
      improvements.push(...updates);
    }
    
    return improvements;
  }
}
```

## Conclusion

Role templates transform the City App Framework from a simple AI tool into an **autonomous development organization**. With pre-built expertise patterns, AI citizens can efficiently handle complex development workflows without constant mayor direction - they know their roles, understand quality standards, and coordinate seamlessly to deliver professional results.

The result is **enterprise-level development capability delivered through autonomous AI collaboration**, making solo developers as capable as full development teams. 🏗️⚙️✨