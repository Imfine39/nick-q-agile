• Skill note: spec-mesh skill not used because this is a static review of docs/templates/workflows, not
  executing a workflow.
                                                                                                                
  Findings
                                                                                                                
  - Major: workflows/design.md:115–workflows/design.md:130 tells you to fill Section 1/2/3/4, but the actual    
    Screen/Domain template section numbers are different (templates/screen-spec.md:41, templates/screen-        
    spec.md:60, templates/screen-spec.md:97, templates/screen-spec.md:122, templates/domain-spec.md:28,         
    templates/domain-spec.md:67, templates/domain-spec.md:121, templates/domain-spec.md:183, templates/domain-  
    spec.md:257), so following the workflow will skip required sections or write into the wrong ones.           
  - Major: The cross-reference example in workflows/design.md:138–workflows/design.md:147 violates the schema   
    (missing screens.*.name and using wildcard API-AUTH-*), but the schema requires name and forbids wildcards  
    (templates/cross-reference-schema.json:63, templates/cross-reference-schema.json:81–templates/cross-        
    reference-schema.json:84, templates/cross-reference-schema.json:96), so validate-matrix/spec-lint will fail 
    if copied.                                                                                                  
  - Major: Fix flows route to plan/implement (workflows/fix.md:293–workflows/fix.md:297), but workflows/        
    plan.md:53–workflows/plan.md:58 and workflows/plan.md:119–workflows/plan.md:122 hardcode feature paths, and 
    workflows/implement.md:32–workflows/implement.md:35 assumes tasks.md exists under features; this breaks fix-    mode paths and the “Trivial -> implement” branch.                                                           
  - Major: Clarify/Feedback direct Vision/Screen updates into “Implementation Notes” (workflows/clarify.md:18–  
    workflows/clarify.md:24, workflows/feedback.md:21–workflows/feedback.md:27), but Vision/Screen templates    
    only have “Clarifications” (templates/vision-spec.md:204, templates/screen-spec.md:270), so clarifications  
    will land in non-existent sections.                                                                         
  - Major: Test Scenario workflow/template use US-*/AC-* IDs (workflows/test-scenario.md:73–workflows/test-     
    scenario.md:79, templates/test-scenario-spec.md:48–templates/test-scenario-spec.md:55, templates/test-      
    scenario-spec.md:173), but Feature Spec uses UC-* and has no AC-* IDs (templates/feature-spec.md:103–       
    templates/feature-spec.md:157), so traceability and coverage mapping are inconsistent.                      
  - Major: Vision Input Part D is explicitly for Domain rules (templates/inputs/vision-input.md:19–templates/   
    inputs/vision-input.md:21, templates/inputs/vision-input.md:153–templates/inputs/vision-input.md:189), but  
    the vision workflow mapping never uses it (workflows/vision.md:77–workflows/vision.md:88) and the design    
    workflow doesn’t read the input file (workflows/design.md:75–workflows/design.md:85), so those rules are    
    likely dropped.                                                                                             
                                                                                                                
  Minor Issues                                                                                                  
                                                                                                                
  - Minor: TodoWrite snippets are malformed (missing closing quotes) in multiple workflows, so copy/paste into  
    TodoWrite will be invalid YAML (e.g., workflows/vision.md:38, workflows/design.md:27, workflows/add.md:37,  
    workflows/fix.md:31, workflows/plan.md:19).                                                                 
  - Minor: Several command examples are invalid due to multiline quoting, and Quick Mode suggests “revert”      
    without a safe procedure (e.g., workflows/pr.md:95–workflows/pr.md:101, workflows/featureproposal.md:87–    
    workflows/featureproposal.md:98, workflows/quick.md:181–workflows/quick.md:186, workflows/quick.md:229–     
    workflows/quick.md:235).                                                                                    
    CLAUDE.template.md:170 shows preserve-input.cjs <type> without the required --feature/--fix arguments.      
  - Minor: CLARIFY GATE ordering differs between core flow and workflows (core flow shows HUMAN_CHECKPOINT      
    before gate in CLAUDE.md:56–CLAUDE.md:73, while workflows gate before checkpoint like workflows/
    vision.md:129–workflows/vision.md:156), which can confuse the intended “gate before approval” policy.       
  - Minor: Fix input severity scale omits “Critical” (templates/inputs/fix-input.md:49–templates/inputs/fix-    
    input.md:50) but the Fix Spec expects it (templates/fix-spec.md:52–templates/fix-spec.md:55).

  Open Questions

  - Should fix work go through plan/tasks like features? If yes, I’ll align plan/implement paths and add a fix- 
    specific plan/tasks template; if no, we should relax implement prerequisites for fix.
  - Do you want to introduce AC-*/US-* identifiers into Feature Spec, or should Test Scenario be updated to use 
    UC-* and acceptance-criteria bullets as-is?